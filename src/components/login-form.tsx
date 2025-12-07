import { useState } from "react"
import { cn } from "../lib/utils"
import { Button } from "../components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "../components/ui/field"
import { Input } from "../components/ui/input"
import { useNavigation } from "../lib/hooks"
import { useToast } from "../context/ToastContext"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const { navigateToDashboard } = useNavigation()
  const { showSuccess, showError, showInfo } = useToast()

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Reset errors
    setEmailError("")
    setPasswordError("")

    // Validate
    let isValid = true
    if (!email) {
      setEmailError("Email is required")
      isValid = false
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email")
      isValid = false
    }

    if (!password) {
      setPasswordError("Password is required")
      isValid = false
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters")
      isValid = false
    }

    if (!isValid) return

    // Simulate login
    setIsLoading(true)
    showInfo("Authenticating...")
    
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Mock authentication - in real app, validate against backend
    if (email && password.length >= 6) {
      showSuccess("Login successful! Redirecting...")
      setTimeout(() => navigateToDashboard(), 500)
    } else {
      showError("Invalid credentials")
    }
    
    setIsLoading(false)
  }

  const handleNDILogin = async () => {
    setIsLoading(true)
    showInfo("Connecting to NDI Bhutan...")
    await new Promise(resolve => setTimeout(resolve, 1200))
    showSuccess("NDI login successful!")
    setTimeout(() => navigateToDashboard(), 500)
    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input 
            id="email" 
            type="email" 
            placeholder="m@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setEmailError("")
            }}
            disabled={isLoading}
            aria-invalid={!!emailError}
          />
          {emailError && <p className="text-xs text-destructive mt-1">{emailError}</p>}
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
              onClick={(e) => {
                e.preventDefault()
                showInfo("Password reset coming soon!")
              }}
            >
              Forgot your password?
            </a>
          </div>
          <Input 
            id="password" 
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setPasswordError("")
            }}
            disabled={isLoading}
            aria-invalid={!!passwordError}
          />
          {passwordError && <p className="text-xs text-destructive mt-1">{passwordError}</p>}
        </Field>
        <Field>
          <Button type="submit" isLoading={isLoading} disabled={isLoading}>
            {isLoading ? "Signing in..." : "Login"}
          </Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <Button 
            variant="outline" 
            type="button"
            onClick={handleNDILogin}
            isLoading={isLoading}
            disabled={isLoading}
            className="w-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="2" y1="9" x2="22" y2="9"></line>
              <circle cx="13" cy="12" r="2" fill="currentColor"></circle>
              <path d="M6 12v5a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-5"></path>
            </svg>
            Login with NDI Bhutan
          </Button>
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary" onClick={(e) => {
              e.preventDefault()
              showInfo("Sign up feature coming soon!")
            }}>
              Sign up
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
