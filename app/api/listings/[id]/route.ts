import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key-change-it');

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { payload } = await jwtVerify(token.value, JWT_SECRET);
        const userId = payload.userId as string;

        // Verify ownership
        const listing = await prisma.listing.findUnique({
            where: { id }
        });

        if (!listing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        if (listing.sellerId !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        // Delete capes first (foreign key)
        await prisma.cape.deleteMany({
            where: { listingId: id }
        });

        await prisma.listing.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
