
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface ClaimSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  claimData: any;
}

const ClaimSummaryModal = ({ isOpen, onClose, claimData }: ClaimSummaryModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div>
              <DialogTitle className="text-xl">Claim Submitted Successfully</DialogTitle>
              <DialogDescription>
                Your transport claim has been submitted for review
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-lg">Claim Summary</h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Mode of Transport:</span>
                <p className="text-gray-900">{claimData.mode}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Travel Date:</span>
                <p className="text-gray-900">{claimData.travelDate}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Departure Time:</span>
                <p className="text-gray-900">{claimData.departureTime}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Arrival Time:</span>
                <p className="text-gray-900">{claimData.arrivalTime}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">From:</span>
                <p className="text-gray-900">{claimData.fromLocation}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">To:</span>
                <p className="text-gray-900">{claimData.toLocation}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Reason:</span>
                <p className="text-gray-900">{claimData.reason}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Final Amount:</span>
                <p className="text-gray-900 font-semibold">${claimData.finalAmount}</p>
              </div>
            </div>
            
            {claimData.toFromHome === 'Yes' && (
              <div className="border-t pt-3">
                <h4 className="font-medium text-gray-600 mb-2">Home to Office Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {claimData.homeDistance && (
                    <div>
                      <span className="font-medium text-gray-600">Distance:</span>
                      <p className="text-gray-900">{claimData.homeDistance} KM</p>
                    </div>
                  )}
                  {claimData.homeAmount && (
                    <div>
                      <span className="font-medium text-gray-600">Amount:</span>
                      <p className="text-gray-900">${claimData.homeAmount}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {claimData.receiptNumber && (
              <div className="border-t pt-3">
                <h4 className="font-medium text-gray-600 mb-2">Receipt Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Receipt Number:</span>
                    <p className="text-gray-900">{claimData.receiptNumber}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Receipt Amount:</span>
                    <p className="text-gray-900">${claimData.receiptAmount}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">What's Next?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Your claim has been submitted to your reporting officer</li>
              <li>• You will receive an email notification once reviewed</li>
              <li>• You can track the status in your dashboard</li>
            </ul>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClaimSummaryModal;
