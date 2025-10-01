import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, MessageSquare } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface ContactVisibilityControlsProps {
  enquiryId: string;
  enquiryStatus: string;
  isMasked?: boolean;
  onShowContactDetails: (enquiryId: string) => Promise<void>;
  onHideContactDetails: (enquiryId: string) => Promise<void>;
  onMarkAsContacted: (enquiryId: string) => Promise<void>;
  onMarkAsAgentViewed: (enquiryId: string) => Promise<void>;
  isLoading?: boolean;
}

export const ContactVisibilityControls: React.FC<ContactVisibilityControlsProps> = ({
  enquiryId,
  enquiryStatus: _enquiryStatus,
  isMasked = true,
  onShowContactDetails,
  onHideContactDetails,
  onMarkAsContacted,
  onMarkAsAgentViewed,
  isLoading = false,
}) => {
  return (
    <div className="flex items-center gap-2">
      {/* Contact Visibility Toggle */}
      {isMasked ? (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onShowContactDetails(enquiryId)}
          disabled={isLoading}
          className="gap-2 text-xs"
          title="Show contact details"
        >
          <Eye className="h-3 w-3" />
          Show Contact
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onHideContactDetails(enquiryId)}
          disabled={isLoading}
          className="gap-2 text-xs"
          title="Hide contact details"
        >
          <EyeOff className="h-3 w-3" />
          Hide Contact
        </Button>
      )}

      {/* Quick Actions Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={isLoading}
            className="gap-2 text-xs"
          >
            <MessageSquare className="h-3 w-3" />
            Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onMarkAsAgentViewed(enquiryId)}>
            <Eye className="h-4 w-4 mr-2" />
            Mark as Agent Viewed
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onMarkAsContacted(enquiryId)}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Mark as Contacted
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onShowContactDetails(enquiryId)}>
            <Eye className="h-4 w-4 mr-2" />
            Show Contact Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onHideContactDetails(enquiryId)}>
            <EyeOff className="h-4 w-4 mr-2" />
            Hide Contact Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ContactVisibilityControls;
