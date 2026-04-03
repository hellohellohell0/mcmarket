import { Metadata } from 'next';
import CapesClient from './CapesClient';

export const metadata: Metadata = {
    title: 'Capes | Glass Market',
    description: 'Browse our collection of Minecraft capes including Copper, Home, Menace, Purple Heart, and Minecraft Experience.',
};

export default function CapesPage() {
    return <CapesClient />;
}
