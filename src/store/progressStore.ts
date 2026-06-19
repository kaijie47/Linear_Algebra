import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { StepId } from '@/types'
import { LEARNING_STEPS } from '@/types'

const TOTAL_STEPS = 9

interface ProgressState {
  completedSteps: StepId[]
  currentStep: StepId | null
  completeStep: (id: StepId) => void
  setCurrentStep: (id: StepId) => void
  isStepCompleted: (id: StepId) => boolean
  isStepUnlocked: (id: StepId) => boolean
  getProgress: () => number
  resetAll: () => void
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completedSteps: [] as StepId[],
      currentStep: null as StepId | null,

      completeStep: (id: StepId) => {
        const { completedSteps } = get()
        if (!completedSteps.includes(id)) {
          set({ completedSteps: [...completedSteps, id] })
        }
      },

      setCurrentStep: (id: StepId) => {
        set({ currentStep: id })
      },

      isStepCompleted: (id: StepId) => {
        return get().completedSteps.includes(id)
      },

      isStepUnlocked: (id: StepId) => {
        const step = LEARNING_STEPS.find((s) => s.id === id)
        if (!step) return false
        if (step.order === 1) return true
        const prevStep = LEARNING_STEPS.find((s) => s.order === step.order - 1)
        if (!prevStep) return false
        return get().completedSteps.includes(prevStep.id)
      },

      getProgress: () => {
        return (get().completedSteps.length / TOTAL_STEPS) * 100
      },

      resetAll: () => set({ completedSteps: [], currentStep: null }),
    }),
    {
      name: 'linear-algebra-progress',
      partialize: (state) => ({
        completedSteps: state.completedSteps,
      }),
    }
  )
)
