import { Button } from "@/components/ui/button";
import { CreditCard, Banknote, Smartphone, QrCode } from "lucide-react";

type PaymentMethodType = 'cash' | 'card' | 'digital' | 'mpesa_till' | 'mpesa_paybill';

interface PaymentMethodsProps {
  onPaymentSelect: (method: PaymentMethodType) => void;
  selectedMethod?: PaymentMethodType;
}

export function PaymentMethods({ onPaymentSelect, selectedMethod }: PaymentMethodsProps) {
  const paymentMethods: { id: PaymentMethodType; label: string; icon: any; color: string }[] = [
    { id: 'cash', label: 'Cash', icon: Banknote, color: 'bg-green-600' },
    { id: 'card', label: 'Card', icon: CreditCard, color: 'bg-blue-600' },
    { id: 'mpesa_till', label: 'M-Pesa Till', icon: Smartphone, color: 'bg-green-700' },
    { id: 'mpesa_paybill', label: 'M-Pesa PayBill', icon: Smartphone, color: 'bg-green-800' },
    { id: 'digital', label: 'QR / Digital', icon: QrCode, color: 'bg-purple-600' },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {paymentMethods.map((method) => {
        const Icon = method.icon;
        const isSelected = selectedMethod === method.id;

        return (
          <Button
            key={method.id}
            variant={isSelected ? "default" : "outline"}
            onClick={() => onPaymentSelect(method.id)}
            className={`h-16 flex-col gap-2 ${isSelected ? method.color : ''}`}
            aria-pressed={isSelected}
          >
            <Icon className="h-5 w-5" />
            <span className="text-xs text-white">{method.label}</span>
          </Button>
        );
      })}
    </div>
  );
}
