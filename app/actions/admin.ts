'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Patient, DietType } from '@/lib/types'

export async function getAllPatients(): Promise<Patient[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .order('last_name')
  
  if (error) {
    console.error('Error fetching patients:', error)
    return []
  }
  
  return data || []
}

export async function createPatient(formData: {
  first_name: string
  last_name: string
  room_number: string
  diet_type: DietType
  allergies: string[]
  special_instructions?: string
}): Promise<{ success: boolean; patient?: Patient; error?: string }> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('patients')
    .insert({
      first_name: formData.first_name,
      last_name: formData.last_name,
      room_number: formData.room_number,
      diet_type: formData.diet_type,
      allergies: formData.allergies,
      special_instructions: formData.special_instructions || null,
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating patient:', error)
    return { success: false, error: error.message }
  }
  
  revalidatePath('/admin/patients')
  revalidatePath('/')
  return { success: true, patient: data }
}

export async function updatePatient(
  patientId: string,
  formData: {
    first_name: string
    last_name: string
    room_number: string
    diet_type: DietType
    allergies: string[]
    special_instructions?: string
  }
): Promise<{ success: boolean; patient?: Patient; error?: string }> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('patients')
    .update({
      first_name: formData.first_name,
      last_name: formData.last_name,
      room_number: formData.room_number,
      diet_type: formData.diet_type,
      allergies: formData.allergies,
      special_instructions: formData.special_instructions || null,
    })
    .eq('id', patientId)
    .select()
  
  if (error) {
    console.error('Error updating patient:', error)
    return { success: false, error: error.message }
  }
  
  if (!data || data.length === 0) {
    return { success: false, error: 'Patient not found' }
  }
  
  revalidatePath('/admin/patients')
  revalidatePath('/')
  return { success: true, patient: data[0] }
}

export async function deletePatient(
  patientId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  
  // Delete the patient - orders will cascade delete automatically via FK constraint
  const { error, count } = await supabase
    .from('patients')
    .delete()
    .eq('id', patientId)
  
  if (error) {
    console.error('Error deleting patient:', error)
    return { success: false, error: error.message }
  }
  
  console.log('[v0] Deleted patient, affected rows:', count)
  
  revalidatePath('/admin/patients')
  revalidatePath('/')
  return { success: true }
}
