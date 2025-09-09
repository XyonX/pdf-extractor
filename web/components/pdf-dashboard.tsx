"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Zap,
  Save,
  Trash2,
  Search,
  Plus,
  Minus,
  ArrowLeft,
} from "lucide-react"
import { PDFViewer } from "./pdf-viewer"
import Link from "next/link"
import NavigationMenu from "@/components/navigation-menu"

interface InvoiceData {
  vendor: {
    name: string
    address: string
    taxId: string
  }
  invoice: {
    number: string
    date: string
    currency: string
    subtotal: number
    taxPercent: number
    total: number
    poNumber: string
    poDate: string
    lineItems: Array<{
      description: string
      unitPrice: number
      quantity: number
      total: number
    }>
  }
}

interface PDFDashboardProps {
  fileId?: string
  invoiceId?: string
  mode: "review" | "edit"
  onSave?: () => void
  onDelete?: () => void
  onBack?: () => void
}

interface FileMetadata {
  fileId: string
  name: string
  blobUrl: string
  mimeType?: string
  size?: number
  createdAt?: string
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api"

export function PDFDashboard({
  fileId,
  invoiceId,
  mode,
  onSave,
  onDelete,
  onBack,
}: PDFDashboardProps) {
  // PDF / file state
  const [fileMeta, setFileMeta] = useState<FileMetadata | null>(null)
  const [pdfSource, setPdfSource] = useState<string | null>(null)

  // Viewer state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [zoom, setZoom] = useState(100)

  // Data extraction
  const [extractedData, setExtractedData] = useState<InvoiceData | null>(null)
  const [isExtracting, setIsExtracting] = useState(false)

  // UI states
  const [metaLoading, setMetaLoading] = useState(false)
  const [metaError, setMetaError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  // For edit mode (future: load existing invoice)
  const [invoiceLoading, setInvoiceLoading] = useState(false)

  // Fetch file metadata when in review mode
  useEffect(() => {
    if (mode === "review" && fileId) {
      let ignore = false
      setMetaLoading(true)
      setMetaError(null)
      setMessage(null)

      ;(async () => {
        try {
          const res = await fetch(`${API_BASE}/files/${fileId}`)
          const json = await res.json()
            if (!res.ok) throw new Error(json.error || "Failed to fetch file metadata")
          if (ignore) return
          setFileMeta(json)
          setPdfSource(json.blobUrl)
        } catch (e: any) {
          if (!ignore) {
            setMetaError(e.message)
          }
        } finally {
          if (!ignore) setMetaLoading(false)
        }
      })()

      return () => {
        ignore = true
      }
    }
  }, [fileId, mode])

  // (Optional placeholder) Load invoice when editing existing one
  useEffect(() => {
    if (mode === "edit" && invoiceId) {
      // TODO: implement GET /api/invoices/:invoiceId and populate extractedData
      setInvoiceLoading(true)
      // Simulated placeholder
      setTimeout(() => {
        setInvoiceLoading(false)
      }, 400)
    }
  }, [invoiceId, mode])

  const handlePDFLoadSuccess = (numPages: number) => {
    setTotalPages(numPages)
    if (currentPage > numPages) setCurrentPage(1)
  }

  const handleExtractData = useCallback(async () => {
    if (!fileId) return
    setIsExtracting(true)
    setMessage(null)
    try {
      // POST /extract with fileId
      const res = await fetch(`${API_BASE}/extract`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Extraction failed")

      setExtractedData(json.data)
      setMessage("Extraction complete.")
    } catch (e: any) {
      setMessage(e.message)
    } finally {
      setIsExtracting(false)
    }
  }, [fileId])

  const handleSave = useCallback(async () => {
    if (!fileId || !extractedData) return
    setMessage(null)
    try {
      const body = {
        fileId,
        vendor: extractedData.vendor,
        invoice: extractedData.invoice,
      }
      const res = await fetch(`${API_BASE}/invoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Save failed")
      setMessage(`Invoice saved (${json.invoiceId})`)
      onSave?.()
    } catch (e: any) {
      setMessage(e.message)
    }
  }, [fileId, extractedData, onSave])

  const handleDelete = () => {
    // Implement DELETE /api/invoices/:invoiceId if needed
    onDelete?.()
  }

  const addLineItem = () => {
    if (!extractedData) return
    setExtractedData({
      ...extractedData,
      invoice: {
        ...extractedData.invoice,
        lineItems: [
          ...extractedData.invoice.lineItems,
          { description: "", unitPrice: 0, quantity: 1, total: 0 },
        ],
      },
    })
  }

  const removeLineItem = (index: number) => {
    if (!extractedData) return
    const newLineItems = extractedData.invoice.lineItems.filter((_, i) => i !== index)
    setExtractedData({
      ...extractedData,
      invoice: {
        ...extractedData.invoice,
        lineItems: newLineItems,
      },
    })
  }

  const fileDisplayName = fileMeta?.name || (fileId ? `File ${fileId}` : "No file")

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Link
              href="/"
              className="text-lg sm:text-xl font-mono font-light tracking-wider text-foreground hover:opacity-80 transition-opacity cursor-pointer select-none"
            >
              <span className="text-primary">PDF</span>
              <span className="text-muted-foreground mx-1">|</span>
              <span className="font-extralight">EXTRACTOR</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <NavigationMenu currentPage={mode === "review" ? "review" : "edit"} />
            <Badge variant="outline" className="text-xs">
              {mode === "review" ? "Review Mode" : "Edit Mode"}
            </Badge>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: PDF Viewer */}
        <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-border bg-card flex flex-col">
          <div className="border-b border-border p-4 min-h-[120px] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-card-foreground">
                PDF Viewer
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(Math.max(50, zoom - 25))}
                  disabled={zoom <= 50}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground min-w-[60px] text-center">
                  {zoom}%
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(Math.min(200, zoom + 25))}
                  disabled={zoom >= 200}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-sm text-card-foreground truncate max-w-[200px]">
                  {metaLoading ? "Loading..." : fileDisplayName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage <= 1 || totalPages === 0}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {totalPages > 0 ? `${currentPage} / ${totalPages}` : "- / -"}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage >= totalPages || totalPages === 0}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>

            <div className="flex-1 p-4">
            <div className="h-full min-h-[300px] lg:min-h-0 border border-border bg-white">
              {metaLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-muted-foreground">
                    <p>Loading file metadata...</p>
                  </div>
                </div>
              ) : metaError ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-destructive text-sm">
                    <p>{metaError}</p>
                  </div>
                </div>
              ) : pdfSource ? (
                <PDFViewer
                  file={pdfSource}
                  currentPage={currentPage}
                  zoom={zoom}
                  onLoadSuccess={handlePDFLoadSuccess}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-muted-foreground">
                    <FileText className="h-16 w-16 mx-auto mb-4" />
                    <p>No PDF loaded</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Extraction Panel */}
        <div className="w-full lg:w-1/2 bg-background flex flex-col">
          <div className="border-b border-border p-4 min-h-[120px] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-foreground">
                Data Extraction
              </h2>
              {mode === "review" && (
                <Button
                  onClick={handleExtractData}
                  disabled={!fileMeta || isExtracting}
                  className="flex items-center gap-2"
                  size="sm"
                >
                  <Zap className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {isExtracting ? "Extracting..." : "Extract with AI"}
                  </span>
                  <span className="sm:hidden">
                    {isExtracting ? "..." : "Extract"}
                  </span>
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Select defaultValue="gemini" disabled>
                <SelectTrigger className="w-24 sm:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini">Gemini</SelectItem>
                  <SelectItem value="groq">Groq</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">AI Model</span>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4 space-y-4 sm:space-y-6">
            {!extractedData ? (
              <div className="flex items-center justify-center h-full min-h-[300px] lg:min-h-0">
                <div className="text-center text-muted-foreground">
                  <Search className="h-16 w-16 mx-auto mb-4" />
                  <p className="text-sm sm:text-base">
                    {mode === "review"
                      ? 'Click "Extract with AI" to begin data extraction'
                      : invoiceLoading
                      ? "Loading invoice data..."
                      : "No invoice loaded"}
                  </p>
                  {message && (
                    <p className="text-xs text-foreground mt-2">{message}</p>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Card className="p-3 sm:p-4 border border-gray-400 bg-card/50 backdrop-blur-sm">
                  <h3 className="text-base font-medium text-foreground mb-4 pb-2 border-b border-gray-300">
                    Vendor Information
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label
                        htmlFor="vendor-name"
                        className="text-sm font-medium text-foreground mb-1.5 block"
                      >
                        Vendor Name
                      </Label>
                      <Input
                        id="vendor-name"
                        value={extractedData.vendor.name}
                        onChange={(e) =>
                          setExtractedData({
                            ...extractedData,
                            vendor: {
                              ...extractedData.vendor,
                              name: e.target.value,
                            },
                          })
                        }
                        className="border border-gray-400 focus:border-primary bg-background"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="vendor-address"
                        className="text-sm font-medium text-foreground mb-1.5 block"
                      >
                        Address
                      </Label>
                      <Textarea
                        id="vendor-address"
                        value={extractedData.vendor.address}
                        onChange={(e) =>
                          setExtractedData({
                            ...extractedData,
                            vendor: {
                              ...extractedData.vendor,
                              address: e.target.value,
                            },
                          })
                        }
                        rows={2}
                        className="border border-gray-400 focus:border-primary bg-background"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="vendor-tax-id"
                        className="text-sm font-medium text-foreground mb-1.5 block"
                      >
                        Tax ID
                      </Label>
                      <Input
                        id="vendor-tax-id"
                        value={extractedData.vendor.taxId}
                        onChange={(e) =>
                          setExtractedData({
                            ...extractedData,
                            vendor: {
                              ...extractedData.vendor,
                              taxId: e.target.value,
                            },
                          })
                        }
                        className="border border-gray-400 focus:border-primary bg-background"
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-3 sm:p-4 border border-gray-400 bg-card/50 backdrop-blur-sm">
                  <h3 className="text-base font-medium text-foreground mb-4 pb-2 border-b border-gray-300">
                    Invoice Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="invoice-number"
                        className="text-sm font-medium text-foreground mb-1.5 block"
                      >
                        Invoice Number
                      </Label>
                      <Input
                        id="invoice-number"
                        value={extractedData.invoice.number}
                        onChange={(e) =>
                          setExtractedData({
                            ...extractedData,
                            invoice: {
                              ...extractedData.invoice,
                              number: e.target.value,
                            },
                          })
                        }
                        className="border border-gray-400 focus:border-primary bg-background"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="invoice-date"
                        className="text-sm font-medium text-foreground mb-1.5 block"
                      >
                        Invoice Date
                      </Label>
                      <Input
                        id="invoice-date"
                        type="date"
                        value={extractedData.invoice.date}
                        onChange={(e) =>
                          setExtractedData({
                            ...extractedData,
                            invoice: {
                              ...extractedData.invoice,
                              date: e.target.value,
                            },
                          })
                        }
                        className="border border-gray-400 focus:border-primary bg-background"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="currency"
                        className="text-sm font-medium text-foreground mb-1.5 block"
                      >
                        Currency
                      </Label>
                      <Input
                        id="currency"
                        value={extractedData.invoice.currency}
                        onChange={(e) =>
                          setExtractedData({
                            ...extractedData,
                            invoice: {
                              ...extractedData.invoice,
                              currency: e.target.value,
                            },
                          })
                        }
                        className="border border-gray-400 focus:border-primary bg-background"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="po-number"
                        className="text-sm font-medium text-foreground mb-1.5 block"
                      >
                        PO Number
                      </Label>
                      <Input
                        id="po-number"
                        value={extractedData.invoice.poNumber}
                        onChange={(e) =>
                          setExtractedData({
                            ...extractedData,
                            invoice: {
                              ...extractedData.invoice,
                              poNumber: e.target.value,
                            },
                          })
                        }
                        className="border border-gray-400 focus:border-primary bg-background"
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-3 sm:p-4 border border-gray-400 bg-card/50 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-300">
                    <h3 className="text-base font-medium text-foreground">
                      Line Items
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addLineItem}
                      className="border border-gray-400 bg-transparent"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Add Item</span>
                      <span className="sm:hidden">Add</span>
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {extractedData.invoice.lineItems.map((item, index) => (
                      <div
                        key={index}
                        className="border border-gray-400 p-3 bg-background"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-foreground bg-primary/10 px-2 py-1 border border-gray-400">
                            Item {index + 1}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLineItem(index)}
                            disabled={
                              extractedData.invoice.lineItems.length === 1
                            }
                            className="hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="col-span-1 sm:col-span-2">
                            <Label className="text-sm font-medium text-foreground mb-1.5 block">
                              Description
                            </Label>
                            <Input
                              value={item.description}
                              onChange={(e) => {
                                const newItems = [
                                  ...extractedData.invoice.lineItems,
                                ]
                                newItems[index].description = e.target.value
                                setExtractedData({
                                  ...extractedData,
                                  invoice: {
                                    ...extractedData.invoice,
                                    lineItems: newItems,
                                  },
                                })
                              }}
                              className="border border-gray-400 focus:border-primary bg-background"
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-foreground mb-1.5 block">
                              Unit Price
                            </Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(e) => {
                                const newItems = [
                                  ...extractedData.invoice.lineItems,
                                ]
                                newItems[index].unitPrice =
                                  Number.parseFloat(e.target.value) || 0
                                newItems[index].total =
                                  newItems[index].unitPrice *
                                  newItems[index].quantity
                                setExtractedData({
                                  ...extractedData,
                                  invoice: {
                                    ...extractedData.invoice,
                                    lineItems: newItems,
                                  },
                                })
                              }}
                              className="border border-gray-400 focus:border-primary bg-background"
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-foreground mb-1.5 block">
                              Quantity
                            </Label>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => {
                                const newItems = [
                                  ...extractedData.invoice.lineItems,
                                ]
                                newItems[index].quantity =
                                  Number.parseInt(e.target.value) || 1
                                newItems[index].total =
                                  newItems[index].unitPrice *
                                  newItems[index].quantity
                                setExtractedData({
                                  ...extractedData,
                                  invoice: {
                                    ...extractedData.invoice,
                                    lineItems: newItems,
                                  },
                                })
                              }}
                              className="border border-gray-400 focus:border-primary bg-background"
                            />
                          </div>
                        </div>
                        <div className="mt-3">
                          <Label className="text-sm font-medium text-foreground mb-1.5 block">
                            Total
                          </Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={item.total}
                            readOnly
                            className="bg-muted border border-gray-400 font-medium"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-3 sm:p-4 border border-gray-400 bg-card/50 backdrop-blur-sm">
                  <h3 className="text-base font-medium text-foreground mb-4 pb-2 border-b border-gray-300">
                    Totals
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="subtotal"
                        className="text-sm font-medium text-foreground mb-1.5 block"
                      >
                        Subtotal
                      </Label>
                      <Input
                        id="subtotal"
                        type="number"
                        step="0.01"
                        value={extractedData.invoice.subtotal}
                        onChange={(e) =>
                          setExtractedData({
                            ...extractedData,
                            invoice: {
                              ...extractedData.invoice,
                              subtotal:
                                Number.parseFloat(e.target.value) || 0,
                            },
                          })
                        }
                        className="border border-gray-400 focus:border-primary bg-background"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="tax-percent"
                        className="text-sm font-medium text-foreground mb-1.5 block"
                      >
                        Tax %
                      </Label>
                      <Input
                        id="tax-percent"
                        type="number"
                        step="0.01"
                        value={extractedData.invoice.taxPercent}
                        onChange={(e) =>
                          setExtractedData({
                            ...extractedData,
                            invoice: {
                              ...extractedData.invoice,
                              taxPercent:
                                Number.parseFloat(e.target.value) || 0,
                            },
                          })
                        }
                        className="border border-gray-400 focus:border-primary bg-background"
                      />
                    </div>
                    <div className="col-span-1 sm:col-span-2">
                      <Label
                        htmlFor="total"
                        className="text-sm font-medium text-foreground mb-1.5 block"
                      >
                        Total
                      </Label>
                      <Input
                        id="total"
                        type="number"
                        step="0.01"
                        value={extractedData.invoice.total}
                        onChange={(e) =>
                          setExtractedData({
                            ...extractedData,
                            invoice: {
                              ...extractedData.invoice,
                              total:
                                Number.parseFloat(e.target.value) || 0,
                            },
                          })
                        }
                        className="border border-gray-400 focus:border-primary bg-background font-medium text-lg"
                      />
                    </div>
                  </div>
                </Card>

                <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-400">
                  <Button
                    className="flex-1"
                    onClick={handleSave}
                    disabled={!extractedData}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Invoice
                  </Button>
                  {mode === "edit" && (
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={handleDelete}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
          {message && (
            <div className="p-2 border-t text-xs bg-gray-50">{message}</div>
          )}
        </div>
      </div>
    </div>
  )
}