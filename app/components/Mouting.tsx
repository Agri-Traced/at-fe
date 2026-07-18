'use client';

import { useEffect, useState } from "react";

export default function Mounting({ children }: { children: React.ReactNode }) {
  const [isMounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }
  return <>{children}</>;
}