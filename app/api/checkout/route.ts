import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getOrSetSessionId } from "@/lib/session";
import { getOrCreateCartBySession, getCartItems } from "@/lib/cart";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

export async function POST(req: Request) {
  const { successUrl, cancelUrl, email } = await req.json();

  const sid = getOrSetSessionId();
  const cart = await getOrCreateCartBySession(sid);
  const items = await getCartItems(cart.id);
  if (!items.length) return NextResponse.json({ error: "Cart empty" }, { status: 400 });

  const line_items = items.map((it: any) => ({
    quantity: it.qty,
    price_data: {
      currency: "usd",
      unit_amount: it.products?.price_cents ?? 0,
      product_data: { name: it.products?.title ?? "Item" },
    },
  }));

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: email,
    line_items,
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl,
    metadata: { cartId: cart.id },
  });

  return NextResponse.json({ url: session.url });
}
