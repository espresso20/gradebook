import { useState } from 'react'
import { X, BookOpen } from 'lucide-react'

const courseColors = [
  { name: 'Sage', value: '#6B8A62' },
  { name: 'Terracotta', value: '#D4693F' },
  { name: 'Gold', value: '#D97706' },
  { name: 'Sky', value: '#0284C7' },
  { name: 'Violet', value: '#7C3AED' },
  { name: 'Rose', value: '#E11D48' },
  { name: 'Slate', value: '#475569' },
  { name: 'Teal', value: '#0D9488' },
]

export default function AddCourseModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    credits: 1,
    color: '#6B8A62',
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'credits' ? parseFloat(value) || 0 : value 
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Course name is required'
    }
    if (formData.credits < 0 || formData.credits > 10) {
      newErrors.credits = 'Credits must be between 0 and 10'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
      setFormData({ name: '', description: '', credits: 1, color: '#6B8A62' })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-warmgray-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-warm-lg w-full max-w-md overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-warmgray-100 dark:border-gray-700">
            <h2 className="font-display text-xl font-semibold text-warmgray-800 dark:text-gray-100">
              Add New Course
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-warmgray-400 dark:text-gray-500 hover:text-warmgray-600 dark:text-gray-300 hover:bg-warmgray-100 dark:bg-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Course Name */}
            <div>
              <label htmlFor="name" className="label">
                Course Name <span className="text-terracotta-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`input ${errors.name ? 'border-red-400 focus:ring-red-400' : ''}`}
                placeholder="e.g., Algebra 1, English Literature"
                autoFocus
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="label">
                Description / Resources
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="input resize-none"
                placeholder="Textbooks used, curriculum info, etc."
              />
            </div>

            {/* Credits */}
            <div>
              <label htmlFor="credits" className="label">
                Credits
              </label>
              <select
                id="credits"
                name="credits"
                value={formData.credits}
                onChange={handleChange}
                className="input"
              >
                <option value={0.25}>0.25 credits</option>
                <option value={0.5}>0.5 credits</option>
                <option value={0.75}>0.75 credits</option>
                <option value={1}>1 credit</option>
                <option value={1.5}>1.5 credits</option>
                <option value={2}>2 credits</option>
              </select>
              {errors.credits && (
                <p className="mt-1 text-sm text-red-500">{errors.credits}</p>
              )}
            </div>

            {/* Color */}
            <div>
              <label className="label">Color</label>
              <div className="flex flex-wrap gap-2">
                {courseColors.map(({ name, value }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color: value }))}
                    className={`w-8 h-8 rounded-lg transition-all ${
                      formData.color === value 
                        ? 'ring-2 ring-offset-2 ring-warmgray-400 scale-110' 
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: value }}
                    title={name}
                  />
                ))}
              </div>
            </div>

            {/* Info about default categories */}
            <div className="bg-cream-100 rounded-xl p-4 text-sm text-warmgray-600 dark:text-gray-300">
              <p>
                This course will be created with default grade categories (Daily, Quizzes, Tests). 
                You can customize these after creation.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex-1"
              >
                Add Course
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
