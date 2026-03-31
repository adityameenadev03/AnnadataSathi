import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth/server";

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

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { data: session } = await auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: farmId } = await params;

    const farm = await prisma.farm.findFirst({
      where: { 
        id: farmId,
        userId: session.user.id
      }
    });

    if (!farm) {
       return NextResponse.json({ error: "Farm not found" }, { status: 404 });
    }

    return NextResponse.json(farm);
  } catch (err) {
    console.error("Fetch farm error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { data: session } = await auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: farmId } = await params;
    const body = await req.json();
    const { name, location, latitude, longitude, sizeInAcres, waterSource, ownershipType } = body;

    // Verify ownership
    const existing = await prisma.farm.findFirst({
      where: { 
        id: farmId,
        userId: session.user.id
      }
    });

    if (!existing) {
      return NextResponse.json({ error: "Farm not found or unauthorized" }, { status: 404 });
    }

    const parsedSize = sizeInAcres ? parseFloat(sizeInAcres) : undefined;

    const updated = await prisma.farm.update({
      where: { id: farmId },
      data: {
        name,
        location,
        latitude,
        longitude,
        sizeInAcres: (parsedSize !== undefined && !isNaN(parsedSize)) ? parsedSize : undefined,
        waterSource: waterSource ? stringToWaterSource(waterSource) : undefined,
        ownershipType: ownershipType ? stringToOwnership(ownershipType) : undefined,
      }
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Update farm error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
