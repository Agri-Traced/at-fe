import { useEffect, useState, useRef } from 'react';

interface UseSSEOptions<T> {
  onMessage?: (data: T) => void;
  onError?: (error: MessageEvent) => void;
}

export function useSSE<T>(url: string, options?: UseSSEOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<unknown | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Sử dụng useRef để tránh re-render trùng lặp hàm callback
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    setLoading(true);
    setError(null);

    // 1. Khởi tạo kết nối SSE
    const eventSource = new EventSource(url);

    // 2. Lắng nghe dữ liệu đổ về
    eventSource.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        
        // Bỏ qua tin nhắn ping kết nối ban đầu nếu có
        if (parsedData.status === 'connected') {
          setLoading(false);
          return;
        }

        setData(parsedData);
        setLoading(false);

        // Gọi callback phụ nếu phía component yêu cầu (ví dụ để bắn Toast thông báo)
        if (optionsRef.current?.onMessage) {
          optionsRef.current.onMessage(parsedData);
        }
      } catch (err) {
        console.error("Lỗi parse dữ liệu SSE JSON:", err);
      }
    };

    // 3. Xử lý khi mất kết nối hoặc lỗi đường truyền
    eventSource.onerror = (err) => {
      setError(err);
      setLoading(false);
      
      if (optionsRef.current?.onError) {
        optionsRef.current.onError(err as any);
      }
      
      eventSource.close(); // Đóng để tránh ngốn băng thông khi lỗi liên tục
    };

    // 4. Dọn dẹp kết nối (Cleanup) khi component bị hủy (Unmount)
    return () => {
      eventSource.close();
    };
  }, [url]); // Kết nối lại nếu URL thay đổi

  return { data, error, loading };
}