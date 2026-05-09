import { NextResponse } from 'next/dist/server/web/spec-extension/response';
import type { NextRequest } from 'next/dist/server/web/spec-extension/request';

// Hizi ni kurasa ambazo lazima mtu awe ame-login ndiyo aingie
const protectedRoutes = ['/dashboard', '/shipments', '/trips', '/branches', '/users', '/settings'];

export function middleware(request: NextRequest) {
  // Angalia muhuri (cookie) kama upo
  const sessionCookie = request.cookies.get('simbadume_session');
  
  const path = request.nextUrl.pathname;
  
  // Je, anajaribu kuingia kwenye kurasa za siri?
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));

  // Kama anajaribu kuingia ofisini lakini hana muhuri (haja-login)
  if (isProtectedRoute && !sessionCookie) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Kama amesha-login lakini anajaribu kurudi kwenye ukurasa wa login
  if (path === '/login' && sessionCookie) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|receipt).*)'],
};