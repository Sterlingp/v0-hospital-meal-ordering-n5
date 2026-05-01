import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Users, Printer } from 'lucide-react'
import { PatientDashboard } from '@/components/admin/patient-dashboard'
import type { Patient } from '@/lib/types'

export const metadata = {
  title: 'Patient Management | Admin Dashboard',
  description: 'Manage patients, dietary requirements, and allergies',
}

export default async function AdminPatientsPage() {
  const supabase = await createClient()
  
  const { data: patients } = await supabase
    .from('patients')
    .select('*')
    .order('last_name')
  
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
                priority
              />
              <div>
                <h1 className="text-2xl font-bold text-primary-foreground">
                  Admin Dashboard
                </h1>
                <p className="text-primary-foreground/80">
                  Patient Management
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="secondary">
                <Link href="/admin/print-settings">
                  <Printer className="h-4 w-4 mr-2" />
                  Print Settings
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Patient Management</h2>
          </div>
          <p className="text-muted-foreground">
            Add, edit, and remove patients. Configure dietary requirements and allergies for each patient.
          </p>
        </div>
        
        <PatientDashboard initialPatients={(patients as Patient[]) || []} />
      </main>
    </div>
  )
}
