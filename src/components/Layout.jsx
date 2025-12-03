import Sidebar from './Sidebar'

export default function Layout({ children, students, schoolYears, activeYear, onUpdate }) {
  return (
    <div className="flex h-screen bg-cream-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        students={students}
        schoolYears={schoolYears}
        activeYear={activeYear}
        onUpdate={onUpdate}
      />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
