import { createClient } from "@/lib/supabase/server"
import type { Job } from "@/app/types/job"
import { Header } from "@/components/header"
import { JobListings } from "@/components/job-listings"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function HomePage() {
  const supabase = await createClient()

  const { data: jobs, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("is_active", true)
    .order("posted_at", { ascending: false })
    .limit(50)

  console.log("[v0] Fetched jobs count:", jobs?.length, "at", new Date().toISOString())
  if (jobs && jobs.length > 0) {
    jobs.forEach((job) => {
      console.log("[v0] Job on homepage:", job.id, "-", job.title, "at", job.company)
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container px-4 md:px-6 py-12">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance mb-6">
            Find Your Next
            <span className="text-primary"> Opportunity</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground text-pretty">
            From expats living in the Netherlands, for expat spouses finding their place here. Connect, share, and
            work—no referrals, no labels, no fuss.
          </p>
        </div>

        {/* Job Listings */}
        <JobListings initialJobs={(jobs as Job[]) || []} />
      </main>

      <footer className="border-t mt-20">
        <div className="container px-4 md:px-6 py-8">
          <p className="text-center text-sm text-muted-foreground">
            Built with care for the expat community in the Netherlands. Post jobs anonymously and help others find
            meaningful work.
          </p>
          <p className="text-center text-xs text-muted-foreground/70 mt-2">ExpatLinkUp</p>
        </div>
      </footer>
    </div>
  )
}
