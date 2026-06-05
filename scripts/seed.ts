import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { deals } from "../src/db/schema";
import { SEED_DEALS } from "../src/lib/seed-data";

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Run `vercel env pull .env.local` first.");
  }
  const db = drizzle(neon(process.env.DATABASE_URL), { schema: { deals } });

  const rows = SEED_DEALS.map((d) => ({
    slug: d.slug,
    address: d.address,
    city: d.city,
    state: d.state,
    zip: d.zip,
    lat: d.lat ?? null,
    lng: d.lng ?? null,
    beds: d.beds,
    baths: d.baths,
    sqft: d.sqft ?? null,
    purchasePrice: d.purchasePrice,
    entryFee: d.entryFee,
    interestRate: d.interestRate ?? null,
    monthlyPayment: d.monthlyPayment ?? null,
    dealTypes: d.dealTypes,
    status: d.status,
    description: d.description,
    images: d.images,
    featured: d.featured ?? false,
  }));

  await db.insert(deals).values(rows).onConflictDoNothing({ target: deals.slug });
  console.log(`Seeded ${rows.length} deals.`);
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  },
);
