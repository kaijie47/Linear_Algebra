import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from '@/components/layout/Sidebar'
import ProgressBar from '@/components/layout/ProgressBar'

export default function Layout() {
  const location = useLocation()

  return (
    <div className="flex min-h-screen bg-[#1a1a2e] text-[#e0d8c8]">
      <Sidebar />

      <main className="ml-[260px] flex-1 flex flex-col min-h-screen">
        <div className="px-8 pt-6 pb-2">
          <ProgressBar />
        </div>

        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="p-8"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
