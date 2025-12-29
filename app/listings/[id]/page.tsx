import prisma from '@/lib/prisma';
import ListingClient from './ListingClient';
import { Metadata } from 'next';

type Props = {
    params: Promise<{ id: string }>;
};

// Fetch listing helper
async function getListing(id: string) {
    const listing = await prisma.listing.findUnique({
        where: { id },
        include: {
            capes: true
        }
    });
    return listing;
}

// Generate dynamic metadata
export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const { id } = await params;
    const listing = await getListing(id);

    if (!listing) {
        return {
            title: 'Refined Listings | Not Found'
        };
    }

    // Construct description parts
    const details = [];
    if (listing.priceCurrentOffer !== null && listing.priceCurrentOffer !== undefined) details.push(`CO: $${listing.priceCurrentOffer.toLocaleString()}`);
    if (listing.priceBin !== null && listing.priceBin !== undefined) details.push(`BIN: $${listing.priceBin.toLocaleString()}`);
    if (listing.capes.length > 0) details.push(`Capes: ${listing.capes.length}`);
    if (listing.nameChanges === 0) details.push('Prename');
    else details.push(`Changes: ${listing.nameChanges >= 15 ? '15+' : listing.nameChanges}`);
    details.push(`Type: ${listing.accountTypes}`);

    // Truncate user description to avoid huge embeds
    const maxDescLen = 100;
    const userDesc = listing.description || '';
    const truncatedDesc = userDesc.length > maxDescLen
        ? userDesc.substring(0, maxDescLen) + '...'
        : userDesc;

    const description = `${details.join(' • ')} - ${truncatedDesc}`;

    // Skin image for thumbnail - Headshot/Helm
    // 'summary' card type makes it a small thumbnail beside description
    const skinUrl = `https://minotar.net/helm/${listing.username}/300.png`;

    return {
        title: listing.username,
        description: description,
        openGraph: {
            title: listing.username,
            description: description,
            images: [skinUrl],
            siteName: 'Refined Listings',
        },
        twitter: {
            card: 'summary',
            title: listing.username,
            description: description,
            images: [skinUrl],
        }
    };
}

export default async function ListingPage({ params }: Props) {
    const { id } = await params;
    const listing = await getListing(id);

    if (!listing) {
        return <div className="container" style={{ padding: '4rem', color: '#ff3e9d' }}>Listing not found</div>;
    }

    return <ListingClient listing={JSON.parse(JSON.stringify(listing))} />;
}
