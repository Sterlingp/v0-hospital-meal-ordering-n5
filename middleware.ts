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

  // Only enforce IP restriction in production
  if (!isProduction) {
    return NextResponse.next()
  }

  const allowedIps = (process.env.ALLOWED_IPS || '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)

  const ip = getClientIp(req)

  if (!allowedIps.includes(ip)) {
    return new NextResponse('Access Denied', { status: 403 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}