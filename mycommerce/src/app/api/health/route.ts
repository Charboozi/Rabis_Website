import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET() {
  try {
    await redis.set("healthcheck", "ok");
    const val = await redis.get("healthcheck");
    return NextResponse.json({ status: "ok", redis: val });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ status: "error", message: String(err) }, { status: 500 });
  }
}