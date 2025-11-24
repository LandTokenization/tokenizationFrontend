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

  const handleGitHubLogin = async () => {
    setIsLoading(true)
    showInfo("Connecting to GitHub...")
    await new Promise(resolve => setTimeout(resolve, 1200))
    showSuccess("GitHub login successful!")
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
            onClick={handleGitHubLogin}
            isLoading={isLoading}
            disabled={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                fill="currentColor"
              />
            </svg>
            Login with GitHub
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
