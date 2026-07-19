import { NextResponse } from "next/server";
import { ethers } from "ethers";
import { ABI } from "@/blockchain/abis/type";
export async function POST(request: Request) {
  try {
    const { address, role } = await request.json();

    if (!address || !role) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // 1. Khởi tạo Provider và Ví Admin từ Private Key bí mật
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL);
    const adminWallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY!, provider);

    // 2. Kết nối tới Smart Contract bằng quyền của Admin
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
    const contract = new ethers.Contract(contractAddress, ABI, adminWallet);

    // 3. Tính toán mã hash của Role (Ví dụ: "FARMER_ROLE" -> 0x...)
    // Nếu contract dùng cấu trúc Role.Farmer (Enum) thay vì AccessControl bytes32,
    // thì bạn truyền số index của Enum (ví dụ: 0, 1, 2) thay vì hash chuỗi này.

    console.log(`Đang gán quyền ${role} cho ví ${address}...`);

    // 4. Gọi hàm grantRole của OpenZeppelin (hoặc hàm gán quyền tùy biến trong contract của bạn)
    // Cú pháp truyền tham số rời: grantRole(role, account)
    const tx = await contract.assignRole(address, role);
    
    // 5. Chờ giao dịch hoàn tất trên mạng lưới
    const receipt = await tx.wait();

    return NextResponse.json({
      success: true,
      message: `Granted ${role} to ${address} successfully`,
      txHash: tx.hash
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}