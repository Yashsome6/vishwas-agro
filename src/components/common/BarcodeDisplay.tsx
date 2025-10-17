import { useEffect, useRef } from "react";
import Barcode from "react-barcode";
import { Card } from "@/components/ui/card";

interface BarcodeDisplayProps {
  value: string;
  displayValue?: boolean;
  width?: number;
  height?: number;
}

export default function BarcodeDisplay({ 
  value, 
  displayValue = true, 
  width = 2, 
  height = 50
}: BarcodeDisplayProps) {
  return (
    <div className="inline-flex items-center justify-center p-2 bg-background border rounded">
      <Barcode 
        value={value}
        width={width}
        height={height}
        displayValue={displayValue}
        background="transparent"
        lineColor="hsl(var(--foreground))"
      />
    </div>
  );
}

// Component to print barcode
export function PrintableBarcode({ value, itemName }: { value: string; itemName: string }) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Barcode - ${itemName}</title>
          <style>
            body { 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              height: 100vh;
              margin: 0;
              font-family: Arial, sans-serif;
            }
            .barcode-container {
              text-align: center;
              padding: 20px;
              border: 2px dashed #000;
            }
            @media print {
              body { height: auto; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 100);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div>
      <button 
        onClick={handlePrint}
        className="text-sm px-3 py-1 bg-primary text-primary-foreground rounded hover:opacity-90"
      >
        Print Barcode
      </button>
      <div ref={printRef} style={{ display: 'none' }}>
        <div className="barcode-container">
          <h3>{itemName}</h3>
          <Barcode value={value} />
        </div>
      </div>
    </div>
  );
}
