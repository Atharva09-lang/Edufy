import { useSelector } from "react-redux"
import { Outlet } from "react-router-dom"

import Sidebar from "../components/core/Dashboard/Sidebar"
import AnimatedPage from "../components/common/AnimatedPage"
import PremiumLoader from "../components/common/PremiumLoader"

function Dashboard() {
  const { loading: profileLoading } = useSelector((state) => state.profile)
  const { loading: authLoading } = useSelector((state) => state.auth)

  if (profileLoading || authLoading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <PremiumLoader size="lg" />
      </div>
    )
  }

  return (
    <div className="relative flex h-[calc(100vh-3.5rem)] min-h-0">
      <Sidebar />

      <main
        data-lenis-prevent
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
      >
        <AnimatedPage className="mx-auto w-11/12 max-w-[1100px] py-6 pb-16 md:py-10 md:pb-20">
          <Outlet />
        </AnimatedPage>
      </main>
    </div>
  )
}

export default Dashboard