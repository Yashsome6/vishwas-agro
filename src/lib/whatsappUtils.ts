import { toast } from "sonner";

// Share invoice via WhatsApp
export function shareOnWhatsApp(invoiceData: any, customerPhone?: string) {
  try {
    const message = `
🧾 *Invoice Details*

Invoice #: ${invoiceData.id}
Date: ${new Date(invoiceData.date).toLocaleDateString()}
Customer: ${invoiceData.customerName}

📦 *Items*
${invoiceData.items.map((item: any, index: number) => 
  `${index + 1}. ${item.name} - Qty: ${item.quantity} x ₹${item.rate} = ₹${item.amount.toFixed(2)}`
).join('\n')}

💰 *Summary*
Subtotal: ₹${invoiceData.subtotal.toFixed(2)}
CGST (9%): ₹${invoiceData.cgst.toFixed(2)}
SGST (9%): ₹${invoiceData.sgst.toFixed(2)}
*Total: ₹${invoiceData.total.toFixed(2)}*

Payment Status: ${invoiceData.paymentStatus.toUpperCase()}

Thank you for your business! 🙏
    `.trim();

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = customerPhone ? customerPhone.replace(/\D/g, '') : '';
    
    // Open WhatsApp with pre-filled message
    const whatsappUrl = phoneNumber 
      ? `https://wa.me/${phoneNumber}?text=${encodedMessage}`
      : `https://wa.me/?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    toast.success("Opening WhatsApp...");
  } catch (error) {
    console.error("WhatsApp share error:", error);
    toast.error("Failed to share on WhatsApp");
  }
}

// Share payment reminder
export function sharePaymentReminder(customerName: string, amount: number, invoiceId: string, phone?: string) {
  const message = `
Dear ${customerName},

This is a friendly reminder regarding your pending payment.

Invoice #: ${invoiceId}
Amount Due: ₹${amount.toLocaleString()}

Please make the payment at your earliest convenience.

Thank you!
  `.trim();

  const encodedMessage = encodeURIComponent(message);
  const phoneNumber = phone ? phone.replace(/\D/g, '') : '';
  const whatsappUrl = phoneNumber 
    ? `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    : `https://wa.me/?text=${encodedMessage}`;
  
  window.open(whatsappUrl, '_blank');
}
