import { verifyMessage } from 'ethers';
import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { address, message, signature } = await req.json();

    // 1. Xác thực chữ ký ngay lập tức
    const recoveredAddress = verifyMessage(message, signature);
    const isValid = recoveredAddress.toLowerCase() === address.toLowerCase();

    if (!isValid) {
      return NextResponse.json(
        { error: { message: 'Signature is invalid or unauthorized', code: 'UNAUTHORIZED' } },
        { status: 401 }
      );
    }

    // 2. Chữ ký đúng -> Chọc vào Database lấy thông tin dựa trên address
    const user = await prisma.user.findUnique({
      where: { walletAddress: address.toLowerCase() }
    });

    if (!user) {
      return NextResponse.json(
        { error: { message: 'User has not registered information', code: 'USER_NOT_FOUND' } },
        { status: 404 }
      );
    }

    // 3. Trả dữ liệu về cho Client
    return NextResponse.json(user);

  } catch (error: any) {
    return NextResponse.json(
      { error: { message: 'System error', details: error.message } },
      { status: 500 }
    );
  }
}