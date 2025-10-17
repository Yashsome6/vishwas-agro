import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

interface InvoiceData {
  id: string;
  date: string;
  customerName: string;
  customerAddress?: string;
  customerGST?: string;
  items: Array<{
    name: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  subtotal: number;
  cgst: number;
  sgst: number;
  total: number;
  paymentStatus: string;
}

// Generate professional PDF invoice with QR code
export function generateInvoicePDF(invoice: InvoiceData, companyInfo?: any) {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Company Header
    doc.setFillColor(59, 130, 246); // Blue header
    doc.rect(0, 0, pageWidth, 40, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text(companyInfo?.name || "Agro ERP System", 15, 20);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(companyInfo?.address || "Agriculture Management System", 15, 28);
    doc.text(`GST: ${companyInfo?.gst || "N/A"} | Ph: ${companyInfo?.phone || "N/A"}`, 15, 34);
    
    // Invoice Title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("TAX INVOICE", pageWidth - 15, 55, { align: "right" });
    
    // Invoice Details
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice #: ${invoice.id}`, pageWidth - 15, 63, { align: "right" });
    doc.text(`Date: ${new Date(invoice.date).toLocaleDateString()}`, pageWidth - 15, 70, { align: "right" });
    doc.text(`Status: ${invoice.paymentStatus.toUpperCase()}`, pageWidth - 15, 77, { align: "right" });
    
    // Customer Details
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Bill To:", 15, 55);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(invoice.customerName, 15, 63);
    if (invoice.customerAddress) {
      doc.text(invoice.customerAddress, 15, 70);
    }
    if (invoice.customerGST) {
      doc.text(`GST: ${invoice.customerGST}`, 15, 77);
    }
    
    // Items Table
    autoTable(doc, {
      startY: 90,
      head: [["#", "Item Description", "Qty", "Rate", "Amount"]],
      body: invoice.items.map((item, index) => [
        index + 1,
        item.name,
        item.quantity.toString(),
        `₹${item.rate.toFixed(2)}`,
        `₹${item.amount.toFixed(2)}`
      ]),
      theme: "striped",
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: "bold"
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 80 },
        2: { cellWidth: 25, halign: "center" },
        3: { cellWidth: 30, halign: "right" },
        4: { cellWidth: 35, halign: "right" }
      },
      margin: { left: 15, right: 15 }
    });
    
    // Calculate final Y position after table
    const finalY = (doc as any).lastAutoTable.finalY || 150;
    
    // Summary Box
    const summaryX = pageWidth - 75;
    const summaryY = finalY + 10;
    
    doc.setFillColor(245, 245, 245);
    doc.rect(summaryX - 5, summaryY - 5, 60, 40, "F");
    
    doc.setFontSize(10);
    doc.text("Subtotal:", summaryX, summaryY);
    doc.text(`₹${invoice.subtotal.toFixed(2)}`, summaryX + 50, summaryY, { align: "right" });
    
    doc.text("CGST (9%):", summaryX, summaryY + 7);
    doc.text(`₹${invoice.cgst.toFixed(2)}`, summaryX + 50, summaryY + 7, { align: "right" });
    
    doc.text("SGST (9%):", summaryX, summaryY + 14);
    doc.text(`₹${invoice.sgst.toFixed(2)}`, summaryX + 50, summaryY + 14, { align: "right" });
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Total:", summaryX, summaryY + 25);
    doc.text(`₹${invoice.total.toFixed(2)}`, summaryX + 50, summaryY + 25, { align: "right" });
    
    // QR Code (placeholder - actual QR code data)
    const qrData = `INV:${invoice.id}|AMT:${invoice.total}|DATE:${invoice.date}`;
    doc.setFontSize(8);
    doc.text("Scan to verify", 15, summaryY + 20);
    doc.rect(15, summaryY + 22, 25, 25); // QR code placeholder
    doc.setFontSize(7);
    doc.text(qrData, 15, summaryY + 50, { maxWidth: 80 });
    
    // Footer
    const footerY = doc.internal.pageSize.height - 20;
    doc.setDrawColor(200, 200, 200);
    doc.line(15, footerY - 5, pageWidth - 15, footerY - 5);
    
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text("Thank you for your business!", pageWidth / 2, footerY, { align: "center" });
    doc.text("This is a computer-generated invoice.", pageWidth / 2, footerY + 5, { align: "center" });
    
    // Save PDF
    doc.save(`Invoice_${invoice.id}_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("PDF invoice generated successfully");
    
    return doc;
  } catch (error) {
    console.error("PDF generation error:", error);
    toast.error("Failed to generate PDF");
    return null;
  }
}

// Generate purchase voucher PDF
export function generatePurchasePDF(voucher: any, vendorName: string) {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Header
    doc.setFillColor(139, 69, 19);
    doc.rect(0, 0, pageWidth, 40, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("Purchase Voucher", 15, 25);
    
    // Voucher details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Voucher #: ${voucher.id}`, 15, 55);
    doc.text(`Date: ${new Date(voucher.date).toLocaleDateString()}`, 15, 65);
    doc.text(`Vendor: ${vendorName}`, 15, 75);
    
    // Items table
    autoTable(doc, {
      startY: 85,
      head: [["Item", "Quantity", "Rate", "Amount"]],
      body: voucher.items.map((item: any) => [
        item.name || "Item",
        item.quantity,
        `₹${item.rate.toFixed(2)}`,
        `₹${(item.quantity * item.rate).toFixed(2)}`
      ]),
      theme: "grid",
      headStyles: { fillColor: [139, 69, 19] }
    });
    
    doc.save(`Purchase_${voucher.id}.pdf`);
    toast.success("Purchase voucher PDF generated");
  } catch (error) {
    console.error("PDF error:", error);
    toast.error("Failed to generate PDF");
  }
}
