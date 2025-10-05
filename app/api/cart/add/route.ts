import { NextResponse } from "next/server";
import { getOrSetSessionId } from "@/lib/session";
import { getOrCreateCartBySession, addToCart } from "@/lib/cart";

export async function POST(req: Request) {
  const { productId, qty } = await req.json();
  const sid = getOrSetSessionId();
  const cart = await getOrCreateCartBySession(sid);
  const item = await addToCart(cart.id, productId, qty ?? 1);
  return NextResponse.json({ ok: true, item });
}
