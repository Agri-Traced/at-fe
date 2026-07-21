"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import type { User } from "../generated/zod";
import { Account, useAccount } from "@ant-design/web3";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useLogin } from "@/hooks/login";
import { usePathname } from "next/navigation";
import { Loading } from "@/app/components/Loading";
import { useTranslation } from "react-i18next";
import { useLogout } from "@/hooks/logout";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null | undefined;
  isLoading: boolean;
  account: Account | undefined;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { account } = useAccount();
  const { mutate: login, isPending } = useLogin();
  const { mutate: logout } = useLogout();
  const pathname = usePathname();
  const { t } = useTranslation();
  const router = useRouter();

  const { data: user, isLoading } = useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      try {
        const res = await api.get<User, User>("/user/profile");
        return res;
      } catch (error: any) {
        const statusCode = error?.response?.status;
        if (statusCode === 404) {
          return null; // Trả về null để UI biết đường điều hướng sang trang Đăng ký (Register)
        }
        throw error;
      }
    },
    retry: false,
    enabled: !!account,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // 4. Logic Auto Logout khi đổi Ví hoặc ngắt kết nối
  useEffect(() => {
    if (!account?.address) {
      if (pathname !== "/login" && pathname !== "/register") {
        logout();
      }
      return;
    }

    // 🎯 Chuẩn hóa địa chỉ ví về chữ thường để so sánh chính xác
    if (user && account.address) {
      const isDifferentWallet =
        user.walletAddress?.toLowerCase() !== account.address.toLowerCase();

      if (isDifferentWallet && !isPending) {
        logout();
      }
    }
  }, [account?.address, user, pathname, isPending, logout]);

  useEffect(() => {
    if (account?.address && user === null && pathname !== "/register") {
      router.push("/register");
    }
  }, [account?.address, user, pathname, router]);

  if (isLoading || isPending) {
    return <Loading message={t("Connecting to your wallet...")} />;
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, account }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
