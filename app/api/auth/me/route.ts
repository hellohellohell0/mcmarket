import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key-change-it');

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
        return NextResponse.json({ user: null }, { status: 200 }); // Not logged in
    }

    try {
        const { payload } = await jwtVerify(token.value, JWT_SECRET);

        // Check if user still exists
        const user = await prisma.user.findUnique({
            where: { id: payload.userId as string },
            select: { id: true, username: true, bio: true, pfpUrl: true }
        });

        if (!user) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        return NextResponse.json({ user });
    } catch (error) {
        return NextResponse.json({ user: null }, { status: 200 });
    }
}
