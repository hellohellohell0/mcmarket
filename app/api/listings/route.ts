import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    // Filtering logic
    const minLen = searchParams.get('minLen') ? Number(searchParams.get('minLen')) : undefined;
    const maxLen = searchParams.get('maxLen') ? Number(searchParams.get('maxLen')) : undefined;
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const maxNameChanges = searchParams.get('maxNameChanges') ? Number(searchParams.get('maxNameChanges')) : undefined;
    const sort = searchParams.get('sort');
    const capes = searchParams.getAll('capes');
    const accountTypes = searchParams.getAll('accountType');
    const search = searchParams.get('search');

    try {
        const listings = await prisma.listing.findMany({
            where: {
                status: 'APPROVED',
                priceBin: {
                    gte: minPrice ?? undefined,
                    lte: maxPrice ?? undefined,
                },
                nameChanges: {
                    lte: maxNameChanges ?? undefined,
                },
            },
            include: {
                capes: true
            },
            orderBy: [
                { isPinned: 'desc' },
                { pinOrder: 'asc' },
                sort === 'price_asc' ? { priceBin: 'asc' } :
                sort === 'price_desc' ? { priceBin: 'desc' } :
                sort === 'date_old' ? { createdAt: 'asc' } :
                { createdAt: 'desc' }
            ]
        });

        // Manual filtering for username length and complex types
        let filtered = listings.filter(l => {
            // If search is provided, we should check against the username if it's not hidden
            if (search && (l.hideIgn || !l.username.toLowerCase().includes(search.toLowerCase()))) return false;
            // Similarly, length filters shouldn't match hidden IGNs to prevent deduction
            if (minLen && (l.hideIgn || l.username.length < minLen)) return false;
            if (maxLen && (l.hideIgn || l.username.length > maxLen)) return false;

            if (accountTypes.length > 0) {
                const types = l.accountTypes.split(', ');
                if (!accountTypes.some(t => types.includes(t))) return false;
            }

            if (capes.length > 0) {
                const lCapes = l.capes.map((c: any) => c.name);
                if (!capes.some(c => lCapes.includes(c))) return false;
            }

            return true;
        });

        const safeListings = filtered.map(l => ({
            ...l,
            username: l.hideIgn ? "Hidden IGN" : l.username
        }));

        return NextResponse.json({ listings: safeListings });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
