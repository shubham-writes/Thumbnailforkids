const { ConvexHttpClient } = require("convex/browser");
const client = new ConvexHttpClient("https://fantastic-ermine-215.convex.cloud");

async function run() {
  const result = await client.query("thumbnails:getRecentThumbnails");
  console.log(JSON.stringify(result.map(x => x.imageUrl).slice(0, 8), null, 2));
}

run().catch(console.error);
