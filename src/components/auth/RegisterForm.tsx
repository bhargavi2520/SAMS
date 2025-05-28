import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuthStore } from '@/store/authStore';
import { RegisterData, UserRole } from '@/types/auth.types';
import { UserPlus, Eye, EyeOff, Loader2 } from 'lucide-react';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();
  
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT',
    profileData: {}
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (formData.password !== formData.confirmPassword) {
      // Handle password mismatch
      return;
    }
    
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by the store
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (role: UserRole) => {
    setFormData(prev => ({
      ...prev,
      role,
      profileData: {} // Reset profile data when role changes
    }));
  };

  const handleProfileDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      profileData: {
        ...prev.profileData,
        [name]: value
      }
    }));
  };

  const roleOptions = [
    { value: 'STUDENT', label: 'Student'},
    { value: 'FACULTY', label: 'Faculty'},
    { value: 'ADMIN', label: 'Administrator' },
    { value: 'HOD', label: 'Head of Department'},
    { value: 'CLASS_TEACHER', label: 'Class Teacher'},
    { value: 'GUEST', label: 'Guest'}
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-green-600 rounded-full">
              <UserPlus className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>
            Join SAMS and get access to the academic management system
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@gmail.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-green-500">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
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
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-green-500"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-green-500"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
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
            
            {/* Student-specific fields */}
            {formData.role === 'STUDENT' && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter name"
                  value={formData.profileData.name || ''}
                  onChange={handleProfileDataChange}
                  required
                />

                <Label htmlFor="phoneNumber">Phone number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="Phone number"
                  value={formData.profileData.phoneNumber || ''}
                  onChange={handleProfileDataChange}
                  required
                />

                <Label htmlFor="aparId">APAR id</Label>
                <Input
                  id="aparId"
                  name="aparId"
                  type="text"
                  placeholder="APAR id"
                  value={formData.profileData.aparId || ''}
                  onChange={handleProfileDataChange}
                  required
                />

                <Label htmlFor="admissionDate">Admission date</Label>
                <Input
                  id="admissionDate"
                  name="admissionDate"
                  type="date"
                  value={formData.profileData.admissionDate || ''}
                  onChange={handleProfileDataChange}
                  required
                />

                <Label htmlFor="year">Year</Label>
                <Select
                  value={formData.profileData.year || ''}
                  onValueChange={value =>
                    handleProfileDataChange({
                      target: { name: 'year', value }
                    } as React.ChangeEvent<HTMLInputElement>)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                  </SelectContent>
                </Select>

                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  name="dob"
                  type="date"
                  value={formData.profileData.dob || ''}
                  onChange={handleProfileDataChange}
                  required
                />

                <Label htmlFor="semester">Semester</Label>
                <Select
                  value={formData.profileData.semester || ''}
                  onValueChange={value =>
                    handleProfileDataChange({
                      target: { name: 'semester', value }
                    } as React.ChangeEvent<HTMLInputElement>)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="6">6</SelectItem>
                    <SelectItem value="7">7</SelectItem>
                    <SelectItem value="8">8</SelectItem>
                  </SelectContent>
                </Select>

                <Label htmlFor="department">Department</Label>
                <Select
                  value={formData.profileData.department || ''}
                  onValueChange={value =>
                    handleProfileDataChange({
                      target: { name: 'department', value }
                    } as React.ChangeEvent<HTMLInputElement>)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CSE">CSE</SelectItem>
                    <SelectItem value="CSD">CSD</SelectItem>
                    <SelectItem value="CSM">CSM</SelectItem>
                    <SelectItem value="ECE">ECE</SelectItem>
                    <SelectItem value="EEE">EEE</SelectItem>
                    <SelectItem value="Mechanical">Mechanical</SelectItem>
                  </SelectContent>
                </Select>

                <Label htmlFor="transport">Transport</Label>
                <Select
                  value={formData.profileData.transport || ''}
                  onValueChange={value =>
                    handleProfileDataChange({
                      target: { name: 'transport', value }
                    } as React.ChangeEvent<HTMLInputElement>)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select transport" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bus">Bus</SelectItem>
                    <SelectItem value="Own">Own</SelectItem>
                    <SelectItem value="None">None</SelectItem>
                  </SelectContent>
                </Select>

                <Label htmlFor="address">Residential Address</Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="residential address"
                  value={formData.profileData.address || ''}
                  onChange={handleProfileDataChange}
                  required
                />

                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Select
                  value={formData.profileData.bloodGroup || ''}
                  onValueChange={value =>
                    handleProfileDataChange({
                      target: { name: 'bloodGroup', value }
                    } as React.ChangeEvent<HTMLInputElement>)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                  </SelectContent>
                </Select>

                <Label htmlFor="parentPhoneNumber">Parent Phone Number</Label>
                <Input
                  id="parentPhoneNumber"
                  name="parentPhoneNumber"
                  type="tel"
                  placeholder="Parent phone number"
                  value={formData.profileData.parentPhoneNumber || ''}
                  onChange={handleProfileDataChange}
                  required
                />
              </div>
            )}

            {/* Teacher-specific fields */}
            {formData.role === 'FACULTY' && (
              <div className="space-y-2">
                <Label htmlFor="subjectAssigned">Subject Assigned</Label>
                <Input
                  id="subjectAssigned"
                  name="subjectAssigned"
                  type="text"
                  placeholder="Enter subject assigned"
                  value={formData.profileData.subjectAssigned || ''}
                  onChange={handleProfileDataChange}
                  required
                />
                <Label htmlFor="department">Department</Label>
                <Select
                  value={formData.profileData.department || ''}
                  onValueChange={value =>
                    handleProfileDataChange({
                      target: { name: 'department', value }
                    } as React.ChangeEvent<HTMLInputElement>)
                  }
                >
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-green-500">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CSE">CSE</SelectItem>
                    <SelectItem value="CSD">CSD</SelectItem>
                    <SelectItem value="CSM">CSM</SelectItem>
                    <SelectItem value="ECE">ECE</SelectItem>
                    <SelectItem value="EEE">EEE</SelectItem>
                    <SelectItem value="Mechanical">Mechanical</SelectItem>
                  </SelectContent>
                </Select>
                <Label htmlFor="classes">Classes</Label>
                <Input
                  id="classes"
                  name="classes"
                  type="text"
                  placeholder="Enter classes (comma separated)"
                  value={formData.profileData.classes || ''}
                  onChange={handleProfileDataChange}
                  required
                />
              </div>
            )}

            {/* Class Teacher-specific fields */}
            {formData.role === 'CLASS_TEACHER' && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter name"
                  value={formData.profileData.name || ''}
                  onChange={handleProfileDataChange}
                  required
                />

                <Label htmlFor="phoneNumber">Phone number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="Phone number"
                  value={formData.profileData.phoneNumber || ''}
                  onChange={handleProfileDataChange}
                  required
                />

                <Label htmlFor="subjectAssigned">Subject Assignment</Label>
                <Input
                  id="subjectAssigned"
                  name="subjectAssigned"
                  type="text"
                  placeholder="Subject Assignment"
                  value={formData.profileData.subjectAssigned || ''}
                  onChange={handleProfileDataChange}
                  required
                />

                <Label htmlFor="department">Department</Label>
                <Select
                  value={formData.profileData.department || ''}
                  onValueChange={value =>
                    handleProfileDataChange({
                      target: { name: 'department', value }
                    } as React.ChangeEvent<HTMLInputElement>)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CSE">CSE</SelectItem>
                    <SelectItem value="CSD">CSD</SelectItem>
                    <SelectItem value="CSM">CSM</SelectItem>
                    <SelectItem value="ECE">ECE</SelectItem>
                    <SelectItem value="EEE">EEE</SelectItem>
                    <SelectItem value="Mechanical">Mechanical</SelectItem>
                  </SelectContent>
                </Select>

                <Label htmlFor="semester">Semester</Label>
                <Select
                  value={formData.profileData.semester || ''}
                  onValueChange={value =>
                    handleProfileDataChange({
                      target: { name: 'semester', value }
                    } as React.ChangeEvent<HTMLInputElement>)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="6">6</SelectItem>
                    <SelectItem value="7">7</SelectItem>
                    <SelectItem value="8">8</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Administrator-specific fields */}
            {formData.role === 'ADMIN' && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter name"
                  value={formData.profileData.name || ''}
                  onChange={handleProfileDataChange}
                  required
                />
              </div>
            )}

            {/* Guest-specific fields */}
            {formData.role === 'GUEST' && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter name"
                  value={formData.profileData.name || ''}
                  onChange={handleProfileDataChange}
                  required
                />
              </div>
            )}

            {/* Head of Department-specific fields */}
            {formData.role === 'HOD' && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter name"
                  value={formData.profileData.name || ''}
                  onChange={handleProfileDataChange}
                  required
                />

                <Label htmlFor="subjectAssigned">Subject Assignment</Label>
                <Input
                  id="subjectAssigned"
                  name="subjectAssigned"
                  type="text"
                  placeholder="Subject Assignment"
                  value={formData.profileData.subjectAssigned || ''}
                  onChange={handleProfileDataChange}
                  required
                />
              </div>
            )}
            
            {formData.password !== formData.confirmPassword && formData.confirmPassword && (
              <Alert variant="destructive">
                <AlertDescription>Passwords do not match</AlertDescription>
              </Alert>
            )}
            
            <Button
              type="submit"
              className="w-full border-2 border-green-600 text-green-600 bg-white hover:bg-green-600 hover:text-white transition duration-700 group"
              style={{ boxShadow: '0 0 0 transparent' }}
              disabled={isLoading || formData.password !== formData.confirmPassword}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 10px rgb(19, 197, 84)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 0 transparent')}
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
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
            </span>
            <Button
              variant="link"
              size="sm"
              className="px-0 text-green-600 hover:text-green-800"
              onClick={() => navigate('/login')}
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
