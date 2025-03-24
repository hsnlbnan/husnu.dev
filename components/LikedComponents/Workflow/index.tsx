import React, { useEffect, useState } from 'react'
import { FiDownloadCloud, FiSearch } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { CircleDivide, MessageCircleCode, ScanSearch } from 'lucide-react'

type Status = 'completed' | 'running' | 'idle'

interface WorkflowCardProps {
  title?: string
  status?: Status
  icon?: React.ReactNode
  label?: string | React.ReactNode
  description?: string
  children?: React.ReactNode
  className?: string
}

interface AnimatedWorkflowCardProps extends WorkflowCardProps {
  isAnimating: boolean
  onAnimationComplete?: () => void
  showCircle?: boolean
}

const StatusLabel = ({ status }: { status: Status }) => {
  if (status === 'running') {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{
            duration: 0.3,
            ease: [0.32, 0.72, 0, 1] // custom easing for more natural motion
          }}
          className="absolute right-0 -top-10 flex items-center gap-1.5 bg-purple-50 border border-purple-200 rounded-full py-1 px-2.5"
        >
          <motion.div
            className="text-xs font-medium text-purple-700"
          >
            Working
          </motion.div>
          <div className="w-3 h-3 relative">
            <div className="absolute inset-0 rounded-full border-2 border-purple-200 border-r-purple-700 animate-spin" />
          </div>
        </motion.div>
      </AnimatePresence>
    )
  }

  if (status === 'completed') {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{
            duration: 0.3,
            ease: [0.32, 0.72, 0, 1]
          }}
          className="absolute right-0 -top-10 flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full py-1 px-2.5"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-xs font-medium text-green-700"
          >
            Completed
          </motion.div>
          <motion.div
            className="w-3 h-3 flex items-center justify-center"
          >
            <svg
              className="text-green-700"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path
                d="M20 6L9 17L4 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </svg>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  }

  return null
}

const AnimatedWorkflowCard = ({
  isAnimating,
  onAnimationComplete,
  showCircle = true,
  ...props
}: AnimatedWorkflowCardProps) => {
  const [status, setStatus] = useState<Status>('idle')
  const [isDrawing, setIsDrawing] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  const ANIMATION_DURATION = 1.8; // saniye cinsinden animasyon süresi

  useEffect(() => {
    if (isAnimating && !isCompleted) {
      setStatus('running')
      setIsDrawing(true)

      const timer = setTimeout(() => {
        setStatus('completed')
        setIsCompleted(true)
        onAnimationComplete?.()
      }, ANIMATION_DURATION * 1000) // animasyon süresi kadar bekle

      return () => clearTimeout(timer)
    }
  }, [isAnimating, onAnimationComplete, isCompleted])

  return (
    <div className={`w-96 relative ${props.className}`}>
      <div className="relative flex flex-col">
        {props.title && (
          <div className="rounded-tl-xl flex items-center gap-2 rounded-tr-xl bg-gray-50 border border-gray-100 text-xs text-gray-700 px-2 py-1 max-w-24">
            <MessageCircleCode className='w-3 h-3' />
            {props.title}
          </div>
        )}

        <div className="relative">
          {/* Status Label */}
          <div className="absolute right-0 -top-8 z-10">
            <AnimatePresence mode="wait">
              {(status === 'running' || status === 'completed') && (
                <motion.div
                  key={status}
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.32, 0.72, 0, 1]
                  }}
                  className="flex items-center gap-1.5 rounded-full py-1 px-2.5"
                  style={{
                    backgroundColor: status === 'running' ? 'rgb(243, 232, 255)' : 'rgb(240, 253, 244)',
                    borderColor: status === 'running' ? 'rgb(216, 180, 254)' : 'rgb(187, 247, 208)',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                  }}
                >
                  {status === 'running' ? (
                    <>
                      <motion.span
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="text-xs font-medium text-purple-700"
                      >
                        Working
                      </motion.span>
                      <div className="w-3 h-3 relative">
                        <div className="absolute inset-0 rounded-full border-2 border-purple-200 border-r-purple-700 animate-spin" />
                      </div>
                    </>
                  ) : (
                    <>
                      <motion.span
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="text-xs font-medium text-green-700"
                      >
                        Completed
                      </motion.span>
                      <motion.div
                        className="w-3 h-3 flex items-center justify-center"
                      >
                        <svg
                          className="text-green-700"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <motion.path
                            d="M20 6L9 17L4 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                          />
                        </svg>
                      </motion.div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mevcut border */}
          <div
            className={`
              bg-white w-full ${props.title ? '-mt-[1px]' : ''} p-3
              border-2 transition-all duration-[2000ms]
              ${status === 'completed' ? 'border-green-500' : 'border-gray-100'}
              ${showCircle ? 'rounded-b-lg' : 'rounded-lg'}
            `}
          >
            <div className="flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                {props.icon && (
                  <div className={`
                    border-2 rounded-lg p-1.5 transition-all duration-[2000ms]
                    ${status === 'completed' ? 'border-green-300 bg-green-50' : 'border-blue-300 bg-blue-50'}
                  `}>
                    {props.icon}
                  </div>
                )}
                {props.children}
              </div>
              {props.label && (
                typeof props.label === 'string' ? (
                  <div className="bg-gray-100 rounded-lg py-1 px-2.5 border border-gray-200">
                    <h4 className="text-xs font-medium">{props.label}</h4>
                  </div>
                ) : (
                  props.label
                )
              )}
            </div>
            {props.description && (
              <div className="flex items-center justify-between mt-2 border-t border-gray-100 pt-2">
                <span className="text-xs text-gray-500">{props.description}</span>
              </div>
            )}
          </div>

          {isDrawing && status === 'running' && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 422 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  className="origin-[0%_0%] animate-drawBorder"
                  x="1"
                  y="1"
                  width="420"
                  height="98"
                  rx="8"
                  stroke="#22c55e"
                  strokeWidth="2"
                  style={{
                    strokeDasharray: '1040'
                  }}
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      {showCircle && (
        <div className="absolute w-full">
          <motion.div
            initial={{ scale: 0.8, y: -4 }}
            animate={{
              scale: status === 'completed' ? 1.1 : 1,
              y: 0,
              backgroundColor: status === 'completed' ? 'rgb(240, 253, 244)' : 'rgb(243, 244, 246)',
              borderColor: status === 'completed' ? 'rgb(34, 197, 94)' : 'rgb(229, 231, 235)'
            }}
            transition={{
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1]
            }}
            className="absolute left-1/2 -translate-x-1/2 -bottom-[6px] w-4 h-4 rounded-full border-2 flex items-center justify-center -ml-2"
          >
            {/* Running durumunda pulse efekti */}
            {status === 'running' && (
              <>
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-green-500"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-green-500"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: 0.4
                  }}
                />
              </>
            )}

            {status === 'completed' && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center text-green-500 mt-[0.5px] ml-[0.4px]"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 15,
                  delay: 0.1
                }}
              >
                <motion.svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-2 h-2"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <motion.path
                    d="M20 6L9 17L4 12"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.2,
                      ease: "easeOut"
                    }}
                  />
                </motion.svg>
              </motion.div>
            )}

            {/* Running durumunda iç dot animasyonu */}
            {status === 'running' && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
              >
                <motion.div
                  className="w-1.5 h-1.5 bg-green-500 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  )
}

export const WorkflowAnimation = () => {
  const [firstStepComplete, setFirstStepComplete] = useState(false)
  const [secondStepComplete, setSecondStepComplete] = useState(false)
  const [isAnimating, setIsAnimating] = useState(true)

  const handleFirstStepComplete = () => {
    setFirstStepComplete(true)
  }

  const handleSecondStepComplete = () => {
    setSecondStepComplete(true)
    setIsAnimating(false)
  }

  return (
    <div className="relative w-full h-full min-h-screen bg-white dark:bg-gray-900">
      <div
        className="absolute inset-0 w-full h-full opacity-20 dark:opacity-30 select-none pointer-events-none -z-1"
        style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          color: 'rgb(107, 114, 128)'
        }}
      />

      <div className="flex items-center justify-center h-screen flex-col gap-4">
        <AnimatedWorkflowCard
          title="Trigger"
          icon={<FiDownloadCloud className={`${firstStepComplete ? 'text-green-500' : 'text-blue-500'}`} />}
          label="Records"
          description="Trigger on a Company"
          isAnimating={isAnimating}
          onAnimationComplete={handleFirstStepComplete}
        >
          <div className="text-sm font-medium">Record command</div>
        </AnimatedWorkflowCard>

        <div className="flex items-center justify-center mt-3">
          <svg
            className="w-6 h-14"
            viewBox="0 0 24 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Arka plandaki gri ok - her zaman görünür */}
            <path
              d="M12 0L12 52M12 52L4 44M12 52L20 44"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              stroke="rgb(156, 163, 175)" // text-gray-400
            />

            {/* Animasyonlu yeşil oklar - üstte, parça parça */}
            <motion.path
              d="M12 0L12 52"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              stroke="rgb(34, 197, 94)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: firstStepComplete ? 1 : 0 }}
              transition={{
                duration: 0.5,
                ease: "easeInOut",
              }}
            />
            <motion.path
              d="M12 52L4 44"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              stroke="rgb(34, 197, 94)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: firstStepComplete ? 1 : 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
            <motion.path
              d="M12 52L20 44"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              stroke="rgb(34, 197, 94)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: firstStepComplete ? 1 : 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
                delay: 0.8
              }}
            />
          </svg>
        </div>

        <AnimatedWorkflowCard
          title=""
          icon={<FiSearch className={`${secondStepComplete ? 'text-green-500' : 'text-blue-500'}`} />}
          label={
            <div className="flex items-center gap-2 bg-blue-100 rounded-lg py-1 px-2.5 border border-gray-200">
              <ScanSearch className='w-3.5 h-3.5' />
              <span className="text-xs font-medium">Agent</span>
            </div>
          }
          description="Research on Records"
          isAnimating={firstStepComplete && !secondStepComplete}
          onAnimationComplete={handleSecondStepComplete}
          className={firstStepComplete ? 'opacity-100' : 'opacity-50'}
          showCircle={false}
        >
          <div className="text-sm font-medium">Research record</div>
        </AnimatedWorkflowCard>
      </div>
    </div>
  )
}

export default WorkflowAnimation