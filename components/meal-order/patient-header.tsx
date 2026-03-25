'use client'

import type { Patient } from '@/lib/types'
import { DIET_LABELS } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { User, MapPin, Leaf, AlertCircle } from 'lucide-react'

interface PatientHeaderProps {
  patient: Patient
}

export function PatientHeader({ patient }: PatientHeaderProps) {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <User className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-card-foreground">
              {patient.first_name} {patient.last_name}
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Room {patient.room_number}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1.5 text-sm">
            <Leaf className="h-4 w-4" />
            {DIET_LABELS[patient.diet_type]}
          </Badge>
          
          {patient.allergies.length > 0 && (
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <div className="flex gap-1">
                {patient.allergies.map((allergy) => (
                  <Badge key={allergy} variant="destructive" className="text-sm">
                    {allergy}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
