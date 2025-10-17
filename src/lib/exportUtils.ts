import { toast } from "sonner";

// Export data to CSV
export function exportToCSV(data: any[], filename: string) {
  try {
    if (!data || data.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Handle special characters and commas
          if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value ?? '';
        }).join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Data exported successfully");
  } catch (error) {
    console.error("Export error:", error);
    toast.error("Failed to export data");
  }
}

// Export to JSON for backup
export function exportToJSON(data: any, filename: string) {
  try {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Backup created successfully");
  } catch (error) {
    console.error("Export error:", error);
    toast.error("Failed to create backup");
  }
}

// Print function for invoices
export function printInvoice(invoiceId: string) {
  const printContent = document.getElementById(`invoice-${invoiceId}`);
  if (!printContent) {
    toast.error("Invoice not found");
    return;
  }

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    toast.error("Please allow pop-ups to print");
    return;
  }

  printWindow.document.write(`
    <html>
      <head>
        <title>Invoice ${invoiceId}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f4f4f4; }
          .header { margin-bottom: 20px; }
          .total { font-weight: bold; font-size: 1.2em; }
          @media print {
            button { display: none; }
          }
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
        <button onclick="window.print()">Print</button>
      </body>
    </html>
  `);
  
  printWindow.document.close();
  printWindow.focus();
}
