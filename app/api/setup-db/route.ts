import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        // Create User Table
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL,
        "username" TEXT NOT NULL,
        "passwordHash" TEXT NOT NULL,
        "bio" TEXT,
        "pfpUrl" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "User_pkey" PRIMARY KEY ("id")
      );
    `);

        await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "User_username_key" ON "User"("username");
    `);

        // Create ContactInfo Table
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "ContactInfo" (
        "id" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "value" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        CONSTRAINT "ContactInfo_pkey" PRIMARY KEY ("id")
      );
    `);

        // Create Listing Table
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Listing" (
        "id" TEXT NOT NULL,
        "sellerId" TEXT NOT NULL,
        "username" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "priceCurrentOffer" DOUBLE PRECISION,
        "priceBin" DOUBLE PRECISION,
        "skinUrl" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
      );
    `);

        // Create Cape Table
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Cape" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "listingId" TEXT NOT NULL,
        CONSTRAINT "Cape_pkey" PRIMARY KEY ("id")
      );
    `);

        // Add Foreign Keys (catch error if they exist, or use DO block if supported, but simple try/catch for each might be safer or just hope for best on fresh DB)
        // Basic SQL standard doesn't have "ADD CONSTRAINT IF NOT EXISTS" easily in Postgres < some version.
        // We'll wrap in try-catch blocks for safety or check if constraint exists.
        // For this one-off, we can just run them. If it fails, it might be because table exists or constraint exists.

        // Using separate try/catches for constraints to avoid failing if already exists
        try {
            await prisma.$executeRawUnsafe(`
          ALTER TABLE "ContactInfo" ADD CONSTRAINT "ContactInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
        `);
        } catch (e) { }

        try {
            await prisma.$executeRawUnsafe(`
          ALTER TABLE "Listing" ADD CONSTRAINT "Listing_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
        `);
        } catch (e) { }

        try {
            await prisma.$executeRawUnsafe(`
          ALTER TABLE "Cape" ADD CONSTRAINT "Cape_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
        `);
        } catch (e) { }

        return NextResponse.json({ success: true, message: "Database tables created successfully." });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
