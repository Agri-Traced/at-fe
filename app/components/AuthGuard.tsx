'use client';

import { useAuth } from "@/contexts/auth";
import { useAccount } from 'wagmi';
import { usePathname, useRouter } from "next/navigation";
import { Loading } from "./Loading";
import { useEffect, useState } from "react";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth(); // hook lấy state của bạn
  const { isConnected, status } = useAccount()
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);


  if (!mounted || isLoading) {
    return <Loading />;
  }
  // 1. Nếu chưa kết nối mà vào trang không phải /login
  else if (!isConnected && !pathname.includes('/login')) {
    router.replace('/login');
    return <Loading />;
  }
  // 2. Nếu đã kết nối nhưng chưa có user (cần đăng ký)
  else if (isConnected && !user && !pathname.includes('/register')) {
    router.replace('/register');
    return <Loading />;
  }
  // 3. Nếu đã đăng nhập mà vào /login hoặc /register
  else if (isConnected && user && (pathname.includes('/login') || pathname.includes('/register'))) {
    router.replace('/');
    return <Loading />;
  }

  return <>{children}</>;
};