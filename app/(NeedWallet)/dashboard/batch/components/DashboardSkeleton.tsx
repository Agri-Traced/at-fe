import { Card, Col, Divider, Flex, Row, Skeleton } from "antd";

export default function DashboardSkeleton() {
  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        padding: 20,
        borderRadius: 16,
        background: "#fff",
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
        border: "1px solid #f0f0f0",
      }}
    >
      <Divider />
      <Skeleton active paragraph={{ rows: 8 }} />
    </div>
  );
}