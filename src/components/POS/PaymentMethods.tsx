
import { Button } from "@/components/ui/button";
import { CreditCard, Banknote, Smartphone, QrCode } from "lucide-react";

interface PaymentMethodsProps {
  onPaymentSelect: (method: 'cash' | 'card' | 'digital' | 'mpesa') => void;
  selectedMethod?: string;
}

export function PaymentMethods({ onPaymentSelect, selectedMethod }: PaymentMethodsProps) {
  const paymentMethods = [
    { id: 'cash', label: 'Cash', icon: Banknote, color: 'bg-green-600' },
    { id: 'card', label: 'Card', icon: CreditCard, color: 'bg-blue-600' },
    { id: 'mpesa', label: 'M-Pesa Till', icon: Smartphone, color: 'bg-green-700' },
    { id: 'digital', label: 'Digital', icon: QrCode, color: 'bg-purple-600' },
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
            onClick={() => onPaymentSelect(method.id as any)}
            className={`h-16 flex-col gap-2 ${isSelected ? method.color : ''}`}
          >
            <Icon className="h-5 w-5" />
            <span className="text-xs">{method.label}</span>
          </Button>
        );
      })}
    </div>
  );
}
