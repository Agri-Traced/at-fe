import { Spin } from "antd";

export default function LoadingTranparent() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100/50">
      <Spin size="large" />
    </div>
  );
}