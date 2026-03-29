"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { Authenticated, Unauthenticated, useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Sparkles, Coins, Wand } from "lucide-react";
import { useEffect } from "react";

function AuthSync() {
  const storeUser = useMutation(api.users.storeUser);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      storeUser().catch(console.error);
    }
  }, [user, isLoaded, storeUser]);

  return null;
}

export default function Header() {
  const convexUser = useQuery(api.users.getUser);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 border-b border-purple-100 shadow-sm">
      <Authenticated>
        <AuthSync />
      </Authenticated>
      <div className="max-w-5xl mx-auto px-4 h-18 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-purple-500 to-pink-500 p-1.5 rounded-xl shadow-sm">
            <Wand className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
            ThumbPop
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Unauthenticated>
            <SignInButton mode="modal">
              <button className="text-sm font-bold text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-full transition-colors cursor-pointer">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="text-sm font-bold bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-full shadow-sm transition-all cursor-pointer">
                Get Started
              </button>
            </SignUpButton>
          </Unauthenticated>

          <Authenticated>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 bg-purple-50 px-3 py-1.5 rounded-full border border-purple-100 shadow-inner">
                <Coins className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-bold text-slate-700">
                  {convexUser === undefined ? "..." : convexUser === null ? "..." : convexUser.credits} Credits
                </span>
              </div>
              <UserButton appearance={{ elements: { avatarBox: "w-9 h-9 border-2 border-purple-200" } }} />
            </div>
          </Authenticated>
        </div>
      </div>
    </header>
  );
}
