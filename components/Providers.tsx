"use client";

import { SessionProvider } from "next-auth/react";
import HelpChat from "@/components/HelpChat";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}<HelpChat /></SessionProvider>;
}
