import React from "react";
import { Phone, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ContactInfoDisplayProps {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  isMasked?: boolean;
  className?: string;
}

const maskEmail = (email: string): string => {
  if (!email || email.length <= 2) return email;
  const [username, domain] = email.split('@');
  if (!username || !domain) return email;
  
  const maskedUsername = username.length > 2 
    ? username.substring(0, 2) + '*'.repeat(Math.max(username.length - 2, 1))
    : username;
  
  return `${maskedUsername}@${domain}`;
};

const maskPhone = (phone: string): string => {
  if (!phone || phone.length <= 5) return phone;
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length < 6) return phone;
  
  const firstPart = cleanPhone.substring(0, 3);
  const lastPart = cleanPhone.substring(cleanPhone.length - 2);
  const maskedMiddle = '*'.repeat(Math.max(cleanPhone.length - 5, 1));
  
  return `${firstPart}${maskedMiddle}${lastPart}`;
};

export const ContactInfoDisplay: React.FC<ContactInfoDisplayProps> = ({
  customerName,
  customerEmail,
  customerPhone,
  isMasked = true,
  className = "",
}) => {
  const displayEmail = isMasked ? maskEmail(customerEmail) : customerEmail;
  const displayPhone = isMasked ? maskPhone(customerPhone) : customerPhone;

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="font-medium text-sm">{customerName}</div>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Mail className="h-3 w-3" />
        <span className="font-mono">{displayEmail}</span>
        {isMasked && (
          <Badge variant="secondary" className="text-xs px-1 py-0">
            Masked
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Phone className="h-3 w-3" />
        <span className="font-mono">{displayPhone}</span>
        {isMasked && (
          <Badge variant="secondary" className="text-xs px-1 py-0">
            Masked
          </Badge>
        )}
      </div>
      {!isMasked && (
        <Badge variant="outline" className="text-xs">
          Contact Visible
        </Badge>
      )}
    </div>
  );
};

export default ContactInfoDisplay;
