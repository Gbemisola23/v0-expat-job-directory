"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function deleteJob(jobId: string) {
  const supabase = await createClient()

  console.log("[v0] Attempting to delete job:", jobId)

  const { error } = await supabase.from("jobs").delete().eq("id", jobId)

  if (error) {
    console.log("[v0] Delete error:", error.message)
    return { error: error.message }
  }

  console.log("[v0] Job deleted successfully:", jobId)

  // Verify deletion
  const { data: checkData } = await supabase.from("jobs").select("id").eq("id", jobId)
  console.log("[v0] Verification check - job still exists?:", checkData?.length ?? 0)

  revalidatePath("/", "layout")
  revalidatePath("/admin")
  revalidatePath(`/jobs/${jobId}`)
  return { success: true }
}

export async function toggleJobStatus(jobId: string, isActive: boolean) {
  const supabase = await createClient()

  console.log("[v0] Attempting to toggle job status:", jobId, "to", !isActive)

  const { error } = await supabase.from("jobs").update({ is_active: !isActive }).eq("id", jobId)

  if (error) {
    console.log("[v0] Toggle status error:", error.message)
    return { error: error.message }
  }

  console.log("[v0] Job status toggled successfully:", jobId)

  revalidatePath("/admin")
  revalidatePath("/")
  return { success: true }
}

export async function updateJob(
  jobId: string,
  data: {
    title: string
    company: string
    location: string
    job_type: string
    salary_range?: string
    description: string
    apply_url: string
    remote_friendly: boolean
  },
) {
  const supabase = await createClient()

  console.log("[v0] Attempting to update job:", jobId, "with data:", data)

  const { error } = await supabase.from("jobs").update(data).eq("id", jobId)

  if (error) {
    console.log("[v0] Update error:", error.message)
    return { error: error.message }
  }

  console.log("[v0] Job updated successfully:", jobId)

  revalidatePath("/admin")
  revalidatePath("/")
  revalidatePath(`/jobs/${jobId}`)
  return { success: true }
}
