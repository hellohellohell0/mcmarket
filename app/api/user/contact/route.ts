import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key-change-it');

// POST /api/user/contact - Add contact info
export async function POST(request: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { payload } = await jwtVerify(token.value, JWT_SECRET);
        const userId = payload.userId as string;
        const { type, value } = await request.json();

        if (!type || !value) return NextResponse.json({ error: 'Type and value required' }, { status: 400 });

        const contact = await prisma.contactInfo.create({
            data: {
                userId,
                type,
                value
            }
        });

        return NextResponse.json({ success: true, contact });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add contact info' }, { status: 500 });
    }
}

// DELETE /api/user/contact - Remove contact info
export async function DELETE(request: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { payload } = await jwtVerify(token.value, JWT_SECRET);
        const userId = payload.userId as string;
        const { id } = await request.json();

        await prisma.contactInfo.deleteMany({
            where: { id, userId } // Ensure ownership
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete contact info' }, { status: 500 });
    }
}
