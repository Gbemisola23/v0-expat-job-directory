"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface JobFiltersProps {
  onSearch: (search: string) => void
  onTypeFilter: (type: string) => void
  onRemoteFilter: (remote: string) => void
}

export function JobFilters({ onSearch, onTypeFilter, onRemoteFilter }: JobFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-6 bg-muted/50 rounded-lg">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search jobs, companies, or keywords..."
          className="pl-10"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <Select onValueChange={onTypeFilter}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Job Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="Full-time">Full-time</SelectItem>
          <SelectItem value="Part-time">Part-time</SelectItem>
          <SelectItem value="Contract">Contract</SelectItem>
          <SelectItem value="Freelance">Freelance</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={onRemoteFilter}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Remote" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Jobs</SelectItem>
          <SelectItem value="remote">Remote Only</SelectItem>
          <SelectItem value="onsite">On-site Only</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
