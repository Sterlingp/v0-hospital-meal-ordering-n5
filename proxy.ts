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

function parseCsvEnv(value?: string): string[] {
  return (value || '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)
}

function isAllowedIp(ip: string, allowedIps: string[], allowedCidrs: string[]): boolean {
  if (!ip) return false
  if (allowedIps.includes(ip)) return true
  return allowedCidrs.some((cidr) => matchesCidr(ip, cidr))
}

export default function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  if (
    pathname.startsWith('/_next/static') ||
    pathname.startsWith('/_next/image') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  const allowedIps = parseCsvEnv(process.env.ALLOWED_IPS)
  const allowedCidrs = parseCsvEnv(process.env.ALLOWED_CIDRS)
  const ip = getClientIp(req)

  if (!isAllowedIp(ip, allowedIps, allowedCidrs)) {
    return new NextResponse('Access Denied', { status: 403 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
