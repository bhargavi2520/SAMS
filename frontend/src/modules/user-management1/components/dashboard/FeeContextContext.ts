import { createContext } from 'react';
import type { FeeDetail, StudentFeeMap } from './FeeContext';

export const FeeContext = createContext<{
  studentFees: StudentFeeMap;
  updateStudentFee: (studentId: string, fees: FeeDetail[]) => void;
}>({
  studentFees: {},
  updateStudentFee: () => {},
});
