import { Schema, model, Document } from "mongoose";

interface LineItem {
  description: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

export interface IInvoice extends Document {
  fileId: string;
  fileName: string;
  vendor: {
    name: string;
    address?: string;
    taxId?: string;
  };
  invoice: {
    number: string;
    date: string;
    currency?: string;
    subtotal?: number;
    taxPercent?: number;
    total?: number;
    poNumber?: string;
    poDate?: string;
    lineItems: LineItem[];
  };
  createdAt: Date;
  updatedAt?: Date;
}

const LineItemSchema = new Schema<LineItem>({
  description: { type: String, required: true },
  unitPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  total: { type: Number, required: true },
});

const InvoiceSchema = new Schema<IInvoice>(
  {
    fileId: { type: String, required: true },
    fileName: { type: String, required: true },
    vendor: {
      name: { type: String, required: true },
      address: { type: String },
      taxId: { type: String },
    },
    invoice: {
      number: { type: String, required: true },
      date: { type: String, required: true },
      currency: { type: String },
      subtotal: { type: Number },
      taxPercent: { type: Number },
      total: { type: Number },
      poNumber: { type: String },
      poDate: { type: String },
      lineItems: { type: [LineItemSchema], default: [] },
    },
  },
  { timestamps: true }
);

export default model<IInvoice>("Invoice", InvoiceSchema);
