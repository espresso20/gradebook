import { useState } from 'react'
import { GraduationCap, BookOpen, Sparkles, ArrowRight } from 'lucide-react'
import db from '../lib/store'
import AddStudentModal from '../components/AddStudentModal'

export default function Welcome({ onStudentAdded }) {
  const [showModal, setShowModal] = useState(false)

  const handleAddStudent = (studentData) => {
    db.addStudent(studentData)
    setShowModal(false)
    onStudentAdded()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-cream-100 flex flex-col">
      {/* Header */}
      <header className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-terracotta-500 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-xl font-semibold text-warmgray-800">
            Family Gradebook
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-6 pb-20">
        <div className="max-w-2xl text-center">
          {/* Decorative icon */}
          <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-terracotta-400 to-terracotta-600 shadow-warm-lg">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>

          {/* Heading */}
          <h1 className="font-display text-4xl md:text-5xl font-bold text-warmgray-900 dark:text-gray-100 mb-4">
            Welcome to Your
            <br />
            <span className="text-terracotta-500">Homeschool Gradebook</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-warmgray-600 dark:text-gray-300 mb-10 max-w-md mx-auto">
            Track your children's progress with ease. Manage courses, grades, and attendance all in one beautiful place.
          </p>

          {/* CTA Button */}
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary text-lg inline-flex items-center gap-2 group"
          >
            Add Your First Student
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>

          {/* Features preview */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <FeatureCard
              icon={<Sparkles className="w-5 h-5 text-gold-500" />}
              title="Weighted Grades"
              description="Support for Daily, Quizzes, Tests, and custom categories with configurable weights"
            />
            <FeatureCard
              icon={<BookOpen className="w-5 h-5 text-sage-500" />}
              title="Multiple Students"
              description="Track all your children's progress in one place, each with their own courses"
            />
            <FeatureCard
              icon={<GraduationCap className="w-5 h-5 text-terracotta-500" />}
              title="Year Archives"
              description="Keep records organized by school year with easy access to past transcripts"
            />
          </div>
        </div>
      </main>

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddStudent}
      />
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="card p-5">
      <div className="w-10 h-10 rounded-lg bg-cream-100 dark:bg-gray-700 flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="font-semibold text-warmgray-800 mb-1">{title}</h3>
      <p className="text-sm text-warmgray-500">{description}</p>
    </div>
  )
}
