import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from "@/lib/prisma";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_fallback_key';

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value; // Lấy token từ cookie

    if (!token) {
      return NextResponse.json({ error: { message: 'No token provided' } }, { status: 401 });
    }

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
    const newToken = jwt.sign(
      {
        id: user.id,
        address: user.walletAddress,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '3d' } // Gia hạn thêm 3 ngày tính từ giây phút này
    );

    // Ghi đè cookie cũ bằng cookie mới có thời hạn kéo dài thêm 3 ngày
    cookieStore.set('auth_token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 3, // 3 ngày
    });

    // 5. Trả dữ liệu user về bình thường
    return NextResponse.json(user);

  } catch (error: any) {
    return NextResponse.json(
      { error: { message: 'System error', details: error.message } },
      { status: 500 }
    );
  }
}