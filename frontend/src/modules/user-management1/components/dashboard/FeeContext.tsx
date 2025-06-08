import React, { createContext, useContext, useState } from 'react';
import { FeeContext } from './FeeContextContext';

// Fee details type
export type FeeDetail = {
  item: string;
  amount: string;
  dueDate: string;
  status: 'Due' | 'Overdue' | 'Paid';
};

export type StudentFeeMap = {
  [studentId: string]: FeeDetail[];
};

export const FeeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [studentFees, setStudentFees] = useState<StudentFeeMap>({
    // Example initial data for demo
    '1': [
      { item: 'Tuition Fee', amount: '₹12000.00', dueDate: '2025-07-15', status: 'Due' },
      { item: 'Library Fine', amount: '₹50.00', dueDate: '2025-06-30', status: 'Overdue' },
      { item: 'Hostel Fee', amount: '₹3000.00', dueDate: '2025-08-01', status: 'Due' },
    ],
    '2': [
      { item: 'Tuition Fee', amount: '₹12000.00', dueDate: '2025-07-15', status: 'Paid' },
      { item: 'Library Fine', amount: '₹0.00', dueDate: '2025-06-30', status: 'Paid' },
      { item: 'Hostel Fee', amount: '₹3000.00', dueDate: '2025-08-01', status: 'Due' },
    ],
  });

  const updateStudentFee = (studentId: string, fees: FeeDetail[]) => {
    setStudentFees((prev) => ({ ...prev, [studentId]: fees }));
  };

  return (
    <FeeContext.Provider value={{ studentFees, updateStudentFee }}>
      {children}
    </FeeContext.Provider>
  );
};
