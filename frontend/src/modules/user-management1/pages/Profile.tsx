import React, { useState } from "react";
import { useAuthStore } from "@/modules/user-management1/store/authStore";
import { StudentProfile, FacultyProfile, AdminProfile, HODProfile, GuestProfile } from "@/modules/user-management1/types/auth.types";
import { Input } from "@/common/components/ui/input";
import { Button } from "@/common/components/ui/button";
import { toast } from "sonner";

// Utility to flatten user + user.profile into one object
function flattenUser(
  user:
    | (StudentProfile & { profile?: StudentProfile })
    | (FacultyProfile & { profile?: FacultyProfile })
    | (AdminProfile & { profile?: AdminProfile })
    | (HODProfile & { profile?: HODProfile })
    | (GuestProfile & { profile?: GuestProfile })
    | undefined
) {
  if (!user) return {};
  if ("profile" in user && user.profile) {
    return { ...user, ...user.profile };
  }
  return user;
}
const ProfilePage = () => {
  const { user, updateProfile, isLoading } = useAuthStore();
  console.log("User from store:", user);
  // Flatten user and profile fields for editing
  const [formData, setFormData] = useState<
    StudentProfile | FacultyProfile | AdminProfile | HODProfile | GuestProfile
  >(flattenUser(user) as StudentProfile | FacultyProfile | AdminProfile | HODProfile | GuestProfile);
  const [isEditing, setIsEditing] = useState(false);

  if (!user) return <p>Loading profile...</p>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev: StudentProfile | FacultyProfile | AdminProfile | HODProfile | GuestProfile) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : "Update failed!";
      toast.error(errorMessage);
    }
  };

  // Generic input field
  const InputField = ({
    label,
    name,
    type = "text",
  }: {
    label: string;
    name: string;
    type?: string;
  }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <Input
        name={name}
        type={type}
        value={formData?.[name] ?? ""}
        onChange={handleChange}
        disabled={!isEditing}
      />
    </div>
  );

  // Render fields common to all users
  const renderCommonFields = () => (
    <>
      <InputField label="First Name" name="firstName" />
      <InputField label="Last Name" name="lastName" />
      <InputField label="Phone Number" name="phoneNumber" />
      <InputField label="Email" name="email" />
    </>
  );

  // Render fields specific to each user role
  const renderRoleFields = () => {
    switch (formData.role) {
      case "STUDENT":
        return (
          <>
            <InputField label="Roll Number" name="rollNumber" />
            <InputField label="Branch" name="branch" />
            <InputField label="Course Program" name="courseProgram" />
            <InputField label="Current Semester" name="currentSemester" type="number" />
            <InputField label="Parent Name" name="parentName" />
            <InputField label="Parent Phone" name="parentPhone" />
            <InputField label="Date of Birth" name="dateOfBirth" type="date" />
            <InputField label="Section" name="section" />
            <InputField label="Student Status" name="studentStatus" />
            <InputField label="Fee Status" name="feeStatus" />
            <InputField label="Enrollment Year" name="enrollmentYear" type="number" />
            <InputField label="Current Academic Year" name="current_academic_year" />
            <InputField label="Current Address" name="currentAddress" />
            <InputField label="Permanent Address" name="permanentAddress" />
            <InputField label="Apar ID" name="aparId" />
          </>
        );
      case "FACULTY":
        return (
          <>
            <InputField label="Employee ID" name="employeeId" />
            <InputField label="Designation" name="designation" />
            <InputField label="Department" name="department" />
            <InputField label="Date of Joining" name="dateOfJoining" type="date" />
            <InputField label="Employment Type" name="employmentType" />
            <InputField label="Official Email" name="officialEmail" />
            <InputField label="Highest Qualification" name="highestQualification" />
            <InputField label="Specialization" name="specialization" />
            <InputField label="Years of Experience" name="yearsOfExperience" type="number" />
          </>
        );
      case "ADMIN":
        return (
          <>
            <InputField label="Admin ID" name="adminId" />
            <InputField label="Employee ID" name="employeeId" />
            <InputField label="Designation" name="designation" />
            <InputField label="Department" name="department" />
          </>
        );
      case "HOD":
        return (
          <>
            <InputField label="Faculty ID" name="facultyId" />
            <InputField label="Department" name="department" />
            <InputField label="Appointment Date" name="appointmentDate" type="date" />
            <InputField label="Tenure End Date" name="tenureEndDate" type="date" />
          </>
        );
      case "GUEST":
        return <InputField label="Affiliation" name="affiliation" />;
      default:
        return <p>No additional info for this role.</p>;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      <form className="space-y-4">
        {renderCommonFields()}
        {renderRoleFields()}
      </form>
      <div className="flex gap-4 mt-6">
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>Edit</Button>
        ) : (
          <>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;