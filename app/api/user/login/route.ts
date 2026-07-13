import { verifyMessage } from 'ethers';
import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_fallback_key';

export async function POST(req: Request) {
  try {
    const { address, message, signature } = await req.json();

    if (!address || !message || !signature) {
      return NextResponse.json(
        { error: { message: 'Missing parameters', code: 'BAD_REQUEST' } },
        { status: 400 }
      );
    }

    // 1. Xác thực chữ ký
    const recoveredAddress = verifyMessage(message, signature);
    const isValid = recoveredAddress.toLowerCase() === address.toLowerCase();

    if (!isValid) {
      return NextResponse.json(
        { error: { message: 'Signature is invalid or unauthorized', code: 'UNAUTHORIZED' } },
        { status: 401 }
      );
    }

    // 2. Kiểm tra xem user đã đăng ký thông tin trong DB chưa
    const user = await prisma.user.findUnique({
      where: { walletAddress: address }
    });

    if (!user) {
      return NextResponse.json(
        { error: { message: 'User has not registered information', code: 'USER_NOT_FOUND' } },
        { status: 404 }
      );
    }

    // 3. Chữ ký đúng + Đã có tài khoản -> Tiến hành tạo JWT Token
    // Lưu các thông tin cơ bản vào payload của token
    const token = jwt.sign(
      {
        id: user.id,
        address: user.walletAddress,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '1d' } // Token có hiệu lực trong 1 ngày
    );

    // 4. Trả Token về cho Client lưu trữ
    return NextResponse.json({ token });

  } catch (error: any) {
    return NextResponse.json(
      { error: { message: 'System error', details: error.message } },
      { status: 500 }
    );
  }
}