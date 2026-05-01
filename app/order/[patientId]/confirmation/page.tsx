import { getPatient } from '@/app/actions/meals'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Clock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { MEAL_LABELS } from '@/lib/types'

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
  }
  
  const orderDate = order?.order_date
    ? new Date(order.order_date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      })
    : null
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <Card className="w-full max-w-lg text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
            <CheckCircle className="h-12 w-12 text-success" />
          </div>
          <CardTitle className="text-3xl">Order Confirmed!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-muted-foreground">
            Thank you, {patient.first_name}! Your meal order has been submitted successfully.
          </p>
          
          {order && (
            <div className="rounded-lg bg-secondary p-4">
              <div className="mb-4 flex items-center justify-center gap-2 text-lg font-semibold">
                <Clock className="h-5 w-5 text-primary" />
                <span>
                  {MEAL_LABELS[order.meal_type as keyof typeof MEAL_LABELS]}{orderDate ? ` - ${orderDate}` : ''}
                </span>
              </div>
              
              <div className="space-y-2 text-left">
                {order.order_items?.map((item: { id: string; menu_item: { name: string; category: string } }) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b border-border/50 py-2 last:border-0"
                  >
                    <span className="font-medium">{item.menu_item?.name}</span>
                    <span className="text-sm capitalize text-muted-foreground">
                      {item.menu_item?.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <p className="text-muted-foreground">
            Your meal will be delivered to Room {patient.room_number}.
          </p>
          
          <div className="flex flex-col gap-3 pt-4">
            <Button asChild size="lg" className="w-full text-lg">
              <Link href={`/order/${patientId}`}>
                <ArrowLeft className="mr-2 h-5 w-5" />
                Order Another Meal
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
