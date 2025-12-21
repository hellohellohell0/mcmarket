import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        const listing = await prisma.listing.findUnique({
            where: { id },
            include: {
                capes: true,
                seller: {
                    select: {
                        username: true,
                        contactInfo: true,
                        pfpUrl: true, // User requested pfp on profile, maybe show on listing too?
                    }
                }
            }
        });

        if (!listing) {
            return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
        }

        return NextResponse.json({ listing });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
