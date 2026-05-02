import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Printer, Cloud, Monitor, Cable } from 'lucide-react'
import Link from 'next/link'
import { PrintSettingsForm } from '@/components/admin/print-settings-form'
import { getPrintSettings } from '@/app/actions/print'

export default async function PrintSettingsPage() {
  const initialSettings = await getPrintSettings()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-primary px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center">
          <Button asChild variant="secondary" size="sm" className="w-full sm:w-auto">
            <Link href="/admin/patients">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Admin
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold text-primary-foreground sm:text-2xl">
              Print Settings
            </h1>
            <p className="text-sm text-primary-foreground/80">
              Configure site-wide printer behavior
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-6 px-4 py-5 sm:p-6">
        {/* Printer Types Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Browser Print</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Opens a print dialog in a new window. Works with any printer connected to your computer.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Cable className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">ESC/POS Direct</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Sends raw commands to thermal receipt printers over network (TCP/IP) or USB.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Cloud className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Cloud Print</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Send orders to a cloud print service API for remote printing capabilities.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Settings Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Printer className="h-5 w-5" />
              Printer Configuration
            </CardTitle>
            <CardDescription>
              These settings apply across the site. Browser print still uses each device&apos;s selected OS printer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PrintSettingsForm initialSettings={initialSettings} />
          </CardContent>
        </Card>

        {/* Test Print Section */}
        <Card>
          <CardHeader>
            <CardTitle>Test Printing</CardTitle>
            <CardDescription>
              Send a test print to verify your printer configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <a 
                href="/api/print/test?type=browser" 
                target="_blank"
                rel="noopener noreferrer"
              >
                <Monitor className="mr-2 h-4 w-4" />
                Test Browser Print
              </a>
            </Button>
            <Button variant="outline" disabled className="w-full sm:w-auto">
              <Cable className="mr-2 h-4 w-4" />
              Test ESC/POS
            </Button>
            <Button variant="outline" disabled className="w-full sm:w-auto">
              <Cloud className="mr-2 h-4 w-4" />
              Test Cloud Print
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
