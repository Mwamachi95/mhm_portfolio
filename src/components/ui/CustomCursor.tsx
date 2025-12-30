'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

interface CursorPosition {
  x: number
  y: number
}

interface CursorState {
  isVisible: boolean
  label: string
  isHovering: boolean
}

// Cursor label mapping based on data-cursor attribute values
const CURSOR_LABELS: Record<string, string> = {
  view: '[ VIEW ]',
  open: '[ OPEN ]',
  close: '[ CLOSE ]',
}

// Linear interpolation helper for smooth cursor movement
function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor
}

export function CustomCursor() {
  // Track mouse position
  const [mousePos, setMousePos] = useState<CursorPosition>({ x: 0, y: 0 })
  const [cursorPos, setCursorPos] = useState<CursorPosition>({ x: 0, y: 0 })

  // Track cursor state
  const [cursorState, setCursorState] = useState<CursorState>({
    isVisible: false,
    label: '',
    isHovering: false,
  })

  // Track if device supports hover (not touch)
  const [isTouchDevice, setIsTouchDevice] = useState(true)

  // RAF reference for cleanup
  const rafRef = useRef<number | null>(null)

  // Track current hovered element for validation
  const currentElementRef = useRef<HTMLElement | null>(null)

  // Get current pathname to reset cursor on route changes
  const pathname = usePathname()

  // Reset cursor state helper
  const resetCursor = useCallback(() => {
    setCursorState({
      isVisible: false,
      label: '',
      isHovering: false,
    })
    currentElementRef.current = null
  }, [])

  // Reset cursor when route changes
  useEffect(() => {
    resetCursor()
  }, [pathname, resetCursor])

  // Detect touch device on mount
  useEffect(() => {
    const checkTouchDevice = () => {
      // Check for coarse pointer (touch) or fine pointer (mouse)
      const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches
      const hasFinePointer = window.matchMedia('(pointer: fine)').matches

      // Only enable custom cursor on devices with mouse/trackpad (fine pointer)
      setIsTouchDevice(hasCoarsePointer && !hasFinePointer)
    }

    checkTouchDevice()

    // Listen for changes (e.g., connecting/disconnecting mouse)
    const mediaQuery = window.matchMedia('(pointer: coarse)')
    const handler = () => checkTouchDevice()
    mediaQuery.addEventListener('change', handler)

    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // Smooth cursor position interpolation with RAF
  useEffect(() => {
    if (isTouchDevice) return

    const smoothFactor = 0.15 // Adjust for more/less smoothing (0.1 = smoother, 0.3 = snappier)

    const animateCursor = () => {
      setCursorPos((prev) => ({
        x: lerp(prev.x, mousePos.x, smoothFactor),
        y: lerp(prev.y, mousePos.y, smoothFactor),
      }))
      rafRef.current = requestAnimationFrame(animateCursor)
    }

    rafRef.current = requestAnimationFrame(animateCursor)

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [mousePos, isTouchDevice])

  // Track mouse movement and validate cursor element still exists
  useEffect(() => {
    if (isTouchDevice) return

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })

      // Validate that the current cursor element still exists in DOM
      // This handles cases where elements are removed (like closing modals)
      if (currentElementRef.current) {
        if (!document.body.contains(currentElementRef.current)) {
          // Element was removed from DOM, reset cursor
          resetCursor()
          return
        }

        // Also check if we're still actually over the element
        const elementUnderMouse = document.elementFromPoint(e.clientX, e.clientY)
        if (elementUnderMouse) {
          const cursorElement = (elementUnderMouse as HTMLElement).closest('[data-cursor]')
          if (!cursorElement) {
            // Mouse moved off the cursor element
            resetCursor()
          }
        }
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isTouchDevice, resetCursor])

  // Handle hover detection via event delegation
  const handleMouseEnter = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement
    const cursorElement = target.closest('[data-cursor]') as HTMLElement | null

    if (cursorElement) {
      const cursorType = cursorElement.getAttribute('data-cursor')
      if (cursorType && CURSOR_LABELS[cursorType]) {
        currentElementRef.current = cursorElement
        setCursorState({
          isVisible: true,
          label: CURSOR_LABELS[cursorType],
          isHovering: true,
        })
      }
    }
  }, [])

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement
    const relatedTarget = e.relatedTarget as HTMLElement | null

    // Check if we're leaving a cursor element
    const leavingCursorElement = target.closest('[data-cursor]')

    // Check if we're entering another cursor element
    const enteringCursorElement = relatedTarget?.closest('[data-cursor]')

    // Only hide cursor if we're not entering another cursor element
    if (leavingCursorElement && !enteringCursorElement) {
      resetCursor()
    } else if (enteringCursorElement) {
      // Update to new element
      currentElementRef.current = enteringCursorElement as HTMLElement
    }
  }, [resetCursor])

  // Handle click - reset cursor when clicking on cursor elements
  const handleClick = useCallback(() => {
    // Small delay to allow the click action to complete
    // This ensures smooth transition when navigating
    setTimeout(() => {
      resetCursor()
    }, 50)
  }, [resetCursor])

  // Handle mousedown - immediately start hiding for faster feedback
  const handleMouseDown = useCallback(() => {
    if (cursorState.isVisible) {
      setCursorState(prev => ({
        ...prev,
        isHovering: false, // Scale down on click
      }))
    }
  }, [cursorState.isVisible])

  // Set up event delegation for cursor detection
  useEffect(() => {
    if (isTouchDevice) return

    document.addEventListener('mouseover', handleMouseEnter)
    document.addEventListener('mouseout', handleMouseLeave)
    document.addEventListener('click', handleClick)
    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('mouseover', handleMouseEnter)
      document.removeEventListener('mouseout', handleMouseLeave)
      document.removeEventListener('click', handleClick)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [isTouchDevice, handleMouseEnter, handleMouseLeave, handleClick, handleMouseDown])

  // Additional safety: check periodically if element still exists
  useEffect(() => {
    if (isTouchDevice || !cursorState.isVisible) return

    const checkInterval = setInterval(() => {
      if (currentElementRef.current && !document.body.contains(currentElementRef.current)) {
        resetCursor()
      }
    }, 100)

    return () => clearInterval(checkInterval)
  }, [isTouchDevice, cursorState.isVisible, resetCursor])

  // Don't render on touch devices
  if (isTouchDevice) return null

  return (
    <AnimatePresence>
      {cursorState.isVisible && (
        <motion.div
          className="fixed pointer-events-none z-[9999] flex items-center justify-center"
          style={{
            left: cursorPos.x,
            top: cursorPos.y,
            x: '-50%',
            y: '-50%',
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: 1,
            scale: cursorState.isHovering ? 1 : 0.8,
          }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{
            opacity: { duration: 0.2, ease: 'easeOut' },
            scale: { type: 'spring', stiffness: 300, damping: 25 },
          }}
        >
          {/* Cursor circle with label */}
          <motion.div
            className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-foreground/90 backdrop-blur-md flex items-center justify-center mix-blend-difference"
            initial={false}
            animate={{
              scale: cursorState.isHovering ? 1 : 0.9,
            }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 30,
            }}
          >
            <motion.span
              className="font-display text-[10px] md:text-xs font-medium tracking-wider text-background select-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {cursorState.label}
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Export CSS class utility for hiding default cursor
// Add this class to your globals.css or apply inline
export const CURSOR_HIDE_CLASS = 'cursor-none'
