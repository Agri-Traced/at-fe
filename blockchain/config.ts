import { ethers } from 'ethers';
import abi from '@/blockchain/abis/AgriTrace.json';
// Import file ABI của bạn (ở đây lấy ví dụ danh sách hàm dạng chuỗi gọn nhẹ)
export const CONTRACT_ABI = abi; // Đảm bảo rằng bạn đã có file ABI JSON từ quá trình biên dịch Smart Contract

// Địa chỉ ví Smart Contract (Nên đưa vào file .env.local)
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS

if (!ethers.isAddress(CONTRACT_ADDRESS)) {
  throw new Error("Invalid smart contract address in environment variables");
}

if (!CONTRACT_ABI) {
  throw new Error("Smart contract ABI is not defined or empty");
}

// URL mạng chạy ngầm khi người dùng chưa kết nối ví (ví dụ: Sepolia RPC công khai)
const RPC_URL = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL

if (!RPC_URL) {
  throw new Error("Public RPC URL is not defined in environment variables");
}

/**
 * 1. HÀM ĐỌC (Read-Only): Dùng khi chỉ cần lấy dữ liệu từ mạng lưới về hiển thị, 
 * Không yêu cầu người dùng phải cài hay mở ví MetaMask.
 */
export const getReadOnlyContract = () => {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI.abi, provider);
};

/**
 * 2. HÀM GHI (Read-Write): Khởi tạo contract gắn với ví MetaMask của người dùng 
 * để thực hiện các thao tác ghi dữ liệu (gọi hàm tốn gas).
 */
export const getSignerContract = async () => {
  if (!window.ethereum) throw new Error("MetaMask is not installed");

  // Kết nối tới extension ví trên trình duyệt
  const provider = new ethers.BrowserProvider(window.ethereum);
  // Lấy tài khoản đang active của người dùng
  const signer = await provider.getSigner();

  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI.abi, signer);
};