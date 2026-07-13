'use client';

import { useAuth } from "@/contexts/auth";
import { useAccount } from 'wagmi';
import { usePathname, useRouter } from "next/navigation";
import { Loading } from "./Loading";
import { useEffect, useState } from "react";
import { useLogin } from "@/hooks/login";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth(); // hook lấy state của bạn
  const { isConnected, address } = useAccount()
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { mutate: login, isPending } = useLogin();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isConnected && address) {
      const existingToken = localStorage.getItem(`token_${address.toLowerCase()}`);
      if (!existingToken) {
        login(address);
      }
    }
  }, [isConnected, address]);

  if (!mounted || isLoading || isPending) {
    return <Loading />;
  }
  // 1. Nếu chưa kết nối mà vào trang không phải /login
  else if (!isConnected && !pathname.includes('/login')) {
    router.replace('/login');
    return <Loading />;
  }
  // 2. Nếu đã kết nối nhưng chưa có user (cần đăng ký)
  else if (isConnected && !user && !isPending && !pathname.includes('/register')) {
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