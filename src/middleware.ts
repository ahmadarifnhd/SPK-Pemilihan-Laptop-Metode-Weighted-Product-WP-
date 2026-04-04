import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Daftar rute yang harus diproteksi (hanya untuk pengguna yang login)
  const protectedRoutes = [
    "/admin",
    "/profile",
  ];

  // Periksa apakah url saat ini adalah salah satu rute yang diproteksi
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // Periksa keberadaan cookie auth_session
    const authSession = request.cookies.get("auth_session");

    if (!authSession) {
      // Jika tidak ada session, arahkan ke halaman signin
      const signInUrl = new URL("/signin", request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Lanjutkan as normal jika tidak terproteksi atau sudah login
  return NextResponse.next();
}

// Hanya jalankan middleware ini pada path tertentu (optimasi)
export const config = {
  matcher: [
    "/admin/:path*",
    "/profile/:path*",
  ],
};
