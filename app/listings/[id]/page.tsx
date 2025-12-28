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
    if (listing.capes.length > 0) details.push(`Capes: ${listing.capes.length}`);
    if (listing.nameChanges === 0) details.push('Prename');
    else details.push(`Changes: ${listing.nameChanges >= 15 ? '15+' : listing.nameChanges}`);
    details.push(`Type: ${listing.accountTypes}`);
    if (listing.priceBin) details.push(`BIN: $${listing.priceBin}`);

    const description = `${details.join(' • ')} - ${listing.description}`;

    // Skin image for thumbnail
    // Using Visage for better head render, or strictly Minotar as requested? 
    // User asked for "thumbnail of the skin". 
    // Visage 'face' or 'head' endpoint is usually good for Discord.
    // Let's use the bust for a clearer view.
    const skinUrl = listing.username.includes('*')
        ? 'https://minotar.net/armor/bust/MHF_Steve/300.png'
        : `https://minotar.net/armor/bust/${listing.username}/300.png`;

    return {
        title: listing.username,
        description: listing.description ? `${details.join(' | ')}\n\n${listing.description}` : details.join(' | '),
        openGraph: {
            title: listing.username,
            description: listing.description ? `${details.join(' | ')}\n\n${listing.description}` : details.join(' | '),
            images: [skinUrl],
            siteName: 'Refined Listings',
        },
        twitter: {
            card: 'summary_large_image',
            title: listing.username,
            description: details.join(' | '),
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
