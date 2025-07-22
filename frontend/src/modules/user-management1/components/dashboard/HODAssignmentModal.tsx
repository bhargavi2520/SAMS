import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogFooter } from '@/common/components/ui/dialog';
import { Button } from '@/common/components/ui/button';
import { Label } from '@/common/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/common/components/ui/select';
import { Alert, AlertDescription } from '@/common/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { hodService, HODProfile, HODAssignment, CreateAssignmentData } from '@/modules/user-management1/services/hod.service';

import ReactSelect from 'react-select';

interface HODAssignmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedHOD?: HODProfile | null;
  onAssignmentSuccess?: () => void;
}

interface YearOption {
  value: number;
  label: string;
}

const HODAssignmentModal: React.FC<HODAssignmentModalProps> = ({
  open,
  onOpenChange,
  selectedHOD,
  onAssignmentSuccess
}) => {
  const [hods, setHODs] = useState<HODProfile[]>([]);
  const [assignments, setAssignments] = useState<HODAssignment[]>([]);
  const [selectedHODId, setSelectedHODId] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const departments = ['CSE', 'ECE', 'EEE', 'MECH', 'CSD', 'CSM'];
  
  // Year options for multi-select
  const yearOptions: YearOption[] = [
    { value: 1, label: 'Year 1' },
    { value: 2, label: 'Year 2' },
    { value: 3, label: 'Year 3' },
    { value: 4, label: 'Year 4' }
  ];

  useEffect(() => {
    if (open) {
      fetchHODs();
      fetchAssignments();
      if (selectedHOD) {
        setSelectedHODId(selectedHOD._id);
      }
    }
  }, [open, selectedHOD]);

  const fetchHODs = async () => {
    try {
      const hodsData = await hodService.getAllHODs();
      setHODs(hodsData);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchAssignments = async () => {
    try {
      const assignmentsData = await hodService.getDepartmentAssignments();
      setAssignments(assignmentsData);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleYearChange = (selectedOptions: readonly YearOption[]) => {
    const yearValues = selectedOptions.map(option => option.value);
    setSelectedYears(yearValues);
  };

  const handleSubmit = async () => {
    if (!selectedHODId || !selectedDepartment || selectedYears.length === 0) {
      setError('Please fill in all fields and select at least one year');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const assignmentData: CreateAssignmentData = {
        hodId: selectedHODId,
        department: selectedDepartment,
        years: selectedYears ,
      };

      await hodService.createAssignment(assignmentData);
      setSuccess('HOD assigned successfully!');
      
      // Reset form
      setSelectedHODId('');
      setSelectedDepartment('');
      setSelectedYears([]);
      
      // Refresh assignments
      await fetchAssignments();
      
      // Call success callback
      if (onAssignmentSuccess) {
        onAssignmentSuccess();
      }

      // Close modal after a short delay
      setTimeout(() => {
        onOpenChange(false);
        setSuccess('');
      }, 2000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setSuccess('');
    setSelectedHODId('');
    setSelectedDepartment('');
    setSelectedYears([]);
    onOpenChange(false);
  };

  const isAssignmentExists = (hodId: string, department: string, years: number[]) => {
    return years.some(year => 
      assignments.some(
        assignment => 
          assignment._id === hodId && 
          assignment.department === department && 
          assignment.years === year
      )
    );
  };

  const getConflictingYears = (hodId: string, department: string, years: number[]) => {
    return years.filter(year => 
      assignments.some(
        assignment => 
          assignment._id === hodId && 
          assignment.department === department && 
          assignment.years === year
      )
    );
  };

  const getHODName = (hodId: string) => {
    const hod = hods.find(h => h._id === hodId);
    return hod ? `${hod.firstName} ${hod.lastName}` : 'Unknown HOD';
  };

  // Custom styles for ReactSelect
  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      minHeight: '40px',
      border: '1px solid hsl(var(--border))',
      borderRadius: '6px',
      '&:hover': {
        border: '1px solid hsl(var(--border))',
      }
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: 'hsl(var(--secondary))',
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: 'hsl(var(--secondary-foreground))',
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: 'hsl(var(--secondary-foreground))',
      '&:hover': {
        backgroundColor: 'hsl(var(--destructive))',
        color: 'hsl(var(--destructive-foreground))',
      }
    })
  };

  const conflictingYears = selectedHODId && selectedDepartment && selectedYears.length > 0 
    ? getConflictingYears(selectedHODId, selectedDepartment, selectedYears)
    : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogTitle className="text-xl font-bold">Assign HOD to Department</DialogTitle>
        
        <div className="space-y-6">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success Alert */}
          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="hod-select">Select HOD</Label>
              <Select value={selectedHODId} onValueChange={setSelectedHODId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an HOD" />
                </SelectTrigger>
                <SelectContent>
                  {hods.map((hod) => (
                    <SelectItem key={hod._id} value={hod._id}>
                      {hod.firstName} {hod.lastName} ({hod.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="department-select">Department</Label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="year-select">Years (Multi-select)</Label>
              <ReactSelect
                isMulti
                options={yearOptions}
                value={yearOptions.filter(option => selectedYears.includes(option.value))}
                onChange={handleYearChange}
                placeholder="Select years..."
                styles={customStyles}
                className="mt-1"
                classNamePrefix="react-select"
              />
            </div>
          </div>

          {/* Warning if any assignment already exists */}
          {conflictingYears.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {getHODName(selectedHODId)} is already assigned to {selectedDepartment} for Year(s): {conflictingYears.join(', ')}
              </AlertDescription>
            </Alert>
          )}

          {/* Display selected years */}
          {selectedYears.length > 0 && (
            <div>
              <Label className="text-sm font-medium">Selected Years:</Label>
              <div className="mt-1 flex flex-wrap gap-2">
                {selectedYears.map(year => (
                  <span 
                    key={year} 
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
                  >
                    Year {year}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Current Assignments */}
          {assignments.length > 0 && (
            <div>
              <Label className="text-sm font-medium">Current Assignments</Label>
              <div className="mt-2 max-h-40 overflow-y-auto border rounded-md p-2">
                {assignments.map((assignment) => (
                  <div key={assignment._id} className="text-sm py-1 border-b last:border-b-0">
                    <span className="font-medium">
                      {assignment.hodName}
                    </span>
                    {' → '}
                    <span className="text-gray-600">
                      {assignment.department} Year {assignment.years}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !selectedHODId || !selectedDepartment || selectedYears.length === 0 ||
                     conflictingYears.length > 0}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Assign HOD
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HODAssignmentModal;