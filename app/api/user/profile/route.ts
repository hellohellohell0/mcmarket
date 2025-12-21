import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key-change-it');

// POST /api/user/profile - Update bio, pfp
export async function POST(request: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { payload } = await jwtVerify(token.value, JWT_SECRET);
        const userId = payload.userId as string;
        const { bio, pfpUrl } = await request.json();

        const updated = await prisma.user.update({
            where: { id: userId },
            data: { bio, pfpUrl }
        });

        return NextResponse.json({ success: true, user: updated });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
