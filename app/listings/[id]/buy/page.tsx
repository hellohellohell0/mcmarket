import { Metadata } from 'next';
import BuyClient from './BuyClient';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); // In a real app, import from lib/prisma

type Props = {
    params: { id: string }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const id = params.id;
    const listing = await prisma.listing.findUnique({
        where: { id },
    });

    if (!listing) {
        return {
            title: 'Not Found | Glass Market',
            description: 'The requested listing could not be found.',
        };
    }

    const title = `Buy ${listing.username} | Glass Market`;
    const description = `Purchase instructions for ${listing.username}. Current Offer: ${listing.priceCurrentOffer ? '$' + listing.priceCurrentOffer : 'N/A'}. BIN: ${listing.priceBin ? '$' + listing.priceBin : 'N/A'}.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
            siteName: 'Glass Market',
        },
    };
}

export default function BuyPage({ params }: Props) {
    return <BuyClient params={params} />;
}
