"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

interface SignUpFormData {
  email: string
  password: string
  firstName: string
  lastName: string
  age?: number
  instagram?: string
  twitter?: string
  tiktok?: string
  showProfile: boolean
}

export default function SignUpDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  
  const [formData, setFormData] = useState<SignUpFormData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    age: undefined,
    instagram: "",
    twitter: "",
    tiktok: "",
    showProfile: true
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? (value ? Number(value) : undefined) : value
    }))
  }

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("Email and password are required")
      return false
    }
    if (!formData.firstName || !formData.lastName) {
      setError("First and last name are required")
      return false
    }
    if (formData.age && (formData.age < 18 || formData.age > 99)) {
      setError("Age must be between 18 and 99")
      return false
    }
    // Basic social handle validation
    const socialHandleRegex = /^[a-zA-Z0-9._]{1,30}$/
    if (formData.instagram && !socialHandleRegex.test(formData.instagram)) {
      setError("Invalid Instagram handle")
      return false
    }
    if (formData.twitter && !socialHandleRegex.test(formData.twitter)) {
      setError("Invalid Twitter handle")
      return false
    }
    if (formData.tiktok && !socialHandleRegex.test(formData.tiktok)) {
      setError("Invalid TikTok handle")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setError(null)

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            age: formData.age,
            instagram: formData.instagram,
            twitter: formData.twitter,
            tiktok: formData.tiktok,
            show_profile: formData.showProfile
          }
        }
      })

      if (signUpError) throw signUpError

      setOpen(false)
      router.refresh()
    } catch (err) {
      console.error("Signup error:", err)
      setError(err instanceof Error ? err.message : "Failed to sign up")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Sign Up</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Account</DialogTitle>
          <DialogDescription>
            Join the party with your own profile.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name*</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name*</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email*</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password*</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="age">Age (optional)</Label>
              <Input
                id="age"
                name="age"
                type="number"
                min={18}
                max={99}
                value={formData.age || ""}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-4">
              <Label>Social Handles (optional)</Label>
              <div>
                <Input
                  name="instagram"
                  placeholder="Instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Input
                  name="twitter"
                  placeholder="Twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Input
                  name="tiktok"
                  placeholder="TikTok"
                  value={formData.tiktok}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="showProfile"
                checked={formData.showProfile}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, showProfile: checked }))
                }
              />
              <Label htmlFor="showProfile">Show my profile to others in parties</Label>
            </div>
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 