import { useContext } from 'react';
import { FeeContext } from './FeeContextContext';

export const useFeeContext = () => useContext(FeeContext);
