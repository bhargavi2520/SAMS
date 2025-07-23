import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogFooter } from '@/common/components/ui/dialog';
import { Button } from '@/common/components/ui/button';
import { Label } from '@/common/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/common/components/ui/select';
import { Alert, AlertDescription } from '@/common/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { hodService, HODProfile, HODAssignment, CreateAssignmentData } from '@/modules/user-management1/services/hod.service';

interface HODAssignmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedHOD?: HODProfile | null;
  onAssignmentSuccess?: () => void;
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
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const departments = ['CSE', 'ECE', 'EEE', 'MECH', 'CSD', 'CSM'];
  const years = [1, 2, 3, 4];

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
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const fetchAssignments = async () => {
    try {
      const assignmentsData = await hodService.getDepartmentAssignments();
      setAssignments(assignmentsData);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const handleSubmit = async () => {
    if (!selectedHODId || !selectedDepartment || !selectedYear) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const assignmentData: CreateAssignmentData = {
        hodId: selectedHODId,
        department: selectedDepartment,
        year: parseInt(selectedYear)
      };

      await hodService.createAssignment(assignmentData);
      setSuccess('HOD assigned successfully!');
      
      // Reset form
      setSelectedHODId('');
      setSelectedDepartment('');
      setSelectedYear('');
      
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

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setSuccess('');
    setSelectedHODId('');
    setSelectedDepartment('');
    setSelectedYear('');
    onOpenChange(false);
  };

  const isAssignmentExists = (hodId: string, department: string, year: string) => {
    const selectedHOD = hods.find(h => h._id === hodId);
    if (!selectedHOD) return false;
    return assignments.some(
      assignment => 
        assignment.hodEmail === selectedHOD.email &&
        assignment.department === department &&
        assignment.years === parseInt(year)
    );
  };

  const getHODName = (hodId: string) => {
    const hod = hods.find(h => h._id === hodId);
    return hod ? `${hod.firstName} ${hod.lastName}` : 'Unknown HOD';
  };

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
              <Label htmlFor="year-select">Year</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      Year {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Warning if assignment already exists */}
          {selectedHODId && selectedDepartment && selectedYear && 
           isAssignmentExists(selectedHODId, selectedDepartment, selectedYear) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {getHODName(selectedHODId)} is already assigned to {selectedDepartment} Year {selectedYear}
              </AlertDescription>
            </Alert>
          )}

          {/* Current Assignments */}
          {assignments.length > 0 && (
            <div>
              <Label className="text-sm font-medium">Current Assignments</Label>
              <div className="mt-2 max-h-40 overflow-y-auto border rounded-md p-2">
                {assignments.map((assignment) => (
                  <div key={assignment._id} className="text-sm py-1 border-b last:border-b-0">
                    <span className="font-medium">
                      {assignment.hodName} ({assignment.hodEmail})
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
            disabled={loading || !selectedHODId || !selectedDepartment || !selectedYear ||
                     isAssignmentExists(selectedHODId, selectedDepartment, selectedYear)}
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