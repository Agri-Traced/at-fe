"use client";

import { Typography } from "antd";
import ConnectWalletButton from "@/app/components/ConnectWalletButton";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { useAuth } from "@/contexts/auth";
import { Loading } from "../../../components/Loading";
import { useLogin } from "@/hooks/login";
import { useEffect } from "react";

const { Title } = Typography;

export default function LoginPage() {
  const { t } = useTranslation();
  const { account } = useAuth();
  const { mutate: login } = useLogin();

  useEffect(() => {
    const handleAutoLogin = async () => {
      if (!account?.address) return;
      login(account.address);
    };
    handleAutoLogin();
  }, [account?.address, login]);

  if (account?.address) {
    return <Loading message={t("Loading user data...")} />;
  }

  return (
    <div className="min-h-screen bg-[url('/login-background.png')] bg-cover">
      <div className="ml-auto h-screen w-screen md:w-[40%] bg-white shadow-2xl p-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-87.5">
          <Image
            src="/logo.png"
            alt="Logo"
            width={200}
            height={200}
            className="mx-auto mb-8 h-auto"
            priority
          />
          <Title level={3} className="text-center mb-8">
            {t("Connect to your wallet")}
          </Title>
          <div className="flex flex-col justify-center">
            <ConnectWalletButton />
          </div>
        </div>
      </div>
    </div>
  );
}
