import { Metadata } from 'next';
import ListAccountClient from './ListAccountClient';

export const metadata: Metadata = {
    title: 'List Your Account | Glass Market',
    description: 'Sell your Minecraft account on Glass Market. Submit your account details for approval and reach premium buyers.',
    openGraph: {
        title: 'List Your Account | Glass Market',
        description: 'Sell your Minecraft account on Glass Market. Submit your account details for approval and reach premium buyers.',
        type: 'website',
    },
};

export default function ListAccountPage() {
    return <ListAccountClient />;
}
