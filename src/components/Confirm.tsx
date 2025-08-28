import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Loader2 } from 'lucide-react'

type ConfirmProps = {
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  isLoading?: boolean
  onConfirm: () => Promise<void> | void
  trigger: React.ReactNode
}

export default function Confirm({
  title = '정말 진행하시겠어요?',
  description,
  confirmText = '확인',
  cancelText = '취소',
  isLoading = false,
  onConfirm,
  trigger
}: ConfirmProps) {
  const [open, setOpen] = useState(false)
  const [confirming, setConfirming] = useState(false)

  const handleConfirm = async () => {
    try {
      setConfirming(true)
      await onConfirm()
      setOpen(false)
    } finally {
      setConfirming(false)
    }
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            className="cursor-pointer"
            disabled={confirming || isLoading}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={confirming || isLoading}
            className="cursor-pointer">
            {(confirming || isLoading) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
