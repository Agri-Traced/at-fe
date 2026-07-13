import { Spin } from "antd"
import Image from "next/image"

export const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Image src="/logo.png" alt="Logo" width={200} height={200} className="mx-auto mb-8" />
      <Spin size="large" />
    </div>
  )
}