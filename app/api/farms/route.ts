import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Map Frontend string values to Prisma Enums
const stringToWaterSource = (source: string) => {
  switch (source) {
    case 'Tube well': return 'BOREWELL';
    case 'Canal': return 'CANAL';
    case 'Rainfed': return 'RAIN';
    default: return 'OTHER';
  }
};

const stringToOwnership = (type: string) => {
  switch (type) {
    case 'Owned': return 'OWNED';
    case 'Leased': return 'LEASED';
    case 'Shared': return 'SHARED';
    default: return 'OWNED';
  }
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, location, latitude, longitude, sizeInAcres, waterSource, ownershipType } = body;

    if (!name || !location || !sizeInAcres) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    console.log(prisma.farm)

    const farm = await prisma.farm.create({
      data: {
        name,
        location,
        latitude,
        longitude,
        sizeInAcres: parseFloat(sizeInAcres),
        waterSource: stringToWaterSource(waterSource),
        ownershipType: stringToOwnership(ownershipType),
      }
    });

    return NextResponse.json({ success: true, farm }, { status: 201 });
  } catch (error) {
    console.error("Failed to save farm:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
