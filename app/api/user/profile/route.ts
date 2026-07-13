import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_fallback_key';

export async function GET(req: Request) {
  try {
    // 1. Lấy token từ Header Authorization (Định dạng chuẩn: Bearer <token>)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: { message: 'Missing token', code: 'TOKEN_REQUIRED' } },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];

    // 2. Xác thực và giải mã token gỡ lấy thông tin ví (address)
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { error: { message: 'Token is invalid or expired', code: 'INVALID_TOKEN' } },
        { status: 401 }
      );
    }

    // 3. Dùng thông tin address đã giải mã từ Token để truy vấn DB
    const user = await prisma.user.findUnique({
      where: {
        walletAddress: decoded.address, // Điều kiện lọc
      },
      include: {
        company: true // Lấy thêm thông tin company đi kèm
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: { message: 'User not found', code: 'USER_NOT_FOUND' } },
        { status: 404 }
      );
    }

    // 4. Trả dữ liệu User về cho Client hoàn toàn bảo mật
    return NextResponse.json(user);

  } catch (error: any) {
    return NextResponse.json(
      { error: { message: 'System error', details: error.message } },
      { status: 500 }
    );
  }
}