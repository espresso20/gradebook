import { useState } from 'react'
import { Printer, Download, FileText } from 'lucide-react'
import db from '../lib/store'

export default function Reports() {
  const [selectedStudent, setSelectedStudent] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  const students = db.getStudents()
  const schoolYears = db.getSchoolYears()

  const handleGenerateReport = () => {
    if (selectedStudent && selectedYear) {
      setShowPreview(true)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleExportPDF = () => {
    // Use browser's print to PDF functionality
    window.print()
  }

  return (
    <div className="min-h-full bg-cream-50 dark:bg-gray-900">
      {!showPreview ? (
        // Report Selection Screen
        <div className="p-6 lg:p-8 max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-warmgray-900 dark:text-gray-100 mb-2">
              Grade Reports
            </h1>
            <p className="text-warmgray-600 dark:text-gray-400">
              Generate printable report cards and transcripts
            </p>
          </div>

          <div className="card space-y-6">
            <div>
              <label className="label">Select Student</label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="input"
              >
                <option value="">Choose a student...</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.first_name} {student.last_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Select School Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="input"
              >
                <option value="">Choose a school year...</option>
                {schoolYears.map(year => (
                  <option key={year.id} value={year.id}>
                    {year.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleGenerateReport}
                disabled={!selectedStudent || !selectedYear}
                className="btn-primary flex items-center gap-2 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileText className="w-4 h-4" />
                Generate Report
              </button>
            </div>

            <div className="bg-warmgray-50 dark:bg-gray-800 rounded-lg p-4 border border-warmgray-200 dark:border-gray-700">
              <h3 className="font-semibold text-warmgray-900 dark:text-gray-100 mb-2">
                Report Features
              </h3>
              <ul className="text-sm text-warmgray-600 dark:text-gray-400 space-y-1">
                <li>• Complete course list with grades and credits</li>
                <li>• GPA calculation and summary</li>
                <li>• Attendance statistics</li>
                <li>• Print-optimized layout</li>
                <li>• Export to PDF via print dialog</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        // Report Preview & Print Screen
        <>
          {/* Action Bar - Hidden when printing */}
          <div className="print:hidden bg-white dark:bg-gray-800 border-b border-warmgray-200 dark:border-gray-700 px-6 py-4 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <button
                onClick={() => setShowPreview(false)}
                className="btn-secondary"
              >
                ← Back to Selection
              </button>
              <div className="flex gap-3">
                <button
                  onClick={handlePrint}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
                <button
                  onClick={handleExportPDF}
                  className="btn-primary flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export PDF
                </button>
              </div>
            </div>
          </div>

          {/* Report Content */}
          <ReportCard studentId={parseInt(selectedStudent)} schoolYearId={parseInt(selectedYear)} />
        </>
      )}
    </div>
  )
}

function ReportCard({ studentId, schoolYearId }) {
  const student = db.getStudents().find(s => s.id === studentId)
  const schoolYear = db.getSchoolYears().find(y => y.id === schoolYearId)
  const summary = db.getStudentSummary(studentId, schoolYearId)

  if (!student || !schoolYear) {
    return (
      <div className="p-8 text-center text-warmgray-600">
        Error: Could not find student or school year data
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="p-8 text-center text-warmgray-600">
        Error: Could not load student summary
      </div>
    )
  }

  if (!summary.courses || summary.courses.length === 0) {
    return (
      <div className="p-8 text-center text-warmgray-600">
        No courses found for this student in the selected school year.
      </div>
    )
  }

  const totalCreditsAttempted = summary.courses.reduce((sum, c) => sum + (c.credits || 0), 0)
  const totalCreditsEarned = summary.courses
    .filter(c => c.letterGrade && c.letterGrade !== 'F')
    .reduce((sum, c) => sum + (c.credits || 0), 0)

  return (
    <div className="report-container bg-white p-8 max-w-5xl mx-auto my-8 shadow-lg print:shadow-none print:m-0">
      {/* Header */}
      <div className="text-center mb-8 pb-6 border-b-2 border-warmgray-300">
        <h1 className="font-display text-3xl font-bold text-warmgray-900 mb-2">
          Academic Report Card
        </h1>
        <p className="text-lg text-warmgray-600">
          Family Gradebook
        </p>
      </div>

      {/* Student Information */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <div className="mb-4">
            <div className="text-xs font-semibold text-warmgray-500 uppercase tracking-wider mb-1">
              Student Name
            </div>
            <div className="text-lg font-semibold text-warmgray-900">
              {student.first_name} {student.last_name}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-warmgray-500 uppercase tracking-wider mb-1">
              Grade Level
            </div>
            <div className="text-lg text-warmgray-900">
              {student.grade_level}
            </div>
          </div>
        </div>
        <div>
          <div className="mb-4">
            <div className="text-xs font-semibold text-warmgray-500 uppercase tracking-wider mb-1">
              School Year
            </div>
            <div className="text-lg font-semibold text-warmgray-900">
              {schoolYear.name}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-warmgray-500 uppercase tracking-wider mb-1">
              Report Date
            </div>
            <div className="text-lg text-warmgray-900">
              {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>
      </div>

      {/* Academic Summary */}
      <div className="bg-warmgray-50 rounded-lg p-6 mb-8">
        <h2 className="font-display text-xl font-bold text-warmgray-900 mb-4">
          Academic Summary
        </h2>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-warmgray-600 mb-1">Cumulative GPA</div>
            <div className="text-3xl font-bold text-terracotta-600">
              {summary.gpa ? summary.gpa.toFixed(2) : 'N/A'}
            </div>
          </div>
          <div>
            <div className="text-sm text-warmgray-600 mb-1">Credits Earned</div>
            <div className="text-3xl font-bold text-sage-600">
              {totalCreditsEarned.toFixed(1)}
            </div>
          </div>
          <div>
            <div className="text-sm text-warmgray-600 mb-1">Credits Attempted</div>
            <div className="text-3xl font-bold text-warmgray-900">
              {totalCreditsAttempted.toFixed(1)}
            </div>
          </div>
        </div>
      </div>

      {/* Course Grades */}
      <div className="mb-8">
        <h2 className="font-display text-xl font-bold text-warmgray-900 mb-4">
          Course Grades
        </h2>
        <table className="w-full report-table">
          <thead>
            <tr className="border-b-2 border-warmgray-300">
              <th className="text-left py-3 px-4 font-semibold text-warmgray-700">Course Name</th>
              <th className="text-center py-3 px-4 font-semibold text-warmgray-700">Credits</th>
              <th className="text-center py-3 px-4 font-semibold text-warmgray-700">Grade %</th>
              <th className="text-center py-3 px-4 font-semibold text-warmgray-700">Letter Grade</th>
              <th className="text-center py-3 px-4 font-semibold text-warmgray-700">GPA Points</th>
            </tr>
          </thead>
          <tbody>
            {summary.courses.map((course, index) => {
              const gradeInfo = db.getGradingScale().find(g => g.letter_grade === course.letterGrade)
              return (
                <tr key={course.id} className={index % 2 === 0 ? 'bg-warmgray-50' : 'bg-white'}>
                  <td className="py-3 px-4 font-medium text-warmgray-900">{course.name || 'Untitled Course'}</td>
                  <td className="py-3 px-4 text-center text-warmgray-700">
                    {course.credits !== undefined ? course.credits.toFixed(1) : '0.0'}
                  </td>
                  <td className="py-3 px-4 text-center text-warmgray-700">
                    {course.grade !== null && course.grade !== undefined ? course.grade.toFixed(1) + '%' : 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-center font-semibold text-warmgray-900">
                    {course.letterGrade || 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-center text-warmgray-700">
                    {gradeInfo && gradeInfo.gpa_points !== undefined ? gradeInfo.gpa_points.toFixed(1) : 'N/A'}
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-warmgray-300 font-bold">
              <td className="py-3 px-4">TOTALS</td>
              <td className="py-3 px-4 text-center">{totalCreditsAttempted.toFixed(1)}</td>
              <td className="py-3 px-4 text-center">—</td>
              <td className="py-3 px-4 text-center">—</td>
              <td className="py-3 px-4 text-center">
                GPA: {summary.gpa ? summary.gpa.toFixed(2) : 'N/A'}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Attendance Summary */}
      {summary.attendance && summary.attendance.present !== undefined && (
        <div className="mb-8">
          <h2 className="font-display text-xl font-bold text-warmgray-900 mb-4">
            Attendance Summary
          </h2>
          <div className="bg-warmgray-50 rounded-lg p-6">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-sm text-warmgray-600 mb-1">Days Present</div>
                <div className="text-2xl font-bold text-sage-600">
                  {summary.attendance.present || 0}
                </div>
              </div>
              <div>
                <div className="text-sm text-warmgray-600 mb-1">Days Absent</div>
                <div className="text-2xl font-bold text-red-600">
                  {summary.attendance.absent || 0}
                </div>
              </div>
              <div>
                <div className="text-sm text-warmgray-600 mb-1">Attendance Rate</div>
                <div className="text-2xl font-bold text-warmgray-900">
                  {summary.attendance.percentage !== undefined ? summary.attendance.percentage.toFixed(1) : '0.0'}%
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grading Scale Reference */}
      <div className="border-t-2 border-warmgray-200 pt-6">
        <h3 className="font-semibold text-warmgray-900 mb-3">Grading Scale</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          {db.getGradingScale().map(grade => (
            <div key={grade.id} className="flex justify-between">
              <span className="font-medium text-warmgray-900">{grade.letter_grade}:</span>
              <span className="text-warmgray-600">
                {grade.min_percentage}%+ ({grade.gpa_points.toFixed(1)} GPA)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-warmgray-500 mt-8 pt-6 border-t border-warmgray-200">
        Generated by Family Gradebook on {new Date().toLocaleDateString()}
      </div>
    </div>
  )
}
