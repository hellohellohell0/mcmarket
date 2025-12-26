import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate required fields
        const {
            username,
            accountTypes,
            nameChanges,
            description,
            priceBin,
            priceCurrentOffer,
            capes,
            oguProfileUrl,
            contactDiscord,
            contactTelegram,
            ticketNumber
        } = body;

        // Validation
        if (!username || !username.trim()) {
            return NextResponse.json({ error: 'Username is required' }, { status: 400 });
        }

        if (!accountTypes || accountTypes.length === 0) {
            return NextResponse.json({ error: 'At least one account type is required' }, { status: 400 });
        }

        if (nameChanges === undefined || nameChanges === null) {
            return NextResponse.json({ error: 'Name changes is required' }, { status: 400 });
        }

        if (!description || !description.trim()) {
            return NextResponse.json({ error: 'Description is required' }, { status: 400 });
        }

        if (!priceBin) {
            return NextResponse.json({ error: 'BIN price is required' }, { status: 400 });
        }

        if (priceCurrentOffer === undefined || priceCurrentOffer === null) {
            return NextResponse.json({ error: 'Current offer is required (use 0 if no offer)' }, { status: 400 });
        }

        // At least one contact method required
        if (!oguProfileUrl && !contactDiscord && !contactTelegram) {
            return NextResponse.json({ error: 'At least one contact method is required' }, { status: 400 });
        }

        if (!ticketNumber || !ticketNumber.trim()) {
            return NextResponse.json({ error: 'Ticket number is required' }, { status: 400 });
        }

        // Create the listing with PENDING status
        const listing = await prisma.listing.create({
            data: {
                username: username.trim(),
                accountTypes: accountTypes.join(', '),
                nameChanges: Number(nameChanges),
                description: description.trim(),
                priceBin: Number(priceBin),
                priceCurrentOffer: Number(priceCurrentOffer) === 0 ? null : Number(priceCurrentOffer),
                oguProfileUrl: oguProfileUrl?.trim() || null,
                contactDiscord: contactDiscord?.trim() || null,
                contactTelegram: contactTelegram?.trim() || null,
                ticketNumber: ticketNumber.trim(),
                status: 'PENDING',
                sellerName: 'Pending User',
                sellerDiscordId: 'N/A',
                publicContact: contactDiscord ? `Discord: ${contactDiscord}` : contactTelegram ? `Telegram: ${contactTelegram}` : 'See OGU',
                currentOwnerName: 'Pending Verification',
                isVerifiedOwner: false,
                capes: {
                    create: (capes || []).map((name: string) => ({ name }))
                }
            },
            include: {
                capes: true
            }
        });

        return NextResponse.json({
            success: true,
            message: `Account ${username} has been sent for approval! We will contact you via your discord ticket once it gets accepted.`,
            listingId: listing.id
        });

    } catch (error) {
        console.error('Submission error:', error);
        return NextResponse.json({
            error: 'Failed to submit listing. Please try again.'
        }, { status: 500 });
    }
}
