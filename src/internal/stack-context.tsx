import type {
  // Types
  MutableRefObject,
  ReactNode,
} from 'react'
import React, { createContext, useCallback, useContext } from 'react'

import { useIsoMorphicEffect } from '../hooks/use-iso-morphic-effect'

type OnUpdate = (
  message: StackMessage,
  type: string,
  element: MutableRefObject<HTMLElement | null>
) => void

const StackContext = createContext<OnUpdate>(() => {})
StackContext.displayName = 'StackContext'

export enum StackMessage {
  Add,
  Remove,
}

export function useStackContext() {
  return useContext(StackContext)
}

export function StackProvider({
  children,
  onUpdate,
  type,
  element,
}: {
  children: ReactNode
  onUpdate?: OnUpdate
  type: string
  element: MutableRefObject<HTMLElement | null>
}) {
  const parentUpdate = useStackContext()

  const notify = useCallback(
    (...args: Parameters<OnUpdate>) => {
      // Notify our layer
      onUpdate?.(...args)

      // Notify the parent
      parentUpdate(...args)
    },
    [parentUpdate, onUpdate]
  )

  useIsoMorphicEffect(() => {
    notify(StackMessage.Add, type, element)
    return () => notify(StackMessage.Remove, type, element)
  }, [notify, type, element])

  return (
    <StackContext.Provider value={notify}>{children}</StackContext.Provider>
  )
}
