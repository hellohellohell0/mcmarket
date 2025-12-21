import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key-change-it');

export async function POST(request: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { payload } = await jwtVerify(token.value, JWT_SECRET);
        const userId = payload.userId as string;
        const { newUsername } = await request.json();

        if (!newUsername || newUsername.length < 3) {
            return NextResponse.json({ error: 'Username must be at least 3 characters' }, { status: 400 });
        }

        // Check if taken
        const existing = await prisma.user.findUnique({ where: { username: newUsername } });
        if (existing) {
            return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
        }

        await prisma.user.update({
            where: { id: userId },
            data: { username: newUsername }
        });

        // Listings username field is just a reference to account username being sold, 
        // BUT we also have `sellerId`. The `Listing` model has a `username` field which is the ACCOUNT being sold, 
        // not the SELLER.
        // Wait, looking at schema:
        // model Listing { ... username String // account username ... seller User ... }
        // So strict "User" username change doesn't affect listings directly, unless we display seller username somewhere.
        // We display seller username in `include: { seller: { select: { username: true } } }`.
        // So this update is sufficient.

        return NextResponse.json({ success: true, message: 'Username updated' });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
