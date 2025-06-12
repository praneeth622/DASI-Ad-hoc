import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Clock, Eye, User, Calendar, MapPin } from 'lucide-react';
import { useClaimsContext, Claim } from '@/contexts/ClaimsContext';

interface RecruiterDashboardProps {
  userEmail: string;
  userName: string;
}

const RecruiterDashboard = ({ userEmail, userName }: RecruiterDashboardProps) => {
  const { getAllClaims, updateClaimStatus } = useClaimsContext();
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionType, setActionType] = useState<'approved' | 'rejected'>('approved');

  const allClaims = getAllClaims();
  const pendingClaims = allClaims.filter(claim => claim.status === 'pending');
  const approvedClaims = allClaims.filter(claim => claim.status === 'approved');
  const rejectedClaims = allClaims.filter(claim => claim.status === 'rejected');

  const handleClaimAction = (claim: Claim, action: 'approved' | 'rejected') => {
    setSelectedClaim(claim);
    setActionType(action);
    setRejectionReason('');
    setIsReviewModalOpen(true);
  };

  const confirmAction = () => {
    if (selectedClaim) {
      updateClaimStatus(
        selectedClaim.id,
        actionType,
        userName,
        actionType === 'rejected' ? rejectionReason : undefined
      );
      setIsReviewModalOpen(false);
      setSelectedClaim(null);
      setRejectionReason('');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const ClaimCard = ({ claim, showActions = false }: { claim: Claim; showActions?: boolean }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-500" />
            <span className="font-medium">{claim.employeeName}</span>
          </div>
          {getStatusBadge(claim.status)}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>{claim.travelDate}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>{claim.fromLocation} → {claim.toLocation}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm">
              <span className="text-gray-500">Mode:</span> {claim.mode}
            </div>
            <div className="text-sm">
              <span className="text-gray-500">Amount:</span> <span className="font-semibold">${claim.finalAmount}</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedClaim(claim);
              // You could open a detailed view modal here
            }}
          >
            <Eye className="w-4 h-4 mr-1" />
            View Details
          </Button>
          {showActions && claim.status === 'pending' && (
            <>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handleClaimAction(claim, 'approved')}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleClaimAction(claim, 'rejected')}
              >
                <XCircle className="w-4 h-4 mr-1" />
                Reject
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recruiter Dashboard</h1>
          <p className="text-gray-600">Welcome back, {userName}</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Claims</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allClaims.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingClaims.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedClaims.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{rejectedClaims.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Claims Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2 text-yellow-600" />
            Pending Claims ({pendingClaims.length})
          </CardTitle>
          <CardDescription>
            Claims awaiting your review and approval
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingClaims.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No pending claims to review</p>
          ) : (
            pendingClaims.map(claim => (
              <ClaimCard key={claim.id} claim={claim} showActions={true} />
            ))
          )}
        </CardContent>
      </Card>

      {/* All Claims Section */}
      <Card>
        <CardHeader>
          <CardTitle>All Claims</CardTitle>
          <CardDescription>
            Complete history of all submitted claims
          </CardDescription>
        </CardHeader>
        <CardContent>
          {allClaims.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No claims submitted yet</p>
          ) : (
            allClaims.map(claim => (
              <ClaimCard key={claim.id} claim={claim} />
            ))
          )}
        </CardContent>
      </Card>

      {/* Review Modal */}
      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approved' ? 'Approve Claim' : 'Reject Claim'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approved' 
                ? 'Are you sure you want to approve this claim?' 
                : 'Please provide a reason for rejecting this claim.'
              }
            </DialogDescription>
          </DialogHeader>
          
          {selectedClaim && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Claim Details</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Employee:</strong> {selectedClaim.employeeName}</p>
                  <p><strong>Date:</strong> {selectedClaim.travelDate}</p>
                  <p><strong>Route:</strong> {selectedClaim.fromLocation} → {selectedClaim.toLocation}</p>
                  <p><strong>Amount:</strong> ${selectedClaim.finalAmount}</p>
                </div>
              </div>
              
              {actionType === 'rejected' && (
                <div className="space-y-2">
                  <Label htmlFor="rejection-reason">Reason for Rejection</Label>
                  <Textarea
                    id="rejection-reason"
                    placeholder="Please explain why this claim is being rejected..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    required
                  />
                </div>
              )}
              
              <div className="flex space-x-2 justify-end">
                <Button variant="outline" onClick={() => setIsReviewModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={confirmAction}
                  className={actionType === 'approved' ? 'bg-green-600 hover:bg-green-700' : ''}
                  variant={actionType === 'rejected' ? 'destructive' : 'default'}
                  disabled={actionType === 'rejected' && !rejectionReason.trim()}
                >
                  {actionType === 'approved' ? 'Approve' : 'Reject'} Claim
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecruiterDashboard;
