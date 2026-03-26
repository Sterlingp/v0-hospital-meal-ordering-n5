'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { X, Plus } from 'lucide-react'
import type { Patient, DietType } from '@/lib/types'
import { DIET_LABELS } from '@/lib/types'
import { createPatient, updatePatient } from '@/app/actions/admin'

const COMMON_ALLERGIES = [
  'gluten',
  'dairy',
  'eggs',
  'peanuts',
  'tree nuts',
  'soy',
  'shellfish',
  'fish',
]

interface PatientFormProps {
  patient?: Patient | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function PatientForm({ patient, open, onOpenChange, onSuccess }: PatientFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [roomNumber, setRoomNumber] = useState('')
  const [dietType, setDietType] = useState<DietType>('regular')
  const [allergies, setAllergies] = useState<string[]>([])
  const [customAllergy, setCustomAllergy] = useState('')
  const [specialInstructions, setSpecialInstructions] = useState('')
  
  const isEditing = !!patient
  
  // Sync form state when patient changes (for edit mode)
  useEffect(() => {
    if (patient) {
      setFirstName(patient.first_name)
      setLastName(patient.last_name)
      setRoomNumber(patient.room_number)
      setDietType(patient.diet_type)
      setAllergies(patient.allergies || [])
      setSpecialInstructions(patient.special_instructions || '')
    } else {
      // Reset form for new patient
      setFirstName('')
      setLastName('')
      setRoomNumber('')
      setDietType('regular')
      setAllergies([])
      setSpecialInstructions('')
    }
    setError(null)
    setCustomAllergy('')
  }, [patient])
  
  const handleAddAllergy = (allergy: string) => {
    const normalized = allergy.toLowerCase().trim()
    if (normalized && !allergies.includes(normalized)) {
      setAllergies([...allergies, normalized])
    }
    setCustomAllergy('')
  }
  
  const handleRemoveAllergy = (allergy: string) => {
    setAllergies(allergies.filter(a => a !== allergy))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = {
      first_name: firstName,
      last_name: lastName,
      room_number: roomNumber,
      diet_type: dietType,
      allergies,
      special_instructions: specialInstructions || undefined,
    }
    
    const result = isEditing
      ? await updatePatient(patient.id, formData)
      : await createPatient(formData)
    
    setLoading(false)
    
    if (result.success) {
      onSuccess()
      onOpenChange(false)
      // Form will reset via useEffect when patient prop changes
    } else {
      setError(result.error || 'Something went wrong')
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Patient' : 'Add New Patient'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update patient information, dietary requirements, and allergies.'
              : 'Enter patient information, dietary requirements, and allergies.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="roomNumber">Room Number</Label>
            <Input
              id="roomNumber"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              placeholder="e.g., 101A"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dietType">Diet Type</Label>
            <Select value={dietType} onValueChange={(value: DietType) => setDietType(value)}>
              <SelectTrigger id="dietType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DIET_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Allergies</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {allergies.map((allergy) => (
                <Badge key={allergy} variant="destructive" className="gap-1">
                  {allergy}
                  <button
                    type="button"
                    onClick={() => handleRemoveAllergy(allergy)}
                    className="ml-1 hover:bg-destructive-foreground/20 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {allergies.length === 0 && (
                <span className="text-sm text-muted-foreground">No allergies added</span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {COMMON_ALLERGIES.filter(a => !allergies.includes(a)).map((allergy) => (
                <Button
                  key={allergy}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddAllergy(allergy)}
                  className="h-7 text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {allergy}
                </Button>
              ))}
            </div>
            
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Add custom allergy..."
                value={customAllergy}
                onChange={(e) => setCustomAllergy(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddAllergy(customAllergy)
                  }
                }}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleAddAllergy(customAllergy)}
                disabled={!customAllergy.trim()}
              >
                Add
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
            <Textarea
              id="specialInstructions"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Any special dietary notes or instructions..."
              rows={3}
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Patient'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
