import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Button } from '@/common/components/ui/button';
import { Badge } from '@/common/components/ui/badge';
import { Alert, AlertDescription } from '@/common/components/ui/alert';
import { Dialog, DialogContent, DialogTitle, DialogFooter } from '@/common/components/ui/dialog';
import { Label } from '@/common/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/common/components/ui/select';
import { Loader2, AlertCircle, CheckCircle, Edit, Trash2, Plus, Users } from 'lucide-react';
import { hodService, HODAssignment, UpdateAssignmentData } from '@/modules/user-management1/services/hod.service';
import HODAssignmentModal from './HODAssignmentModal';

const HODAssignmentManager: React.FC = () => {
  const [assignments, setAssignments] = useState<HODAssignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [editModal, setEditModal] = useState<{ open: boolean; assignment: HODAssignment | null }>({ open: false, assignment: null });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; assignment: HODAssignment | null }>({ open: false, assignment: null });
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editDepartment, setEditDepartment] = useState<string>('');
  const [editYear, setEditYear] = useState<string>('');

  const departments = ['CSE', 'ECE', 'EEE', 'MECH', 'CSD', 'CSM'];
  const years = [1, 2, 3, 4];

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await hodService.getDepartmentAssignments();
      setAssignments(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditAssignment = async () => {
    if (!editModal.assignment || !editDepartment || !editYear) return;

    setEditLoading(true);
    setError('');
    try {
      const updateData: UpdateAssignmentData = {
        department: editDepartment,
        year: parseInt(editYear)
      };

      await hodService.updateAssignment(editModal.assignment._id, updateData);
      setSuccess('Assignment updated successfully!');
      await fetchAssignments();
      setEditModal({ open: false, assignment: null });
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteAssignment = async () => {
    if (!deleteModal.assignment) return;

    setDeleteLoading(true);
    setError('');
    try {
      await hodService.removeAssignment(deleteModal.assignment._id);
      setSuccess('Assignment removed successfully!');
      await fetchAssignments();
      setDeleteModal({ open: false, assignment: null });
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const openEditModal = (assignment: HODAssignment) => {
    setEditDepartment(assignment.department);
    setEditYear(assignment.departmentYears.toString());
    setEditModal({ open: true, assignment });
  };

  const openDeleteModal = (assignment: HODAssignment) => {
    setDeleteModal({ open: true, assignment });
  };

  const getDepartmentColor = (department: string) => {
    const colors: { [key: string]: string } = {
      'CSE': 'bg-blue-100 text-blue-800',
      'ECE': 'bg-green-100 text-green-800',
      'EEE': 'bg-yellow-100 text-yellow-800',
      'MECH': 'bg-red-100 text-red-800',
      'CSD': 'bg-purple-100 text-purple-800',
      'CSM': 'bg-pink-100 text-pink-800'
    };
    return colors[department] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading HOD assignments...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-lg font-semibold text-gray-900">
            HOD Department Assignments
          </h4>
          <p className="text-sm text-gray-600 mt-1">Manage Head of Department assignments to departments and years</p>
        </div>
        <Button onClick={() => setShowAssignmentModal(true)} size="sm" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Assign HOD
        </Button>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {/* Assignments Grid */}
      {assignments.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-medium text-gray-900 mb-2">No HOD Assignments</h3>
            <p className="text-sm text-gray-600 mb-4">No HODs have been assigned to departments yet.</p>
            <Button size="sm" onClick={() => setShowAssignmentModal(true)}>
              Create First Assignment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {assignments.map((assignment) => (
            <Card key={assignment._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">
                      {assignment.hod.firstName} {assignment.hod.lastName}
                    </CardTitle>
                    <p className="text-xs text-gray-600">{assignment.hod.email}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(assignment)}
                      className="h-7 w-7 p-0"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDeleteModal(assignment)}
                      className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getDepartmentColor(assignment.department)}>
                      {assignment.department}
                    </Badge>
                    <Badge variant="outline">
                      Year {assignment.departmentYears}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">
                    Assigned on {new Date(assignment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Assignment Modal */}
      <HODAssignmentModal
        open={showAssignmentModal}
        onOpenChange={setShowAssignmentModal}
        onAssignmentSuccess={fetchAssignments}
      />

      {/* Edit Modal */}
      <Dialog open={editModal.open} onOpenChange={(open) => setEditModal({ open, assignment: open ? editModal.assignment : null })}>
        <DialogContent>
          <DialogTitle>Edit HOD Assignment</DialogTitle>
          <div className="space-y-4">
            <div>
              <Label>HOD</Label>
              <p className="text-sm text-gray-600 mt-1">
                {editModal.assignment?.hod.firstName} {editModal.assignment?.hod.lastName}
              </p>
            </div>
            <div>
              <Label htmlFor="edit-department">Department</Label>
              <Select value={editDepartment} onValueChange={setEditDepartment}>
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
              <Label htmlFor="edit-year">Year</Label>
              <Select value={editYear} onValueChange={setEditYear}>
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModal({ open: false, assignment: null })} disabled={editLoading}>
              Cancel
            </Button>
            <Button onClick={handleEditAssignment} disabled={editLoading || !editDepartment || !editYear}>
              {editLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModal.open} onOpenChange={(open) => setDeleteModal({ open, assignment: open ? deleteModal.assignment : null })}>
        <DialogContent>
          <DialogTitle>Remove HOD Assignment</DialogTitle>
          <p className="text-gray-600">
            Are you sure you want to remove{' '}
            <span className="font-medium">
              {deleteModal.assignment?.hod.firstName} {deleteModal.assignment?.hod.lastName}
            </span>{' '}
            from {deleteModal.assignment?.department} Year {deleteModal.assignment?.departmentYears}?
          </p>
          <p className="text-sm text-red-600">This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModal({ open: false, assignment: null })} disabled={deleteLoading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAssignment} disabled={deleteLoading}>
              {deleteLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Remove Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HODAssignmentManager; 