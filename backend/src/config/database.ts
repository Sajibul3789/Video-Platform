import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL!;

console.log("📊 Connecting to database...");

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

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({
  adapter,
  log: ["query", "info", "warn", "error"],
});

export default prisma;
