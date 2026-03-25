'use client'

import type { Patient } from '@/lib/types'
import { DIET_LABELS } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { User, MapPin, Leaf, AlertCircle, Home } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface PatientHeaderProps {
  patient: Patient
}

export function PatientHeader({ patient }: PatientHeaderProps) {
  return (
    <header className="border-b bg-primary">
      <div className="container mx-auto flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/ehmct-logo.png"
              alt="East Houston Medical Center"
              width={50}
              height={50}
              className="rounded"
            />
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-primary-foreground">East Houston</p>
              <p className="text-xs text-primary-foreground/80">Medical Center</p>
            </div>
          </Link>
          <div className="h-10 w-px bg-primary-foreground/20" />
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20 text-primary-foreground">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary-foreground">
                {patient.first_name} {patient.last_name}
              </h1>
              <div className="flex items-center gap-2 text-primary-foreground/80 text-sm">
                <MapPin className="h-3 w-3" />
                <span>Room {patient.room_number}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1.5 text-sm bg-emerald-500/90 text-white border-0">
            <Leaf className="h-4 w-4" />
            {DIET_LABELS[patient.diet_type]}
          </Badge>
          
          {patient.allergies.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {patient.allergies.map((allergy) => (
                  <Badge key={allergy} variant="destructive" className="text-sm">
                    {allergy}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-primary-foreground hover:bg-primary-foreground/20 gap-1"
          >
            <Link href="/">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
