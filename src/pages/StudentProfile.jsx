import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Plus,
  BookOpen,
  Calendar,
  TrendingUp,
  Edit2,
  Trash2,
  MoreVertical,
  ChevronRight,
  Settings as SettingsIcon
} from 'lucide-react'
import db from '../lib/store'
import { getGradeColorClass } from '../lib/database'
import AddCourseModal from '../components/AddCourseModal'

export default function StudentProfile({ onUpdate }) {
  const { studentId } = useParams()
  const navigate = useNavigate()
  const [student, setStudent] = useState(null)
  const [summary, setSummary] = useState(null)
  const [showAddCourse, setShowAddCourse] = useState(false)
  const [selectedYearId, setSelectedYearId] = useState(null)
  const [activeModal, setActiveModal] = useState(null)
  const [showStudentMenu, setShowStudentMenu] = useState(false)

  const schoolYears = db.getSchoolYears()
  const activeSchoolYear = db.getActiveSchoolYear()

  // Initialize selected year to active year
  useEffect(() => {
    if (activeSchoolYear && !selectedYearId) {
      setSelectedYearId(activeSchoolYear.id)
    }
  }, [activeSchoolYear, selectedYearId])

  useEffect(() => {
    loadStudent()
  }, [studentId, selectedYearId])

  const loadStudent = () => {
    const s = db.getStudent(parseInt(studentId))
    setStudent(s)
    if (s && selectedYearId) {
      setSummary(db.getStudentSummary(s.id, selectedYearId))
    }
  }

  const selectedYear = schoolYears.find(y => y.id === selectedYearId)

  const handleAddCourse = (courseData) => {
    db.addCourse({
      ...courseData,
      student_id: parseInt(studentId),
      school_year_id: selectedYearId,
    })
    setShowAddCourse(false)
    loadStudent()
  }

  const handleDeleteStudent = () => {
    if (confirm(`Are you sure you want to delete ${student.first_name} ${student.last_name} and all associated courses, grades, and attendance records? This cannot be undone.`)) {
      db.deleteStudent(parseInt(studentId))
      onUpdate()
      navigate('/')
    }
  }

  if (!student) {
    return (
      <div className="p-8 text-center text-warmgray-500 dark:text-gray-400">
        Student not found
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-terracotta-400 to-terracotta-600 flex items-center justify-center text-white text-2xl font-semibold">
            {student.first_name.charAt(0)}
            {student.last_name?.charAt(0) || ''}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-warmgray-800 dark:text-gray-100">
              {student.first_name} {student.last_name}
            </h1>
            <p className="text-warmgray-500 dark:text-gray-400">
              {student.grade_level || 'Grade not set'}
            </p>
          </div>
        </div>

        <div className="flex gap-3 relative">
          <Link
            to={`/student/${studentId}/attendance`}
            className="btn-secondary flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Attendance
          </Link>
          <button
            onClick={() => setShowAddCourse(true)}
            className="btn-primary flex items-center gap-2"
            disabled={!selectedYearId}
          >
            <Plus className="w-4 h-4" />
            Add Course
          </button>

          {/* Student Settings Menu */}
          <div className="relative">
            <button
              onClick={() => setShowStudentMenu(!showStudentMenu)}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-warmgray-600 dark:text-gray-300 hover:bg-warmgray-100 dark:hover:bg-gray-700 transition-colors"
              title="Student settings"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {showStudentMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowStudentMenu(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-warm-lg border border-warmgray-100 dark:border-gray-700 py-1 z-20">
                  <button
                    onClick={() => {
                      setShowStudentMenu(false)
                      handleDeleteStudent()
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Student
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* School Year Selector */}
      <div className="mb-8">
        <label className="label mb-2">School Year</label>
        <div className="flex flex-wrap gap-2">
          {schoolYears.map(year => (
            <button
              key={year.id}
              onClick={() => setSelectedYearId(year.id)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                selectedYearId === year.id
                  ? 'bg-terracotta-500 text-white shadow-warm'
                  : 'bg-warmgray-100 text-warmgray-700 hover:bg-warmgray-200'
              }`}
            >
              {year.name}
              {year.is_active && (
                <span className="ml-2 text-xs opacity-75">(Active)</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<TrendingUp className="w-5 h-5 text-terracotta-500" />}
          label="GPA"
          value={summary?.gpa?.toFixed(2) || '—'}
          onClick={() => setActiveModal('gpa')}
        />
        <StatCard
          icon={<BookOpen className="w-5 h-5 text-sage-500" />}
          label="Courses"
          value={summary?.courses?.length || 0}
          onClick={() => setActiveModal('courses')}
        />
        <StatCard
          icon={<Calendar className="w-5 h-5 text-gold-500" />}
          label="School Days"
          value={summary?.attendance?.total || 0}
          onClick={() => setActiveModal('attendance')}
        />
        <StatCard
          icon={<Calendar className="w-5 h-5 text-warmgray-400 dark:text-gray-500" />}
          label="Absent"
          value={summary?.attendance?.absent || 0}
          onClick={() => setActiveModal('attendance')}
        />
      </div>

      {/* Detail Modals */}
      {activeModal === 'gpa' && (
        <GPADetailModal
          summary={summary}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === 'courses' && (
        <CoursesDetailModal
          summary={summary}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === 'attendance' && (
        <AttendanceDetailModal
          studentId={parseInt(studentId)}
          schoolYearId={selectedYearId}
          attendance={summary?.attendance}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* Courses List */}
      <div className="mb-6">
        <h2 className="font-display text-xl font-semibold text-warmgray-800 dark:text-gray-100 mb-4">
          Courses
        </h2>
        
        {(!summary?.courses || summary.courses.length === 0) ? (
          <div className="card text-center py-12">
            <BookOpen className="w-12 h-12 text-warmgray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="font-semibold text-warmgray-600 dark:text-gray-300 mb-2">No courses yet</h3>
            <p className="text-warmgray-500 dark:text-gray-400 mb-4">
              Add your first course to start tracking grades
            </p>
            <button 
              onClick={() => setShowAddCourse(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add First Course
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {summary.courses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                studentId={studentId}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Course Modal */}
      <AddCourseModal
        isOpen={showAddCourse}
        onClose={() => setShowAddCourse(false)}
        onSubmit={handleAddCourse}
      />
    </div>
  )
}

function StatCard({ icon, label, value, onClick }) {
  return (
    <button
      onClick={onClick}
      className="card p-4 hover:shadow-warm-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer text-left w-full"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-cream-100 dark:bg-gray-700 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <div className="text-xs text-warmgray-500 dark:text-gray-400">{label}</div>
          <div className="text-xl font-semibold text-warmgray-800 dark:text-gray-100">{value}</div>
        </div>
      </div>
    </button>
  )
}

function CourseCard({ course, studentId }) {
  return (
    <Link
      to={`/student/${studentId}/course/${course.id}`}
      className="card p-5 hover:shadow-warm-lg transition-all duration-200 hover:-translate-y-1 group block"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Color indicator */}
          <div
            className="w-2 h-12 rounded-full"
            style={{ backgroundColor: course.color || '#6B8A62' }}
          />

          <div>
            <h3 className="font-semibold text-warmgray-800 dark:text-gray-100 group-hover:text-terracotta-600 transition-colors">
              {course.name}
            </h3>
            <div className="flex items-center gap-3 text-sm text-warmgray-500 dark:text-gray-400">
              <span>{course.credits} credit{course.credits !== 1 ? 's' : ''}</span>
              {course.categories && (
                <span>• {course.categories.filter(c => c.grades?.length > 0).length} categories with grades</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Grade display */}
          {course.letterGrade ? (
            <div className="text-right">
              <span className={`grade-badge ${getGradeColorClass(course.letterGrade)}`}>
                {course.letterGrade}
              </span>
              <div className="text-sm text-warmgray-500 dark:text-gray-400 mt-1">
                {course.grade?.toFixed(1)}%
              </div>
            </div>
          ) : (
            <span className="text-sm text-warmgray-400 dark:text-gray-500">No grades</span>
          )}

          <ChevronRight className="w-5 h-5 text-warmgray-300 dark:text-gray-600 group-hover:text-terracotta-400 transition-colors" />
        </div>
      </div>
    </Link>
  )
}

// Modal Components
function GPADetailModal({ summary, onClose }) {
  const gradingScale = db.getGradingScale()

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-warmgray-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-warm-lg w-full max-w-2xl p-6">
          <h3 className="font-display text-xl font-semibold text-warmgray-800 dark:text-gray-100 mb-4">
            GPA Breakdown
          </h3>

          <div className="mb-6 p-4 bg-terracotta-50 dark:bg-terracotta-900/30 rounded-xl text-center">
            <div className="text-sm text-warmgray-600 dark:text-gray-300 mb-1">Cumulative GPA</div>
            <div className="text-4xl font-bold text-terracotta-600">
              {summary?.gpa?.toFixed(2) || '—'}
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <h4 className="font-semibold text-warmgray-700 dark:text-gray-200">Course Breakdown</h4>
            {summary?.courses?.filter(c => c.grade !== null).map(course => {
              const gradeInfo = gradingScale.find(g => g.letter_grade === course.letterGrade)
              return (
                <div key={course.id} className="flex items-center justify-between p-3 bg-warmgray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <div className="font-medium text-warmgray-800 dark:text-gray-100">{course.name}</div>
                    <div className="text-sm text-warmgray-500 dark:text-gray-400">
                      {course.credits} credit{course.credits !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`grade-badge ${getGradeColorClass(course.letterGrade)}`}>
                      {course.letterGrade}
                    </span>
                    <div className="text-xs text-warmgray-500 dark:text-gray-400 mt-1">
                      {gradeInfo?.gpa_points.toFixed(1)} points
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="p-4 bg-cream-50 dark:bg-gray-700 rounded-xl mb-4">
            <h4 className="font-semibold text-warmgray-700 dark:text-gray-200 mb-2">How GPA is Calculated</h4>
            <p className="text-sm text-warmgray-600 dark:text-gray-300">
              GPA is calculated by multiplying each course's letter grade points by its credits,
              summing all courses, and dividing by total credits.
            </p>
          </div>

          <button onClick={onClose} className="btn-primary w-full">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

function CoursesDetailModal({ summary, onClose }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-warmgray-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-warm-lg w-full max-w-2xl p-6">
          <h3 className="font-display text-xl font-semibold text-warmgray-800 dark:text-gray-100 mb-4">
            Course Summary
          </h3>

          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="p-4 bg-sage-50 dark:bg-sage-900/30 rounded-xl text-center">
              <div className="text-sm text-warmgray-600 dark:text-gray-300 mb-1">Total Courses</div>
              <div className="text-3xl font-bold text-sage-600">
                {summary?.courses?.length || 0}
              </div>
            </div>
            <div className="p-4 bg-gold-50 dark:bg-gold-900/30 rounded-xl text-center">
              <div className="text-sm text-warmgray-600 dark:text-gray-300 mb-1">Total Credits</div>
              <div className="text-3xl font-bold text-gold-600">
                {summary?.courses?.reduce((sum, c) => sum + c.credits, 0) || 0}
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <h4 className="font-semibold text-warmgray-700 dark:text-gray-200">All Courses</h4>
            {summary?.courses?.map(course => (
              <div key={course.id} className="p-4 bg-warmgray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-medium text-warmgray-800 dark:text-gray-100">{course.name}</div>
                    <div className="text-sm text-warmgray-500 dark:text-gray-400">
                      {course.credits} credit{course.credits !== 1 ? 's' : ''}
                    </div>
                  </div>
                  {course.letterGrade ? (
                    <span className={`grade-badge ${getGradeColorClass(course.letterGrade)}`}>
                      {course.letterGrade}
                    </span>
                  ) : (
                    <span className="text-sm text-warmgray-400 dark:text-gray-500">No grade</span>
                  )}
                </div>

                {course.grade !== null && (
                  <div className="grid grid-cols-2 gap-2 text-xs text-warmgray-600 dark:text-gray-300">
                    <div>Academic: {course.academicGrade?.toFixed(1)}%</div>
                    <div>Attendance: {course.attendanceGrade?.toFixed(1)}%</div>
                  </div>
                )}

                {course.ignore_attendance_weight && (
                  <div className="mt-2 text-xs text-terracotta-600 font-medium">
                    ⚠ Attendance override active
                  </div>
                )}
              </div>
            ))}
          </div>

          <button onClick={onClose} className="btn-primary w-full">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

function AttendanceDetailModal({ studentId, schoolYearId, attendance, onClose }) {
  const allAttendance = db.getAttendance(studentId, schoolYearId)
  const attendancePercentage = attendance?.total > 0
    ? ((attendance.present / attendance.total) * 100).toFixed(1)
    : 0

  // Group by month
  const byMonth = {}
  allAttendance.forEach(record => {
    const month = record.date.substring(0, 7) // YYYY-MM
    if (!byMonth[month]) {
      byMonth[month] = { present: 0, absent: 0 }
    }
    if (record.status === 'present') byMonth[month].present++
    if (record.status === 'absent') byMonth[month].absent++
  })

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-warmgray-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-warm-lg w-full max-w-2xl p-6">
          <h3 className="font-display text-xl font-semibold text-warmgray-800 dark:text-gray-100 mb-4">
            Attendance Report
          </h3>

          <div className="mb-6 grid grid-cols-3 gap-4">
            <div className="p-4 bg-warmgray-50 dark:bg-gray-700 rounded-xl text-center">
              <div className="text-sm text-warmgray-600 dark:text-gray-300 mb-1">Total Days</div>
              <div className="text-3xl font-bold text-warmgray-800 dark:text-gray-100">
                {attendance?.total || 0}
              </div>
            </div>
            <div className="p-4 bg-sage-50 dark:bg-sage-900/30 rounded-xl text-center">
              <div className="text-sm text-warmgray-600 dark:text-gray-300 mb-1">Present</div>
              <div className="text-3xl font-bold text-sage-600">
                {attendance?.present || 0}
              </div>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-xl text-center">
              <div className="text-sm text-warmgray-600 dark:text-gray-300 mb-1">Absent</div>
              <div className="text-3xl font-bold text-red-600">
                {attendance?.absent || 0}
              </div>
            </div>
          </div>

          <div className="mb-6 p-4 bg-terracotta-50 dark:bg-terracotta-900/30 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-warmgray-800 dark:text-gray-100">Attendance Rate</span>
              <span className="text-2xl font-bold text-terracotta-600">
                {attendancePercentage}%
              </span>
            </div>
            <div className="mt-2 w-full bg-warmgray-200 rounded-full h-2">
              <div
                className="bg-terracotta-500 h-2 rounded-full transition-all"
                style={{ width: `${attendancePercentage}%` }}
              />
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <h4 className="font-semibold text-warmgray-700 dark:text-gray-200">Monthly Breakdown</h4>
            {Object.entries(byMonth).sort().reverse().map(([month, stats]) => {
              const total = stats.present + stats.absent
              const percentage = total > 0 ? ((stats.present / total) * 100).toFixed(0) : 0
              return (
                <div key={month} className="flex items-center justify-between p-3 bg-warmgray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <div className="font-medium text-warmgray-800 dark:text-gray-100">
                      {new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </div>
                    <div className="text-sm text-warmgray-500 dark:text-gray-400">
                      {stats.present} present • {stats.absent} absent
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-warmgray-800 dark:text-gray-100">{percentage}%</div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="p-4 bg-cream-50 dark:bg-gray-700 rounded-xl mb-4">
            <h4 className="font-semibold text-warmgray-700 dark:text-gray-200 mb-2">Attendance Impact</h4>
            <p className="text-sm text-warmgray-600 dark:text-gray-300">
              Attendance counts for 33% of each course grade (unless overridden).
              Perfect attendance = 100%, which contributes 33 percentage points to the final grade.
            </p>
          </div>

          <button onClick={onClose} className="btn-primary w-full">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
