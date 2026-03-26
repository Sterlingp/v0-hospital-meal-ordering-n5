'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Pencil, Trash2 } from 'lucide-react'
import type { Patient } from '@/lib/types'
import { DIET_LABELS } from '@/lib/types'
import { deletePatient } from '@/app/actions/admin'
import { PatientForm } from './patient-form'

interface PatientListProps {
  patients: Patient[]
  onRefresh: () => void
}

export function PatientList({ patients, onRefresh }: PatientListProps) {
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
  const [deletingPatient, setDeletingPatient] = useState<Patient | null>(null)
  const [deleting, setDeleting] = useState(false)
  
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!deletingPatient) return
    
    console.log('[v0] Deleting patient:', deletingPatient.id, deletingPatient.first_name)
    setDeleting(true)
    
    try {
      const result = await deletePatient(deletingPatient.id)
      console.log('[v0] Delete result:', result)
      
      if (result.success) {
        setDeletingPatient(null)
        onRefresh()
      } else {
        console.error('[v0] Delete failed:', result.error)
      }
    } catch (err) {
      console.error('[v0] Delete exception:', err)
    } finally {
      setDeleting(false)
    }
  }
  
  const getDietBadgeVariant = (dietType: string) => {
    switch (dietType) {
      case 'regular':
        return 'secondary'
      case 'heart_healthy':
        return 'default'
      case 'renal':
        return 'destructive'
      case 'carb_controlled':
        return 'outline'
      case 'vegetarian':
        return 'secondary'
      case 'no_added_salt':
        return 'outline'
      default:
        return 'secondary'
    }
  }
  
  return (
    <>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Diet Type</TableHead>
              <TableHead>Allergies</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="font-medium">
                  {patient.first_name} {patient.last_name}
                </TableCell>
                <TableCell>{patient.room_number}</TableCell>
                <TableCell>
                  <Badge variant={getDietBadgeVariant(patient.diet_type) as 'default' | 'secondary' | 'destructive' | 'outline'}>
                    {DIET_LABELS[patient.diet_type]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {patient.allergies.length > 0 ? (
                      patient.allergies.map((allergy) => (
                        <Badge key={allergy} variant="destructive" className="text-xs">
                          {allergy}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-sm">None</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingPatient(patient)}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit {patient.first_name}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeletingPatient(patient)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete {patient.first_name}</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {patients.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No patients found. Add your first patient to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Edit Patient Dialog */}
      <PatientForm
        patient={editingPatient}
        open={!!editingPatient}
        onOpenChange={(open) => !open && setEditingPatient(null)}
        onSuccess={onRefresh}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingPatient} onOpenChange={(open) => !open && setDeletingPatient(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Patient</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deletingPatient?.first_name} {deletingPatient?.last_name}?
              This will also delete all their order history. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? 'Deleting...' : 'Delete Patient'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
