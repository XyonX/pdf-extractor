"use client"
import { useState } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Edit, Trash2, Eye, Upload } from "lucide-react"
import { NavigationMenu } from "@/components/navigation-menu"

interface Invoice {
  id: string
  fileName: string
  vendor: {
    name: string
    address: string
    taxId: string
  }
  invoice: {
    number: string
    date: string
    currency: string
    total: number
  }
  createdAt: string
  updatedAt?: string
}

export function InvoiceListPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  // Mock data for demonstration
  const [invoices] = useState<Invoice[]>([
    {
      id: "1",
      fileName: "invoice_001.pdf",
      vendor: {
        name: "Acme Corporation",
        address: "123 Business St, City, State 12345",
        taxId: "TAX123456789",
      },
      invoice: {
        number: "INV-2024-001",
        date: "2024-01-15",
        currency: "USD",
        total: 1085.0,
      },
      createdAt: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      fileName: "invoice_002.pdf",
      vendor: {
        name: "Tech Solutions Inc",
        address: "456 Tech Ave, Silicon Valley, CA 94000",
        taxId: "TAX987654321",
      },
      invoice: {
        number: "INV-2024-002",
        date: "2024-01-20",
        currency: "USD",
        total: 2500.0,
      },
      createdAt: "2024-01-20T14:15:00Z",
    },
    {
      id: "3",
      fileName: "invoice_003.pdf",
      vendor: {
        name: "Global Services Ltd",
        address: "789 Global Blvd, International City, NY 10001",
        taxId: "TAX456789123",
      },
      invoice: {
        number: "INV-2024-003",
        date: "2024-01-25",
        currency: "USD",
        total: 750.0,
      },
      createdAt: "2024-01-25T09:45:00Z",
    },
  ])

  // Filter invoices based on search query
  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.invoice.number.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount)
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Mock upload - in real app, this would POST to /upload endpoint
    const mockFileId = `file_${Date.now()}`
    console.log("[v0] Uploading file:", file.name, "Mock fileId:", mockFileId)

    // Navigate to review page for newly uploaded file
    router.push(`/review/${mockFileId}`)
  }

  const handleViewInvoice = (invoiceId: string) => {
    router.push(`/invoices/${invoiceId}`)
  }

  const handleEditInvoice = (invoiceId: string) => {
    router.push(`/invoices/${invoiceId}`)
  }

  const handleDeleteInvoice = (invoiceId: string) => {
    // Mock delete - in real app, this would call DELETE API
    console.log("[v0] Deleting invoice:", invoiceId)
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          <div className="text-lg sm:text-xl font-mono font-light tracking-wider text-foreground">
            <span className="text-primary">PDF</span>
            <span className="text-muted-foreground mx-1">|</span>
            <span className="font-extralight">EXTRACTOR</span>
          </div>
          <div className="flex items-center gap-2">
            <NavigationMenu currentPage="list" />
            <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" id="pdf-upload" />
            <Button
              variant="default"
              size="sm"
              onClick={() => document.getElementById("pdf-upload")?.click()}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">New Upload</span>
              <span className="sm:hidden">Upload</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-light text-foreground">Invoice List</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage and search through your extracted invoices</p>
            </div>
            <Badge variant="outline" className="text-xs">
              {filteredInvoices.length} invoice{filteredInvoices.length !== 1 ? "s" : ""}
            </Badge>
          </div>

          {/* Search */}
          <Card className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by vendor name or invoice number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </Card>

          {/* Invoice Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-medium">Invoice #</TableHead>
                    <TableHead className="font-medium">Vendor</TableHead>
                    <TableHead className="font-medium">Date</TableHead>
                    <TableHead className="font-medium">Total</TableHead>
                    <TableHead className="font-medium">File</TableHead>
                    <TableHead className="font-medium">Created</TableHead>
                    <TableHead className="font-medium text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        {searchQuery ? "No invoices found matching your search." : "No invoices found."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id} className="hover:bg-muted/30">
                        <TableCell className="font-mono text-sm">{invoice.invoice.number}</TableCell>
                        <TableCell>
                          <div className="max-w-[200px]">
                            <div className="font-medium text-sm truncate">{invoice.vendor.name}</div>
                            <div className="text-xs text-muted-foreground truncate">{invoice.vendor.taxId}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{formatDate(invoice.invoice.date)}</TableCell>
                        <TableCell className="font-medium text-sm">
                          {formatCurrency(invoice.invoice.total, invoice.invoice.currency)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-[150px] truncate">
                          {invoice.fileName}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{formatDate(invoice.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleViewInvoice(invoice.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleEditInvoice(invoice.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteInvoice(invoice.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Summary Stats */}
          {filteredInvoices.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="text-sm text-muted-foreground">Total Invoices</div>
                <div className="text-2xl font-light text-foreground mt-1">{filteredInvoices.length}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-muted-foreground">Total Value</div>
                <div className="text-2xl font-light text-foreground mt-1">
                  {formatCurrency(
                    filteredInvoices.reduce((sum, inv) => sum + inv.invoice.total, 0),
                    "USD",
                  )}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-muted-foreground">Unique Vendors</div>
                <div className="text-2xl font-light text-foreground mt-1">
                  {new Set(filteredInvoices.map((inv) => inv.vendor.name)).size}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
