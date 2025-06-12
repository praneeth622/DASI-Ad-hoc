
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Clock, CheckCircle, XCircle, FileText } from 'lucide-react';
import ClaimForm from './ClaimForm';
import ClaimSummaryModal from './ClaimSummaryModal';
import { useClaimsContext } from '@/contexts/ClaimsContext';

interface EmployeeDashboardProps {
  userEmail: string;
  userName: string;
}

const EmployeeDashboard = ({ userEmail, userName }: EmployeeDashboardProps) => {
  const { getClaimsByEmployee } = useClaimsContext();
  const [currentView, setCurrentView] = useState('dashboard');
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [latestClaim, setLatestClaim] = useState<any>(null);

  const claims = getClaimsByEmployee(userEmail);

  const handleClaimSubmit = (claimData: any) => {
    setLatestClaim(claimData);
    setShowSummaryModal(true);
    setCurrentView('dashboard');
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

  if (currentView === 'new-claim') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">New Transport Claim</h1>
            <p className="text-slate-600">Submit a new ad-hoc transport claim</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setCurrentView('dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>
        <ClaimForm onSubmit={handleClaimSubmit} userEmail={userEmail} userName={userName} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Employee Dashboard</h1>
          <p className="text-slate-600">Welcome back, {userName}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setCurrentView('new-claim')}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <PlusCircle className="h-5 w-5 mr-2 text-blue-600" />
              Add New Claim
            </CardTitle>
            <CardDescription>Submit a new transport claim</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <FileText className="h-5 w-5 mr-2 text-green-600" />
              Total Claims
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-slate-900">
              {claims.length}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Clock className="h-5 w-5 mr-2 text-yellow-600" />
              Pending Claims
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-slate-900">
              {claims.filter(c => c.status === 'pending').length}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Recent Claims */}
      <Card>
        <CardHeader>
          <CardTitle>Your Claims</CardTitle>
          <CardDescription>Your transport claim submissions and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {claims.map((claim) => (
              <div key={claim.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(claim.status)}
                  <div>
                    <p className="font-medium text-slate-900">{claim.mode}</p>
                    <p className="text-sm text-slate-600">{claim.travelDate} • {claim.reason}</p>
                    <p className="text-xs text-slate-500">{claim.fromLocation} → {claim.toLocation}</p>
                    {claim.rejectionReason && (
                      <p className="text-xs text-red-600 mt-1">Reason: {claim.rejectionReason}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-slate-900">${claim.finalAmount}</span>
                  {getStatusBadge(claim.status)}
                </div>
              </div>
            ))}
            {claims.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <FileText className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                <p>No claims submitted yet</p>
                <Button
                  variant="outline"
                  onClick={() => setCurrentView('new-claim')}
                  className="mt-3"
                >
                  Submit your first claim
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {showSummaryModal && latestClaim && (
        <ClaimSummaryModal
          isOpen={showSummaryModal}
          onClose={() => setShowSummaryModal(false)}
          claimData={latestClaim}
        />
      )}
    </div>
  );
};

export default EmployeeDashboard;
