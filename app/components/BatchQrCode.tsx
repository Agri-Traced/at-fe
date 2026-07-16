'use client';

import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from 'antd'; // Hoặc dùng button HTML/Tailwind tùy bạn
import { DownloadOutlined } from '@ant-design/icons';

interface QRCodeProps {
  id: string | number;
}

export default function BatchQRCode({ id }: QRCodeProps) {
  const qrRef = useRef<SVGSVGElement>(null);

  // Đường dẫn link tra cứu độc bản của lô hàng
  // Thay đổi domain khi bạn deploy thực tế
  const traceUrl = `${window.location.origin}/trace/${id}`;

  // Hàm xử lý tải mã QR về máy dưới dạng ảnh SVG/PNG
  const downloadQRCode = () => {
    const svg = qrRef.current;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `QR_Batch_${id}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md border border-gray-100 w-fit mx-auto gap-4">
      <h3 className="font-semibold text-gray-700 text-lg">Mã QR Lô Hàng #{id}</h3>

      {/* Thẻ chứa mã QR */}
      <div className="p-3 border-2 border-dashed border-green-400 rounded-lg bg-green-50/30">
        <QRCodeSVG
          ref={qrRef}
          value={traceUrl} // Dữ liệu mã hóa vào QR
          size={200}       // Kích thước (px)
          bgColor={"#ffffff"}
          fgColor={"#000000"}
          level={"H"}      // Độ sửa lỗi cao (High), giúp QR bị bẩn/rách vẫn quét được
          includeMargin={true}
          // Bạn có thể chèn Logo của dự án vào giữa mã QR ở đây:
          imageSettings={{
            src: "/logo-agri.png", // Đường dẫn ảnh logo trong thư mục public
            x: undefined,
            y: undefined,
            height: 40,
            width: 40,
            excavate: true, // Tự động đục lỗ QR để logo không đè lên các mắt mã
          }}
        />
      </div>

      <p className="text-xs text-gray-400 text-center max-w-50 break-all">
        {traceUrl}
      </p>

      {/* Nút bấm tải xuống */}
      <Button
        type="primary"
        icon={<DownloadOutlined />}
        onClick={downloadQRCode}
        className="bg-green-600 hover:bg-green-700 border-none"
      >
        Tải mã QR
      </Button>
    </div>
  );
}