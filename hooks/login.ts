"use client";

import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { App } from "antd";
import { useRouter, useSearchParams } from "next/navigation"; // 🎯 Dùng useSearchParams
import { useSignMessage, useDisconnect } from "wagmi";
import { useAccount } from "@ant-design/web3";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { notification } = App.useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const { account } = useAccount();
  return useMutation({
    mutationFn: async (address: string) => {
      const message = `${t("Verify access for your wallet to login")} - ${Date.now()}`;
      const signature = await signMessageAsync({ message });

      const res = await api.post<{ token: string }>("/user/login", {
        address,
        message,
        signature,
      });

      return res.data;
    },
    retry: false,
    onSuccess: () => {
      notification.success({
        message: t("Welcome to Agri-Trace."),
        showProgress: true,
        placement: "bottomRight",
      });

      queryClient.invalidateQueries({ queryKey: ["auth-user"] });

      const redirectUrl = searchParams.get("redirect");
      if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        router.push("/dashboard");
      }
    },
    onError: async (error: any) => {
      const statusCode = error?.status || error?.response?.status;
      if (statusCode === 404) {
        return router.push("/register");
      }
      if (account?.address) {
        disconnect();
      }

      notification.error({
        message: t("Login failed."),
        description:
          error?.response?.data?.message ||
          error?.message ||
          t("An unknown error occurred"),
        showProgress: true,
        placement: "bottomRight",
      });
    },
  });
};
