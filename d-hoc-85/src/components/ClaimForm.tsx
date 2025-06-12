import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload } from 'lucide-react';
import { useClaimsContext } from '@/contexts/ClaimsContext';

interface ClaimFormData {
  mode: string;
  toFromHome: string;
  travelDate: string;
  departureTime: string;
  arrivalTime: string;
  homeDistance: string;
  homeAmount: string;
  fromLocation: string;
  toLocation: string;
  reason: string;
  reasonDetails: string;
  parkingFee: string;
  erp: string;
  receiptNumber: string;
  receiptAmount: string;
  computedAmount: string;
  finalAmount: string;
  attachments: FileList | null;
}

interface ClaimFormProps {
  onSubmit: (data: ClaimFormData) => void;
  userEmail: string;
  userName: string;
}

const ClaimForm = ({ onSubmit, userEmail, userName }: ClaimFormProps) => {
  const { addClaim } = useClaimsContext();
  const [formData, setFormData] = useState<ClaimFormData>({
    mode: '',
    toFromHome: '',
    travelDate: '',
    departureTime: '',
    arrivalTime: '',
    homeDistance: '',
    homeAmount: '',
    fromLocation: '',
    toLocation: '',
    reason: '',
    reasonDetails: '',
    parkingFee: '',
    erp: '',
    receiptNumber: '',
    receiptAmount: '',
    computedAmount: '',
    finalAmount: '',
    attachments: null
  });

  // Auto-calculate amounts
  useEffect(() => {
    let computed = 0;
    
    if (formData.mode === 'Car' && formData.homeDistance) {
      computed = parseFloat(formData.homeDistance) * 0.47; // Standard rate per km
    } else if (formData.receiptAmount) {
      computed = parseFloat(formData.receiptAmount);
    }
    
    const parking = parseFloat(formData.parkingFee) || 0;
    const erp = parseFloat(formData.erp) || 0;
    const homeAmt = parseFloat(formData.homeAmount) || 0;
    
    const final = computed + parking + erp + homeAmt;
    
    setFormData(prev => ({
      ...prev,
      computedAmount: computed.toFixed(2),
      finalAmount: final.toFixed(2)
    }));
  }, [formData.mode, formData.homeDistance, formData.receiptAmount, formData.parkingFee, formData.erp, formData.homeAmount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add claim to context
    addClaim({
      employeeEmail: userEmail,
      employeeName: userName,
      mode: formData.mode,
      travelDate: formData.travelDate,
      departureTime: formData.departureTime,
      arrivalTime: formData.arrivalTime,
      fromLocation: formData.fromLocation,
      toLocation: formData.toLocation,
      reason: formData.reason,
      reasonDetails: formData.reasonDetails,
      toFromHome: formData.toFromHome,
      homeDistance: formData.homeDistance,
      homeAmount: formData.homeAmount,
      parkingFee: formData.parkingFee,
      erp: formData.erp,
      receiptNumber: formData.receiptNumber,
      receiptAmount: formData.receiptAmount,
      finalAmount: formData.finalAmount,
    });
    
    // Call the original onSubmit for any additional logic (like showing modal)
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof ClaimFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, attachments: e.target.files }));
  };

  const showHomeFields = formData.toFromHome === 'Yes';
  const showReceiptFields = formData.mode === 'Taxi / Private Hire' || formData.mode === 'Bus / MRT / LRT';

  return (
    <Card className="max-w-4xl">
      <CardHeader>
        <CardTitle>Transport Claim Form</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mode of Transport */}
            <div className="space-y-2">
              <Label htmlFor="mode">Mode of Transport *</Label>
              <Select onValueChange={(value) => handleInputChange('mode', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select transport mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Taxi / Private Hire">Taxi / Private Hire</SelectItem>
                  <SelectItem value="Car">Car</SelectItem>
                  <SelectItem value="Motorcycle">Motorcycle</SelectItem>
                  <SelectItem value="Bus / MRT / LRT">Bus / MRT / LRT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* To/From Home */}
            <div className="space-y-2">
              <Label htmlFor="toFromHome">To / From Home *</Label>
              <Select onValueChange={(value) => handleInputChange('toFromHome', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Yes/No" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Travel Date */}
            <div className="space-y-2">
              <Label htmlFor="travelDate">Travel Date *</Label>
              <Input
                type="date"
                value={formData.travelDate}
                onChange={(e) => handleInputChange('travelDate', e.target.value)}
                required
              />
            </div>

            {/* Departure Time */}
            <div className="space-y-2">
              <Label htmlFor="departureTime">Departure Time *</Label>
              <Input
                type="time"
                value={formData.departureTime}
                onChange={(e) => handleInputChange('departureTime', e.target.value)}
                required
              />
            </div>

            {/* Arrival Time */}
            <div className="space-y-2">
              <Label htmlFor="arrivalTime">Arrival Time *</Label>
              <Input
                type="time"
                value={formData.arrivalTime}
                onChange={(e) => handleInputChange('arrivalTime', e.target.value)}
                required
              />
            </div>

            {/* Conditional Home Fields */}
            {showHomeFields && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="homeDistance">Home to Office Distance (KM)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.homeDistance}
                    onChange={(e) => handleInputChange('homeDistance', e.target.value)}
                    placeholder="Enter distance in KM"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="homeAmount">Home to Office Amount ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.homeAmount}
                    onChange={(e) => handleInputChange('homeAmount', e.target.value)}
                    placeholder="Enter amount"
                  />
                </div>
              </>
            )}
          </div>

          {/* From and To Locations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fromLocation">From *</Label>
              <Input
                value={formData.fromLocation}
                onChange={(e) => handleInputChange('fromLocation', e.target.value)}
                placeholder="Starting location"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="toLocation">To *</Label>
              <Input
                value={formData.toLocation}
                onChange={(e) => handleInputChange('toLocation', e.target.value)}
                placeholder="Destination location"
                required
              />
            </div>
          </div>

          {/* Reason */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Journey *</Label>
              <Select onValueChange={(value) => handleInputChange('reason', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Overtime">Overtime</SelectItem>
                  <SelectItem value="Required to report to work before 6:30 am">Required to report to work before 6:30 am</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reasonDetails">Reason (Details)</Label>
              <Textarea
                value={formData.reasonDetails}
                onChange={(e) => handleInputChange('reasonDetails', e.target.value)}
                placeholder="Additional details about the reason"
                rows={3}
              />
            </div>
          </div>

          {/* Additional Costs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="parkingFee">Parking Fee ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.parkingFee}
                onChange={(e) => handleInputChange('parkingFee', e.target.value)}
                placeholder="Optional"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="erp">ERP ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.erp}
                onChange={(e) => handleInputChange('erp', e.target.value)}
                placeholder="Optional"
              />
            </div>
          </div>

          {/* Receipt Fields (conditional) */}
          {showReceiptFields && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="receiptNumber">Receipt Number</Label>
                <Input
                  value={formData.receiptNumber}
                  onChange={(e) => handleInputChange('receiptNumber', e.target.value)}
                  placeholder="Receipt number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="receiptAmount">Receipt Amount ($) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.receiptAmount}
                  onChange={(e) => handleInputChange('receiptAmount', e.target.value)}
                  placeholder="Claim amount"
                  required={showReceiptFields}
                />
              </div>
            </div>
          )}

          {/* Computed Amounts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="computedAmount">Computed Amount ($)</Label>
              <Input
                value={formData.computedAmount}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="finalAmount">Final Amount ($)</Label>
              <Input
                value={formData.finalAmount}
                readOnly
                className="bg-gray-50 font-semibold"
              />
            </div>
          </div>

          {/* File Upload */}
          {showReceiptFields && (
            <div className="space-y-2">
              <Label htmlFor="attachments">Attachments</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <p className="text-sm text-gray-600 mb-2">Upload receipts (PDF, PNG, JPEG only)</p>
                <p className="text-xs text-gray-500 mb-3">Maximum 2 files, 5MB each</p>
                <Input
                  type="file"
                  multiple
                  accept=".pdf,.png,.jpeg,.jpg"
                  onChange={handleFileChange}
                  className="max-w-xs"
                />
              </div>
            </div>
          )}

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Submit Claim
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ClaimForm;
