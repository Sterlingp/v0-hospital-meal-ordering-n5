'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Clock, ArrowLeft } from 'lucide-react'
import { MEAL_LABELS } from '@/lib/types'

interface ConfirmationOrderItem {
  id: string
  menu_item: {
    name: string
    category: string
  }
}

interface ConfirmationOrder {
  meal_type: string
  order_items?: ConfirmationOrderItem[]
}

interface OrderConfirmationCardProps {
  patientId: string
  patientFirstName: string
  roomNumber: string
  order: ConfirmationOrder | null
  orderDate: string | null
  autoPrintEnabled: boolean
  printUrl?: string
}

export function OrderConfirmationCard({
  patientId,
  patientFirstName,
  roomNumber,
  order,
  orderDate,
  autoPrintEnabled,
  printUrl,
}: OrderConfirmationCardProps) {
  const router = useRouter()
  const [hasStartedPrinting, setHasStartedPrinting] = useState(false)

  useEffect(() => {
    if (!autoPrintEnabled || !printUrl) return
    setHasStartedPrinting(true)

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      if (event.data?.type === 'meal-order-print-dialog-closed') {
        router.push('/')
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [autoPrintEnabled, printUrl, router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-6">
      {autoPrintEnabled && printUrl ? (
        <iframe
          title="Auto Print Receipt"
          src={printUrl}
          className="hidden"
        />
      ) : null}

      <Card className="w-full max-w-lg text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
            <CheckCircle className="h-12 w-12 text-success" />
          </div>
          <CardTitle className="text-3xl">Order Confirmed!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-muted-foreground">
            Thank you, {patientFirstName}! Your meal order has been submitted successfully.
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
                {order.order_items?.map((item) => (
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
            Your meal will be delivered to Room {roomNumber}.
          </p>

          {autoPrintEnabled && hasStartedPrinting ? (
            <p className="text-sm text-muted-foreground">
              Printing started. You&apos;ll return home after the print dialog closes.
            </p>
          ) : null}

          <div className="flex flex-col gap-3 pt-4">
            <Button asChild size="lg" className="w-full text-lg">
              <Link href="/">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Go Back Home
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="w-full text-lg">
              <Link href={`/order/${patientId}`}>
                Order Another Meal
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
