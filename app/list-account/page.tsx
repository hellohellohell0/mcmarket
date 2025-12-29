import { Metadata } from 'next';
import ListAccountClient from './ListAccountClient';

export const metadata: Metadata = {
    title: 'List Your Account | Glass Market',
    description: 'Submit a listing request to list your account on Glass Market.',
    openGraph: {
        title: 'List Your Account | Glass Market',
        description: 'Submit a listing request to list your account on Glass Market.',
        type: 'website',
    },
};

export default function ListAccountPage() {
    return <ListAccountClient />;
}
