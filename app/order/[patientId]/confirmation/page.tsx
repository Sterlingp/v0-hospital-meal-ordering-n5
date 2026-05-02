import { getPatient } from '@/app/actions/meals'
import { autoPrintOrder, getPrintSettings } from '@/app/actions/print'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { OrderConfirmationCard } from '@/components/meal-order/order-confirmation-card'

interface ConfirmationPageProps {
  params: Promise<{ patientId: string }>
  searchParams: Promise<{ orderId?: string }>
}

export default async function ConfirmationPage({ params, searchParams }: ConfirmationPageProps) {
  const { patientId } = await params
  const { orderId } = await searchParams
  
  const patient = await getPatient(patientId)
  
  if (!patient) {
    notFound()
  }
  
  let order = null
  const printSettings = await getPrintSettings()
  let printUrl: string | undefined
  if (orderId) {
    const supabase = await createClient()
    const { data } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          menu_item:menu_items (*)
        )
      `)
      .eq('id', orderId)
      .single()
    
    order = data

    if (printSettings.enabled && printSettings.autoPrint) {
      const autoPrintResult = await autoPrintOrder(orderId)
      printUrl = autoPrintResult.printUrl
    }
  }
  
  const orderDate = order?.order_date
    ? new Date(order.order_date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      })
    : null
  
  return (
    <OrderConfirmationCard
      patientId={patientId}
      patientFirstName={patient.first_name}
      roomNumber={patient.room_number}
      order={order}
      orderDate={orderDate}
      autoPrintEnabled={printSettings.enabled && printSettings.autoPrint}
      printUrl={printUrl}
    />
  )
}
