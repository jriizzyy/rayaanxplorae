import Stripe from "stripe";
import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase";
import { clearCart } from "@/lib/cart";
import crypto from "node:crypto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

// simple token generator for downloads
function token() {
  return crypto.randomBytes(24).toString("hex");
}

export async function POST(req: Request) {
  // Stripe sends JSON but we must read the raw body to validate the signature
  const sig = req.headers.get("stripe-signature") as string;
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // 1) Pull line items so we know titles/prices/qty
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      limit: 100,
    });

    const email =
      session.customer_details?.email ??
      session.customer_email ??
      "unknown@example.com";
    const currency = (session.currency || "usd").toUpperCase();
    const amountTotalCents = session.amount_total ?? 0;

    // 2) Insert order
    const { data: order, error: orderErr } = await supabaseService
      .from("orders")
      .insert({
        email,
        amount_total_cents: amountTotalCents,
        currency,
        stripe_session_id: session.id,
        payment_status: session.payment_status ?? "paid",
      })
      .select()
      .single();

    if (orderErr || !order) {
      console.error("Order insert failed:", orderErr);
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    // 3) Insert order items + downloads
    const orderItems: any[] = [];
    const downloads: any[] = [];

    for (const li of lineItems.data) {
      const title = li.description || "Item";
      const qty = li.quantity ?? 1;
      const priceCents = li.price?.unit_amount ?? 0;

      orderItems.push({
        order_id: order.id,
        product_id: null, // set if you map Stripe items -> your products table
        title,
        price_cents: priceCents,
        qty,
      });

      // One token per line item (or per qty if you prefer)
      downloads.push({
        token: token(),
        order_id: order.id,
        product_id: null, // set if you have mapping
        email,
        expires_at: new Date(Date.now() + 72 * 3600 * 1000).toISOString(), // 72h
      });
    }

    if (orderItems.length) {
      const { error } = await supabaseService
        .from("order_items")
        .insert(orderItems);
      if (error) console.error("Order items insert failed:", error);
    }

    if (downloads.length) {
      const { error } = await supabaseService.from("downloads").insert(downloads);
      if (error) console.error("Downloads insert failed:", error);
    }

    // 4) Clear the cart (THIS IS STEP 6)
    const cartId = (session.metadata as any)?.cartId;
    if (cartId) {
      try {
        await clearCart(cartId);
      } catch (e) {
        console.error("Cart clear failed:", e);
      }
    }

    return NextResponse.json({ received: true });
  }

  // Fallback for other events you don’t use yet
  return NextResponse.json({ received: true });
}
