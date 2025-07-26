/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/common/components/ui/select";
import { Alert, AlertDescription } from "@/common/components/ui/alert";
import { useAuthStore } from "@/modules/user-management1/store/authStore";
import {
  RegisterData,
  UserRole,
} from "@/modules/user-management1/types/auth.types";
import type { StudentProfile } from "@/modules/user-management1/types/auth.types";
import { UserPlus, Eye, EyeOff, Loader2 } from "lucide-react";

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();
  const todayDate = new Date().toISOString().slice(0, 10);
  const [formData, setFormData] = useState<RegisterData>({
    email: "",
    password: "",
    confirmPassword: "",
    role: "STUDENT",
    profileData: {},
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    // Do not send confirmPassword to the backend
    const { confirmPassword, ...submissionData } = formData;
    try {
      await register(submissionData);
      console.log("Registration successful");
      navigate("/dashboard");
    } catch (err: any) {
      // The error state is already managed by the useAuthStore,
      // so no need to manually set it here.
      console.error("Registration error:", err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (role: UserRole) => {
    setFormData((prev) => ({
      ...prev,
      role,
      profileData: {}, // Reset profile data when role changes
    }));
  };
  const [phoneNumberValid, setPhoneNumberValid] = useState(true);
  const [parentPhoneNumberValid, setParentPhoneNumberValid] = useState(true);
  const handleProfileDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name == "phoneNumber") {
      if (value && /^\d{10}$/.test(value) && !value.startsWith("0")) {
        setPhoneNumberValid(true);
      } else {
        setPhoneNumberValid(false);
      }
    }
    if (name == "parentPhoneNumber") {
      if (value && /^\d{10}$/.test(value) && !value.startsWith("0")) {
        setParentPhoneNumberValid(true);
      } else {
        setParentPhoneNumberValid(false);
      }
    }

    setFormData((prev) => ({
      ...prev,
      profileData: {
        ...prev.profileData,
        [name]: value,
      },
    }));
  };

  const roleOptions = [
    { value: "STUDENT", label: "Student" },
    { value: "FACULTY", label: "Faculty" },
    { value: "HOD", label: "Head of Department" },
    { value: "GUEST", label: "Guest" },
  ];

  // Mapping of year to allowed semesters
  const semesterMap: Record<string, string[]> = {
    "1": ["1", "2"],
    "2": ["3", "4"],
    "3": ["5", "6"],
    "4": ["7", "8"],
  };

  // Helper to get current allowed semesters based on selected year
  const selectedYear = (formData.profileData as any).year as string | undefined;
  const allowedSemesters = selectedYear
    ? semesterMap[selectedYear]
    : ["1", "2", "3", "4", "5", "6", "7", "8"];

  // When year changes, if current semester not in allowed list reset it
  const handleYearChange = (value: string) => {
    setFormData((prev) => {
      const currentSemester = (prev.profileData as any).semester as
        | string
        | undefined;
      const semestersForYear = semesterMap[value];
      const newSemester =
        currentSemester && semestersForYear.includes(currentSemester)
          ? currentSemester
          : "";
      return {
        ...prev,
        profileData: {
          ...prev.profileData,
          year: value,
          semester: newSemester,
        },
      };
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 p-4">
      <Card className="w-full max-w-lg shadow-xl dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-green-600 rounded-full">
              <UserPlus className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold dark:text-white">Create Account</CardTitle>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="dark:text-gray-200">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@gmail.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="dark:text-gray-200">Role</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                  {roleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Common fields for all roles */}
            <div className="space-y-2">
              <Label htmlFor="firstName" className="dark:text-gray-200">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Enter first name"
                value={formData.profileData.firstName || ""}
                onChange={handleProfileDataChange}
                required
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
              <Label htmlFor="lastName" className="dark:text-gray-200">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Enter last name"
                value={formData.profileData.lastName || ""}
                onChange={handleProfileDataChange}
                required
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            {/* Role-specific fields */}
            {formData.role === "STUDENT" && (
              <div className="space-y-2">
                <Label htmlFor="rollNumber" className="dark:text-gray-200">Roll Number</Label>
                <Input
                  id="rollNumber"
                  name="rollNumber"
                  type="text"
                  placeholder="Enter your roll number"
                  value={
                    (formData.profileData as StudentProfile).rollNumber || ""
                  }
                  onChange={handleProfileDataChange}
                  required
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />

                <Label htmlFor="phoneNumber" className="dark:text-gray-200">Phone number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="Phone number"
                  value={formData.profileData.phoneNumber || ""}
                  onChange={handleProfileDataChange}
                  required
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
                {!phoneNumberValid && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      Phone Number should be 10 digit and not leading zeroes
                    </AlertDescription>
                  </Alert>
                )}

                <Label htmlFor="aparId" className="dark:text-gray-200">APAR id</Label>
                <Input
                  id="aparId"
                  name="aparId"
                  type="text"
                  placeholder="APAR id"
                  value={
                    formData.role === "STUDENT"
                      ? (formData.profileData as any).aparId || ""
                      : ""
                  }
                  onChange={handleProfileDataChange}
                  required
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />

                <Label htmlFor="admission_academic_year" className="dark:text-gray-200">Admission date</Label>
                <Input
                  id="admission_academic_year"
                  name="admission_academic_year"
                  type="date"
                  max={todayDate}
                  value={
                    (formData.profileData as any)["admission_academic_year"] ||
                    ""
                  }
                  onChange={handleProfileDataChange}
                  required
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <div className="flex items-center space-x-2 mt-2">
                  <input
                    id="lateralEntry"
                    name="lateralEntry"
                    type="checkbox"
                    checked={!!(formData.profileData as any).lateralEntry}
                    onChange={(e) =>
                      handleProfileDataChange({
                        target: {
                          name: "lateralEntry",
                          value: e.target.checked,
                        },
                      } as unknown as React.ChangeEvent<HTMLInputElement>)
                    }
                    className="h-4 w-4 accent-green-600"
                  />
                  <Label htmlFor="lateralEntry" className="mb-0 dark:text-gray-200">
                    Lateral Entry
                  </Label>
                </div>
                <Label htmlFor="year" className="dark:text-gray-200">Year</Label>
                <Select
                  value={(formData.profileData as any).year || ""}
                  onValueChange={handleYearChange}
                >
                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                  </SelectContent>
                </Select>

                <Label htmlFor="dateOfBirth" className="dark:text-gray-200">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  max={todayDate}
                  value={
                    (formData.profileData as Partial<StudentProfile>)
                      .dateOfBirth || ""
                  }
                  onChange={handleProfileDataChange}
                  required
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />

                <Label htmlFor="semester" className="dark:text-gray-200">Semester</Label>
                <Select
                  value={(formData.profileData as any).semester || ""}
                  onValueChange={(value) =>
                    handleProfileDataChange({
                      target: { name: "semester", value },
                    } as React.ChangeEvent<HTMLInputElement>)
                  }
                >
                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                    {allowedSemesters.map((sem) => (
                      <SelectItem key={sem} value={sem}>
                        {sem}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Label htmlFor="department" className="dark:text-gray-200">Department</Label>
                <Select
                  value={(formData.profileData as any).department || ""}
                  onValueChange={(value) =>
                    handleProfileDataChange({
                      target: { name: "department", value },
                    } as React.ChangeEvent<HTMLInputElement>)
                  }
                >
                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                    <SelectItem value="CSE">CSE</SelectItem>
                    <SelectItem value="CSD">CSD</SelectItem>
                    <SelectItem value="CSM">CSM</SelectItem>
                    <SelectItem value="ECE">ECE</SelectItem>
                    <SelectItem value="EEE">EEE</SelectItem>
                    <SelectItem value="Mechanical">Mechanical</SelectItem>
                  </SelectContent>
                </Select>

                {/* New Section select */}
                <Label htmlFor="section" className="dark:text-gray-200">Section</Label>
                <Select
                  value={(formData.profileData as any).section || ""}
                  onValueChange={(value) =>
                    handleProfileDataChange({
                      target: { name: "section", value },
                    } as React.ChangeEvent<HTMLInputElement>)
                  }
                >
                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                  </SelectContent>
                </Select>

                <Label htmlFor="transport" className="dark:text-gray-200">Transport</Label>
                <Select
                  value={(formData.profileData as any).transport || ""}
                  onValueChange={(value) =>
                    handleProfileDataChange({
                      target: { name: "transport", value },
                    } as React.ChangeEvent<HTMLInputElement>)
                  }
                >
                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <SelectValue placeholder="Select transport" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                    <SelectItem value="College Bus">College Bus</SelectItem>
                    <SelectItem value="RTC">RTC</SelectItem>
                    <SelectItem value="Own Vehicle">Own Vehicle</SelectItem>
                  </SelectContent>
                </Select>

                {/* Show bus route if College Bus is selected */}
                {(formData.profileData as any).transport === "College Bus" && (
                  <>
                    <Label htmlFor="busRoute" className="dark:text-gray-200">Bus Route</Label>
                    <Select
                      value={(formData.profileData as any).busRoute || ""}
                      onValueChange={(value) =>
                        handleProfileDataChange({
                          target: { name: "busRoute", value },
                        } as React.ChangeEvent<HTMLInputElement>)
                      }
                    >
                      <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <SelectValue placeholder="Select bus route" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                        <SelectItem value="Vizag">Vizag</SelectItem>
                        <SelectItem value="Parawada">Parawada</SelectItem>
                        <SelectItem value="Anakapalle">Anakapalle</SelectItem>
                        <SelectItem value="Chodawaram">Chodawaram</SelectItem>
                        <SelectItem value="Narsipatnam">Narsipatnam</SelectItem>
                        <SelectItem value="Tuni">Tuni</SelectItem>
                        <SelectItem value="Yelamanchili">
                          Yelamanchili
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </>
                )}

                <Label htmlFor="address" className="dark:text-gray-200">Residential Address</Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="residential address"
                  value={(formData.profileData as any).address || ""}
                  onChange={handleProfileDataChange}
                  required
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />

                <Label htmlFor="parentPhoneNumber" className="dark:text-gray-200">Parent Phone Number</Label>
                <Input
                  id="parentPhoneNumber"
                  name="parentPhoneNumber"
                  type="tel"
                  placeholder="Parent phone number"
                  value={(formData.profileData as any).parentPhoneNumber || ""}
                  onChange={handleProfileDataChange}
                  required
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
              </div>
            )}

            {formData.role === "FACULTY" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="dark:text-gray-200">Phone number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    placeholder="Phone number"
                    value={formData.profileData.phoneNumber || ""}
                    onChange={handleProfileDataChange}
                    required
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  />
                </div>
                {!phoneNumberValid && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      Phone Number should be 10 digit and not leading zeroes
                    </AlertDescription>
                  </Alert>
                )}
              </>
            )}

            {formData.role === "GUEST" && (
              <div className="space-y-2">
                {/* No additional fields for GUEST */}
              </div>
            )}

            {formData.role === "HOD" && (
              <div className="space-y-2">
                {/* No additional fields for HOD */}
              </div>
            )}

            {!parentPhoneNumberValid && (
              <Alert variant="destructive">
                <AlertDescription>
                  Phone Number should be 10 digit and not leading zeroes
                </AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="password" className="dark:text-gray-200">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              {/* Enhanced Password requirements */}
              <div className="mt-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 px-4 py-3 text-xs">
                <div className="mb-2 font-semibold text-gray-800 dark:text-gray-200">
                  Your password must have:
                </div>
                <ul className="space-y-1 list-disc list-inside">
                  <li
                    className={
                      formData.password
                        ? formData.password.length >= 8
                          ? "text-green-600 font-medium"
                          : "text-red-600 font-medium"
                        : "text-gray-600 dark:text-gray-400"
                    }
                  >
                    Minimum <span className="font-bold">8 characters</span>
                  </li>
                  <li
                    className={
                      formData.password
                        ? /[A-Z]/.test(formData.password)
                          ? "text-green-600 font-medium"
                          : "text-red-600 font-medium"
                        : "text-gray-600 dark:text-gray-400"
                    }
                  >
                    At least{" "}
                    <span className="font-bold">one uppercase letter</span>{" "}
                    (A–Z)
                  </li>
                  <li
                    className={
                      formData.password
                        ? /[a-z]/.test(formData.password)
                          ? "text-green-600 font-medium"
                          : "text-red-600 font-medium"
                        : "text-gray-600 dark:text-gray-400"
                    }
                  >
                    At least{" "}
                    <span className="font-bold">one lowercase letter</span>{" "}
                    (a–z)
                  </li>
                  <li
                    className={
                      formData.password
                        ? /\d/.test(formData.password)
                          ? "text-green-600 font-medium"
                          : "text-red-600 font-medium"
                        : "text-gray-600 dark:text-gray-400"
                    }
                  >
                    At least <span className="font-bold">one number</span> (0–9)
                  </li>
                  <li
                    className={
                      formData.password
                        ? /[!@#$%^&*(),.?":{}|<>_\-[\];'/`~+=]/.test(
                            formData.password
                          )
                          ? "text-green-600 font-medium"
                          : "text-red-600 font-medium"
                        : "text-gray-600 dark:text-gray-400"
                    }
                  >
                    At least{" "}
                    <span className="font-bold">one special character</span>{" "}
                    (e.g. @, #, $, %, !, &amp;, *)
                  </li>
                  <li
                    className={
                      formData.password
                        ? !/\s/.test(formData.password)
                          ? "text-green-600 font-medium"
                          : "text-red-600 font-medium"
                        : "text-gray-600 dark:text-gray-400"
                    }
                  >
                    <span className="font-bold">No spaces</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="dark:text-gray-200">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            {formData.password !== formData.confirmPassword &&
              formData.confirmPassword && (
                <Alert variant="destructive">
                  <AlertDescription>Passwords do not match</AlertDescription>
                </Alert>
              )}

            <Button
              type="submit"
              className="w-full border-2 border-green-600 text-green-600 bg-white hover:bg-green-600 hover:text-white transition duration-700 group dark:bg-green-600 dark:border-green-600 dark:text-white dark:hover:bg-green-700 dark:hover:border-green-700"
              style={{ boxShadow: "0 0 0 transparent" }}
              disabled={
                isLoading || formData.password !== formData.confirmPassword
              }
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = "0 0 10px rgb(19, 197, 84)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow = "0 0 0 transparent")
              }
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create Account
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Already have an account?{" "}
            </span>
            <Button
              variant="link"
              size="sm"
              className="px-0 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
              onClick={() => navigate("/login")}
            >
              Sign in here
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterForm;
