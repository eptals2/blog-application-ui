export const useToast = () => {
  const visible = useState('toast-visible', () => false)
  const message = useState('toast-message', () => '')
  const type = useState<'success' | 'error'>(
    'toast-type',
    () => 'success'
  )

  let timeout: ReturnType<typeof setTimeout> | undefined

  const show = (
    newMessage: string,
    newType: 'success' | 'error'
  ) => {
    message.value = newMessage
    type.value = newType
    visible.value = true

    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      visible.value = false
    }, 3000)
  }

  const success = (newMessage: string) => {
    show(newMessage, 'success')
  }

  const error = (newMessage: string) => {
    show(newMessage, 'error')
  }

  const hide = () => {
    visible.value = false
  }

  return {
    visible,
    message,
    type,
    success,
    error,
    hide
  }
}