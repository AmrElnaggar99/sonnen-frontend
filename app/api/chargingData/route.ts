import { NextResponse } from "next/server";
import rawData from "@/mocks/backend-response.json";

export async function GET() {
  return NextResponse.json(rawData);
}
