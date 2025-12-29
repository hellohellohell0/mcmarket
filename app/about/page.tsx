import { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
    title: 'About | Glass Market',
    description: 'Learn more about Glass Market - the premium Minecraft account marketplace.',
    openGraph: {
        title: 'About | Glass Market',
        description: 'Learn more about Glass Market - the premium Minecraft account marketplace.',
        type: 'website',
    },
};

export default function AboutPage() {
    return <AboutClient />;
}
