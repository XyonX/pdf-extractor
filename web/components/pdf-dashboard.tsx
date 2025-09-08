"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { FileText, Zap, Save, Trash2, Search, Plus, Minus, ArrowLeft } from "lucide-react"
import { PDFViewer } from "./pdf-viewer"
import Link from "next/link"
import NavigationMenu from "@/components/navigation-menu" // Import NavigationMenu component

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

export function PDFDashboard({ fileId, invoiceId, mode, onSave, onDelete, onBack }: PDFDashboardProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [zoom, setZoom] = useState(100)
  const [extractedData, setExtractedData] = useState<InvoiceData | null>(null)
  const [isExtracting, setIsExtracting] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(false)

  useEffect(() => {
    if (mode === "review" && fileId) {
      console.log("[v0] Loading file for review:", fileId)
      loadMockFile()
    } else if (mode === "edit" && invoiceId) {
      console.log("[v0] Loading invoice for edit:", invoiceId)
      loadMockInvoice(invoiceId)
    }
  }, [fileId, invoiceId, mode])

  const loadMockFile = () => {
    setIsDemoMode(true)
    setSelectedFile({ name: "invoice_sample.pdf" } as File)
    setTotalPages(1)
    setCurrentPage(1)
  }

  const loadMockInvoice = (id: string) => {
    setIsDemoMode(true)
    setSelectedFile({ name: `invoice_${id}.pdf` } as File)
    setTotalPages(1)
    setCurrentPage(1)

    setExtractedData({
      vendor: {
        name: "Acme Corporation",
        address: "123 Business St, City, State 12345",
        taxId: "TAX123456789",
      },
      invoice: {
        number: `INV-2024-${id.padStart(3, "0")}`,
        date: "2024-01-15",
        currency: "USD",
        subtotal: 1000.0,
        taxPercent: 8.5,
        total: 1085.0,
        poNumber: "PO-2024-001",
        poDate: "2024-01-10",
        lineItems: [
          {
            description: "Professional Services",
            unitPrice: 500.0,
            quantity: 2,
            total: 1000.0,
          },
        ],
      },
    })
  }

  const handlePDFLoadSuccess = (numPages: number) => {
    setTotalPages(numPages)
  }

  const handleExtractData = async () => {
    setIsExtracting(true)
    setTimeout(() => {
      setExtractedData({
        vendor: {
          name: "Acme Corporation",
          address: "123 Business St, City, State 12345",
          taxId: "TAX123456789",
        },
        invoice: {
          number: "INV-2024-001",
          date: "2024-01-15",
          currency: "USD",
          subtotal: 1000.0,
          taxPercent: 8.5,
          total: 1085.0,
          poNumber: "PO-2024-001",
          poDate: "2024-01-10",
          lineItems: [
            {
              description: "Professional Services",
              unitPrice: 500.0,
              quantity: 2,
              total: 1000.0,
            },
          ],
        },
      })
      setIsExtracting(false)
    }, 2000)
  }

  const handleSave = () => {
    console.log("[v0] Saving invoice data:", extractedData)
    onSave?.()
  }

  const handleDelete = () => {
    console.log("[v0] Deleting invoice:", invoiceId)
    onDelete?.()
  }

  const addLineItem = () => {
    if (extractedData) {
      setExtractedData({
        ...extractedData,
        invoice: {
          ...extractedData.invoice,
          lineItems: [...extractedData.invoice.lineItems, { description: "", unitPrice: 0, quantity: 1, total: 0 }],
        },
      })
    }
  }

  const removeLineItem = (index: number) => {
    if (extractedData) {
      const newLineItems = extractedData.invoice.lineItems.filter((_, i) => i !== index)
      setExtractedData({
        ...extractedData,
        invoice: {
          ...extractedData.invoice,
          lineItems: newLineItems,
        },
      })
    }
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Link
              href="/"
              className="text-lg sm:text-xl font-mono font-light tracking-wider text-foreground hover:opacity-80 transition-opacity cursor-pointer select-none"
              onClick={() => console.log("[v0] Logo clicked, navigating to home")}
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
        <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-border bg-card flex flex-col">
          <div className="border-b border-border p-4 min-h-[120px] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-card-foreground">PDF Viewer</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(Math.max(50, zoom - 25))}
                  disabled={zoom <= 50}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground min-w-[60px] text-center">{zoom}%</span>
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
                  {selectedFile?.name || "Loading..."}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage <= 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage >= totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 p-4">
            <div className="h-full min-h-[300px] lg:min-h-0 border border-border bg-white">
              {isDemoMode ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <div className="text-muted-foreground mb-4">
                    <FileText className="h-24 w-24 mx-auto mb-4 text-primary/20" />
                    <h3 className="text-lg font-medium mb-2">Demo Mode</h3>
                    <p className="text-sm max-w-sm">
                      This is a demonstration with mock data. Upload a real PDF file to see the actual PDF viewer in
                      action.
                    </p>
                  </div>
                  <div className="mt-6 p-4 bg-muted/50 border border-border text-xs text-muted-foreground max-w-xs">
                    <p className="font-medium mb-1">Sample Invoice Preview</p>
                    <p>Invoice #: INV-2024-001</p>
                    <p>Date: 2024-01-15</p>
                    <p>Total: $1,085.00</p>
                  </div>
                </div>
              ) : selectedFile ? (
                <PDFViewer
                  file={selectedFile}
                  currentPage={currentPage}
                  zoom={zoom}
                  onLoadSuccess={handlePDFLoadSuccess}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-muted-foreground">
                    <FileText className="h-16 w-16 mx-auto mb-4" />
                    <p>Loading PDF...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 bg-background flex flex-col">
          <div className="border-b border-border p-4 min-h-[120px] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-foreground">Data Extraction</h2>
              {mode === "review" && (
                <Button
                  onClick={handleExtractData}
                  disabled={!selectedFile || isExtracting}
                  className="flex items-center gap-2"
                  size="sm"
                >
                  <Zap className="h-4 w-4" />
                  <span className="hidden sm:inline">{isExtracting ? "Extracting..." : "Extract with AI"}</span>
                  <span className="sm:hidden">{isExtracting ? "..." : "Extract"}</span>
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Select defaultValue="gemini">
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
                    {mode === "review" ? 'Click "Extract with AI" to begin data extraction' : "Loading invoice data..."}
                  </p>
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
                      <Label htmlFor="vendor-name" className="text-sm font-medium text-foreground mb-1.5 block">
                        Vendor Name
                      </Label>
                      <Input
                        id="vendor-name"
                        value={extractedData.vendor.name}
                        onChange={(e) =>
                          setExtractedData({
                            ...extractedData,
                            vendor: { ...extractedData.vendor, name: e.target.value },
                          })
                        }
                        className="border border-gray-400 focus:border-primary bg-background"
                      />
                    </div>
                    <div>
                      <Label htmlFor="vendor-address" className="text-sm font-medium text-foreground mb-1.5 block">
                        Address
                      </Label>
                      <Textarea
                        id="vendor-address"
                        value={extractedData.vendor.address}
                        onChange={(e) =>
                          setExtractedData({
                            ...extractedData,
                            vendor: { ...extractedData.vendor, address: e.target.value },
                          })
                        }
                        rows={2}
                        className="border border-gray-400 focus:border-primary bg-background"
                      />
                    </div>
                    <div>
                      <Label htmlFor="vendor-tax-id" className="text-sm font-medium text-foreground mb-1.5 block">
                        Tax ID
                      </Label>
                      <Input
                        id="vendor-tax-id"
                        value={extractedData.vendor.taxId}
                        onChange={(e) =>
                          setExtractedData({
                            ...extractedData,
                            vendor: { ...extractedData.vendor, taxId: e.target.value },
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
                      <Label htmlFor="invoice-number" className="text-sm font-medium text-foreground mb-1.5 block">
                        Invoice Number
                      </Label>
                      <Input
                        id="invoice-number"
                        value={extractedData.invoice.number}
                        onChange={(e) =>
                          setExtractedData({
                            ...extractedData,
                            invoice: { ...extractedData.invoice, number: e.target.value },
                          })
                        }
                        className="border border-gray-400 focus:border-primary bg-background"
                      />
                    </div>
                    <div>
                      <Label htmlFor="invoice-date" className="text-sm font-medium text-foreground mb-1.5 block">
                        Invoice Date
                      </Label>
                      <Input
                        id="invoice-date"
                        type="date"
                        value={extractedData.invoice.date}
                        onChange={(e) =>
                          setExtractedData({
                            ...extractedData,
                            invoice: { ...extractedData.invoice, date: e.target.value },
                          })
                        }
                        className="border border-gray-400 focus:border-primary bg-background"
                      />
                    </div>
                    <div>
                      <Label htmlFor="currency" className="text-sm font-medium text-foreground mb-1.5 block">
                        Currency
                      </Label>
                      <Input
                        id="currency"
                        value={extractedData.invoice.currency}
                        onChange={(e) =>
                          setExtractedData({
                            ...extractedData,
                            invoice: { ...extractedData.invoice, currency: e.target.value },
                          })
                        }
                        className="border border-gray-400 focus:border-primary bg-background"
                      />
                    </div>
                    <div>
                      <Label htmlFor="po-number" className="text-sm font-medium text-foreground mb-1.5 block">
                        PO Number
                      </Label>
                      <Input
                        id="po-number"
                        value={extractedData.invoice.poNumber}
                        onChange={(e) =>
                          setExtractedData({
                            ...extractedData,
                            invoice: { ...extractedData.invoice, poNumber: e.target.value },
                          })
                        }
                        className="border border-gray-400 focus:border-primary bg-background"
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-3 sm:p-4 border border-gray-400 bg-card/50 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-300">
                    <h3 className="text-base font-medium text-foreground">Line Items</h3>
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
                      <div key={index} className="border border-gray-400 p-3 bg-background">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-foreground bg-primary/10 px-2 py-1 border border-gray-400">
                            Item {index + 1}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLineItem(index)}
                            disabled={extractedData.invoice.lineItems.length === 1}
                            className="hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="col-span-1 sm:col-span-2">
                            <Label className="text-sm font-medium text-foreground mb-1.5 block">Description</Label>
                            <Input
                              value={item.description}
                              onChange={(e) => {
                                const newItems = [...extractedData.invoice.lineItems]
                                newItems[index].description = e.target.value
                                setExtractedData({
                                  ...extractedData,
                                  invoice: { ...extractedData.invoice, lineItems: newItems },
                                })
                              }}
                              className="border border-gray-400 focus:border-primary bg-background"
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-foreground mb-1.5 block">Unit Price</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(e) => {
                                const newItems = [...extractedData.invoice.lineItems]
                                newItems[index].unitPrice = Number.parseFloat(e.target.value) || 0
                                newItems[index].total = newItems[index].unitPrice * newItems[index].quantity
                                setExtractedData({
                                  ...extractedData,
                                  invoice: { ...extractedData.invoice, lineItems: newItems },
                                })
                              }}
                              className="border border-gray-400 focus:border-primary bg-background"
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-foreground mb-1.5 block">Quantity</Label>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => {
                                const newItems = [...extractedData.invoice.lineItems]
                                newItems[index].quantity = Number.parseInt(e.target.value) || 1
                                newItems[index].total = newItems[index].unitPrice * newItems[index].quantity
                                setExtractedData({
                                  ...extractedData,
                                  invoice: { ...extractedData.invoice, lineItems: newItems },
                                })
                              }}
                              className="border border-gray-400 focus:border-primary bg-background"
                            />
                          </div>
                        </div>
                        <div className="mt-3">
                          <Label className="text-sm font-medium text-foreground mb-1.5 block">Total</Label>
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
                  <h3 className="text-base font-medium text-foreground mb-4 pb-2 border-b border-gray-300">Totals</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="subtotal" className="text-sm font-medium text-foreground mb-1.5 block">
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
                            invoice: { ...extractedData.invoice, subtotal: Number.parseFloat(e.target.value) || 0 },
                          })
                        }
                        className="border border-gray-400 focus:border-primary bg-background"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tax-percent" className="text-sm font-medium text-foreground mb-1.5 block">
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
                            invoice: { ...extractedData.invoice, taxPercent: Number.parseFloat(e.target.value) || 0 },
                          })
                        }
                        className="border border-gray-400 focus:border-primary bg-background"
                      />
                    </div>
                    <div className="col-span-1 sm:col-span-2">
                      <Label htmlFor="total" className="text-sm font-medium text-foreground mb-1.5 block">
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
                            invoice: { ...extractedData.invoice, total: Number.parseFloat(e.target.value) || 0 },
                          })
                        }
                        className="border border-gray-400 focus:border-primary bg-background font-medium text-lg"
                      />
                    </div>
                  </div>
                </Card>

                <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-400">
                  <Button className="flex-1" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Invoice
                  </Button>
                  {mode === "edit" && (
                    <Button variant="destructive" className="flex-1" onClick={handleDelete}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
