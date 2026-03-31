import { PrismaClient, Prisma } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({
    adapter,
});

const cropData = [
    {
        name: "Wheat",
        sowingDate: new Date("2024-10-01"),
        expectedHarvest: new Date("2025-02-01"),
        status: "growing",
    },
    {
        name: "Rice",
        sowingDate: new Date("2024-06-01"),
        expectedHarvest: new Date("2024-10-01"),
        status: "growing",
    },
]

export async function main() {
    const farm = await prisma.farm.create({
        data: {
            name: "Main Farm",
            location: "Default Location",
            sizeInAcres: 10,
        }
    });

    for (const u of cropData) {
        await prisma.crop.create({
            data: {
                name: u.name,
                sowingDate: u.sowingDate,
                expectedHarvest: u.expectedHarvest,
                status: u.status.toUpperCase() as any,
                farmId: farm.id
            }
        });
    }
}
main();