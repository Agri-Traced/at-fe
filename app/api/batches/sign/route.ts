// app/api/batches/approvals/route.ts
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import EventEmitter from 'events';

// Tạo một global event emitter để các API khác có thể bắn sự kiện vào đây
// (Trong production, bạn có thể thay thế bằng Redis Pub/Sub nếu chạy nhiều instance server)
const globalSymbols = Object.getOwnPropertySymbols(global);
const emitterSymbol = Symbol.for('sse.emitter');
let emitter: EventEmitter;

if (globalSymbols.indexOf(emitterSymbol) > -1) {
  emitter = (global as any)[emitterSymbol];
} else {
  emitter = new EventEmitter();
  (global as any)[emitterSymbol] = emitter;
}

export { emitter }; // Xuất ra để các API Route khác sử dụng khi cập nhật DB

export async function GET(req: NextRequest) {
  const batchId = req.nextUrl.searchParams.get('batchId');

  if (!batchId) {
    return new Response("Missing batchId", { status: 400 });
  }

  const responseStream = new ReadableStream({
    start(controller) {
      // Hàm hỗ trợ gửi dữ liệu đúng chuẩn định dạng SSE: "data: { ... }\n\n"
      const sendEvent = (data: any) => {
        controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      // Định nghĩa hàm callback lắng nghe sự thay đổi của lô hàng tương ứng
      const onApprovalUpdate = (updatedBatchId: string, payload: any) => {
        if (updatedBatchId === batchId) {
          sendEvent(payload);
        }
      };

      // Đăng ký lắng nghe sự kiện
      emitter.on('approval-update', onApprovalUpdate);

      // Gửi tín hiệu kết nối thành công ban đầu
      sendEvent({ status: 'connected', message: 'SSE connection established' });

      // Nếu client ngắt kết nối (tắt tab, mất mạng), ta dọn dẹp để tránh rò rỉ bộ nhớ
      req.signal.addEventListener('abort', () => {
        emitter.off('approval-update', onApprovalUpdate);
        controller.close();
      });
    },
  });

  return new Response(responseStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}

export async function POST(req: Request) {
  const { batchId, signature, walletAddress } = await req.json();

  // 1. Thực hiện lưu chữ ký vào Database của bạn tại đây...
  // const updatedBatch = await prisma.batch.update({ ... });
  
  // Giả sử sau khi lưu, ta thu được thông tin số chữ ký hiện tại
  const currentSignatures = [signature]; // Ví dụ minh họa
  const requiredSignatures = 2; 

  // 2. Bắn sự kiện Real-time thông qua SSE Emitter
  emitter.emit('approval-update', batchId.toString(), {
    currentSignaturesCount: currentSignatures.length,
    requiredSignatures,
    lastSignedBy: walletAddress,
    isFullyApproved: currentSignatures.length >= requiredSignatures,
  });

  return NextResponse.json({ success: true });
}