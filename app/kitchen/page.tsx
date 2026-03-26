import { getKitchenOrders } from '@/app/actions/kitchen'
import { KitchenDashboard } from '@/components/kitchen/kitchen-dashboard'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { Home } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function KitchenPage() {
  const orders = await getKitchenOrders()
  
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-primary">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/ehmct-logo.png"
                alt="East Houston Medical Center"
                width={50}
                height={50}
                className="rounded"
                priority
              />
              <div>
                <h1 className="text-xl font-bold text-primary-foreground">
                  Kitchen Dashboard
                </h1>
                <p className="text-sm text-primary-foreground/80">
                  East Houston Medical Center
                </p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-primary-foreground hover:bg-primary-foreground/20 gap-1"
            >
              <Link href="/">
                <Home className="h-4 w-4" />
                Patient Select
              </Link>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-6">
        <KitchenDashboard initialOrders={orders} />
      </main>
    </div>
  )
}
