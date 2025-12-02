import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Check, X, Clock, Sun } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, getDay, isSameMonth, isToday } from 'date-fns'
import db from '../lib/store'

const statusConfig = {
  present: { label: 'Present', icon: Check, color: 'bg-sage-500 text-white', shortLabel: '✓' },
  absent: { label: 'Absent', icon: X, color: 'bg-red-500 text-white', shortLabel: '✗' },
}

export default function Attendance() {
  const { studentId } = useParams()
  const [student, setStudent] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [attendance, setAttendance] = useState({})
  const [stats, setStats] = useState(null)

  const schoolYear = db.getActiveSchoolYear()

  useEffect(() => {
    setStudent(db.getStudent(parseInt(studentId)))
  }, [studentId])

  useEffect(() => {
    loadAttendance()
  }, [studentId, currentMonth])

  const loadAttendance = () => {
    const monthStr = format(currentMonth, 'yyyy-MM')
    const records = db.getAttendance(parseInt(studentId), schoolYear?.id, monthStr)
    const attendanceMap = {}
    records.forEach(r => {
      attendanceMap[r.date] = r.status
    })
    setAttendance(attendanceMap)
    setStats(db.getAttendanceStats(parseInt(studentId), schoolYear?.id))
  }

  const handleDayClick = (date, currentStatus) => {
    if (!schoolYear?.id) {
      return
    }

    const dateStr = format(date, 'yyyy-MM-dd')
    const statuses = [null, 'present', 'absent']
    // Convert undefined to null for proper cycling
    const status = currentStatus === undefined ? null : currentStatus
    const currentIndex = statuses.indexOf(status)
    const nextStatus = statuses[(currentIndex + 1) % statuses.length]

    db.setAttendance(parseInt(studentId), schoolYear.id, dateStr, nextStatus)
    loadAttendance()
  }

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startPadding = getDay(monthStart) // 0 = Sunday

  if (!student) {
    return <div className="p-8 text-center text-warmgray-500 dark:text-gray-400">Student not found</div>
  }

  if (!schoolYear) {
    return (
      <div className="p-8 text-center">
        <div className="max-w-md mx-auto">
          <h2 className="font-display text-xl font-semibold text-warmgray-800 dark:text-gray-100 mb-2">
            No Active School Year
          </h2>
          <p className="text-warmgray-500 dark:text-gray-400 mb-4">
            Please set up a school year in Settings before tracking attendance.
          </p>
          <Link
            to="/settings"
            className="btn-primary inline-block"
          >
            Go to Settings
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link 
          to={`/student/${studentId}`}
          className="inline-flex items-center gap-2 text-warmgray-500 dark:text-gray-400 hover:text-warmgray-700 dark:text-gray-200 mb-4 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to {student.first_name}'s Profile
        </Link>
        
        <h1 className="font-display text-2xl font-bold text-warmgray-800 dark:text-gray-100">
          Attendance for {student.first_name}
        </h1>
        <p className="text-warmgray-500 dark:text-gray-400">
          {schoolYear?.name} School Year
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Days" value={stats?.total || 0} color="text-warmgray-800 dark:text-gray-100" />
        <StatCard label="Present" value={stats?.present || 0} color="text-sage-600" />
        <StatCard label="Absent" value={stats?.absent || 0} color="text-red-600" />
      </div>

      {/* Legend */}
      <div className="card mb-6">
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="text-warmgray-500 dark:text-gray-400">Click a day to cycle through:</span>
          {Object.entries(statusConfig).map(([key, config]) => (
            <div key={key} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${config.color}`}>
                {config.shortLabel}
              </div>
              <span className="text-warmgray-600 dark:text-gray-300">{config.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar */}
      <div className="card">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 rounded-lg hover:bg-warmgray-100 dark:bg-gray-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-warmgray-600 dark:text-gray-300" />
          </button>
          <h2 className="font-display text-xl font-semibold text-warmgray-800 dark:text-gray-100">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 rounded-lg hover:bg-warmgray-100 dark:bg-gray-600 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-warmgray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-medium text-warmgray-500 dark:text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Padding for start of month */}
          {Array.from({ length: startPadding }).map((_, i) => (
            <div key={`pad-${i}`} />
          ))}
          
          {/* Days */}
          {days.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd')
            const status = attendance[dateStr]
            const config = status ? statusConfig[status] : null
            const isWeekend = getDay(day) === 0 || getDay(day) === 6
            
            return (
              <button
                key={dateStr}
                onClick={() => handleDayClick(day, status)}
                className={`
                  aspect-square rounded-xl flex flex-col items-center justify-center
                  transition-all duration-150 hover:scale-105
                  ${isToday(day) ? 'ring-2 ring-terracotta-400 ring-offset-2' : ''}
                  ${config ? config.color : isWeekend ? 'bg-warmgray-50 text-warmgray-400' : 'bg-warmgray-100 text-warmgray-600 hover:bg-warmgray-200'}
                `}
              >
                <span className={`text-sm font-medium ${config ? '' : ''}`}>
                  {format(day, 'd')}
                </span>
                {config && (
                  <span className="text-xs font-bold mt-0.5">
                    {config.shortLabel}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Quick tip */}
      <div className="mt-6 text-sm text-warmgray-500 dark:text-gray-400 text-center">
        Tip: Click any day to cycle through attendance statuses. Click again to clear.
      </div>
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div className="card p-4 text-center">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-sm text-warmgray-500 dark:text-gray-400">{label}</div>
    </div>
  )
}
