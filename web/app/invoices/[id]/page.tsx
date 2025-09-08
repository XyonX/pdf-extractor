"use client"
import { PDFDashboard } from "@/components/pdf-dashboard"
import { useParams, useRouter } from "next/navigation"

export default function InvoiceEditPage() {
  const params = useParams()
  const router = useRouter()
  const invoiceId = params.id as string

  const handleSave = () => {
    // After saving, redirect back to invoices list
    router.push("/invoices")
  }

  const handleDelete = () => {
    // After deleting, redirect back to invoices list
    router.push("/invoices")
  }

  const handleBack = () => {
    router.push("/invoices")
  }

  return (
    <main className="min-h-screen bg-background">
      <PDFDashboard invoiceId={invoiceId} mode="edit" onSave={handleSave} onDelete={handleDelete} onBack={handleBack} />
    </main>
  )
}
