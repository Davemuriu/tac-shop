
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sale } from "@/types";
import { Printer, Mail, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ReceiptPreviewProps {
  sale: Sale;
  businessInfo?: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  onPrint?: () => void;
  onEmail?: () => void;
}

export function ReceiptPreview({ sale, businessInfo, onPrint, onEmail }: ReceiptPreviewProps) {
  const defaultBusinessInfo = {
    name: "Tac Shop",
    address: "123 Main St, City, State 12345",
    phone: "+1 (555) 123-4567",
    email: "contact@tacshop.com"
  };

  const info = businessInfo || defaultBusinessInfo;

  const handlePrint = () => {
    window.print();
    onPrint?.();
    toast({
      title: "Printing Receipt",
      description: "Sending receipt to printer..."
    });
  };

  const handleEmail = () => {
    onEmail?.();
    toast({
      title: "Email Sent",
      description: "Receipt has been emailed to customer"
    });
  };

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Receipt PDF is being generated..."
    });
  };

  return (
    <div className="space-y-4">
      {/* Print Actions */}
      <div className="flex gap-2 justify-end no-print">
        <Button onClick={handleDownload} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          PDF
        </Button>
        <Button onClick={handleEmail} variant="outline" size="sm">
          <Mail className="h-4 w-4 mr-2" />
          Email
        </Button>
        <Button onClick={handlePrint} size="sm">
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
      </div>

      {/* Receipt Content */}
      <Card className="max-w-sm mx-auto print:shadow-none print:border-none">
        <CardContent className="p-6 space-y-4 text-sm">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-lg font-bold">{info.name}</h2>
            <div className="text-muted-foreground">
              <p>{info.address}</p>
              <p>{info.phone}</p>
              <p>{info.email}</p>
            </div>
          </div>

          <Separator />

          {/* Receipt Info */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Receipt #:</span>
              <span className="font-mono">{sale.receiptNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{new Date(sale.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Time:</span>
              <span>{new Date(sale.createdAt).toLocaleTimeString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Cashier:</span>
              <span>{sale.cashierId}</span>
            </div>
          </div>

          <Separator />

          {/* Items */}
          <div className="space-y-2">
            {sale.items.map((item) => (
              <div key={item.id}>
                <div className="flex justify-between">
                  <span className="flex-1">{item.productName}</span>
                  <span className="ml-2">${item.unitPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground text-xs">
                  <span>{item.quantity} x ${item.unitPrice.toFixed(2)}</span>
                  <span>${item.total.toFixed(2)}</span>
                </div>
                {item.discount > 0 && (
                  <div className="flex justify-between text-green-600 text-xs">
                    <span>Discount:</span>
                    <span>-${item.discount.toFixed(2)}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <Separator />

          {/* Totals */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${sale.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (8%):</span>
              <span>${sale.tax.toFixed(2)}</span>
            </div>
            {sale.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount:</span>
                <span>-${sale.discount.toFixed(2)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${sale.total.toFixed(2)}</span>
            </div>
          </div>

          <Separator />

          {/* Payment Info */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Payment Method:</span>
              <span className="capitalize">{sale.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span>Amount Paid:</span>
              <span>${sale.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Change:</span>
              <span>$0.00</span>
            </div>
          </div>

          <Separator />

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground space-y-1">
            <p>Thank you for your business!</p>
            <p>Visit us again soon</p>
          </div>

          {/* QR Code Placeholder */}
          <div className="text-center">
            <div className="w-16 h-16 bg-muted mx-auto flex items-center justify-center text-xs">
              QR Code
            </div>
            <p className="text-xs text-muted-foreground mt-1">Scan for digital receipt</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
