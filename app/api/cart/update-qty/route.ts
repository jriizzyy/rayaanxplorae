import { NextResponse } from "next/server";
import { updateQty } from "@/lib/cart";

export async function POST(req: Request) {
  const { cartItemId, qty } = await req.json();
  const item = await updateQty(cartItemId, qty);
  return NextResponse.json({ ok: true, item });
}
