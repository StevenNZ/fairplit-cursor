import React, { useState } from "react"
import { Link, useNavigate } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react"

export default function RegisterPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState("")

  const passwordChecks = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains a number", met: /\d/.test(password) },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
  ]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsLoading(false)
    navigate({ to: "/dashboard" })
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="lg:hidden mb-4">
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            FinTrack
          </h1>
        </div>
        <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">
          Create your account
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Start tracking your expenses and take control of your finances.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="firstName" className="text-sm font-medium text-foreground">
              First name
            </Label>
            <Input
              id="firstName"
              type="text"
              placeholder="John"
              required
              className="h-11 bg-card border-border px-4 text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="lastName" className="text-sm font-medium text-foreground">
              Last name
            </Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Doe"
              required
              className="h-11 bg-card border-border px-4 text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="text-sm font-medium text-foreground">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            required
            className="h-11 bg-card border-border px-4 text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 bg-card border-border px-4 pr-11 text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {password.length > 0 && (
            <div className="flex flex-col gap-1.5 mt-1">
              {passwordChecks.map((check) => (
                <div
                  key={check.label}
                  className="flex items-center gap-2 text-xs"
                >
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded-full transition-colors ${
                      check.met
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Check className="h-2.5 w-2.5" />
                  </div>
                  <span
                    className={
                      check.met ? "text-foreground" : "text-muted-foreground"
                    }
                  >
                    {check.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="h-11 w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
              Creating account...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Create account
              <ArrowRight className="h-4 w-4" />
            </span>
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Sign in
        </Link>
      </p>

      <p className="text-center text-xs text-muted-foreground leading-relaxed">
        By creating an account, you agree to our{" "}
        <Link to="/" className="underline hover:text-foreground transition-colors">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link to="/" className="underline hover:text-foreground transition-colors">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  )
}
