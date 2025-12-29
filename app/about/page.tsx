import { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
    title: 'About | Glass Market',
    description: 'Glass Market is an account marketplace made by Reprising for the purpose of browsing, selling, and buying accounts easily...',
    openGraph: {
        title: 'About | Glass Market',
        description: 'Glass Market is an account marketplace made by Reprising for the purpose of browsing, selling, and buying accounts easily...',
        type: 'website',
    },
};

export default function AboutPage() {
    return <AboutClient />;
}
