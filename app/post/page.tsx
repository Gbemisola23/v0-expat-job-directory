import { Header } from "@/components/header"
import { JobPostForm } from "@/components/job-post-form"

export default function PostJobPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container px-4 md:px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-balance mb-3">Post a Job</h1>
            <p className="text-muted-foreground text-pretty">
              Help expat spouses find meaningful work. Your posting is completely anonymous and will be visible for 30
              days.
            </p>
          </div>

          <JobPostForm />
        </div>
      </main>
    </div>
  )
}
