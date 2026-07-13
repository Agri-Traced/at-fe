import { Spin } from "antd"
import Image from "next/image"
import { useTranslation } from "react-i18next";

export const Loading = ({ message }: { message?: string }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Image src="/logo.png" alt="Logo" width={200} height={200} className="mx-auto mb-8" />
      <Spin size="large" description={message || t('Loading')} />
    </div>
  )
}