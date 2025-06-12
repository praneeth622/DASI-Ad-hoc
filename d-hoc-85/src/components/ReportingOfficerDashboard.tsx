
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileText, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Claim {
  id: string;
  employeeName: string;
  employeeEmail: string;
  mode: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  amount: number;
  reason: string;
  fromLocation: string;
  toLocation: string;
  departureTime: string;
  arrivalTime: string;
  reasonDetails?: string;
  receiptNumber?: string;
  receiptAmount?: string;
  parkingFee?: string;
  erp?: string;
  submittedDate: string;
}

const ReportingOfficerDashboard = () => {
  const { toast } = useToast();
  const [claims, setClaims] = useState<Claim[]>([
    {
      id: '1',
      employeeName: 'John Doe',
      employeeEmail: 'john.doe@company.com',
      mode: 'Taxi / Private Hire',
      date: '2024-06-10',
      status: 'pending',
      amount: 25.50,
      reason: 'Overtime',
      fromLocation: 'Home',
      toLocation: 'Office',
      departureTime: '22:30',
      arrivalTime: '23:00',
      reasonDetails: 'Had to stay late to complete urgent project deliverables',
      receiptNumber: 'TX123456',
      receiptAmount: '25.50',
      submittedDate: '2024-06-11'
    },
    {
      id: '2',
      employeeName: 'Jane Smith',
      employeeEmail: 'jane.smith@company.com',
      mode: 'Car',
      date: '2024-06-08',
      status: 'pending',
      amount: 15.00,
      reason: 'Required to report to work before 6:30 am',
      fromLocation: 'Home',
      toLocation: 'Office',
      departureTime: '06:00',
      arrivalTime: '06:25',
      reasonDetails: 'Early morning system maintenance',
      parkingFee: '5.00',
      submittedDate: '2024-06-09'
    },
    {
      id: '3',
      employeeName: 'Mike Johnson',
      employeeEmail: 'mike.johnson@company.com',
      mode: 'Bus / MRT / LRT',
      date: '2024-06-05',
      status: 'approved',
      amount: 8.50,
      reason: 'Overtime',
      fromLocation: 'Office',
      toLocation: 'Home',
      departureTime: '21:00',
      arrivalTime: '21:45',
      receiptAmount: '8.50',
      submittedDate: '2024-06-06'
    }
  ]);

  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const pendingClaims = claims.filter(c => c.status === 'pending');
  const approvedClaims = claims.filter(c => c.status === 'approved');
  const rejectedClaims = claims.filter(c => c.status === 'rejected');

  const handleApproveClaim = (claimId: string) => {
    setClaims(prev =>
      prev.map(claim =>
        claim.id === claimId ? { ...claim, status: 'approved' as const } : claim
      )
    );
    toast({
      title: "Claim Approved",
      description: "The transport claim has been approved successfully.",
    });
  };

  const handleRejectClaim = (claimId: string) => {
    setClaims(prev =>
      prev.map(claim =>
        claim.id === claimId ? { ...claim, status: 'rejected' as const } : claim
      )
    );
    setShowRejectDialog(false);
    setRejectionReason('');
    toast({
      title: "Claim Rejected",
      description: "The transport claim has been rejected.",
      variant: "destructive",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };
    
    return (
      <Badge className={`${variants[status as keyof typeof variants]} capitalize`}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reporting Officer Dashboard</h1>
          <p className="text-slate-600">Review and manage transport claims</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Clock className="h-5 w-5 mr-2 text-yellow-600" />
              Pending
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-slate-900">
              {pendingClaims.length}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
              Approved
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-slate-900">
              {approvedClaims.length}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <XCircle className="h-5 w-5 mr-2 text-red-600" />
              Rejected
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-slate-900">
              {rejectedClaims.length}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              Total Claims
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-slate-900">
              {claims.length}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Pending Claims */}
      {pendingClaims.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-yellow-600" />
              Claims Requiring Review
            </CardTitle>
            <CardDescription>Review and approve or reject pending claims</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingClaims.map((claim) => (
                <div key={claim.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">{claim.employeeName}</h3>
                      <p className="text-sm text-slate-600">{claim.employeeEmail}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-slate-900">${claim.amount.toFixed(2)}</span>
                      {getStatusBadge(claim.status)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <span className="font-medium text-slate-600">Transport:</span>
                      <p className="text-slate-900">{claim.mode}</p>
                    </div>
                    <div>
                      <span className="font-medium text-slate-600">Date:</span>
                      <p className="text-slate-900">{claim.date}</p>
                    </div>
                    <div>
                      <span className="font-medium text-slate-600">Route:</span>
                      <p className="text-slate-900">{claim.fromLocation} → {claim.toLocation}</p>
                    </div>
                    <div>
                      <span className="font-medium text-slate-600">Reason:</span>
                      <p className="text-slate-900">{claim.reason}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Claim Details</DialogTitle>
                          <DialogDescription>
                            Review all claim information before making a decision
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-slate-600">Employee:</span>
                              <p className="text-slate-900">{claim.employeeName}</p>
                            </div>
                            <div>
                              <span className="font-medium text-slate-600">Email:</span>
                              <p className="text-slate-900">{claim.employeeEmail}</p>
                            </div>
                            <div>
                              <span className="font-medium text-slate-600">Mode:</span>
                              <p className="text-slate-900">{claim.mode}</p>
                            </div>
                            <div>
                              <span className="font-medium text-slate-600">Travel Date:</span>
                              <p className="text-slate-900">{claim.date}</p>
                            </div>
                            <div>
                              <span className="font-medium text-slate-600">Departure:</span>
                              <p className="text-slate-900">{claim.departureTime}</p>
                            </div>
                            <div>
                              <span className="font-medium text-slate-600">Arrival:</span>
                              <p className="text-slate-900">{claim.arrivalTime}</p>
                            </div>
                            <div>
                              <span className="font-medium text-slate-600">From:</span>
                              <p className="text-slate-900">{claim.fromLocation}</p>
                            </div>
                            <div>
                              <span className="font-medium text-slate-600">To:</span>
                              <p className="text-slate-900">{claim.toLocation}</p>
                            </div>
                            <div>
                              <span className="font-medium text-slate-600">Reason:</span>
                              <p className="text-slate-900">{claim.reason}</p>
                            </div>
                            <div>
                              <span className="font-medium text-slate-600">Total Amount:</span>
                              <p className="text-slate-900 font-semibold">${claim.amount.toFixed(2)}</p>
                            </div>
                          </div>
                          
                          {claim.reasonDetails && (
                            <div>
                              <span className="font-medium text-slate-600">Additional Details:</span>
                              <p className="text-slate-900 mt-1">{claim.reasonDetails}</p>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleApproveClaim(claim.id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedClaim(claim);
                          setShowRejectDialog(true);
                        }}
                        variant="destructive"
                        size="sm"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Claims */}
      <Card>
        <CardHeader>
          <CardTitle>All Claims History</CardTitle>
          <CardDescription>Complete history of all transport claims</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {claims.map((claim) => (
              <div key={claim.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(claim.status)}
                  <div>
                    <p className="font-medium text-slate-900">{claim.employeeName}</p>
                    <p className="text-sm text-slate-600">{claim.mode} • {claim.date} • {claim.reason}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-slate-900">${claim.amount.toFixed(2)}</span>
                  {getStatusBadge(claim.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Claim</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this claim
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Enter reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => selectedClaim && handleRejectClaim(selectedClaim.id)}
                disabled={!rejectionReason.trim()}
              >
                Reject Claim
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportingOfficerDashboard;
