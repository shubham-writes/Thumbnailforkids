import { NextResponse } from "next/server";
import sharp from "sharp";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: "Prompt is required" },
        { status: 400 }
      );
    }

    // 1. Authenticate with Clerk via Next.js Server
    const { userId, getToken } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // 2. Pass JWT to Convex to verify credits & approval
    const convexToken = await getToken({ template: "convex" });
    if (!convexToken) {
      return NextResponse.json({ success: false, error: "Convex Auth Token Missing" }, { status: 401 });
    }

    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    convex.setAuth(convexToken);

    try {
      // Deduct a credit before calling Nvidia
      await convex.mutation(api.users.deductCredit);
    } catch (convexError: any) {
      return NextResponse.json({ success: false, error: convexError.message || "Failed credit check" }, { status: 403 });
    }

    const enhancedPrompt = `3D Pixar-style thumbnail of ${prompt}, bright vivid colors, expressive, kid-friendly. Wide shot, centered subject, important elements in middle, empty space top and bottom.`;

    const apiReqBody = {
      text_prompts: [
        {
          text: enhancedPrompt,
          weight: 1,
        },
      ],
      seed: 0,
      steps: 25,
    };

    const response = await fetch(
      "https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-schnell",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          prompt: enhancedPrompt,
        }),
      }
    );

    // Some flux implementations output directly in other formats instead of stable-diffusion like formats.
    // NVidia standard output for Flux NIM: {"data": [{"b64_json": "..."}]}
    // Adjusting for OpenAI compat shim which NVidia uses:
    const data = await response.json();

    if (!response.ok) {
      console.error("NVIDIA API error:", data);
      return NextResponse.json(
        { success: false, error: "AI generation failed" },
        { status: 500 }
      );
    }

    let base64Image = "";
    if (data.data && data.data[0] && data.data[0].b64_json) {
      base64Image = data.data[0].b64_json;
    } else if (data.artifacts && data.artifacts[0] && data.artifacts[0].base64) {
      base64Image = data.artifacts[0].base64;
    } else {
      throw new Error("Could not parse generated image payload");
    }

    // Decode base64 to buffer
    const imageBuffer = Buffer.from(base64Image, "base64");

    // Process with sharp: crop to 16:9 from the center
    const image = sharp(imageBuffer);
    const metadata = await image.metadata();

    // We assume the original is 1:1 (e.g. 1024x1024)
    const originalWidth = metadata.width || 1024;
    const originalHeight = metadata.height || 1024;

    // Calculate 16:9 dimensions based on width
    const targetHeight = Math.round((originalWidth * 9) / 16);

    // Ensure we don't try to extract more than what exists
    const finalHeight = Math.min(targetHeight, originalHeight);
    const topOffset = Math.max(0, Math.floor((originalHeight - finalHeight) / 2));

    const croppedBuffer = await image
      .extract({
        left: 0,
        top: topOffset,
        width: originalWidth,
        height: finalHeight,
      })
      .toFormat("webp", { quality: 80 })
      .toBuffer();

    // 1. Get a short-lived upload URL
    const uploadUrl = await convex.mutation(api.thumbnails.generateUploadUrl);

    // 2. POST the file to the URL
    const uploadResult = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": "image/webp" },
      body: croppedBuffer as unknown as BodyInit,
    });

    if (!uploadResult.ok) {
      throw new Error("Failed to upload image to Convex storage");
    }

    const { storageId } = await uploadResult.json();

    // 3. Get the absolute URL to return to the frontend
    const imageUrl = await convex.query(api.thumbnails.getStorageUrl, { storageId });

    if (!imageUrl) {
      throw new Error("Could not retrieve image URL from storage");
    }

    return NextResponse.json({
      success: true,
      imageUrl,
    });
  } catch (error: any) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
