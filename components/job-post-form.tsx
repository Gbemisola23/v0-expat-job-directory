"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import type { JobFormData } from "@/app/types/job"

export function JobPostForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    company: "",
    location: "",
    job_type: "Full-time",
    description: "",
    requirements: "",
    salary_range: "",
    remote_friendly: false,
    contact_email: "",
    application_url: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    if (!formData.contact_email && !formData.application_url) {
      setError("Please provide either a contact email or application link.")
      setIsSubmitting(false)
      return
    }

    try {
      const supabase = createClient()

      const { data, error: submitError } = await supabase.from("jobs").insert([formData]).select().single()

      if (submitError) throw submitError

      router.push(`/jobs/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post job")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="p-6 md:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Job Title *</Label>
          <Input
            id="title"
            placeholder="e.g., Marketing Manager"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Company Name *</Label>
          <Input
            id="company"
            placeholder="e.g., Tech Startup Inc."
            required
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              placeholder="e.g., Singapore"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="job_type">Job Type *</Label>
            <Select
              value={formData.job_type}
              onValueChange={(value: any) => setFormData({ ...formData, job_type: value })}
            >
              <SelectTrigger id="job_type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Freelance">Freelance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="salary_range">Salary Range (Optional)</Label>
          <Input
            id="salary_range"
            placeholder="e.g., $50,000 - $70,000"
            value={formData.salary_range}
            onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="remote_friendly"
            checked={formData.remote_friendly}
            onCheckedChange={(checked) => setFormData({ ...formData, remote_friendly: checked as boolean })}
          />
          <Label htmlFor="remote_friendly" className="font-normal cursor-pointer">
            This position is remote-friendly
          </Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Job Description *</Label>
          <Textarea
            id="description"
            placeholder="Describe the role, responsibilities, and what you're looking for..."
            required
            rows={6}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="requirements">Requirements (Optional)</Label>
          <Textarea
            id="requirements"
            placeholder="List the skills, experience, or qualifications needed..."
            rows={4}
            value={formData.requirements}
            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_email">Contact Email (Optional)</Label>
          <Input
            id="contact_email"
            type="email"
            placeholder="e.g., hiring@company.com or leave blank for anonymous"
            value={formData.contact_email}
            onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            {formData.contact_email
              ? "This email will be visible to applicants."
              : "Leave blank to post anonymously without contact information."}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="application_url">Application Link (Optional)</Label>
          <Input
            id="application_url"
            type="url"
            placeholder="e.g., https://forms.gle/abc123 or company career page"
            value={formData.application_url}
            onChange={(e) => setFormData({ ...formData, application_url: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            Link to your application form, Google Form, or career page. Provide at least one contact method (email or
            link).
          </p>
        </div>

        {error && <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm">{error}</div>}

        <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting} size="lg">
          {isSubmitting ? "Posting..." : "Post Job"}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          By posting, you agree that your listing will be public for 30 days and can be contacted via the provided
          email.
        </p>
      </form>
    </Card>
  )
}
