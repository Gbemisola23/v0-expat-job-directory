import { createClient } from "@/lib/supabase/server"
import type { Job } from "@/app/types/job"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Briefcase, DollarSign, Calendar, Mail, ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface JobDetailPageProps {
  params: Promise<{ id: string }>
}

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: job, error } = await supabase.from("jobs").select("*").eq("id", id).eq("is_active", true).single()

  if (error || !job) {
    notFound()
  }

  const typedJob = job as Job

  const postedDate = new Date(typedJob.posted_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container px-4 md:px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Jobs
            </Button>
          </Link>

          <Card className="p-8 md:p-12">
            <div className="space-y-8">
              {/* Header */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">{typedJob.title}</h1>
                    <p className="text-xl font-medium text-muted-foreground">{typedJob.company}</p>
                  </div>
                  <Badge variant="secondary" className="text-base px-4 py-2">
                    {typedJob.job_type}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-6 text-sm text-muted-foreground pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <span className="font-medium">{typedJob.location}</span>
                  </div>

                  {typedJob.remote_friendly && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      <span className="font-medium">Remote Friendly</span>
                    </div>
                  )}

                  {typedJob.salary_range && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      <span className="font-medium">{typedJob.salary_range}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <span className="font-medium">Posted {postedDate}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">About the Role</h2>
                <p className="text-muted-foreground leading-relaxed text-pretty whitespace-pre-wrap">
                  {typedJob.description}
                </p>
              </div>

              {/* Requirements */}
              {typedJob.requirements && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">Requirements</h2>
                  <p className="text-muted-foreground leading-relaxed text-pretty whitespace-pre-wrap">
                    {typedJob.requirements}
                  </p>
                </div>
              )}

              {/* Apply Section */}
              <div className="pt-6 border-t">
                <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                  <h3 className="text-xl font-semibold">Interested?</h3>
                  <p className="text-muted-foreground text-pretty">
                    {typedJob.application_url && typedJob.contact_email
                      ? "Apply using the link below or reach out via email:"
                      : typedJob.application_url
                        ? "Click the button below to submit your application:"
                        : "To apply for this position, please reach out directly via email:"}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {typedJob.application_url && (
                      <Button asChild size="lg" className="bg-primary hover:bg-primary/90 flex-1">
                        <a href={typedJob.application_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-5 w-5 mr-2" />
                          Apply Now
                        </a>
                      </Button>
                    )}
                    {typedJob.contact_email && (
                      <Button
                        asChild
                        size="lg"
                        variant={typedJob.application_url ? "outline" : "default"}
                        className={typedJob.application_url ? "flex-1" : "bg-primary hover:bg-primary/90"}
                      >
                        <a href={`mailto:${typedJob.contact_email}`}>
                          <Mail className="h-5 w-5 mr-2" />
                          {typedJob.application_url ? "Email Us" : typedJob.contact_email}
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
