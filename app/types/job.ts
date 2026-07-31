export interface Job {
  id: string
  title: string
  company: string
  location: string
  job_type: "Full-time" | "Part-time" | "Contract" | "Freelance"
  description: string
  requirements?: string
  salary_range?: string
  remote_friendly: boolean
  posted_at: string
  expires_at: string
  contact_email: string
  application_url?: string
  is_active: boolean
}

export type JobFormData = Omit<Job, "id" | "posted_at" | "expires_at" | "is_active">
