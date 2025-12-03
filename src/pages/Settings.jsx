import { useState } from 'react'
import { Download, Upload, Trash2, AlertTriangle, Plus, Edit2, Moon, Sun } from 'lucide-react'
import db from '../lib/store'
import { VERSION } from '../version'

export default function Settings({ onUpdate, darkMode, toggleDarkMode }) {
  const [gradingScale, setGradingScale] = useState(db.getGradingScale())
  const [isSimpleScale, setIsSimpleScale] = useState(db.isSimpleGradingScale())
  const [schoolYears, setSchoolYears] = useState(db.getSchoolYears())
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showAddYear, setShowAddYear] = useState(false)
  const [editingYear, setEditingYear] = useState(null)
  const [newYear, setNewYear] = useState({
    name: '',
    start_date: '',
    end_date: '',
  })

  const handleExport = () => {
    const data = db.exportData()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `gradebook-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (event) => {
      const success = db.importData(event.target?.result)
      if (success) {
        alert('Data imported successfully!')
        onUpdate()
        window.location.reload()
      } else {
        alert('Failed to import data. Please check the file format.')
      }
    }
    reader.readAsText(file)
  }

  const handleClearAllData = () => {
    db.clearAllData()
    setShowDeleteConfirm(false)
    onUpdate()
    window.location.reload()
  }

  const handleScaleChange = (id, field, value) => {
    const updated = gradingScale.map(g =>
      g.id === id ? { ...g, [field]: parseFloat(value) || 0 } : g
    )
    setGradingScale(updated)
    db.updateGradingScale(updated)
  }

  const handleToggleGradingScale = () => {
    const result = db.toggleGradingScale()
    setGradingScale(result.scale)
    setIsSimpleScale(result.isSimple)
    onUpdate() // Trigger refresh to recalculate all grades
  }

  const handleAddYear = () => {
    if (!newYear.name || !newYear.start_date || !newYear.end_date) {
      alert('Please fill in all fields')
      return
    }
    db.addSchoolYear(newYear)
    setSchoolYears(db.getSchoolYears())
    setShowAddYear(false)
    setNewYear({ name: '', start_date: '', end_date: '' })
    onUpdate()
  }

  const handleEditYear = (year) => {
    setEditingYear({
      id: year.id,
      name: year.name,
      start_date: year.start_date,
      end_date: year.end_date,
    })
  }

  const handleUpdateYear = () => {
    if (!editingYear.name || !editingYear.start_date || !editingYear.end_date) {
      alert('Please fill in all fields')
      return
    }
    db.updateSchoolYear(editingYear.id, {
      name: editingYear.name,
      start_date: editingYear.start_date,
      end_date: editingYear.end_date,
    })
    setSchoolYears(db.getSchoolYears())
    setEditingYear(null)
    onUpdate()
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <h1 className="font-display text-2xl font-bold text-warmgray-800 dark:text-gray-100 mb-8">
        Settings
      </h1>

      {/* Appearance */}
      <section className="card mb-6">
        <h2 className="font-display text-lg font-semibold text-warmgray-800 dark:text-gray-100 mb-4">
          Appearance
        </h2>

        <div className="flex items-center justify-between p-4 bg-warmgray-50 dark:bg-gray-700 rounded-xl">
          <div>
            <div className="font-medium text-warmgray-800 dark:text-gray-100">Theme</div>
            <div className="text-sm text-warmgray-500 dark:text-gray-400">
              {darkMode ? 'Dark mode is enabled' : 'Light mode is enabled'}
            </div>
          </div>
          <button
            onClick={toggleDarkMode}
            className="btn-secondary flex items-center gap-2"
          >
            {darkMode ? (
              <>
                <Sun className="w-4 h-4" />
                Light Mode
              </>
            ) : (
              <>
                <Moon className="w-4 h-4" />
                Dark Mode
              </>
            )}
          </button>
        </div>
      </section>

      {/* Grading Scale */}
      <section className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-warmgray-800 dark:text-gray-100">
              Grading Scale
            </h2>
            <p className="text-sm text-warmgray-500 dark:text-gray-400 mt-1">
              {isSimpleScale
                ? 'Using simple 5-grade scale (A, B, C, D, F)'
                : 'Using advanced 13-grade scale with +/- modifiers'}
            </p>
          </div>
          <button
            onClick={handleToggleGradingScale}
            className="btn-secondary text-sm"
          >
            Switch to {isSimpleScale ? 'Advanced' : 'Simple'} Grades
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-warmgray-200 dark:border-gray-600">
                <th className="text-left py-2 px-3 text-warmgray-600 dark:text-gray-300 font-medium">Letter Grade</th>
                <th className="text-left py-2 px-3 text-warmgray-600 dark:text-gray-300 font-medium">Minimum %</th>
                <th className="text-left py-2 px-3 text-warmgray-600 dark:text-gray-300 font-medium">GPA Points</th>
              </tr>
            </thead>
            <tbody>
              {gradingScale.map(grade => (
                <tr key={grade.id} className="border-b border-warmgray-100 dark:border-gray-700">
                  <td className="py-2 px-3 font-medium text-warmgray-800 dark:text-gray-100">
                    {grade.letter_grade}
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      value={grade.min_percentage}
                      onChange={(e) => handleScaleChange(grade.id, 'min_percentage', e.target.value)}
                      className="w-20 px-2 py-1 border border-warmgray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-warmgray-800 dark:text-gray-100 rounded-lg text-sm"
                      min="0"
                      max="100"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      value={grade.gpa_points}
                      onChange={(e) => handleScaleChange(grade.id, 'gpa_points', e.target.value)}
                      className="w-20 px-2 py-1 border border-warmgray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-warmgray-800 dark:text-gray-100 rounded-lg text-sm"
                      min="0"
                      max="4"
                      step="0.1"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* School Years */}
      <section className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-warmgray-800 dark:text-gray-100">
              School Years
            </h2>
            <p className="text-sm text-warmgray-500 dark:text-gray-400 mt-1">
              Manage your school years for archiving and reporting.
            </p>
          </div>
          <button
            onClick={() => setShowAddYear(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Year
          </button>
        </div>

        <div className="space-y-3">
          {schoolYears.map(year => (
            <div
              key={year.id}
              className={`flex items-center justify-between p-4 rounded-xl border ${
                year.is_active
                  ? 'border-terracotta-300 dark:border-terracotta-600 bg-terracotta-50 dark:bg-terracotta-900/30'
                  : 'border-warmgray-200 dark:border-gray-600 bg-warmgray-50 dark:bg-gray-700'
              }`}
            >
              <div>
                <div className="font-medium text-warmgray-800 dark:text-gray-100">{year.name}</div>
                <div className="text-sm text-warmgray-500 dark:text-gray-400">
                  {year.start_date} to {year.end_date}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEditYear(year)}
                  className="p-2 rounded-lg text-warmgray-600 dark:text-gray-300 hover:text-warmgray-800 dark:hover:text-gray-100 hover:bg-warmgray-200 dark:hover:bg-gray-600 transition-colors"
                  title="Edit year"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                {year.is_active ? (
                  <span className="px-3 py-1 bg-terracotta-500 text-white text-sm font-medium rounded-full">
                    Active
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      db.setActiveSchoolYear(year.id)
                      setSchoolYears(db.getSchoolYears())
                      onUpdate()
                    }}
                    className="btn-ghost text-sm"
                  >
                    Set Active
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Data Management */}
      <section className="card mb-6">
        <h2 className="font-display text-lg font-semibold text-warmgray-800 dark:text-gray-100 mb-4">
          Data Management
        </h2>
        
        <div className="space-y-4">
          {/* Export */}
          <div className="flex items-center justify-between p-4 bg-warmgray-50 dark:bg-gray-700 rounded-xl">
            <div>
              <div className="font-medium text-warmgray-800 dark:text-gray-100">Export Data</div>
              <div className="text-sm text-warmgray-500 dark:text-gray-400">
                Download a backup of all your gradebook data
              </div>
            </div>
            <button 
              onClick={handleExport}
              className="btn-secondary flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>

          {/* Import */}
          <div className="flex items-center justify-between p-4 bg-warmgray-50 dark:bg-gray-700 rounded-xl">
            <div>
              <div className="font-medium text-warmgray-800 dark:text-gray-100">Import Data</div>
              <div className="text-sm text-warmgray-500 dark:text-gray-400">
                Restore from a previous backup file
              </div>
            </div>
            <label className="btn-secondary flex items-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4" />
              Import
              <input 
                type="file" 
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>

          {/* Clear Data */}
          <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/30 rounded-xl border border-red-200">
            <div>
              <div className="font-medium text-red-800">Clear All Data</div>
              <div className="text-sm text-red-600">
                Permanently delete all students, courses, and grades
              </div>
            </div>
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          </div>
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div 
            className="fixed inset-0 bg-warmgray-900/50 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-warm-lg w-full max-w-md p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-warmgray-800 dark:text-gray-100">
                    Delete All Data?
                  </h3>
                  <p className="text-sm text-warmgray-500 dark:text-gray-400">
                    This action cannot be undone.
                  </p>
                </div>
              </div>
              
              <p className="text-warmgray-600 dark:text-gray-300 mb-6">
                All students, courses, grades, and attendance records will be permanently deleted. 
                Consider exporting your data first.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearAllData}
                  className="flex-1 px-4 py-3 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-colors"
                >
                  Delete Everything
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add School Year Modal */}
      {showAddYear && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-warmgray-900/50 backdrop-blur-sm"
            onClick={() => setShowAddYear(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-warm-lg w-full max-w-md p-6">
              <h3 className="font-display text-lg font-semibold text-warmgray-800 dark:text-gray-100 mb-4">
                Add School Year
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="label">Year Name</label>
                  <input
                    type="text"
                    value={newYear.name}
                    onChange={(e) => setNewYear({ ...newYear, name: e.target.value })}
                    placeholder="e.g., 2025-2026"
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">Start Date</label>
                  <input
                    type="date"
                    value={newYear.start_date}
                    onChange={(e) => setNewYear({ ...newYear, start_date: e.target.value })}
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">End Date</label>
                  <input
                    type="date"
                    value={newYear.end_date}
                    onChange={(e) => setNewYear({ ...newYear, end_date: e.target.value })}
                    className="input"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddYear(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddYear}
                  className="btn-primary flex-1"
                >
                  Add Year
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit School Year Modal */}
      {editingYear && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-warmgray-900/50 backdrop-blur-sm"
            onClick={() => setEditingYear(null)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-warm-lg w-full max-w-md p-6">
              <h3 className="font-display text-lg font-semibold text-warmgray-800 dark:text-gray-100 mb-4">
                Edit School Year
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="label">Year Name</label>
                  <input
                    type="text"
                    value={editingYear.name}
                    onChange={(e) => setEditingYear({ ...editingYear, name: e.target.value })}
                    placeholder="e.g., 2025-2026"
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">Start Date</label>
                  <input
                    type="date"
                    value={editingYear.start_date}
                    onChange={(e) => setEditingYear({ ...editingYear, start_date: e.target.value })}
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">End Date</label>
                  <input
                    type="date"
                    value={editingYear.end_date}
                    onChange={(e) => setEditingYear({ ...editingYear, end_date: e.target.value })}
                    className="input"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setEditingYear(null)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateYear}
                  className="btn-primary flex-1"
                >
                  Update Year
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* App Version */}
      <div className="mt-8 text-center text-sm text-warmgray-500 dark:text-gray-400">
        <p>Family Gradebook v{VERSION}</p>
        <p className="text-xs mt-1">Made with ❤️ for homeschool families</p>
      </div>
    </div>
  )
}
