// @ts-nocheck
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Edge-compatible Middleware for Global Basic Auth.
 * Protects `/admin` and sub-routes directly when deploying on Next.js/Vercel.
 */
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // Protect only administrative paths
  if (url.pathname.startsWith('/admin')) {
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return new NextResponse('Acceso Restringido. Se requiere autenticación.', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Panel Administrativo Dr. Mendez"',
        },
      });
    }

    try {
      // Decode authorization credentials
      const authValue = authHeader.split(' ')[1];
      const decoded = Buffer.from(authValue, 'base64').toString('utf-8');
      const [username, password] = decoded.split(':');

      const expectedUser = process.env.ADMIN_USER || 'admin';
      const expectedPass = process.env.ADMIN_PASS || 'MendezPenalPractica2026!';

      if (username !== expectedUser || password !== expectedPass) {
        return new NextResponse('Credenciales Inválidas.', {
          status: 401,
          headers: {
            'WWW-Authenticate': 'Basic realm="Panel Administrativo Dr. Mendez"',
          },
        });
      }
    } catch (e) {
      return new NextResponse('Error de Autenticación.', { status: 400 });
    }
  }

  return NextResponse.next();
}

// Config to target only administrative routes
export const config = {
  matcher: ['/admin/:path*'],
};
