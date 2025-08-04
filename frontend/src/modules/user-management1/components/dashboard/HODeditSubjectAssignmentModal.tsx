import React, { useState, useEffect } from "react";
import { UserCog, X } from "lucide-react";
import { Button } from "@/common/components/ui/button";

export const EditAssignmentModal = ({ 
  isOpen, 
  onClose, 
  assignment, 
  onSave,
  isLoading = false,
  faculties = [],
  subjects = [],
  onFacultyFocus,
  onSubjectFocus
}) => {
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  useEffect(() => {
    if (assignment) {
      setSelectedFaculty(assignment.facultyId || '');
      setSelectedSubject(assignment.subjectId || '');
    }
  }, [assignment]);

  const handleSave = () => {
    if (selectedFaculty && selectedSubject) {
      onSave({
        ...assignment,
        facultyId: selectedFaculty,
        subjectId: selectedSubject
      });
    }
  };

  const handleClose = () => {
    setSelectedFaculty('');
    setSelectedSubject('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-neutral-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <UserCog className="w-5 h-5" />
            Edit Assignment
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="bg-gray-50 dark:bg-neutral-700 rounded p-3 space-y-2">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Year:</strong> {assignment?.year} | <strong>Semester:</strong> {assignment?.semester} | <strong>Section:</strong> {assignment?.section}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Current Faculty:</strong> {assignment?.faculty_name}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Current Subject:</strong> {assignment?.subject_name}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Faculty
            </label>
            <select
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              onFocus={onFacultyFocus}
              className="w-full border border-gray-300 dark:border-neutral-600 rounded px-3 py-2 text-sm bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Faculty</option>
              {faculties.map((faculty) => (
                <option key={faculty.Id} value={faculty.Id}>
                  {faculty.firstName} {faculty.lastName} ({faculty.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              onFocus={onSubjectFocus}
              className="w-full border border-gray-300 dark:border-neutral-600 rounded px-3 py-2 text-sm bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Subject</option>
              {subjects.map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {subject.name} ({subject.code})
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-neutral-700">
          <Button
            onClick={handleSave}
            disabled={!selectedFaculty || !selectedSubject || isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            onClick={handleClose}
            variant="outline"
            className="flex-1 border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-200"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};