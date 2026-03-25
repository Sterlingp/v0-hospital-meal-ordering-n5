import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DIET_LABELS } from '@/lib/types'
import Link from 'next/link'
import { User, MapPin, ChefHat } from 'lucide-react'
import Image from 'next/image'
import type { Patient } from '@/lib/types'

export default async function HomePage() {
  const supabase = await createClient()
  
  const { data: patients } = await supabase
    .from('patients')
    .select('*')
    .order('room_number')
  
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-primary">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/ehmct-logo.png"
                alt="East Houston Medical Center"
                width={60}
                height={60}
                className="rounded"
              />
              <div>
                <h1 className="text-2xl font-bold text-primary-foreground">
                  East Houston Medical Center
                </h1>
                <p className="text-primary-foreground/80">
                  Patient Meal Ordering System
                </p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-primary-foreground hover:bg-primary-foreground/20 gap-2"
            >
              <Link href="/kitchen">
                <ChefHat className="h-4 w-4" />
                Kitchen Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-6 py-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Select a Patient</h2>
      </div>
      
      <main className="container mx-auto px-6 pb-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {patients?.map((patient: Patient) => (
            <Card key={patient.id} className="overflow-hidden transition-shadow hover:shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                    <User className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">
                      {patient.first_name} {patient.last_name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Room {patient.room_number}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Diet:</span>
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-sm font-medium text-secondary-foreground">
                      {DIET_LABELS[patient.diet_type]}
                    </span>
                  </div>
                  {patient.allergies.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm text-muted-foreground">Allergies:</span>
                      {patient.allergies.map((allergy: string) => (
                        <span
                          key={allergy}
                          className="rounded bg-destructive/10 px-2 py-0.5 text-sm font-medium text-destructive"
                        >
                          {allergy}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <Button asChild className="w-full">
                  <Link href={`/order/${patient.id}`}>
                    Start Meal Order
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {(!patients || patients.length === 0) && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <User className="h-16 w-16 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold text-foreground">No Patients Found</h2>
            <p className="mt-2 text-muted-foreground">
              No patients are currently registered in the system.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
