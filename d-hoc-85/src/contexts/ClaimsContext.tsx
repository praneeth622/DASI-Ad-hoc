
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Claim {
  id: string;
  employeeEmail: string;
  employeeName: string;
  mode: string;
  travelDate: string;
  departureTime: string;
  arrivalTime: string;
  fromLocation: string;
  toLocation: string;
  reason: string;
  reasonDetails: string;
  toFromHome: string;
  homeDistance?: string;
  homeAmount?: string;
  parkingFee?: string;
  erp?: string;
  receiptNumber?: string;
  receiptAmount?: string;
  finalAmount: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

interface ClaimsContextType {
  claims: Claim[];
  addClaim: (claim: Omit<Claim, 'id' | 'submittedAt' | 'status'>) => void;
  updateClaimStatus: (claimId: string, status: 'approved' | 'rejected', reviewedBy: string, rejectionReason?: string) => void;
  getClaimsByEmployee: (employeeEmail: string) => Claim[];
  getAllClaims: () => Claim[];
}

const ClaimsContext = createContext<ClaimsContextType | undefined>(undefined);

export const useClaimsContext = () => {
  const context = useContext(ClaimsContext);
  if (!context) {
    throw new Error('useClaimsContext must be used within a ClaimsProvider');
  }
  return context;
};

export const ClaimsProvider = ({ children }: { children: ReactNode }) => {
  const [claims, setClaims] = useState<Claim[]>([]);

  const addClaim = (claimData: Omit<Claim, 'id' | 'submittedAt' | 'status'>) => {
    const newClaim: Claim = {
      ...claimData,
      id: `claim-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    setClaims(prevClaims => [...prevClaims, newClaim]);
  };

  const updateClaimStatus = (claimId: string, status: 'approved' | 'rejected', reviewedBy: string, rejectionReason?: string) => {
    setClaims(prevClaims =>
      prevClaims.map(claim =>
        claim.id === claimId
          ? {
              ...claim,
              status,
              reviewedAt: new Date().toISOString(),
              reviewedBy,
              rejectionReason: status === 'rejected' ? rejectionReason : undefined,
            }
          : claim
      )
    );
  };

  const getClaimsByEmployee = (employeeEmail: string) => {
    return claims.filter(claim => claim.employeeEmail === employeeEmail);
  };

  const getAllClaims = () => {
    return claims;
  };

  return (
    <ClaimsContext.Provider value={{
      claims,
      addClaim,
      updateClaimStatus,
      getClaimsByEmployee,
      getAllClaims,
    }}>
      {children}
    </ClaimsContext.Provider>
  );
};
