"use client"

import type { ToastActionElement, ToastProps } from "@/components/ui/toast"
import {
  useToast as useToastImpl
} from "@/components/ui/use-toast"

export type ToasterToast = ToastProps & {
  id: string
  title?: string
  description?: string
  action?: ToastActionElement
}

export function useToast() {
  const { toast } = useToastImpl()
  return { toast }
}
