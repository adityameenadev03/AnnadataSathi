import { auth } from "@/lib/auth/server";
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

export async function GET(req: Request) {
  try {
    const { data: session } = await auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const farms = await prisma.farm.findMany({
      where: { userId: session.user.id },
      include: {
        _count: {
          select: { crops: { where: { status: 'GROWING' } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(farms);
  } catch (err) {
    console.error("Fetch farms error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { data: session } = await auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, location, latitude, longitude, sizeInAcres, waterSource, ownershipType } = body;

    if (!name || !location || !sizeInAcres) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Ensure the user exists in our public.user table (Self-healing sync)
    // This fixed the ForeignKeyConstraintViolation error.
    await prisma.user.upsert({
      where: { id: session.user.id },
      update: { 
        name: session.user.name, 
        email: session.user.email 
      },
      create: { 
        id: session.user.id, 
        name: session.user.name, 
        email: session.user.email 
      },
    });

    console.log("Creating farm for user:", session.user.id);

    const farm = await prisma.farm.create({
      data: {
        name,
        location,
        latitude,
        longitude,
        sizeInAcres: parseFloat(sizeInAcres),
        waterSource: stringToWaterSource(waterSource),
        ownershipType: stringToOwnership(ownershipType),
        userId: session.user.id,
      }
    });

    return NextResponse.json(farm);
  } catch (err) {
    console.error("Save farm error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
