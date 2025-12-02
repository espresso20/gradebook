import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ChevronLeft,
  Plus,
  Settings,
  Trash2,
  Edit2,
  Check,
  X,
  MoreVertical
} from 'lucide-react'
import db from '../lib/store'
import { getGradeColorClass } from '../lib/database'

export default function CourseView() {
  const { studentId, courseId } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [student, setStudent] = useState(null)
  const [editingWeights, setEditingWeights] = useState(false)
  const [weights, setWeights] = useState({})
  const [newGrade, setNewGrade] = useState({ categoryId: null, score: '', maxScore: '100', notes: '' })
  const [showCourseMenu, setShowCourseMenu] = useState(false)

  useEffect(() => {
    loadData()
  }, [courseId])

  const loadData = () => {
    const c = db.getCourseWithGrade(parseInt(courseId))
    setCourse(c)
    setStudent(db.getStudent(parseInt(studentId)))
    
    if (c?.categories) {
      const w = {}
      c.categories.forEach(cat => {
        w[cat.id] = cat.weight * 100
      })
      setWeights(w)
    }
  }

  const handleAddGrade = (categoryId) => {
    if (!newGrade.score) return
    
    db.addGrade({
      category_id: categoryId,
      date: new Date().toISOString().split('T')[0],
      score: parseFloat(newGrade.score),
      max_score: parseFloat(newGrade.maxScore) || 100,
      notes: newGrade.notes,
    })
    
    setNewGrade({ categoryId: null, score: '', maxScore: '100', notes: '' })
    loadData()
  }

  const handleDeleteGrade = (gradeId) => {
    if (confirm('Delete this grade?')) {
      db.deleteGrade(gradeId)
      loadData()
    }
  }

  const handleSaveWeights = () => {
    let total = 0
    Object.values(weights).forEach(w => {
      total += parseFloat(w) || 0
    })

    if (Math.abs(total - 100) > 0.01 && total !== 0) {
      alert('Weights must total 100% (or all be 0 for equal weighting)')
      return
    }

    Object.entries(weights).forEach(([catId, weight]) => {
      db.updateCategory(parseInt(catId), { weight: parseFloat(weight) / 100 })
    })

    setEditingWeights(false)
    loadData()
  }

  const handleDeleteCourse = () => {
    if (confirm(`Are you sure you want to delete ${course.name} and all its grades? This cannot be undone.`)) {
      db.deleteCourse(parseInt(courseId))
      navigate(`/student/${studentId}`)
    }
  }

  if (!course || !student) {
    return (
      <div className="p-8 text-center text-warmgray-500 dark:text-gray-400">
        Course not found
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          to={`/student/${studentId}`}
          className="inline-flex items-center gap-2 text-warmgray-500 dark:text-gray-400 hover:text-warmgray-700 dark:hover:text-gray-200 mb-4 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to {student.first_name}'s Profile
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-3 h-12 rounded-full"
              style={{ backgroundColor: course.color || '#6B8A62' }}
            />
            <div>
              <h1 className="font-display text-2xl font-bold text-warmgray-800 dark:text-gray-100">
                {course.name}
              </h1>
              <p className="text-warmgray-500 dark:text-gray-400">
                {course.credits} credit{course.credits !== 1 ? 's' : ''}
                {course.description && ` • ${course.description}`}
              </p>
            </div>
          </div>

          {/* Current Grade and Menu */}
          <div className="flex items-center gap-4 relative">
            {course.letterGrade ? (
              <div className="text-right">
                <div className="text-sm text-warmgray-500 dark:text-gray-400 mb-1">Current Grade</div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-warmgray-800 dark:text-gray-100">
                    {course.grade?.toFixed(1)}%
                  </span>
                  <span className={`grade-badge text-lg ${getGradeColorClass(course.letterGrade)}`}>
                    {course.letterGrade}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-warmgray-400 dark:text-gray-500">No grades yet</div>
            )}

            {/* Course Settings Menu */}
            <div className="relative">
              <button
                onClick={() => setShowCourseMenu(!showCourseMenu)}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-warmgray-600 dark:text-gray-300 hover:bg-warmgray-100 dark:hover:bg-gray-700 transition-colors"
                title="Course settings"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {showCourseMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowCourseMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-warm-lg border border-warmgray-100 dark:border-gray-700 py-1 z-20">
                    <button
                      onClick={() => {
                        setShowCourseMenu(false)
                        handleDeleteCourse()
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Course
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Override */}
      <div className="card mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-warmgray-800 dark:text-gray-100 mb-1">Attendance Weight Override</h2>
            <p className="text-sm text-warmgray-500 dark:text-gray-400">
              {course.ignore_attendance_weight
                ? 'This course uses only academic grades (100%). Attendance does not affect the grade.'
                : 'This course uses standard weighting: 67% academic grades + 33% attendance.'}
            </p>
          </div>
          <button
            onClick={() => {
              db.updateCourse(course.id, { ignore_attendance_weight: !course.ignore_attendance_weight })
              loadData()
            }}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              course.ignore_attendance_weight
                ? 'bg-terracotta-500 text-white hover:bg-terracotta-600'
                : 'bg-warmgray-200 text-warmgray-700 hover:bg-warmgray-300'
            }`}
          >
            {course.ignore_attendance_weight ? 'Override Active' : 'Enable Override'}
          </button>
        </div>
      </div>

      {/* Weight Settings */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-warmgray-800 dark:text-gray-100">Category Weights</h2>
          {editingWeights ? (
            <div className="flex gap-2">
              <button
                onClick={() => setEditingWeights(false)}
                className="btn-ghost text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveWeights}
                className="btn-primary text-sm py-2"
              >
                Save Weights
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditingWeights(true)}
              className="btn-ghost text-sm flex items-center gap-1"
            >
              <Settings className="w-4 h-4" />
              Edit Weights
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-4">
          {course.categories?.map(cat => (
            <div key={cat.id} className="flex items-center gap-2">
              <span className="text-sm text-warmgray-600 dark:text-gray-300">{cat.name}:</span>
              {editingWeights ? (
                <input
                  type="number"
                  value={weights[cat.id] || 0}
                  onChange={(e) => setWeights(prev => ({ ...prev, [cat.id]: e.target.value }))}
                  className="w-16 px-2 py-1 text-sm border border-warmgray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-warmgray-800 dark:text-gray-100 rounded-lg"
                  min="0"
                  max="100"
                />
              ) : (
                <span className="text-sm font-medium text-warmgray-800 dark:text-gray-100">
                  {(cat.weight * 100).toFixed(0)}%
                </span>
              )}
            </div>
          ))}
        </div>
        
        {editingWeights && (
          <p className="text-xs text-warmgray-500 dark:text-gray-400 mt-3">
            Weights should total 100%. If all are 0, categories will be weighted equally.
          </p>
        )}
      </div>

      {/* Grade Categories */}
      <div className="space-y-6">
        {course.categories?.map(category => (
          <CategorySection
            key={category.id}
            category={category}
            onAddGrade={handleAddGrade}
            onDeleteGrade={handleDeleteGrade}
            newGrade={newGrade}
            setNewGrade={setNewGrade}
          />
        ))}
      </div>
    </div>
  )
}

function CategorySection({ category, onAddGrade, onDeleteGrade, newGrade, setNewGrade }) {
  const isAddingToThis = newGrade.categoryId === category.id
  
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-warmgray-800 dark:text-gray-100">{category.name}</h3>
          <p className="text-sm text-warmgray-500 dark:text-gray-400">
            {category.grades?.length || 0} grade{category.grades?.length !== 1 ? 's' : ''}
            {category.average !== null && (
              <> • Average: <span className="font-medium">{category.average.toFixed(1)}%</span></>
            )}
          </p>
        </div>
        
        {!isAddingToThis && (
          <button
            onClick={() => setNewGrade({ categoryId: category.id, score: '', maxScore: '100', notes: '' })}
            className="btn-ghost text-sm flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Grade
          </button>
        )}
      </div>

      {/* Add grade form */}
      {isAddingToThis && (
        <div className="bg-cream-50 dark:bg-gray-700 rounded-xl p-4 mb-4">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="text-xs text-warmgray-500 dark:text-gray-400">Score</label>
              <input
                type="number"
                value={newGrade.score}
                onChange={(e) => setNewGrade(prev => ({ ...prev, score: e.target.value }))}
                className="w-20 px-3 py-2 border border-warmgray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-warmgray-800 dark:text-gray-100 rounded-lg text-sm"
                placeholder="95"
                autoFocus
              />
            </div>
            <span className="text-warmgray-400 dark:text-gray-500 pb-2">/</span>
            <div>
              <label className="text-xs text-warmgray-500 dark:text-gray-400">Max</label>
              <input
                type="number"
                value={newGrade.maxScore}
                onChange={(e) => setNewGrade(prev => ({ ...prev, maxScore: e.target.value }))}
                className="w-20 px-3 py-2 border border-warmgray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-warmgray-800 dark:text-gray-100 rounded-lg text-sm"
                placeholder="100"
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="text-xs text-warmgray-500 dark:text-gray-400">Notes (optional)</label>
              <input
                type="text"
                value={newGrade.notes}
                onChange={(e) => setNewGrade(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full px-3 py-2 border border-warmgray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-warmgray-800 dark:text-gray-100 rounded-lg text-sm"
                placeholder="Chapter 3 Test"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setNewGrade({ categoryId: null, score: '', maxScore: '100', notes: '' })}
                className="p-2 text-warmgray-400 dark:text-gray-500 hover:text-warmgray-600 dark:text-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <button
                onClick={() => onAddGrade(category.id)}
                className="btn-primary py-2 px-4"
                disabled={!newGrade.score}
              >
                <Check className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grades list */}
      {category.grades?.length > 0 ? (
        <div className="space-y-2">
          {category.grades.map(grade => (
            <div 
              key={grade.id}
              className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-warmgray-50 dark:hover:bg-gray-700 dark:bg-gray-700 group"
            >
              <div className="flex items-center gap-4">
                <span className="text-sm text-warmgray-500 dark:text-gray-400 w-24">
                  {new Date(grade.date).toLocaleDateString()}
                </span>
                <span className="font-medium text-warmgray-800 dark:text-gray-100">
                  {grade.score} / {grade.max_score}
                </span>
                <span className="text-sm text-warmgray-500 dark:text-gray-400">
                  ({((grade.score / grade.max_score) * 100).toFixed(1)}%)
                </span>
                {grade.notes && (
                  <span className="text-sm text-warmgray-400 dark:text-gray-500">— {grade.notes}</span>
                )}
              </div>
              <button
                onClick={() => onDeleteGrade(grade.id)}
                className="p-1 text-warmgray-300 dark:text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-warmgray-400 dark:text-gray-500 text-center py-4">
          No grades in this category yet
        </p>
      )}
    </div>
  )
}
