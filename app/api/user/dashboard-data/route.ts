import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key-change-it');

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { payload } = await jwtVerify(token.value, JWT_SECRET);
        const userId = payload.userId as string;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                contactInfo: true,
                listings: true
            }
        });

        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        return NextResponse.json({
            contacts: user.contactInfo,
            listings: user.listings
        });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
