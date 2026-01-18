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

export async function createListing(data: any) {
    const isAdmin = await checkAdminSession();
    if (!isAdmin) throw new Error('Unauthorized');

    const { capes, ...listingData } = data;

    return prisma.listing.create({
        data: {
            ...listingData,
            status: 'APPROVED',
            capes: {
                create: capes.map((name: string) => ({ name }))
            }
        }
    });
}

export async function deleteListing(id: string) {
    const isAdmin = await checkAdminSession();
    if (!isAdmin) throw new Error('Unauthorized');

    await prisma.listing.delete({
        where: { id }
    });
}

export async function updateListing(id: string, data: any) {
    const isAdmin = await checkAdminSession();
    if (!isAdmin) throw new Error('Unauthorized');

    const { capes, ...listingData } = data;

    // For simplicity with capes, we delete existing and recreate or just ignore for now if not provided
    // Let's implement full update for capes too
    if (capes) {
        await prisma.cape.deleteMany({ where: { listingId: id } });
        await prisma.listing.update({
            where: { id },
            data: {
                ...listingData,
                capes: {
                    create: capes.map((name: string) => ({ name }))
                }
            }
        });
    } else {
        await prisma.listing.update({
            where: { id },
            data: listingData
        });
    }
}

export async function approveListing(id: string) {
    const isAdmin = await checkAdminSession();
    if (!isAdmin) throw new Error('Unauthorized');

    await prisma.listing.update({
        where: { id },
        data: { status: 'APPROVED' }
    });
}

export async function rejectListing(id: string) {
    const isAdmin = await checkAdminSession();
    if (!isAdmin) throw new Error('Unauthorized');

    await prisma.listing.update({
        where: { id },
        data: { status: 'REJECTED' }
    });
}

export async function deleteRecentRequests(count: number) {
    const isAdmin = await checkAdminSession();
    if (!isAdmin) throw new Error('Unauthorized');

    const listings = await prisma.listing.findMany({
        where: { status: 'PENDING' },
        orderBy: { createdAt: 'desc' },
        take: count,
        select: { id: true }
    });

    const ids = listings.map(l => l.id);

    if (ids.length > 0) {
        await prisma.listing.deleteMany({
            where: {
                id: { in: ids }
            }
        });
    }

    return ids; // Return deleted IDs to update client side state
}
