import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key-change-it');

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const listing = await prisma.listing.findUnique({
            where: { id },
            select: {
                id: true,
                username: true,
                description: true,
                accountTypes: true,
                nameChanges: true,
                priceCurrentOffer: true,
                priceBin: true,
                capes: true,
                sellerName: true,
                // sellerDiscordId: false, // Excluded
                publicContact: true,
                // contactTelegram: false, // Excluded
                // contactDiscord: false, // Excluded
                currentOwnerName: true,
                isVerifiedOwner: true,
                identityVerified: true,
                oguProfileUrl: true,
                status: true,
                createdAt: true,
                ticketNumber: true
            }
        });

        if (!listing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        return NextResponse.json({ listing });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}



