'use client'

import { useState } from 'react'
import type { KitchenOrder } from '@/app/actions/kitchen'
import { updateOrderStatus } from '@/app/actions/kitchen'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DIET_LABELS, MEAL_LABELS, CATEGORY_LABELS, STATUS_LABELS } from '@/lib/types'
import type { OrderStatus } from '@/lib/types'
import { cn } from '@/lib/utils'
import { 
  Clock, 
  MapPin, 
  AlertTriangle, 
  ChefHat, 
  Check, 
  Truck,
  Loader2,
  Sun,
  Utensils,
  Moon
} from 'lucide-react'

interface OrderTicketProps {
  order: KitchenOrder
  onStatusUpdate?: () => void
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-warning text-warning-foreground',
  preparing: 'bg-primary text-primary-foreground',
  ready: 'bg-success text-success-foreground',
  delivered: 'bg-muted text-muted-foreground',
  cancelled: 'bg-destructive text-destructive-foreground',
}

const MEAL_ICONS: Record<string, React.ReactNode> = {
  breakfast: <Sun className="h-4 w-4" />,
  lunch: <Utensils className="h-4 w-4" />,
  dinner: <Moon className="h-4 w-4" />,
}

export function OrderTicket({ order, onStatusUpdate }: OrderTicketProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  
  const getNextStatus = (): OrderStatus | null => {
    switch (order.status) {
      case 'pending':
        return 'preparing'
      case 'preparing':
        return 'ready'
      case 'ready':
        return 'delivered'
      default:
        return null
    }
  }
  
  const getNextAction = (): { label: string; icon: React.ReactNode } | null => {
    switch (order.status) {
      case 'pending':
        return { label: 'Start Preparing', icon: <ChefHat className="h-4 w-4" /> }
      case 'preparing':
        return { label: 'Mark Ready', icon: <Check className="h-4 w-4" /> }
      case 'ready':
        return { label: 'Mark Delivered', icon: <Truck className="h-4 w-4" /> }
      default:
        return null
    }
  }
  
  const handleStatusUpdate = async () => {
    const nextStatus = getNextStatus()
    if (!nextStatus) return
    
    setIsUpdating(true)
    const result = await updateOrderStatus(order.id, nextStatus)
    setIsUpdating(false)
    
    if (result.success && onStatusUpdate) {
      onStatusUpdate()
    }
  }
  
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })
  }
  
  const getElapsedTime = () => {
    const created = new Date(order.created_at)
    const now = new Date()
    const diffMs = now.getTime() - created.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 60) {
      return `${diffMins}m ago`
    }
    const hours = Math.floor(diffMins / 60)
    const mins = diffMins % 60
    return `${hours}h ${mins}m ago`
  }
  
  const nextAction = getNextAction()
  
  // Group items by category
  const itemsByCategory = order.order_items.reduce((acc, item) => {
    const category = item.menu_item.category
    if (!acc[category]) acc[category] = []
    acc[category].push(item)
    return acc
  }, {} as Record<string, typeof order.order_items>)
  
  return (
    <Card className={cn(
      'overflow-hidden transition-all',
      order.status === 'pending' && 'border-warning border-2',
      order.status === 'preparing' && 'border-primary border-2',
      order.status === 'ready' && 'border-success border-2 animate-pulse'
    )}>
      <CardHeader className={cn('py-3 px-4', STATUS_COLORS[order.status])}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {MEAL_ICONS[order.meal_type]}
              <span className="font-semibold">{MEAL_LABELS[order.meal_type]}</span>
            </div>
            <Badge variant="outline" className="bg-background/20 border-0">
              {STATUS_LABELS[order.status]}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-sm opacity-80">
            <Clock className="h-3 w-3" />
            {getElapsedTime()}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        {/* Patient Info */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-lg text-foreground">
              {order.patient.first_name} {order.patient.last_name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              Room {order.patient.room_number}
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            {DIET_LABELS[order.patient.diet_type as keyof typeof DIET_LABELS]}
          </Badge>
        </div>
        
        {/* Allergies Warning */}
        {order.patient.allergies.length > 0 && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-destructive/10 text-destructive">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm font-medium">
              Allergies: {order.patient.allergies.join(', ')}
            </span>
          </div>
        )}
        
        {/* Order Items */}
        <div className="space-y-2">
          {Object.entries(itemsByCategory).map(([category, items]) => (
            <div key={category}>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
              </p>
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-1">
                  <span className="text-foreground">{item.menu_item.name}</span>
                  {item.quantity > 1 && (
                    <span className="text-sm text-muted-foreground">x{item.quantity}</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        
        {/* Special Requests */}
        {order.special_requests && (
          <div className="p-2 rounded-lg bg-muted">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Special Requests
            </p>
            <p className="text-sm text-foreground">{order.special_requests}</p>
          </div>
        )}
        
        {/* Action Button */}
        {nextAction && (
          <Button
            onClick={handleStatusUpdate}
            disabled={isUpdating}
            className="w-full gap-2"
            variant={order.status === 'ready' ? 'default' : 'outline'}
          >
            {isUpdating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              nextAction.icon
            )}
            {nextAction.label}
          </Button>
        )}
        
        {/* Timestamps */}
        <div className="text-xs text-muted-foreground pt-2 border-t">
          <p>Ordered: {formatTime(order.created_at)}</p>
          {order.submitted_at && <p>Started: {formatTime(order.submitted_at)}</p>}
          {order.prepared_at && <p>Ready: {formatTime(order.prepared_at)}</p>}
          {order.delivered_at && <p>Delivered: {formatTime(order.delivered_at)}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
