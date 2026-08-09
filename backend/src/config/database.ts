import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// Get the connection string and ensure it's properly formatted
const connectionString = process.env.DATABASE_URL!;

console.log("📊 Connecting to database...");

// Create a connection pool with explicit configuration
const pool = new Pool({
  connectionString: connectionString,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Database connection error:", err.message);
    console.error("Please check your DATABASE_URL in .env file");
    return;
  }
  console.log("✅ Database connected successfully");
  release();
});

// Create Prisma adapter
const adapter = new PrismaPg(pool);

// Create Prisma Client with adapter
const prisma = new PrismaClient({
  adapter,
  log: ["query", "info", "warn", "error"],
});

export default prisma;
