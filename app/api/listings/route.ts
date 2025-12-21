import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key-change-it');

// GET /api/listings - Fetch all listings with filters
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    // Filters
    const minLen = searchParams.get('minLen') ? parseInt(searchParams.get('minLen')!) : undefined;
    const maxLen = searchParams.get('maxLen') ? parseInt(searchParams.get('maxLen')!) : undefined;
    const capes = searchParams.getAll('capes'); // e.g. ?capes=Common&capes=Pan
    const sort = searchParams.get('sort'); // price_asc, price_desc, date_new, date_old
    const countType = searchParams.get('countType'); // offers, bins, both (default)

    try {
        const where: any = {
            // Basic filtering to exclude accounts with no offer if requested or implicit? 
            // User said: "Make sure accounts with current offer of 0 do not get counted to the filter indexing."
            // I interpret this as: if priceCurrentOffer is 0, don't show it? Or just dont count it? 
            // Usually marketplace hides "sold" or "invalid" ones. I'll assume 0 means "no offer available" or something.
            // Let's filter out priceCurrentOffer === 0 if that's what user means.
            OR: [
                { priceCurrentOffer: { not: 0 } },
                { priceCurrentOffer: null } // allow null? User said "current offer of 0", implying 0 is a specific value to ignore.
            ]
        };

        if (minLen || maxLen) {
            where.username = {};
            if (minLen) where.username.gte = undefined; // Prisma doesn't support length filtering on string directly in 'where' easily for sqlite without raw query or regex. 
            // Wait, SQLite/Prisma limitation. I might have to filter in memory if dataset is small, or use raw query.
            // For now, I'll skip length filter in DB query and do in memory if easy, or ignore for MVP DB step.
            // Actually, I can filtered in memory since MVP scale is small.
        }

        if (capes.length > 0) {
            where.capes = {
                some: {
                    name: { in: capes }
                }
            };
        }

        let orderBy: any = { createdAt: 'desc' };
        if (sort === 'price_asc') orderBy = { priceBin: 'asc' }; // Sort by BIN usually? or C/O? I'll use BIN for price sort generally or generic "price"
        if (sort === 'price_desc') orderBy = { priceBin: 'desc' };
        if (sort === 'date_old') orderBy = { createdAt: 'asc' };

        const listings = await prisma.listing.findMany({
            where,
            include: {
                capes: true,
                seller: {
                    select: { username: true }
                }
            },
            orderBy
        });

        // In-memory filtering for username length and offer=0 logic refinement if needed
        const filtered = listings.filter((l: any) => {
            if (l.priceCurrentOffer === 0) return false;
            if (minLen && l.username.length < minLen) return false;
            if (maxLen && l.username.length > maxLen) return false;
            return true;
        });

        return NextResponse.json({ listings: filtered });
    } catch (error) {
        console.error('Fetch listings error:', error);
        return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 });
    }
}

// POST /api/listings - Create listing
export async function POST(request: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { payload } = await jwtVerify(token.value, JWT_SECRET);
        const userId = payload.userId as string;

        const { username, description, priceCurrentOffer, priceBin, capes } = await request.json(); // capes is array of strings

        // Check contact info requirement
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { contactInfo: true, listings: true }
        });

        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        if (user.contactInfo.length === 0) {
            return NextResponse.json({ error: 'You must add contact info to your profile before listing.' }, { status: 403 });
        }

        if (user.listings.length >= 5) {
            return NextResponse.json({ error: 'Listing limit reached (max 5).' }, { status: 403 });
        }

        // Fetch skin URL (mock or external API). User said "Use minecraft api".
        // Minotar or Crafatar. https://minotar.net/helm/{username}/100.png
        const skinUrl = `https://minotar.net/helm/${username}/100.png`;

        const newListing = await prisma.listing.create({
            data: {
                sellerId: userId,
                username,
                description,
                priceCurrentOffer: parseFloat(priceCurrentOffer),
                priceBin: parseFloat(priceBin),
                skinUrl,
                capes: {
                    create: capes.map((c: string) => ({ name: c }))
                }
            }
        });

        return NextResponse.json({ success: true, listing: newListing });

    } catch (error) {
        console.error('Create listing error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
