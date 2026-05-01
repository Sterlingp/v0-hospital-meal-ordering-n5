'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Loader2, Save } from 'lucide-react'

type PrinterType = 'browser' | 'escpos' | 'cloud'

interface PrintSettings {
  enabled: boolean
  autoPrint: boolean
  printerType: PrinterType
  cloudPrintUrl: string
  cloudApiKey: string
  escposHost: string
  escposPort: string
}

export function PrintSettingsForm() {
  const [settings, setSettings] = useState<PrintSettings>({
    enabled: true,
    autoPrint: true,
    printerType: 'browser',
    cloudPrintUrl: '',
    cloudApiKey: '',
    escposHost: '',
    escposPort: '9100',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    // In production, this would save to database or environment variables
    // For now, we'll just simulate a save
    await new Promise(resolve => setTimeout(resolve, 500))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Enable/Disable Printing */}
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label htmlFor="print-enabled" className="text-base font-medium">
            Enable Printing
          </Label>
          <p className="text-sm text-muted-foreground">
            Turn printing on or off for all orders
          </p>
        </div>
        <Switch
          id="print-enabled"
          checked={settings.enabled}
          onCheckedChange={(checked) => setSettings(s => ({ ...s, enabled: checked }))}
        />
      </div>

      {/* Auto-Print Toggle */}
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label htmlFor="auto-print" className="text-base font-medium">
            Auto-Print Orders
          </Label>
          <p className="text-sm text-muted-foreground">
            Automatically print when an order is submitted
          </p>
        </div>
        <Switch
          id="auto-print"
          checked={settings.autoPrint}
          onCheckedChange={(checked) => setSettings(s => ({ ...s, autoPrint: checked }))}
          disabled={!settings.enabled}
        />
      </div>

      {/* Printer Type Selection */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Printer Type</Label>
        <RadioGroup
          value={settings.printerType}
          onValueChange={(value) => setSettings(s => ({ ...s, printerType: value as PrinterType }))}
          className="grid gap-3"
          disabled={!settings.enabled}
        >
          <div className="flex items-center space-x-3 rounded-lg border p-4">
            <RadioGroupItem value="browser" id="browser" />
            <Label htmlFor="browser" className="flex-1 cursor-pointer">
              <div className="font-medium">Browser Print</div>
              <div className="text-sm text-muted-foreground">
                Uses the browser&apos;s native print dialog
              </div>
            </Label>
          </div>
          
          <div className="flex items-center space-x-3 rounded-lg border p-4">
            <RadioGroupItem value="escpos" id="escpos" />
            <Label htmlFor="escpos" className="flex-1 cursor-pointer">
              <div className="font-medium">ESC/POS Thermal Printer</div>
              <div className="text-sm text-muted-foreground">
                Direct printing to network thermal printers
              </div>
            </Label>
          </div>
          
          <div className="flex items-center space-x-3 rounded-lg border p-4">
            <RadioGroupItem value="cloud" id="cloud" />
            <Label htmlFor="cloud" className="flex-1 cursor-pointer">
              <div className="font-medium">Cloud Print Service</div>
              <div className="text-sm text-muted-foreground">
                Send to a cloud-based print service API
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* ESC/POS Settings */}
      {settings.printerType === 'escpos' && (
        <div className="space-y-4 rounded-lg border p-4">
          <h4 className="font-medium">ESC/POS Printer Settings</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="escpos-host">Printer IP Address</Label>
              <Input
                id="escpos-host"
                placeholder="192.168.1.100"
                value={settings.escposHost}
                onChange={(e) => setSettings(s => ({ ...s, escposHost: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="escpos-port">Port</Label>
              <Input
                id="escpos-port"
                placeholder="9100"
                value={settings.escposPort}
                onChange={(e) => setSettings(s => ({ ...s, escposPort: e.target.value }))}
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Note: ESC/POS printing requires a browser extension or local print server for direct network printing.
          </p>
        </div>
      )}

      {/* Cloud Print Settings */}
      {settings.printerType === 'cloud' && (
        <div className="space-y-4 rounded-lg border p-4">
          <h4 className="font-medium">Cloud Print Settings</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cloud-url">Cloud Print API URL</Label>
              <Input
                id="cloud-url"
                placeholder="https://api.printservice.com/print"
                value={settings.cloudPrintUrl}
                onChange={(e) => setSettings(s => ({ ...s, cloudPrintUrl: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cloud-key">API Key</Label>
              <Input
                id="cloud-key"
                type="password"
                placeholder="Enter your API key"
                value={settings.cloudApiKey}
                onChange={(e) => setSettings(s => ({ ...s, cloudApiKey: e.target.value }))}
              />
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex items-center gap-4">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Settings
        </Button>
        {saved && (
          <span className="text-sm text-green-600">Settings saved!</span>
        )}
      </div>
    </div>
  )
}
