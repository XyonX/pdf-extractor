"use client"
import { useState, useEffect } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"

interface PDFViewerProps {
  file: File | null
  currentPage: number
  zoom: number
  onLoadSuccess: (numPages: number) => void
}

export function PDFViewer({ file, currentPage, zoom, onLoadSuccess }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [workerReady, setWorkerReady] = useState(false)

  useEffect(() => {
    const setupWorker = async () => {
      try {
        if (typeof window !== "undefined") {
          // Use CDN for browser environment
          pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`
        }
        setWorkerReady(true)
        console.log("[v0] PDF worker configured successfully")
      } catch (error) {
        console.error("[v0] Worker setup failed:", error)
        pdfjs.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.mjs"
        setWorkerReady(true)
      }
    }

    setupWorker()
  }, [])

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log("[v0] PDF loaded successfully with", numPages, "pages")
    setNumPages(numPages)
    setLoading(false)
    setError(null)
    onLoadSuccess(numPages)
  }

  const onDocumentLoadError = (error: Error) => {
    console.error("[v0] PDF load error:", error)
    if (error.message.includes("Invalid PDF structure")) {
      setError("Demo mode: Upload a real PDF file to view")
    } else {
      setError("Failed to load PDF: " + error.message)
    }
    setLoading(false)
  }

  if (!workerReady) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <p>Initializing PDF viewer...</p>
      </div>
    )
  }

  if (!file) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <p>No PDF selected</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <div className="text-destructive mb-4">
          <svg className="h-16 w-16 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <p className="text-sm">{error}</p>
        </div>
        <div className="text-muted-foreground text-xs max-w-sm">
          <p>
            This is a demo with mock data. To test the PDF viewer, upload a real PDF file using the file input above.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex items-center justify-center overflow-auto bg-gray-100">
      <div className="max-w-full max-h-full">
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className="flex items-center justify-center p-8">
              <div className="text-muted-foreground">Loading PDF...</div>
            </div>
          }
        >
          <Page
            pageNumber={currentPage}
            scale={zoom / 100}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="shadow-lg"
          />
        </Document>
      </div>
    </div>
  )
}
