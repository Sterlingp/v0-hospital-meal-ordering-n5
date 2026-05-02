'use client'

import { useState, useEffect } from 'react'
import type { MenuItem, DietType, EntreeOption, SelectedEntreeOptions } from '@/lib/types'
import { ENTREE_OPTIONS, getAvailableChoicesForOption } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface EntreeOptionsModalProps {
  item: MenuItem | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (item: MenuItem, options: SelectedEntreeOptions) => void
  patientDietType: DietType
  patientAllergies: string[]
}

export function EntreeOptionsModal({
  item,
  isOpen,
  onClose,
  onConfirm,
  patientDietType,
  patientAllergies,
}: EntreeOptionsModalProps) {
  const [selectedOptions, setSelectedOptions] = useState<SelectedEntreeOptions>({})
  
  // Get options config for this item
  const optionsConfig = item ? ENTREE_OPTIONS[item.name] : null
  
  // Reset selections when item changes
  useEffect(() => {
    if (item && optionsConfig) {
      const initialOptions: SelectedEntreeOptions = {}
      optionsConfig.forEach((option) => {
        if (option.multiple) {
          initialOptions[option.id] = []
        } else {
          initialOptions[option.id] = ''
        }
      })
      setSelectedOptions(initialOptions)
    }
  }, [item, optionsConfig])
  
  // Filter out choices that are restricted for this diet
  const getAvailableChoices = (option: EntreeOption) => {
    return getAvailableChoicesForOption(option, patientDietType, patientAllergies)
  }
  
  const handleSelect = (optionId: string, value: string, isMultiple: boolean) => {
    setSelectedOptions((prev) => {
      if (isMultiple) {
        const currentValues = (prev[optionId] as string[]) || []
        if (currentValues.includes(value)) {
          return { ...prev, [optionId]: currentValues.filter((v) => v !== value) }
        }
        return { ...prev, [optionId]: [...currentValues, value] }
      }
      return { ...prev, [optionId]: value }
    })
  }
  
  const isSelected = (optionId: string, value: string, isMultiple: boolean) => {
    if (isMultiple) {
      return ((selectedOptions[optionId] as string[]) || []).includes(value)
    }
    return selectedOptions[optionId] === value
  }
  
  const canConfirm = () => {
    if (!optionsConfig) return true
    return optionsConfig.every((option) => {
      if (!option.required) return true
      const value = selectedOptions[option.id]
      if (option.multiple) {
        return Array.isArray(value) && value.length > 0
      }
      return value && value !== ''
    })
  }
  
  const handleConfirm = () => {
    if (item && canConfirm()) {
      onConfirm(item, selectedOptions)
    }
  }
  
  if (!item || !optionsConfig) return null
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{item.name}</DialogTitle>
          <DialogDescription>
            Select your options for this item
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {optionsConfig.map((option) => {
            const availableChoices = getAvailableChoices(option)
            if (availableChoices.length === 0) return null
            
            return (
              <div key={option.id}>
                <h4 className="mb-3 font-medium text-foreground">
                  {option.label}
                  {option.required && <span className="ml-1 text-destructive">*</span>}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {availableChoices.map((choice) => {
                    const selected = isSelected(option.id, choice.value, option.multiple || false)
                    return (
                      <button
                        key={choice.value}
                        type="button"
                        onClick={() => handleSelect(option.id, choice.value, option.multiple || false)}
                        className={cn(
                          'relative flex items-center justify-center rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all',
                          selected
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border bg-card text-foreground hover:border-primary/50'
                        )}
                      >
                        {choice.label}
                        {selected && (
                          <Check className="absolute right-2 h-4 w-4 text-primary" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!canConfirm()}>
            Add to Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
