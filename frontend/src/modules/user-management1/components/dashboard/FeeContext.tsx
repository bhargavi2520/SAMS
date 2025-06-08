import React, { createContext, useContext, useState } from 'react';

// Fee details type
export type FeeDetail = {
  item: string;
  amount: string;
  dueDate: string;
  status: 'Due' | 'Overdue' | 'Paid';
};

export interface FeeContextType {
  studentFees: Record<string, FeeDetail[]>;
  updateStudentFee: (studentId: string, fees: FeeDetail[]) => void;
}

export const FeeContext = React.createContext<FeeContextType>({
  studentFees: {},
  updateStudentFee: () => {},
});

export const FeeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [studentFees, setStudentFees] = React.useState<Record<string, FeeDetail[]>>({});

  const updateStudentFee = (studentId: string, fees: FeeDetail[]) => {
    setStudentFees(prev => ({
      ...prev,
      [studentId]: fees,
    }));
  };

  return (
    <FeeContext.Provider value={{ studentFees, updateStudentFee }}>
      {children}
    </FeeContext.Provider>
  );
};
