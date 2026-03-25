import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DIET_LABELS } from '@/lib/types'
import Link from 'next/link'
import { User, MapPin, Utensils } from 'lucide-react'
import type { Patient } from '@/lib/types'

export default async function HomePage() {
  const supabase = await createClient()
  
  const { data: patients } = await supabase
    .from('patients')
    .select('*')
    .order('room_number')
  
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Utensils className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-card-foreground">
                Hospital Meal Ordering
              </h1>
              <p className="text-muted-foreground">
                Select a patient to begin meal ordering
              </p>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-8">
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
                    <span className="rounded-full bg-accent/20 px-2 py-0.5 text-sm font-medium text-accent-foreground">
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
