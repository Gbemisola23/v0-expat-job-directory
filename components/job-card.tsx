import type { Job } from "@/app/types/job"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Briefcase, DollarSign, Calendar } from "lucide-react"
import Link from "next/link"

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  const postedDate = new Date(job.posted_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <Link href={`/jobs/${job.id}`}>
      <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl font-semibold text-balance group-hover:text-primary transition-colors">
                {job.title}
              </h3>
              <Badge variant="secondary" className="shrink-0">
                {job.job_type}
              </Badge>
            </div>
            <p className="text-lg font-medium text-muted-foreground">{job.company}</p>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span>{job.location}</span>
            </div>

            {job.remote_friendly && (
              <div className="flex items-center gap-1.5">
                <Briefcase className="h-4 w-4" />
                <span>Remote Friendly</span>
              </div>
            )}

            {job.salary_range && (
              <div className="flex items-center gap-1.5">
                <DollarSign className="h-4 w-4" />
                <span>{job.salary_range}</span>
              </div>
            )}

            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{postedDate}</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 text-pretty">{job.description}</p>
        </div>
      </Card>
    </Link>
  )
}
