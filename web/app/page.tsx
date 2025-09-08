"use client"
import { useState } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, FileText } from "lucide-react"
import { NavigationMenu } from "@/components/navigation-menu"

export default function Home() {
  const [isDragOver, setIsDragOver] = useState(false)
  const router = useRouter()

  const handleFileSelect = (file: File) => {
    if (file.type === "application/pdf") {
      // Mock file upload - in real app, this would POST to /upload endpoint
      const mockFileId = `file_${Date.now()}`
      console.log("[v0] Uploading file:", file.name, "-> fileId:", mockFileId)

      // Navigate to review page with the new file
      router.push(`/review/${mockFileId}`)
    } else {
      alert("Please select a PDF file")
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          <div className="text-lg sm:text-xl font-mono font-light tracking-wider text-foreground">
            <span className="text-primary">PDF</span>
            <span className="text-muted-foreground mx-1">|</span>
            <span className="font-extralight">EXTRACTOR</span>
          </div>
          <NavigationMenu currentPage="home" />
        </div>
      </header>

      {/* Main Upload Area */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <Card className="w-full max-w-2xl p-8 sm:p-12">
          <div className="text-center mb-8">
            <div className="text-2xl sm:text-3xl font-mono font-light tracking-wider text-foreground mb-2">
              <span className="text-primary">PDF</span>
              <span className="text-muted-foreground mx-1">|</span>
              <span className="font-extralight">EXTRACTOR</span>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base">
              Upload a PDF invoice to extract and manage data with AI
            </p>
          </div>

          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-none p-8 sm:p-12 text-center transition-colors ${
              isDragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragOver(true)
            }}
            onDragLeave={() => setIsDragOver(false)}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 border border-border bg-card">
                <Upload className="h-12 w-12 text-primary" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium text-foreground">Drop your PDF here</h3>
                <p className="text-sm text-muted-foreground">or click to browse files</p>
              </div>

              <input type="file" accept=".pdf" onChange={handleFileInput} className="hidden" id="file-upload" />

              <Button asChild className="mt-4">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <FileText className="h-4 w-4 mr-2" />
                  Select PDF File
                </label>
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">Supported format: PDF files only</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
