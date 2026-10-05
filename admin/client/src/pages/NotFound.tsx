import { Link } from "react-router"

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-3 px-6">
      <h1 className="font-display text-7xl font-bold tracking-tight text-foreground">404</h1>
      <p className="text-muted-foreground text-base">The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="mt-3 inline-flex items-center text-sm font-medium text-[#0f766e] hover:text-[#0f766e]/80 underline underline-offset-4 transition-colors"
      >
        Go back home
      </Link>
    </div>
  )
}
