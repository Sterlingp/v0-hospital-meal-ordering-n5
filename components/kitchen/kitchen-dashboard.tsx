'use client'

import { useState, useEffect, useCallback } from 'react'
import type { KitchenOrder } from '@/app/actions/kitchen'
import { getKitchenOrders } from '@/app/actions/kitchen'
import { OrderTicket } from './order-ticket'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { OrderStatus } from '@/lib/types'
import { RefreshCw, Clock, ChefHat, Check, Truck } from 'lucide-react'

interface KitchenDashboardProps {
  initialOrders: KitchenOrder[]
}

export function KitchenDashboard({ initialOrders }: KitchenDashboardProps) {
  const [orders, setOrders] = useState<KitchenOrder[]>(initialOrders)
  const [activeTab, setActiveTab] = useState<'all' | OrderStatus>('all')
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const refreshOrders = useCallback(async () => {
    setIsRefreshing(true)
    const freshOrders = await getKitchenOrders()
    setOrders(freshOrders)
    setIsRefreshing(false)
  }, [])
  
  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(refreshOrders, 30000)
    return () => clearInterval(interval)
  }, [refreshOrders])
  
  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(o => o.status === activeTab)
  
  const pendingCount = orders.filter(o => o.status === 'pending').length
  const preparingCount = orders.filter(o => o.status === 'preparing').length
  const readyCount = orders.filter(o => o.status === 'ready').length
  
  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-4 rounded-lg bg-warning/10 border border-warning/20">
          <div className="p-2 rounded-full bg-warning text-warning-foreground">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20">
          <div className="p-2 rounded-full bg-primary text-primary-foreground">
            <ChefHat className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{preparingCount}</p>
            <p className="text-sm text-muted-foreground">Preparing</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-4 rounded-lg bg-success/10 border border-success/20">
          <div className="p-2 rounded-full bg-success text-success-foreground">
            <Check className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{readyCount}</p>
            <p className="text-sm text-muted-foreground">Ready</p>
          </div>
        </div>
      </div>
      
      {/* Tabs and Refresh */}
      <div className="flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList>
            <TabsTrigger value="all" className="gap-2">
              All Orders
              <Badge variant="secondary" className="ml-1">{orders.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="pending" className="gap-2">
              Pending
              {pendingCount > 0 && (
                <Badge variant="destructive" className="ml-1">{pendingCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="preparing" className="gap-2">
              Preparing
              {preparingCount > 0 && (
                <Badge className="ml-1">{preparingCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="ready" className="gap-2">
              Ready
              {readyCount > 0 && (
                <Badge className="ml-1 bg-success text-success-foreground">{readyCount}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button
          variant="outline"
          size="sm"
          onClick={refreshOrders}
          disabled={isRefreshing}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Truck className="h-16 w-16 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold text-foreground">No Orders</h2>
          <p className="mt-2 text-muted-foreground">
            {activeTab === 'all' 
              ? 'No active orders in the queue.'
              : `No ${activeTab} orders at the moment.`
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredOrders.map((order) => (
            <OrderTicket
              key={order.id}
              order={order}
              onStatusUpdate={refreshOrders}
            />
          ))}
        </div>
      )}
    </div>
  )
}
