import { NextResponse } from "next/server";
import { removeFromCart } from "@/lib/cart";

export async function POST(req: Request) {
  const { cartItemId } = await req.json();
  await removeFromCart(cartItemId);
  return NextResponse.json({ ok: true });
}
