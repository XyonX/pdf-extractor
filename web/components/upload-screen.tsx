"use client"

import type React from "react"

import { Upload } from "lucide-react"
import { Input } from "@/components/ui/input"

interface UploadScreenProps {
  onFileUpload: (file: File) => void
}

export function UploadScreen({ onFileUpload }: UploadScreenProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "application/pdf") {
      onFileUpload(file)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center">
            <div className="text-lg sm:text-xl font-mono font-light tracking-wider text-foreground">
              <span className="text-primary">PDF</span>
              <span className="text-muted-foreground mx-1">|</span>
              <span className="font-extralight">EXTRACTOR</span>
            </div>
          </div>
        </div>
      </header>

      {/* Upload Area */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <div className="border-2 border-dashed border-border p-8 sm:p-12 text-center bg-card">
            <Upload className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-xl font-medium text-foreground mb-2">Upload PDF Document</h2>
            <p className="text-muted-foreground mb-6">Select a PDF file to extract invoice data using AI</p>
            <div className="space-y-4">
              <Input type="file" accept=".pdf" onChange={handleFileChange} className="cursor-pointer" />
              <p className="text-xs text-muted-foreground">Supported format: PDF (max 10MB)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
