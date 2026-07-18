import { defineConfig } from '@wagmi/cli';
import { react } from '@wagmi/cli/plugins';
// 1. Import trực tiếp file ABI tĩnh của bạn
import activityLogAbi from './src/constants/abi.json';

export default defineConfig({
  // 2. Nơi file TypeScript an toàn về kiểu (TypeSafe) sẽ được sinh ra
  out: 'src/generated.ts',
  contracts: [
    {
      name: 'ActivityLogContract',
      // 3. Ép kiểu 'as const' cực kỳ quan trọng để TypeScript đọc sâu cấu trúc JSON compile-time
      abi: activityLogAbi as const,
    },
  ],
  plugins: [
    react(), // Tự động sinh toàn bộ custom hooks (useRead..., useWrite...) cho React
  ],
});