import React, { useState } from 'react';
import { FeeProvider, FeeDetail } from './FeeContext';
import { useFeeContext } from './useFeeContext';
import DashboardNav from '../../../../components/dashboard/DashboardNav';

// Example students for demo (should come from backend or context)
const students = Array.from({ length: 50 }, (_, i) => ({
  id: (i + 1).toString(),
  name: `Student ${i + 1}`
}));

// Example student details for demo (should come from backend or context)
const studentDetails: Record<string, {
  name: string;
  rollNumber: string;
  dateOfBirth: string;
  phoneNumber: string;
  parentName: string;
  parentPhone: string;
  aparId: string;
  branch: string;
  courseProgram: string;
  section: string;
}> = Object.fromEntries(
  students.map((s, i) => [
    s.id,
    {
      name: s.name,
      rollNumber: `2024PHY${(i + 1).toString().padStart(3, '0')}`,
      dateOfBirth: `2004-${((i % 12) + 1).toString().padStart(2, '0')}-${((i % 28) + 1).toString().padStart(2, '0')}`,
      phoneNumber: `78942${(10000 + i).toString()}`,
      parentName: `Parent ${i + 1}`,
      parentPhone: `98765${(10000 + i).toString()}`,
      aparId: `APAR${(100000 + i).toString()}`,
      branch: i % 2 === 0 ? 'Physics' : 'Chemistry',
      courseProgram: i % 2 === 0 ? 'BSc Physics' : 'BSc Chemistry',
      section: String.fromCharCode(65 + (i % 3)), // A, B, C
    }
  ]))
;

const FeeEditor: React.FC<{ studentId: string }> = ({ studentId }) => {
  const { studentFees, updateStudentFee } = useFeeContext();
  const [fees, setFees] = useState<FeeDetail[]>(studentFees[studentId] || []);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [newFee, setNewFee] = useState<FeeDetail>({ item: '', amount: '', dueDate: '', status: 'Due' });

  const handleChange = (idx: number, field: keyof FeeDetail, value: string) => {
    setFees(fees => fees.map((fee, i) => i === idx ? { ...fee, [field]: value } : fee));
  };

  const handleSave = () => {
    updateStudentFee(studentId, fees);
    setEditIdx(null);
  };

  const handleAdd = () => {
    setFees([...fees, newFee]);
    setNewFee({ item: '', amount: '', dueDate: '', status: 'Due' });
  };

  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-2">Fee Details</h3>
      <table className="min-w-full text-xs md:text-sm border mb-2">
        <thead>
          <tr className="bg-gray-50">
            <th className="py-2 px-3">Item</th>
            <th className="py-2 px-3">Amount</th>
            <th className="py-2 px-3">Due Date</th>
            <th className="py-2 px-3">Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {fees.map((fee, idx) => (
            <tr key={idx}>
              <td>
                {editIdx === idx ? (
                  <input value={fee.item} onChange={e => handleChange(idx, 'item', e.target.value)} className="border rounded px-1" />
                ) : fee.item}
              </td>
              <td>
                {editIdx === idx ? (
                  <input value={fee.amount} onChange={e => handleChange(idx, 'amount', e.target.value)} className="border rounded px-1" />
                ) : fee.amount}
              </td>
              <td>
                {editIdx === idx ? (
                  <input value={fee.dueDate} onChange={e => handleChange(idx, 'dueDate', e.target.value)} className="border rounded px-1" type="date" />
                ) : fee.dueDate}
              </td>
              <td>
                {editIdx === idx ? (
                  <select value={fee.status} onChange={e => handleChange(idx, 'status', e.target.value)} className="border rounded px-1">
                    <option value="Due">Due</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Paid">Paid</option>
                  </select>
                ) : fee.status}
              </td>
              <td>
                {editIdx === idx ? (
                  <button className="text-blue-600" onClick={handleSave}>Save</button>
                ) : (
                  <button className="text-blue-600" onClick={() => setEditIdx(idx)}>Edit</button>
                )}
              </td>
            </tr>
          ))}
          <tr>
            <td><input value={newFee.item} onChange={e => setNewFee(f => ({ ...f, item: e.target.value }))} className="border rounded px-1" /></td>
            <td><input value={newFee.amount} onChange={e => setNewFee(f => ({ ...f, amount: e.target.value }))} className="border rounded px-1" /></td>
            <td><input value={newFee.dueDate} onChange={e => setNewFee(f => ({ ...f, dueDate: e.target.value }))} className="border rounded px-1" type="date" /></td>
            <td>
              <select value={newFee.status} onChange={e => setNewFee(f => ({ ...f, status: e.target.value as FeeDetail['status'] }))} className="border rounded px-1">
                <option value="Due">Due</option>
                <option value="Overdue">Overdue</option>
                <option value="Paid">Paid</option>
              </select>
            </td>
            <td><button className="text-green-600" onClick={handleAdd}>Add</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const ClassTeacherDashboard: React.FC = () => {
  const { studentFees } = useFeeContext();
  const [selectedStudent, setSelectedStudent] = useState<string>('1');
  const details = studentDetails[selectedStudent];
  const navSections = React.useMemo(() => [
    { label: 'Student Details', section: 'student-details' },
    { label: 'Fee Management', section: 'fee-management' },
  ], []);
  const studentDetailsRef = React.useRef<HTMLDivElement>(null);
  const feeManagementRef = React.useRef<HTMLDivElement>(null);
  const sectionRefs = React.useMemo(() => ({
    'student-details': studentDetailsRef,
    'fee-management': feeManagementRef,
  }), [studentDetailsRef, feeManagementRef]);
  const [activeSection, setActiveSection] = useState<string>('student-details');

  // Scroll handler for nav
  const handleNavClick = (section: string) => {
    setActiveSection(section);
    const ref = sectionRefs[section];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Listen to scroll to update active section
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      let current = 'student-details';
      for (const { section, ref } of navSections.map(s => ({ section: s.section, ref: sectionRefs[s.section] }))) {
        if (ref.current) {
          const offsetTop = ref.current.offsetTop;
          if (scrollPosition >= offsetTop) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navSections, sectionRefs]);

  // Quick stats (mocked)
  const totalStudents = students.length;
  const totalDue = (studentFees[selectedStudent] || []).filter(f => f.status !== 'Paid').length;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <DashboardNav
        activeSection={activeSection}
        onNavClick={handleNavClick}
        dashboardType="class_teacher"
      />
      {/* Main Content */}
      <main className="flex-1 flex justify-center">
        <div className="w-full max-w-4xl px-2 md:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-blue-800 mb-1">Class Teacher Dashboard</h1>
              <p className="text-gray-500 text-sm">Welcome! Manage your class, view student details, and update fee records.</p>
            </div>
            <div className="flex gap-4">
              <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center min-w-[90px]">
                <div className="text-lg font-bold text-blue-700">{totalStudents}</div>
                <div className="text-xs text-gray-500">Total Students</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center min-w-[90px]">
                <div className="text-lg font-bold text-red-600">{totalDue}</div>
                <div className="text-xs text-gray-500">Fees Due</div>
              </div>
            </div>
          </div>
          {/* Student Section Menu - Segmented Control Style */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-lg bg-blue-100 p-1 shadow-inner">
              {students.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStudent(s.id)}
                  className={`px-5 py-2 font-medium rounded-md transition-all focus:outline-none
                    ${selectedStudent === s.id
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-transparent text-blue-700 hover:bg-blue-200'}`}
                  style={{ minWidth: 120 }}
                  aria-pressed={selectedStudent === s.id}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
          {/* Student Details Section */}
          <section ref={studentDetailsRef} id="student-details" className="bg-white rounded-xl shadow p-6 mb-8 border-t-4 border-blue-200">
            <h2 className="text-2xl font-semibold text-blue-700 mb-4 flex items-center gap-2">
              <span className="inline-block w-2 h-6 bg-blue-500 rounded-full mr-2" />Student Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-base mb-4">
              <div><span className="font-medium text-gray-600">Name:</span> {details.name}</div>
              <div><span className="font-medium text-gray-600">Roll Number:</span> {details.rollNumber}</div>
              <div><span className="font-medium text-gray-600">Date of Birth:</span> {details.dateOfBirth}</div>
              <div><span className="font-medium text-gray-600">Phone Number:</span> {details.phoneNumber}</div>
              <div><span className="font-medium text-gray-600">Parent Name:</span> {details.parentName}</div>
              <div><span className="font-medium text-gray-600">Parent Phone:</span> {details.parentPhone}</div>
              <div><span className="font-medium text-gray-600">APAR ID:</span> {details.aparId}</div>
              <div><span className="font-medium text-gray-600">Branch:</span> {details.branch}</div>
              <div><span className="font-medium text-gray-600">Course Program:</span> {details.courseProgram}</div>
              <div><span className="font-medium text-gray-600">Section:</span> {details.section}</div>
            </div>
          </section>
          {/* Fee Management Section */}
          <section ref={feeManagementRef} id="fee-management" className="bg-white rounded-xl shadow p-6 mb-8 border-t-4 border-blue-200">
            <h2 className="text-2xl font-semibold text-blue-700 mb-4 flex items-center gap-2">
              <span className="inline-block w-2 h-6 bg-blue-500 rounded-full mr-2" />Fee Management
            </h2>
            <FeeEditor studentId={selectedStudent} />
          </section>
        </div>
      </main>
    </div>
  );
};

const WrappedClassTeacherDashboard = () => (
  <FeeProvider>
    <ClassTeacherDashboard />
  </FeeProvider>
);

export default WrappedClassTeacherDashboard;
