import { useModalStore } from '@/store/modalStore.ts'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import * as React from 'react'
import { Button } from '@/components/ui/button.tsx'

interface ModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title?: string
  description?: string
  children?: React.ReactNode
  trigger?: React.ReactNode
  footer?: React.ReactNode
  showCloseButton?: boolean
  className?: string
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  trigger,
  footer,
  showCloseButton = true,
  className
}: ModalProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        showCloseButton={showCloseButton}
        className={className}>
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
        )}
        {children}
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  )
}

export function GlobalModal() {
  const { isOpen, title, message, closeModal } = useModalStore()

  return (
    <Modal
      open={isOpen}
      onOpenChange={closeModal}
      title={title}
      description={message}>
      <div className="flex justify-end mt-4">
        <Button
          className="cursor-pointer"
          onClick={closeModal}>
          확인
        </Button>
      </div>
    </Modal>
  )
}
