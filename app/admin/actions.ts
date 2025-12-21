'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { ListingStatus } from '@prisma/client';

const ADMIN_USER = 'ADMIN';
const ADMIN_PASS = '4w1j?NB4&"T5>hOAI#K&a>3Sd;R#qtt@xx<<[';

export async function adminLogin(prevState: any, formData: FormData) {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (username === ADMIN_USER && password === ADMIN_PASS) {
        const cookieStore = await cookies();
        cookieStore.set('admin_session', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/'
        });
        redirect('/admin/dashboard');
    }

    return { error: 'Invalid credentials' };
}

export async function adminLogout() {
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
    redirect('/admin/login');
}

export async function checkAdminSession() {
    const cookieStore = await cookies();
    return cookieStore.get('admin_session')?.value === 'true';
}

// Listing Management Actions
export async function getListings(status?: ListingStatus) {
    const isAdmin = await checkAdminSession();
    if (!isAdmin) throw new Error('Unauthorized');

    return prisma.listing.findMany({
        where: status ? { status } : undefined,
        orderBy: { createdAt: 'desc' },
        include: { capes: true }
    });
}

export async function updateListingStatus(id: string, status: ListingStatus) {
    const isAdmin = await checkAdminSession();
    if (!isAdmin) throw new Error('Unauthorized');

    await prisma.listing.update({
        where: { id },
        data: { status }
    });
}

export async function updateListingPrice(id: string, currentOffer: number | null, bin: number | null) {
    const isAdmin = await checkAdminSession();
    if (!isAdmin) throw new Error('Unauthorized');

    await prisma.listing.update({
        where: { id },
        data: {
            priceCurrentOffer: currentOffer,
            priceBin: bin
        }
    });
}
