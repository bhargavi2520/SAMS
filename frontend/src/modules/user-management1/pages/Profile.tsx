import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/modules/user-management1/store/authStore";
import { StudentProfile, FacultyProfile, AdminProfile, HODProfile, GuestProfile } from "@/modules/user-management1/types/auth.types";
import { Input } from "@/common/components/ui/input";
import { Button } from "@/common/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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
  const { user, updateProfile, fetchProfile, isLoading } = useAuthStore();
  const navigate = useNavigate();
  console.log("User from store:", user);
  // Flatten user and profile fields for editing
  const [formData, setFormData] = useState<
    StudentProfile | FacultyProfile | AdminProfile | HODProfile | GuestProfile
  >(flattenUser(user) as StudentProfile | FacultyProfile | AdminProfile | HODProfile | GuestProfile);
  
  console.log("Form data:", formData);
  console.log("Student fields:", formData.role === "STUDENT" ? {
    admission_academic_year: (formData as StudentProfile).admission_academic_year,
    year: (formData as StudentProfile).year,
    semester: (formData as StudentProfile).semester,
    department: (formData as StudentProfile).department,
    transport: (formData as StudentProfile).transport,
    busRoute: (formData as StudentProfile).busRoute,
    address: (formData as StudentProfile).address,
    parentPhoneNumber: (formData as StudentProfile).parentPhoneNumber
  } : "Not a student");
  const [isEditing, setIsEditing] = useState(false);

  // Fetch profile data when component mounts
  useEffect(() => {
    if (!user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  // Update formData when user data changes
  useEffect(() => {
    if (user) {
      setFormData(flattenUser(user) as StudentProfile | FacultyProfile | AdminProfile | HODProfile | GuestProfile);
    }
  }, [user]);

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
  }) => {
    const value = formData?.[name];
    console.log(`Field ${name}:`, value, typeof value);
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <Input
          name={name}
          type={type}
          value={value ?? ""}
          onChange={handleChange}
          disabled={!isEditing}
        />
      </div>
    );
  };

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
            <InputField label="APAR ID" name="aparId" />
            <InputField label="Admission Academic Year" name="admission_academic_year" type="date" />
            <InputField label="Year" name="year" type="number" />
            <InputField label="Date of Birth" name="dateOfBirth" type="date" />
            <InputField label="Semester" name="semester" type="number" />
            <InputField label="Department" name="department" />
            <InputField label="Section" name="section" type="number" />
            <InputField label="Transport" name="transport" />
            {(formData as StudentProfile).transport === "College Bus" && (
              <InputField label="Bus Route" name="busRoute" />
            )}
            <InputField label="Residential Address" name="address" />
            <InputField label="Parent Phone Number" name="parentPhoneNumber" />
          </>
        );
      case "FACULTY":
        return (
          <>
            <InputField label="Phone Number" name="phoneNumber" />
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
      <Button 
        onClick={() => navigate('/dashboard')}
        className="bg-white text-blue-600 border-blue-600 border-2 px-3 py-1 md:px-4 md:py-2 rounded-full text-sm font-medium mb-4 hover:bg-blue-600 hover:text-white hover:rounded-lg"
      >
         Back to Dashboard
      </Button>
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