import { cookies } from "next/headers";
import { randomBytes } from "crypto";

const COOKIE = "rx_session_id";
const MAX_AGE = 60 * 60 * 24 * 180; // 180 days

export function getOrSetSessionId(): string {
  const jar = cookies();
  let sid = jar.get(COOKIE)?.value;
  if (!sid) {
    sid = randomBytes(16).toString("hex");
    jar.set(COOKIE, sid, {
      httpOnly: true, sameSite: "lax", path: "/", maxAge: MAX_AGE,
    });
  }
  return sid;
}
