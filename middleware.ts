import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()

  const realIp = req.headers.get('x-real-ip')
  if (realIp) return realIp.trim()

  return ''
}

export function middleware(req: NextRequest) {
  const isProduction = process.env.VERCEL_ENV === 'production'

  if (!isProduction) {
    return NextResponse.next()
  }

  const allowedIps = (process.env.ALLOWED_IPS || '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)

  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() || ''

  if (!ip || !allowedIps.includes(ip)) {
    return new NextResponse('Access Denied', { status: 403 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Apply to all routes except:
     * - _next (Next.js internals)
     * - api (VERY IMPORTANT)
     * - static files
     */
    '/((?!_next|api|favicon.ico).*)',
  ],
}