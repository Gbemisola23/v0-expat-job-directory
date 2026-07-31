"use client"

import { useState, useMemo } from "react"
import type { Job } from "@/app/types/job"
import { JobCard } from "@/components/job-card"
import { JobFilters } from "@/components/job-filters"

interface JobListingsProps {
  initialJobs: Job[]
}

export function JobListings({ initialJobs }: JobListingsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [remoteFilter, setRemoteFilter] = useState("all")

  const filteredJobs = useMemo(() => {
    return initialJobs.filter((job) => {
      const matchesSearch =
        searchTerm === "" ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = typeFilter === "all" || job.job_type === typeFilter

      const matchesRemote =
        remoteFilter === "all" ||
        (remoteFilter === "remote" && job.remote_friendly) ||
        (remoteFilter === "onsite" && !job.remote_friendly)

      return matchesSearch && matchesType && matchesRemote
    })
  }, [initialJobs, searchTerm, typeFilter, remoteFilter])

  return (
    <div className="space-y-8">
      <JobFilters onSearch={setSearchTerm} onTypeFilter={setTypeFilter} onRemoteFilter={setRemoteFilter} />

      {filteredJobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No jobs found matching your criteria.</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"} found
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
