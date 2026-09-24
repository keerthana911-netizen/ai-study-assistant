"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

function GoogleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M21.35 12.23c0-.72-.06-1.41-.18-2.08H12v3.94h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.2 2.91-7.25Z" />
      <path fill="#34A853" d="M12 21.7c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.28v2.53A9.74 9.74 0 0 0 12 21.7Z" />
      <path fill="#FBBC05" d="M6.53 13.78a5.86 5.86 0 0 1 0-3.56V7.69H3.28a9.73 9.73 0 0 0 0 8.62l3.25-2.53Z" />
      <path fill="#EA4335" d="M12 6.19c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.27 14.63 2.3 12 2.3a9.74 9.74 0 0 0-8.72 5.39l3.25 2.53C7.3 7.91 9.46 6.19 12 6.19Z" />
    </svg>
  );
}

function GithubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.04-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.49 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.49 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.29 0 .32.22.7.83.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12Z" />
    </svg>
  );
}

export default function AuthSocialButtons() {
  const [loading, setLoading] = useState<"google" | "github" | null>(null);
  const [error, setError] = useState("");

  const continueWith = async (provider: "google" | "github") => {
    setLoading(provider);
    setError("");
    try {
      const result = await signIn(provider, { callbackUrl: "/dashboard", redirect: false });
      if (result?.error || !result?.url) {
        throw new Error(provider === "google" ? "Google sign-in is not configured yet." : "GitHub sign-in is not configured yet.");
      }
      window.location.assign(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Social sign-in failed. Please try again.");
      setLoading(null);
    }
  };

  return (
    <div className="mb-5">
      <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => continueWith("google")}
        disabled={loading !== null}
        className="w-full flex items-center justify-center gap-2 border border-white/10 bg-white/5 rounded-xl py-2.5 font-medium text-white hover:bg-white/10 transition"
      >
        <GoogleIcon />
        {loading === "google" ? "Connecting..." : "Google"}
      </button>
      <button
        type="button"
        onClick={() => continueWith("github")}
        disabled={loading !== null}
        className="w-full flex items-center justify-center gap-2 border border-white/10 bg-white/5 rounded-xl py-2.5 font-medium text-white hover:bg-white/10 transition"
      >
        <GithubIcon />
        {loading === "github" ? "Connecting..." : "GitHub"}
      </button>
      </div>
      {error && <p role="alert" className="text-red-400 text-xs mt-2 text-center">{error}</p>}
    </div>
  );
}
