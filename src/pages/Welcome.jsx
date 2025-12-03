import { GraduationCap, BookOpen, Calendar, Settings as SettingsIcon, TrendingUp, FileText } from 'lucide-react'

export default function Welcome() {
  return (
    <div className="min-h-full bg-gradient-to-b from-cream-50 to-cream-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-6 py-20">
      <div className="max-w-3xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-terracotta-400 to-terracotta-600 shadow-warm-lg">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-bold text-warmgray-900 dark:text-gray-100 mb-4">
            Welcome to Your
            <br />
            <span className="text-terracotta-500">Homeschool Gradebook</span>
          </h1>

          <p className="text-lg text-warmgray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Track your children's academic progress with ease. Manage courses, grades, and attendance all in one beautiful place.
          </p>
        </div>

        {/* Getting Started Guide */}
        <div className="card mb-8">
          <h2 className="font-display text-2xl font-bold text-warmgray-900 dark:text-gray-100 mb-6">
            Getting Started
          </h2>

          <div className="space-y-6">
            <Step
              number="1"
              title="Add Your First Student"
              description="Click the 'Add Student' button in the sidebar to create a profile for your first child. You'll enter their name and grade level."
            />

            <Step
              number="2"
              title="Set Up a School Year"
              description="Go to Settings to create your first school year (e.g., '2024-2025'). This helps organize your records and allows you to archive past years."
            />

            <Step
              number="3"
              title="Create Courses"
              description="From a student's profile, add courses like 'Math', 'English', or 'Science'. Assign credits and choose a color for easy identification."
            />

            <Step
              number="4"
              title="Track Grades"
              description="Open any course to add assignments across different categories (Tests, Quizzes, Homework). Grades are automatically calculated using weighted averages."
            />

            <Step
              number="5"
              title="Record Attendance"
              description="Click 'Attendance' from the student profile to mark days present or absent. Attendance can optionally contribute to the final grade."
            />
          </div>
        </div>

        {/* Quick Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TipCard
            icon={<TrendingUp className="w-5 h-5 text-terracotta-500" />}
            title="GPA Calculation"
            description="GPAs are automatically calculated based on course grades and credit hours"
          />

          <TipCard
            icon={<SettingsIcon className="w-5 h-5 text-sage-500" />}
            title="Customizable Grading"
            description="Switch between simple (A-F) and advanced (A+, A-, etc.) grading scales in Settings"
          />

          <TipCard
            icon={<Calendar className="w-5 h-5 text-gold-500" />}
            title="School Years"
            description="Archive past years and easily switch between them using the dropdown in the sidebar"
          />

          <TipCard
            icon={<FileText className="w-5 h-5 text-terracotta-500" />}
            title="Export Your Data"
            description="Backup all your data anytime from Settings → Data Management → Export"
          />
        </div>

        {/* Help Link */}
        <div className="text-center mt-8">
          <p className="text-warmgray-600 dark:text-gray-400">
            Need more help? Check out the{' '}
            <a href="/help" className="text-terracotta-500 hover:text-terracotta-600 font-medium underline">
              Help documentation
            </a>
            {' '}for detailed guides.
          </p>
        </div>
      </div>
    </div>
  )
}

function Step({ number, title, description }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-terracotta-500 text-white flex items-center justify-center font-bold text-sm">
        {number}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-warmgray-900 dark:text-gray-100 mb-1">
          {title}
        </h3>
        <p className="text-sm text-warmgray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
    </div>
  )
}

function TipCard({ icon, title, description }) {
  return (
    <div className="p-4 rounded-xl bg-warmgray-50 dark:bg-gray-800 border border-warmgray-200 dark:border-gray-700">
      <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="font-semibold text-warmgray-800 dark:text-gray-100 mb-1">
        {title}
      </h3>
      <p className="text-sm text-warmgray-600 dark:text-gray-400">
        {description}
      </p>
    </div>
  )
}
