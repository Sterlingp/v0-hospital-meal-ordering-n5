import { getPatient } from '@/app/actions/meals'
import { PatientHeader } from '@/components/meal-order/patient-header'
import { OrderWizard } from '@/components/meal-order/order-wizard'
import { notFound } from 'next/navigation'

interface OrderPageProps {
  params: Promise<{ patientId: string }>
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { patientId } = await params
  const patient = await getPatient(patientId)
  
  if (!patient) {
    notFound()
  }
  
  return (
    <div className="flex min-h-screen flex-col">
      <PatientHeader patient={patient} />
      <OrderWizard patient={patient} />
    </div>
  )
}
