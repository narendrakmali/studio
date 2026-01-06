// Force all routes to use dynamic rendering
// This prevents Next.js from trying to statically generate pages at build time
// which would fail because Firebase environment variables aren't available during build

export const dynamic = 'force-dynamic';
export const revalidate = 0;
