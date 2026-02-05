import React from "react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 bg-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(160,84%,39%)_0%,transparent_50%)] opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(200,70%,50%)_0%,transparent_50%)] opacity-10" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-card">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">FairSplit</h1>
          </div>
          <div className="max-w-md">
            <blockquote className="text-lg leading-relaxed text-card/80">
              {"\"FairSplit helped me understand where my money goes each month. I've saved over $2,000 since I started tracking.\""}
            </blockquote>
            <p className="mt-4 font-medium text-card">AD</p>
            <p className="text-sm text-card/60">Software Tester at Inv</p>
          </div>
          <div className="flex items-center gap-6 text-sm text-card/50">
            <span>Spring Boot</span>
            <span className="h-1 w-1 rounded-full bg-card/30" />
            <span>Cursor</span>
            <span className="h-1 w-1 rounded-full bg-card/30" />
            <span>v0</span>
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}
