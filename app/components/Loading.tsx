import { Spin } from "antd"
import Image from "next/image"
import { useTranslation } from "react-i18next";

export const Loading = ({ message }: { message?: string }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center gap-4 justify-center h-screen">
      <Spin size="large" description={message || t('Loading')} />
      <Image src="/logo.png" alt="Logo" width={200} height={200} className="h-auto" priority />
    </div>
  )
}