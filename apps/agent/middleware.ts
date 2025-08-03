import type { NextRequest } from "next/server";
import { auth0 } from "./lib/auth0";

export async function middleware(request: NextRequest) {
  // Let Auth0 middleware handle authentication
  return await auth0.middleware(request);
}

export const config = {
  matcher: [
    /*
     * Protect ALL routes including root "/" - redirect to Auth0 login if not authenticated
     * Exclude only:
     * - _next/static (static files)
     * - _next/image (image optimization files) 
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/",
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"
  ]
};
