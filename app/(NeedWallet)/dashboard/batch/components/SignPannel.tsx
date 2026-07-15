import { useSSE } from '@/hooks/sse';
import { message, Progress } from 'antd';

interface ApprovalPayload {
  currentSignaturesCount: number;
  requiredSignatures: number;
  lastSignedBy: string;
  isFullyApproved: boolean;
}

export default function BatchApprovalWidget({ batchId }: { batchId: number }) {
  // Sử dụng helper hook
  const { data, loading } = useSSE<ApprovalPayload>(
    `/api/batches/approvals?batchId=${batchId}`,
    {
      onMessage: (payload) => {
        if (payload.lastSignedBy) {
          message.info(`Ví ${payload.lastSignedBy.slice(0, 6)}... vừa ký duyệt!`);
        }
        if (payload.isFullyApproved) {
          message.success("Đủ chữ ký! Trạng thái đang được ghi lên Blockchain.");
        }
      }
    }
  );

  if (loading) return <div>Đang kết nối luồng thời gian thực...</div>;
  if (!data) return <div>Chưa có dữ liệu phê duyệt.</div>;

  const percent = Math.round((data.currentSignaturesCount / data.requiredSignatures) * 100);

  return (
    <div style={{ padding: 20, border: '1px solid #f0f0f0', borderRadius: 8 }}>
      <h4>Tiến độ đa chữ ký: {data.currentSignaturesCount}/{data.requiredSignatures}</h4>
      <Progress percent={percent} status={data.isFullyApproved ? "success" : "active"} />
    </div>
  );
}