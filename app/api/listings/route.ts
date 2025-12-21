import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/listings
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    // Filters
    const minLen = searchParams.get('minLen') ? parseInt(searchParams.get('minLen')!) : undefined;
    const maxLen = searchParams.get('maxLen') ? parseInt(searchParams.get('maxLen')!) : undefined;
    const capes = searchParams.getAll('capes');
    const sort = searchParams.get('sort');
    const accountTypes = searchParams.getAll('accountType'); // High Tier, OG, etc
    const minNameChanges = searchParams.get('minNameChanges') ? parseInt(searchParams.get('minNameChanges')!) : undefined;
    const maxNameChanges = searchParams.get('maxNameChanges') ? parseInt(searchParams.get('maxNameChanges')!) : undefined;

    // Status filter - Default to APPROVED for public API, but allow override if needed (handled by separate admin actions usually, but ok here if strict)
    // For safety, this public endpoint should ONLY return APPROVED listings.
    const status = 'APPROVED';

    try {
        const where: any = {
            status,
            OR: [
                { priceCurrentOffer: { not: null } }, // Ensure at least one price exists? Or just rely on status.
                { priceBin: { not: null } }
            ]
        };

        if (capes.length > 0) {
            where.capes = {
                some: {
                    name: { in: capes }
                }
            };
        }

        // Account Types filter (Comma separated string in DB)
        // If user selects multiple, we want listings that match ANY of them? Or ALL? Usually ANY.
        // Since DB stores "OG,High Tier", using `contains` for each might be needed.
        if (accountTypes.length > 0) {
            where.OR = accountTypes.map(type => ({
                accountTypes: { contains: type }
            }));
        }

        if (maxNameChanges !== undefined) {
            // "If it's at the end, it will be 15 name changes or more."
            // Logic: if user selects 15, they want <= 15? Or exactly? 
            // Usually slider is "Max Name Changes".
            // If slider is at 15 (max), it means "Anything up to 15+" aka disable filter?
            // "where the user can select the maximum number of namechanges" -> l.nameChanges <= selected.
            if (maxNameChanges < 15) {
                where.nameChanges = { lte: maxNameChanges };
            }
            // If 15, don't filter (allow all).
        }

        let orderBy: any = { createdAt: 'desc' };
        if (sort === 'price_asc') orderBy = { priceBin: 'asc' }; // Prefer BIN for sorting
        if (sort === 'price_desc') orderBy = { priceBin: 'desc' };
        if (sort === 'date_old') orderBy = { createdAt: 'asc' };

        const listings = await prisma.listing.findMany({
            where,
            include: { capes: true },
            orderBy
        });

        // In-memory filtering for partial matches or complex logic
        const filtered = listings.filter((l: any) => {
            if (minLen && l.username.length < minLen) return false;
            if (maxLen && l.username.length > maxLen) return false;

            // Price Range Logic
            const minP = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : null;
            const maxP = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : null;

            if (minP !== null || maxP !== null) {
                const prices = [];
                if (l.priceBin) prices.push(l.priceBin);
                if (l.priceCurrentOffer) prices.push(l.priceCurrentOffer);

                if (prices.length === 0) return false; // Should not happen given query

                const hasMatch = prices.some(p => {
                    if (minP !== null && p < minP) return false;
                    if (maxP !== null && p > maxP) return false;
                    return true;
                });
                if (!hasMatch) return false;
            }
            return true;
        });

        return NextResponse.json({ listings: filtered });
    } catch (error) {
        console.error('Fetch listings error:', error);
        return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 });
    }
}

// POST /api/listings - Create listing (Guest)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            username, description,
            priceCurrentOffer, priceBin,
            capes, // array of strings
            accountTypes, // array of strings
            nameChanges, // number
            sellerName, sellerDiscordId, publicContact
        } = body;

        // Validation
        if (!username || !sellerName || !sellerDiscordId || !publicContact) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Fetch skin URL
        const skinUrl = `https://minotar.net/skin/${username}`;

        const newListing = await prisma.listing.create({
            data: {
                username,
                description: description || '',
                priceCurrentOffer: priceCurrentOffer ? parseFloat(priceCurrentOffer) : null,
                priceBin: priceBin ? parseFloat(priceBin) : null,
                skinUrl,
                accountTypes: accountTypes.join(','), // Store as CSV
                nameChanges: parseInt(nameChanges),
                sellerName,
                sellerDiscordId,
                publicContact,
                status: 'PENDING',
                capes: {
                    create: (capes || []).map((c: string) => ({ name: c }))
                }
            }
        });

        return NextResponse.json({ success: true, listing: newListing });

    } catch (error) {
        console.error('Create listing error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
