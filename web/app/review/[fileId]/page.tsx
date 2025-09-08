"use client"
import { PDFDashboard } from "@/components/pdf-dashboard"
import { useParams, useRouter } from "next/navigation"

export default function ReviewPage() {
  const params = useParams()
  const router = useRouter()
  const fileId = params.fileId as string

  const handleSave = () => {
    // After saving, redirect back to invoices list
    router.push("/invoices")
  }

  const handleBack = () => {
    router.push("/invoices")
  }

  return (
    <main className="min-h-screen bg-background">
      <PDFDashboard fileId={fileId} mode="review" onSave={handleSave} onBack={handleBack} />
    </main>
  )
}
