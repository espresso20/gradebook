import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { GraduationCap, Plus, Settings, HelpCircle, Menu, X, BookOpen, ChevronDown } from 'lucide-react'
import db from '../lib/store'
import AddStudentModal from './AddStudentModal'

export default function Sidebar({ students, schoolYears, activeYear, onUpdate }) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const handleAddStudent = (studentData) => {
    db.addStudent(studentData)
    setShowAddModal(false)
    onUpdate()
  }

  const handleYearChange = (yearId) => {
    db.setActiveSchoolYear(parseInt(yearId))
    onUpdate()
    navigate('/')
  }

  const currentYear = schoolYears.find(y => y.is_active) || schoolYears[0]

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 border border-warmgray-200 dark:border-gray-700 shadow-sm"
      >
        {isMobileOpen ? (
          <X className="w-5 h-5 text-warmgray-600 dark:text-gray-300" />
        ) : (
          <Menu className="w-5 h-5 text-warmgray-600 dark:text-gray-300" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-72 bg-warmgray-50 dark:bg-gray-900 border-r border-warmgray-200 dark:border-gray-700
          flex flex-col transition-transform duration-300 lg:transform-none
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-warmgray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-terracotta-500 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-semibold text-warmgray-900 dark:text-gray-100">
              Family Gradebook
            </span>
          </div>

          {/* Add Student Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full btn-primary flex items-center justify-center gap-2 mb-4"
          >
            <Plus className="w-4 h-4" />
            Add Student
          </button>

          {/* School Year Selector */}
          {schoolYears.length > 0 && (
            <div className="relative">
              <select
                value={currentYear?.id || ''}
                onChange={(e) => handleYearChange(e.target.value)}
                className="w-full px-3 py-2 pr-8 text-sm rounded-lg border border-warmgray-300 dark:border-gray-600
                  bg-white dark:bg-gray-800 text-warmgray-900 dark:text-gray-100
                  focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500
                  appearance-none cursor-pointer"
              >
                {schoolYears.map(year => (
                  <option key={year.id} value={year.id}>
                    {year.name} {year.is_active ? '(Active)' : ''}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-warmgray-500 dark:text-gray-400 pointer-events-none" />
            </div>
          )}
        </div>

        {/* Students List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-3">
            <h3 className="text-xs font-semibold text-warmgray-500 dark:text-gray-400 uppercase tracking-wider">
              Students
            </h3>
          </div>

          {students.length === 0 ? (
            <div className="text-center py-8 text-warmgray-500 dark:text-gray-400 text-sm">
              No students yet
            </div>
          ) : (
            <nav className="space-y-1">
              {students.map(student => {
                const isActive = location.pathname.includes(`/student/${student.id}`)
                const gpa = db.calculateStudentGPA(student.id)

                return (
                  <Link
                    key={student.id}
                    to={`/student/${student.id}`}
                    onClick={() => setIsMobileOpen(false)}
                    className={`
                      block px-3 py-2.5 rounded-lg transition-colors
                      ${isActive
                        ? 'bg-terracotta-100 dark:bg-terracotta-900/30 text-terracotta-700 dark:text-terracotta-400'
                        : 'text-warmgray-700 dark:text-gray-300 hover:bg-warmgray-100 dark:hover:bg-gray-800'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {student.first_name} {student.last_name}
                        </div>
                        <div className={`text-xs ${isActive ? 'text-terracotta-600 dark:text-terracotta-500' : 'text-warmgray-500 dark:text-gray-400'}`}>
                          GPA: {gpa.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </nav>
          )}
        </div>

        {/* Bottom Buttons */}
        <div className="p-4 border-t border-warmgray-200 dark:border-gray-700 space-y-2">
          <Link
            to="/settings"
            onClick={() => setIsMobileOpen(false)}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
              ${location.pathname === '/settings'
                ? 'bg-terracotta-100 dark:bg-terracotta-900/30 text-terracotta-700 dark:text-terracotta-400'
                : 'text-warmgray-700 dark:text-gray-300 hover:bg-warmgray-100 dark:hover:bg-gray-800'
              }
            `}
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>

          <Link
            to="/help"
            onClick={() => setIsMobileOpen(false)}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
              ${location.pathname === '/help'
                ? 'bg-terracotta-100 dark:bg-terracotta-900/30 text-terracotta-700 dark:text-terracotta-400'
                : 'text-warmgray-700 dark:text-gray-300 hover:bg-warmgray-100 dark:hover:bg-gray-800'
              }
            `}
          >
            <HelpCircle className="w-4 h-4" />
            Help
          </Link>
        </div>
      </aside>

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddStudent}
      />
    </>
  )
}
