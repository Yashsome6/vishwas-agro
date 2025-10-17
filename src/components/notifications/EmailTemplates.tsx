import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Send, Save } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const EMAIL_TEMPLATES = {
  lowStock: {
    subject: "Low Stock Alert - {itemName}",
    body: `Dear Team,

This is an automated alert to notify you that the following item is running low on stock:

Item: {itemName}
Current Quantity: {currentQty}
Minimum Quantity: {minQty}
Warehouse: {warehouse}

Please arrange for restocking at the earliest.

Best regards,
Agro Seeds Enterprise`
  },
  reorderSuggestion: {
    subject: "Reorder Suggestion - {itemName}",
    body: `Dear Procurement Team,

Based on our smart reorder calculations, we suggest placing an order for:

Item: {itemName}
Suggested Reorder Quantity: {reorderQty}
Estimated Cost: ₹{estimatedCost}
Urgency: {urgency}

Please review and place the purchase order.

Best regards,
Inventory Management System`
  },
  paymentReminder: {
    subject: "Payment Reminder - Invoice {invoiceId}",
    body: `Dear {customerName},

This is a friendly reminder regarding the pending payment for:

Invoice Number: {invoiceId}
Invoice Date: {invoiceDate}
Amount Due: ₹{amountDue}
Due Date: {dueDate}

Please process the payment at your earliest convenience.

Thank you,
Agro Seeds Enterprise`
  },
  orderConfirmation: {
    subject: "Order Confirmation - {orderId}",
    body: `Dear {customerName},

Thank you for your order! Here are the details:

Order Number: {orderId}
Order Date: {orderDate}
Total Amount: ₹{totalAmount}
Payment Status: {paymentStatus}

We will process your order shortly.

Best regards,
Agro Seeds Enterprise`
  }
};

export default function EmailTemplates() {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof EMAIL_TEMPLATES>("lowStock");
  const [emailData, setEmailData] = useState({
    to: "",
    subject: EMAIL_TEMPLATES.lowStock.subject,
    body: EMAIL_TEMPLATES.lowStock.body
  });

  const handleTemplateChange = (template: keyof typeof EMAIL_TEMPLATES) => {
    setSelectedTemplate(template);
    setEmailData({
      ...emailData,
      subject: EMAIL_TEMPLATES[template].subject,
      body: EMAIL_TEMPLATES[template].body
    });
  };

  const handleSend = () => {
    // Frontend only - simulate sending
    toast({ 
      title: "Email Sent", 
      description: "Email notification has been queued for delivery" 
    });
  };

  const handleSaveTemplate = () => {
    toast({ 
      title: "Template Saved", 
      description: "Email template has been saved successfully" 
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notification Templates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Template Type</Label>
            <Select value={selectedTemplate} onValueChange={(v) => handleTemplateChange(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lowStock">Low Stock Alert</SelectItem>
                <SelectItem value="reorderSuggestion">Reorder Suggestion</SelectItem>
                <SelectItem value="paymentReminder">Payment Reminder</SelectItem>
                <SelectItem value="orderConfirmation">Order Confirmation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>To</Label>
            <Input 
              placeholder="recipient@example.com"
              value={emailData.to}
              onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
            />
          </div>

          <div>
            <Label>Subject</Label>
            <Input 
              value={emailData.subject}
              onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
            />
          </div>

          <div>
            <Label>Email Body</Label>
            <Textarea 
              rows={12}
              value={emailData.body}
              onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Use placeholders like {"{itemName}"}, {"{currentQty}"}, {"{customerName}"} - they will be replaced with actual values
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSend} className="flex-1">
              <Send className="h-4 w-4 mr-2" />
              Send Email
            </Button>
            <Button onClick={handleSaveTemplate} variant="outline">
              <Save className="h-4 w-4 mr-2" />
              Save Template
            </Button>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm font-semibold mb-2">📧 Demo Mode</p>
            <p className="text-xs text-muted-foreground">
              This is a frontend email template manager. To actually send emails, you would need backend integration with services like SendGrid, AWS SES, or similar email providers.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Email Variables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            <code className="bg-muted px-2 py-1 rounded">{"{itemName}"}</code>
            <code className="bg-muted px-2 py-1 rounded">{"{currentQty}"}</code>
            <code className="bg-muted px-2 py-1 rounded">{"{minQty}"}</code>
            <code className="bg-muted px-2 py-1 rounded">{"{warehouse}"}</code>
            <code className="bg-muted px-2 py-1 rounded">{"{reorderQty}"}</code>
            <code className="bg-muted px-2 py-1 rounded">{"{estimatedCost}"}</code>
            <code className="bg-muted px-2 py-1 rounded">{"{customerName}"}</code>
            <code className="bg-muted px-2 py-1 rounded">{"{invoiceId}"}</code>
            <code className="bg-muted px-2 py-1 rounded">{"{amountDue}"}</code>
            <code className="bg-muted px-2 py-1 rounded">{"{dueDate}"}</code>
            <code className="bg-muted px-2 py-1 rounded">{"{orderId}"}</code>
            <code className="bg-muted px-2 py-1 rounded">{"{totalAmount}"}</code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
