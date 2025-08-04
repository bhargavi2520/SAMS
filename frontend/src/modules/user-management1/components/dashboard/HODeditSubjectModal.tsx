import { useState, useEffect } from "react"
import { BookOpen, X } from "lucide-react";
import { Button } from "@/common/components/ui/button";

export const EditSubjectModal = ({
  isOpen,
  onClose,
  subject,
  onSave,
  isLoading = false,
}) => {
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");

  useEffect(() => {
    if (subject) {
      setSubjectName(subject.name || "");
      setSubjectCode(subject.code || "");
    }
  }, [subject]);

  const handleSave = () => {
    if (subjectName.trim() && subjectCode.trim()) {
      onSave({
        ...subject,
        name: subjectName.trim(),
        code: subjectCode.trim(),
      });
    }
  };

  const handleClose = () => {
    setSubjectName("");
    setSubjectCode("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-neutral-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Edit Subject
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Subject Code
            </label>
            <input
              type="text"
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value)}
              className="w-full border border-gray-300 dark:border-neutral-600 rounded px-3 py-2 text-sm bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter subject code"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Subject Name
            </label>
            <input
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              className="w-full border border-gray-300 dark:border-neutral-600 rounded px-3 py-2 text-sm bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter subject name"
            />
          </div>

          <div className="bg-gray-50 dark:bg-neutral-700 rounded p-3">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Year:</strong> {subject?.year} |{" "}
              <strong>Semester:</strong> {subject?.semester}
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-neutral-700">
          <Button
            onClick={handleSave}
            disabled={!subjectName.trim() || !subjectCode.trim() || isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? "Saving..." : "Save Changes"}
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
