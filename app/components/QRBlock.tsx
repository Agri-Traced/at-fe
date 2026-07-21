"use client";

import React, { useRef } from "react";
import { QRCode, Button, Space } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import Link from "next/link";

export const QRBlock = ({ id }: { id: string | number }) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const handleDownload = () => {
    if (!qrRef.current) return;
    const canvas = qrRef.current.querySelector("canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `QR_Batch_${id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const qrValue = `${origin}/trace/${id}`;

  return (
    <Space orientation="vertical" align="center" size="middle" className="w-full py-4">
      <div ref={qrRef} className="bg-white p-3 rounded-xl shadow-sm border">
        <QRCode
          value={qrValue}
          icon="/icon.png"
          size={200}
          errorLevel="H"
        />
      </div>

      <Link href={`/trace/${id}`} target="_blank" rel="noopener noreferrer">
        Truy cập QR
      </Link>

      <Button
        type="primary"
        icon={<DownloadOutlined />}
        onClick={handleDownload}
      >
        Tải mã QR về máy
      </Button>
    </Space>
  );
};