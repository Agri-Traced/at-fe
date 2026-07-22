"use client";

import { AuthProvider } from "@/contexts/auth";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>{children}</AuthProvider>
  );
}
