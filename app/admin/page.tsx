import { createClient } from "@/lib/supabase/server"
import type { Job } from "@/app/types/job"
import { Header } from "@/components/header"
import { AdminJobList } from "@/components/admin-job-list"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"

async function signOut() {
  "use server"
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/admin/login")
}

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: jobs, error } = await supabase.from("jobs").select("*").order("posted_at", { ascending: false })

  const totalJobs = jobs?.length || 0
  const activeJobs = jobs?.filter((job) => job.is_active).length || 0
  const expiredJobs = totalJobs - activeJobs

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container px-4 md:px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-balance mb-3">Admin Dashboard</h1>
            <p className="text-muted-foreground text-pretty">
              Manage all job postings, view statistics, and keep your directory clean.
            </p>
          </div>
          <form action={signOut}>
            <Button variant="outline" type="submit">
              Sign Out
            </Button>
          </form>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <div className="rounded-lg border bg-card p-6">
            <div className="text-2xl font-bold">{totalJobs}</div>
            <p className="text-sm text-muted-foreground">Total Jobs</p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <div className="text-2xl font-bold text-primary">{activeJobs}</div>
            <p className="text-sm text-muted-foreground">Active Jobs</p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <div className="text-2xl font-bold text-muted-foreground">{expiredJobs}</div>
            <p className="text-sm text-muted-foreground">Expired Jobs</p>
          </div>
        </div>

        <AdminJobList initialJobs={(jobs as Job[]) || []} />
      </main>
    </div>
  )
}
