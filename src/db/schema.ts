import {
  boolean,
  doublePrecision,
  integer,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const deals = pgTable("deals", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),

  // Location
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zip: text("zip").notNull(),
  lat: doublePrecision("lat"),
  lng: doublePrecision("lng"),

  // Property facts
  beds: integer("beds").notNull().default(0),
  baths: real("baths").notNull().default(0),
  sqft: integer("sqft"),
  yearBuilt: integer("year_built"),

  // Financials (whole dollars)
  purchasePrice: integer("purchase_price").notNull().default(0),
  entryFee: integer("entry_fee").notNull().default(0),
  interestRate: real("interest_rate"),
  monthlyPayment: integer("monthly_payment"),

  // External links
  zillowUrl: text("zillow_url"),
  directPhone: text("direct_phone"),

  // Presentation
  dealTypes: text("deal_types").array().notNull().default([]),
  status: text("status").notNull().default("available"),
  description: text("description").notNull().default(""),
  images: text("images").array().notNull().default([]),
  featured: boolean("featured").notNull().default(false),
  // Default true so existing rows stay visible; new autosaved drafts set false.
  published: boolean("published").notNull().default(true),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  dealSlug: text("deal_slug").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type DealRow = typeof deals.$inferSelect;
export type NewDealRow = typeof deals.$inferInsert;
export type LeadRow = typeof leads.$inferSelect;
