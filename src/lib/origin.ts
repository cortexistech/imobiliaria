function originOf(urlish: string) {
  try {
    return new URL(urlish).origin;
  } catch {
    return null;
  }
}

/** Same-origin POST check for cookie-authenticated APIs. */
export function isSameOriginRequest(req: Request) {
  const host = req.headers.get("host");
  if (!host) return false;

  const proto = req.headers.get("x-forwarded-proto") || "http";
  const expected = new Set<string>([`${proto}://${host}`, `https://${host}`, `http://${host}`]);

  const authUrl = process.env.AUTH_URL || process.env.NEXTAUTH_URL;
  if (authUrl) {
    const origin = originOf(authUrl);
    if (origin) expected.add(origin);
  }

  const origin = req.headers.get("origin");
  if (origin) return expected.has(origin);

  const referer = req.headers.get("referer");
  if (!referer) return false;
  const refererOrigin = originOf(referer);
  return Boolean(refererOrigin && expected.has(refererOrigin));
}
