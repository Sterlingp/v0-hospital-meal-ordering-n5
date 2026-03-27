import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function ipToInt(ip: string): number | null {
  const parts = ip.split('.')
  if (parts.length !== 4) return null

  const nums = parts.map(Number)
  if (nums.some((n) => Number.isNaN(n) || n < 0 || n > 255)) return null

  return (
    ((nums[0] << 24) >>> 0) +
    ((nums[1] << 16) >>> 0) +
    ((nums[2] << 8) >>> 0) +
    (nums[3] >>> 0)
  ) >>> 0
}

function matchesCidr(ip: string, cidr: string): boolean {
  const [range, prefixStr] = cidr.split('/')
  const prefix = Number(prefixStr)

  if (!range || Number.isNaN(prefix) || prefix < 0 || prefix > 32) return false

  const ipInt = ipToInt(ip)
  const rangeInt = ipToInt(range)

  if (ipInt === null || rangeInt === null) return false
  if (prefix === 0) return true

  const mask = (0xffffffff << (32 - prefix)) >>> 0
  return (ipInt & mask) === (rangeInt & mask)
}

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()

  const realIp = req.headers.get('x-real-ip')
  if (realIp) return realIp.trim()

  return ''
}

export function middleware(req: NextRequest) {
  if (process.env.VERCEL_ENV !== 'production') {
    return NextResponse.next()
  }

  const allowedCidrs = (process.env.ALLOWED_CIDRS || '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)

  if (allowedCidrs.length === 0) {
    return NextResponse.next()
  }

  const ip = getClientIp(req)
  if (!ip) {
    return new NextResponse('Access Denied', { status: 403 })
  }

  const allowed = allowedCidrs.some((cidr) => matchesCidr(ip, cidr))

  if (!allowed) {
    return new NextResponse('Access Denied', { status: 403 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/order/:path*', '/patients/:path*', '/kitchen/:path*'],
}