import { useState } from 'react'
import { X, User, Calendar, GraduationCap } from 'lucide-react'

const gradeOptions = [
  'Pre-K', 'Kindergarten',
  '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade',
  '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade',
  'Other'
]

export default function AddStudentModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    grade_level: '',
    birth_date: '',
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
      setFormData({ first_name: '', last_name: '', grade_level: '', birth_date: '' })
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
              Add New Student
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
            {/* Avatar placeholder */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-terracotta-400 to-terracotta-600 flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* First Name */}
            <div>
              <label htmlFor="first_name" className="label">
                First Name <span className="text-terracotta-500">*</span>
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className={`input ${errors.first_name ? 'border-red-400 focus:ring-red-400' : ''}`}
                placeholder="Enter first name"
                autoFocus
              />
              {errors.first_name && (
                <p className="mt-1 text-sm text-red-500">{errors.first_name}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="last_name" className="label">
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="input"
                placeholder="Enter last name"
              />
            </div>

            {/* Grade Level */}
            <div>
              <label htmlFor="grade_level" className="label flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-warmgray-400 dark:text-gray-500" />
                Grade Level
              </label>
              <select
                id="grade_level"
                name="grade_level"
                value={formData.grade_level}
                onChange={handleChange}
                className="input"
              >
                <option value="">Select grade level</option>
                {gradeOptions.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>

            {/* Birth Date */}
            <div>
              <label htmlFor="birth_date" className="label flex items-center gap-2">
                <Calendar className="w-4 h-4 text-warmgray-400 dark:text-gray-500" />
                Birth Date
              </label>
              <input
                type="date"
                id="birth_date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleChange}
                className="input"
              />
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
                Add Student
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
