"use client"

import { useState } from "react"
import type { Job } from "@/app/types/job"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Eye, EyeOff, ExternalLink } from "lucide-react"
import { deleteJob, toggleJobStatus } from "@/app/admin/actions"
import { AdminEditDialog } from "@/components/admin-edit-dialog"
import { formatDistanceToNow } from "date-fns"

interface AdminJobListProps {
  initialJobs: Job[]
}

export function AdminJobList({ initialJobs }: AdminJobListProps) {
  const [jobs, setJobs] = useState(initialJobs)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [filter, setFilter] = useState<"all" | "active" | "expired">("all")

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      searchTerm === "" ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter =
      filter === "all" || (filter === "active" && job.is_active) || (filter === "expired" && !job.is_active)

    return matchesSearch && matchesFilter
  })

  const handleDelete = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
      return
    }

    const result = await deleteJob(jobId)
    if (result.success) {
      setJobs(jobs.filter((job) => job.id !== jobId))
    }
  }

  const handleToggleStatus = async (jobId: string, isActive: boolean) => {
    const result = await toggleJobStatus(jobId, isActive)
    if (result.success) {
      setJobs(jobs.map((job) => (job.id === jobId ? { ...job, is_active: !isActive } : job)))
    }
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search by title or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <div className="flex gap-2">
          <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
            All
          </Button>
          <Button variant={filter === "active" ? "default" : "outline"} size="sm" onClick={() => setFilter("active")}>
            Active
          </Button>
          <Button variant={filter === "expired" ? "default" : "outline"} size="sm" onClick={() => setFilter("expired")}>
            Expired
          </Button>
        </div>
      </div>

      {/* Job List */}
      <div className="space-y-3">
        {filteredJobs.map((job) => (
          <div key={job.id} className="rounded-lg border bg-card p-4 hover:bg-accent/5 transition-colors">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg truncate">{job.title}</h3>
                  <Badge variant={job.is_active ? "default" : "secondary"}>
                    {job.is_active ? "Active" : "Expired"}
                  </Badge>
                  {job.remote_friendly && (
                    <Badge variant="outline" className="text-xs">
                      Remote
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {job.company} • {job.location} • {job.job_type}
                </p>
                <p className="text-xs text-muted-foreground">
                  Posted {formatDistanceToNow(new Date(job.posted_at), { addSuffix: true })}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleStatus(job.id, job.is_active)}
                  title={job.is_active ? "Deactivate job" : "Activate job"}
                >
                  {job.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setEditingJob(job)} title="Edit job">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`/jobs/${job.id}`, "_blank")}
                  title="View job"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(job.id)}
                  className="text-destructive hover:bg-destructive/10"
                  title="Delete job"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {filteredJobs.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No jobs found matching your criteria.</div>
        )}
      </div>

      {/* Edit Dialog */}
      {editingJob && (
        <AdminEditDialog
          job={editingJob}
          onClose={() => setEditingJob(null)}
          onUpdate={(updatedJob) => {
            setJobs(jobs.map((job) => (job.id === updatedJob.id ? updatedJob : job)))
            setEditingJob(null)
          }}
        />
      )}
    </div>
  )
}
