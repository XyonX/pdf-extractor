"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, FileText, Edit, Trash2, Plus } from "lucide-react"

interface Invoice {
  id: string
  fileName: string
  vendorName: string
  invoiceNumber: string
  date: string
  total: number
  currency: string
  status: "processed" | "pending" | "error"
  createdAt: string
}

const mockInvoices: Invoice[] = [
  {
    id: "1",
    fileName: "invoice_001.pdf",
    vendorName: "Acme Corporation",
    invoiceNumber: "INV-2024-001",
    date: "2024-01-15",
    total: 1085.0,
    currency: "USD",
    status: "processed",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    fileName: "invoice_002.pdf",
    vendorName: "Tech Solutions Ltd",
    invoiceNumber: "INV-2024-002",
    date: "2024-01-16",
    total: 2500.0,
    currency: "USD",
    status: "processed",
    createdAt: "2024-01-16T14:20:00Z",
  },
  {
    id: "3",
    fileName: "invoice_003.pdf",
    vendorName: "Office Supplies Co",
    invoiceNumber: "INV-2024-003",
    date: "2024-01-17",
    total: 450.75,
    currency: "USD",
    status: "pending",
    createdAt: "2024-01-17T09:15:00Z",
  },
]

export function InvoiceList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [invoices] = useState<Invoice[]>(mockInvoices)

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusBadge = (status: Invoice["status"]) => {
    switch (status) {
      case "processed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Processed
          </Badge>
        )
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold text-foreground">Invoice Management</h1>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="p-6">
        {/* Search and Filters */}
        <Card className="p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by vendor name or invoice number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredInvoices.length} of {invoices.length} invoices
            </div>
          </div>
        </Card>

        {/* Invoice Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Invoice #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      {invoice.fileName}
                    </div>
                  </TableCell>
                  <TableCell>{invoice.vendorName}</TableCell>
                  <TableCell>{invoice.invoiceNumber}</TableCell>
                  <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {invoice.currency} {invoice.total.toFixed(2)}
                  </TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell>{new Date(invoice.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredInvoices.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? "No invoices found matching your search." : "No invoices available."}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
