import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { NextResponse, NextRequest } from 'next/server';
import { IUserJWT } from '@/types/user';

const JWT_SECRET = process.env.JWT_SECRET!;

export function withAuth(handler: (req: NextRequest, user: IUserJWT, context: any) => Promise<Response>) {
  return async (req: NextRequest, context: any) => {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return await handler(req, decoded as IUserJWT, context);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  };
}

export function withRole(role: string, handler: (req: NextRequest, user: IUserJWT, context: any) => Promise<Response>) {
  return withAuth(async (req, user, context) => {
    if (user.role !== role && user.role !== 'OWNER') {
      return NextResponse.json(
        { error: `Forbidden: You do not have permission: ${role}`, code: 'FORBIDDEN' },
        { status: 403 }
      );
    }
    return await handler(req, user, context);
  });
}