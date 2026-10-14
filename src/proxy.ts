import { type NextRequest, NextResponse } from "next/server";
import { projects } from "@/content/projects";

/**
 * Real 404 status for unknown case studies. With Cache Components, notFound()
 * inside a streamed render keeps the 200 status (soft 404), so unknown slugs
 * are rewritten here, before rendering, to a path with no route.
 * Imports the raw project list (no zod) to keep the proxy small.
 */
const slugs = new Set(projects.map((p) => p.slug));

export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2];
  if (slug && !slugs.has(slug)) {
    return NextResponse.rewrite(new URL("/404", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/work/:slug",
};
