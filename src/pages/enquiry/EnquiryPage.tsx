"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MapPin,
  Phone,
  Calendar,
  DollarSign,
  MessageSquare,
  Search,
  Filter,
  RefreshCw,
  Loader2,
  X,
  Send,
  ChevronDown,
  Unlock,
} from "lucide-react";
import { useEnquiryManagement } from "@/hooks/useEnquiryManagement";
import { useAgentContext } from "@/context/AgentContext";
import { ExpiryTimer } from "@/components/ui/expiry-timer";

export default function AgentTableView() {
  const { userId } = useAgentContext();

  const {
    enquiries,
    loading,
    error,
    refetch,
    filteredEnquiries,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    clearFilters,
    isRefetching,
    isUpdating,
    isDeleting,
    updateError,
    deleteError,
    cancelEnquiry,
    stats,

    // Contact visibility function
    handleContactVisibility,
  } = useEnquiryManagement({ agentId: userId || "" });

  console.log("filteredEnquiries: ", filteredEnquiries);

  // Handler for expiry-triggered refetch with user feedback
  const handleExpiryRefetch = async () => {
    // Add a small delay to ensure backend queue has processed the expiration
    setTimeout(async () => {
      try {
        await refetch();
      } catch (error) {
        console.error('❌ Failed to refresh enquiries after expiry:', error);
      }
    }, 2000); // 2 second delay to ensure backend processing
  };
  const handleUnlockEnquiry = async (enquiryId: string) => {
    try {
      await handleContactVisibility(enquiryId, "unlock");
      console.log("Enquiry unlocked and status updated to AGENTVIEW");
    } catch (error) {
      console.error("Failed to unlock enquiry:", error);
    }
  };

  const handleContactEnquiry = async (enquiryId: string) => {
    try {
      await handleContactVisibility(enquiryId, "contact");
      console.log("Enquiry status updated to CONTACTED");
    } catch (error) {
      console.error("Failed to update enquiry status:", error);
    }
  };

  // State for cancel reason selection
  const [selectedReasons, setSelectedReasons] = useState<
    Record<string, string>
  >({});

  // Cancel reasons
  const cancelReasons = [
    "Vehicle not available",
    "Price too low",
    "Customer requirements not met",
    "Booking period conflict",
    "Maintenance required",
    "Other reasons",
  ];

  // Map UI reasons to API reason codes
  const getApiReasonCode = (uiReason: string): string => {
    const reasonMap: Record<string, string> = {
      "Vehicle not available": "VEHICLE_NOT_AVAILABLE",
      "Price too low": "PRICE_TOO_LOW",
      "Customer requirements not met": "CUSTOMER_REQUIREMENTS_NOT_MET",
      "Booking period conflict": "BOOKING_PERIOD_CONFLICT",
      "Maintenance required": "MAINTENANCE_REQUIRED",
      "Other reasons": "OTHER_REASONS",
    };
    return reasonMap[uiReason] || "OTHER_REASONS";
  };

  // Handler functions for cancel functionality
  const handleCancelSelect = (enquiryId: string, reason: string) => {
    setSelectedReasons((prev) => ({
      ...prev,
      [enquiryId]: reason,
    }));
  };

  const handleClearCancelSelection = (enquiryId: string) => {
    setSelectedReasons((prev) => {
      const newReasons = { ...prev };
      delete newReasons[enquiryId];
      return newReasons;
    });
  };

  const handleSendCancel = async (enquiryId: string) => {
    try {
      const selectedReason = getSelectedReason(enquiryId);
      const apiReasonCode = selectedReason
        ? getApiReasonCode(selectedReason)
        : undefined;

      await cancelEnquiry(enquiryId, apiReasonCode);
      // Clear the selected reason after sending
      handleClearCancelSelection(enquiryId);
      console.log("Enquiry cancelled successfully");
    } catch (error) {
      console.error("Failed to cancel enquiry:", error);
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString; // Return original if invalid date
      }
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString; // Return original if parsing fails
    }
  };

  // Helper function to format date only (no time)
  const formatDateOnly = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString; // Return original if invalid date
      }
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString; // Return original if parsing fails
    }
  };

  // Helper function to get selected reason for an enquiry
  const getSelectedReason = (enquiryId: string) => {
    return selectedReasons[enquiryId];
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return (
          <Badge className="bg-primary text-primary-foreground">New</Badge>
        );
      case "agentview":
        return <Badge className="bg-blue-500 text-white">Agent View</Badge>;
      case "contacted":
        return <Badge variant="secondary">Contacted</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      case "expired":
        return (
          <Badge
            className="text-white font-medium border-0"
            style={{ backgroundColor: "#f59e0b" }}
          >
            Expired
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-foreground">
                  Enquiry Management
                </h1>
                <p className="text-muted-foreground">
                  Manage customer enquiries and booking requests in table view.
                </p>
              </div>

              {/* Refresh Button */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refetch}
                  disabled={loading || isRefetching}
                  className="gap-2"
                >
                  {loading || isRefetching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  {isRefetching ? "Refreshing..." : "Refresh"}
                </Button>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-destructive font-medium">
                  Error loading enquiries
                </p>
                <p className="text-destructive/80 text-sm">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refetch}
                  className="mt-2"
                >
                  Try Again
                </Button>
              </div>
            )}

            {/* Mutation Status */}
            {(isUpdating || isDeleting) && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <p className="text-blue-700 font-medium">
                    {isUpdating
                      ? "Updating enquiry status..."
                      : "Processing request..."}
                  </p>
                </div>
              </div>
            )}

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              <div className="p-4 bg-card border rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {stats.total}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Enquiries
                </div>
              </div>
              <div className="p-4 bg-card border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.new}
                </div>
                <div className="text-sm text-muted-foreground">New</div>
              </div>
              <div className="p-4 bg-card border rounded-lg">
                <div className="text-2xl font-bold text-blue-500">
                  {stats.agentview}
                </div>
                <div className="text-sm text-muted-foreground">Agent View</div>
              </div>
              <div className="p-4 bg-card border rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {stats.contacted}
                </div>
                <div className="text-sm text-muted-foreground">Contacted</div>
              </div>
              <div className="p-4 bg-card border rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {stats.cancelled}
                </div>
                <div className="text-sm text-muted-foreground">Cancelled</div>
              </div>
              <div className="p-4 bg-card border rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.expired}
                </div>
                <div className="text-sm text-muted-foreground">Expired</div>
              </div>
              <div className="p-4 bg-card border rounded-lg border-orange-200 bg-orange-50">
                <div className="text-2xl font-bold text-orange-600">
                  {filteredEnquiries.filter(e => {
                    if (e.status !== 'new') return false;
                    const createdTime = new Date(e.createdAt).getTime();
                    const expiryTime = createdTime + (30 * 60 * 1000);
                    const now = Date.now();
                    const timeRemaining = expiryTime - now;
                    const minutesRemaining = Math.floor(timeRemaining / (1000 * 60));
                    return minutesRemaining <= 6 && minutesRemaining > 0; // Warning when 6 minutes or less remaining
                  }).length}
                </div>
                <div className="text-sm text-orange-700 font-medium">Expiring Soon</div>
              </div>
            </div>

            {/* Update/Delete Errors */}
            {(updateError || deleteError) && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-destructive font-medium">Action failed</p>
                <p className="text-destructive/80 text-sm">
                  {updateError || deleteError}
                </p>
              </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 p-4 bg-card rounded-lg border">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search enquiries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="agentview">Agent View</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
              {/* 
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select> */}

              {/* <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {uniqueLocations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select> */}

              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent"
                onClick={clearFilters}
              >
                <Filter className="h-4 w-4" />
                Clear Filters
              </Button>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Showing {filteredEnquiries.length} of {enquiries.length}{" "}
                enquiries
              </span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  New:{" "}
                  {filteredEnquiries.filter((e) => e.status === "new").length}
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Agent View:{" "}
                  {
                    filteredEnquiries.filter((e) => e.status === "agentview")
                      .length
                  }
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  Contacted:{" "}
                  {
                    filteredEnquiries.filter((e) => e.status === "contacted")
                      .length
                  }
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-destructive rounded-full"></div>
                  Cancelled:{" "}
                  {
                    filteredEnquiries.filter((e) => e.status === "cancelled")
                      .length
                  }
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Expired:{" "}
                  {
                    filteredEnquiries.filter((e) => e.status === "expired")
                      .length
                  }
                </span>
                <span className="flex items-center gap-1 text-orange-600 font-medium">
                  <div className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></div>
                  Expiring Soon:{" "}
                  {filteredEnquiries.filter(e => {
                    if (e.status !== 'new') return false;
                    const createdTime = new Date(e.createdAt).getTime();
                    const expiryTime = createdTime + (30 * 60 * 1000);
                    const now = Date.now();
                    const timeRemaining = expiryTime - now;
                    const minutesRemaining = Math.floor(timeRemaining / (1000 * 60));
                    return minutesRemaining <= 6 && minutesRemaining > 0;
                  }).length}
                </span>
              </div>
            </div>

            {/* Enquiries Table */}
            <div className="border rounded-lg bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Booking Details</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead>Enquiry Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Loading enquiries...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredEnquiries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="text-muted-foreground">
                          {enquiries.length === 0
                            ? "No enquiries found"
                            : "No enquiries match your filters"}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEnquiries.map((enquiry) => (
                      <TableRow key={enquiry.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          #{enquiry.id.slice(-6)}
                        </TableCell>

                        {/* Vehicle */}
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {/* <img
                              src={enquiry.car.image || "/placeholder.svg"}
                              alt={enquiry.car.name}
                              className="w-12 h-8 object-cover rounded"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/placeholder.svg";
                              }}
                            /> */}
                            <div>
                              <div className="font-medium text-sm">
                                {enquiry.car.name}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                {enquiry.car.location}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {enquiry.car.vehicleCode}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        {/* Customer */}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs bg-primary text-white font-medium">
                                {enquiry.customer.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm">
                                {enquiry.customer.name}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {enquiry.customer.phone}
                                </div>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {enquiry.customer.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        {/* Booking Details */}
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm">
                              <DollarSign className="h-3 w-3 text-primary" />
                              <span className="font-medium">
                                {enquiry.booking.price} AED/day
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {enquiry.booking.duration} days
                            </div>
                            <div className="text-xs font-medium text-primary">
                              Total: {enquiry.booking.totalAmount} AED
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatDateOnly(enquiry.booking.startDate)} -{" "}
                              {formatDateOnly(enquiry.booking.endDate)}
                            </div>
                          </div>
                        </TableCell>

                        {/* Status */}
                        <TableCell>{getStatusBadge(enquiry.status)}</TableCell>

                        {/* Expiry Timer */}
                        <TableCell>
                          <ExpiryTimer 
                            createdAt={enquiry.createdAt}
                            status={enquiry.status}
                            expiryMinutes={30}
                            onExpiry={handleExpiryRefetch} // Use enhanced refetch handler
                          />
                        </TableCell>

                        {/* Enquiry Date */}
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(enquiry.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {enquiry.status === "new" && (
                              <Button
                                size="sm"
                                className="gap-1"
                                onClick={() => handleUnlockEnquiry(enquiry.id)}
                                disabled={isUpdating}
                              >
                                <Unlock className="h-3 w-3" />
                                Unlock
                              </Button>
                            )}
                            {enquiry.status === "agentview" && (
                              <Button
                                size="sm"
                                className="gap-1"
                                onClick={() => handleContactEnquiry(enquiry.id)}
                                disabled={isUpdating}
                              >
                                <Phone className="h-3 w-3" />
                                Contact
                              </Button>
                            )}
                            {enquiry.status === "contacted" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1 bg-transparent"
                                >
                                  <MessageSquare className="h-3 w-3" />
                                  Follow Up
                                </Button>
                                <div className="flex items-center gap-1">
                                  {getSelectedReason(enquiry.id) ? (
                                    <div className="flex items-center gap-1 bg-destructive/10 border border-destructive/20 rounded-md px-2 py-1">
                                      <span className="text-xs text-destructive font-medium">
                                        {getSelectedReason(enquiry.id)}
                                      </span>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 w-6 p-0 hover:bg-destructive/20"
                                        onClick={() =>
                                          handleClearCancelSelection(enquiry.id)
                                        }
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        className="h-6 px-2 gap-1 ml-1"
                                        onClick={() =>
                                          handleSendCancel(enquiry.id)
                                        }
                                      >
                                        <Send className="h-3 w-3" />
                                        Send
                                      </Button>
                                    </div>
                                  ) : (
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          size="sm"
                                          variant="destructive"
                                          className="gap-1"
                                        >
                                          Cancel
                                          <ChevronDown className="h-3 w-3" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent
                                        align="end"
                                        className="w-56"
                                      >
                                        {cancelReasons.map((reason) => (
                                          <DropdownMenuItem
                                            key={reason}
                                            onClick={() =>
                                              handleCancelSelect(
                                                enquiry.id,
                                                reason
                                              )
                                            }
                                            className="cursor-pointer hover:bg-destructive/10 focus:bg-destructive/10"
                                          >
                                            {reason}
                                          </DropdownMenuItem>
                                        ))}
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
