import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();

  // Xóa cookie bằng cách set đè thời hạn sống về 0
  cookieStore.set('auth_token', '', { expires: new Date(0), path: '/' });

  return NextResponse.json({ success: true });
}