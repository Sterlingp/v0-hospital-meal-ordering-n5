'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, RefreshCw } from 'lucide-react'
import type { Patient } from '@/lib/types'
import { getAllPatients } from '@/app/actions/admin'
import { PatientList } from './patient-list'
import { PatientForm } from './patient-form'

export function PatientDashboard({ initialPatients }: { initialPatients: Patient[] }) {
  const [patients, setPatients] = useState<Patient[]>(initialPatients)
  const [loading, setLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  
  const refreshPatients = useCallback(async () => {
    setLoading(true)
    const data = await getAllPatients()
    setPatients(data)
    setLoading(false)
  }, [])
  
  // Refresh on mount to get latest data
  useEffect(() => {
    refreshPatients()
  }, [refreshPatients])
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground">
            {patients.length} patient{patients.length !== 1 ? 's' : ''} registered
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshPatients} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Patient
          </Button>
        </div>
      </div>
      
      <PatientList patients={patients} onRefresh={refreshPatients} />
      
      <PatientForm
        open={showAddForm}
        onOpenChange={setShowAddForm}
        onSuccess={refreshPatients}
      />
    </div>
  )
}
