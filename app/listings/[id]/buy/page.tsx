import { Metadata } from 'next';
import BuyClient from './BuyClient';
import prisma from '@/lib/prisma';

type Props = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
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

export default async function BuyPage({ params }: Props) {
    const { id } = await params;
    return <BuyClient id={id} />;
}
