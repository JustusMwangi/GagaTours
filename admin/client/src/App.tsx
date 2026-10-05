import { Outlet } from "react-router"
import { Toaster } from "@/components/ui/sonner"
import BootstrapChecker from "@/components/auth/BootstrapChecker"

export default function App() {
  return (
    <div className="min-h-svh">
      <BootstrapChecker>
        <Outlet />
      </BootstrapChecker>
      <Toaster />
    </div>
  )
}
