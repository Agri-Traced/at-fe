import { verifyMessage } from 'ethers';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // <-- Thêm import này để thao tác với Cookie
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
    const isValid = recoveredAddress === address;

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

    // 3. Tiến hành tạo JWT Token
    const token = jwt.sign(
      {
        id: user.id,
        address: user.walletAddress,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '3d' } // Token hạn 7 ngày
    );

    // 4. LẤY COOKIE STORE & SET COOKIE VÀO TRÌNH DUYỆT
    const cookieStore = await cookies();

    cookieStore.set('auth_token', token, {
      httpOnly: true,                 // Chặn JavaScript phía Client đọc token (Chống XSS)
      secure: process.env.NODE_ENV === 'production', // Chỉ gửi qua HTTPS ở môi trường production
      sameSite: 'strict',             // Chống các cuộc tấn công giả mạo CSRF
      path: '/',                      // Có hiệu lực cho toàn bộ website
      maxAge: 60 * 60 * 24 * 3,       // Thời gian sống: 3 ngày (tính bằng giây)
    });

    // 5. Trả response thành công (Không cần gửi kèm Token ở body nữa vì nó đã nằm trong Cookie)
    return NextResponse.json({ success: true, user });

  } catch (error: any) {
    return NextResponse.json(
      { error: { message: 'System error', details: error.message } },
      { status: 500 }
    );
  }
}