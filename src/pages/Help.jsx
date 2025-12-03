import { useState } from 'react'
import {
  GraduationCap,
  BookOpen,
  Calendar,
  Settings,
  Download,
  Upload,
  Users,
  TrendingUp,
  BarChart3,
  FileText,
  Moon,
  Trash2,
  Plus,
  ChevronRight,
  ChevronDown,
  Printer
} from 'lucide-react'

export default function Help() {
  const [openSection, setOpenSection] = useState('getting-started')

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section)
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-warmgray-900 dark:text-gray-100 mb-2">
          Help & Documentation
        </h1>
        <p className="text-warmgray-600 dark:text-gray-400">
          Everything you need to know about using Family Gradebook
        </p>
      </div>

      <div className="space-y-4">
        {/* Getting Started */}
        <HelpSection
          id="getting-started"
          title="Getting Started"
          icon={<GraduationCap className="w-5 h-5" />}
          isOpen={openSection === 'getting-started'}
          onToggle={() => toggleSection('getting-started')}
        >
          <div className="space-y-4">
            <HelpItem title="1. Add Your First Student">
              <p>Click the <strong>"Add Student"</strong> button in the sidebar (left side of the screen).</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Enter the student's first and last name</li>
                <li>Select their current grade level</li>
                <li>Click "Add Student" to save</li>
              </ul>
            </HelpItem>

            <HelpItem title="2. Create a School Year">
              <p>Go to <strong>Settings</strong> from the sidebar, then scroll to "School Years".</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Click "Add Year"</li>
                <li>Enter a name (e.g., "2024-2025")</li>
                <li>Set start and end dates</li>
                <li>The new year will automatically become active</li>
              </ul>
            </HelpItem>

            <HelpItem title="3. Add Courses">
              <p>Click on a student name in the sidebar to view their profile, then:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Click "Add Course"</li>
                <li>Enter course name (e.g., "Algebra I")</li>
                <li>Set credit hours (typically 0.5 or 1.0)</li>
                <li>Choose a color for easy identification</li>
                <li>Toggle "Ignore Attendance Weight" if attendance shouldn't affect the grade</li>
              </ul>
            </HelpItem>
          </div>
        </HelpSection>

        {/* Managing Students */}
        <HelpSection
          id="students"
          title="Managing Students"
          icon={<Users className="w-5 h-5" />}
          isOpen={openSection === 'students'}
          onToggle={() => toggleSection('students')}
        >
          <div className="space-y-4">
            <HelpItem title="Adding Multiple Students">
              <p>You can add as many students as you need. Each student has their own:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Course list and grades</li>
                <li>Attendance records</li>
                <li>GPA calculation</li>
              </ul>
            </HelpItem>

            <HelpItem title="Viewing Student Profiles">
              <p>Click any student name in the sidebar to view:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>All their courses with current grades</li>
                <li>Overall GPA</li>
                <li>Quick access to attendance</li>
              </ul>
            </HelpItem>

            <HelpItem title="Deleting a Student">
              <p>From the student's profile page:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Click the three-dot menu (⋮) in the top right</li>
                <li>Select "Delete Student"</li>
                <li>Confirm the deletion</li>
                <li><strong>Warning:</strong> This permanently deletes all courses, grades, and attendance records</li>
              </ul>
            </HelpItem>
          </div>
        </HelpSection>

        {/* Courses & Grading */}
        <HelpSection
          id="courses"
          title="Courses & Grading"
          icon={<BookOpen className="w-5 h-5" />}
          isOpen={openSection === 'courses'}
          onToggle={() => toggleSection('courses')}
        >
          <div className="space-y-4">
            <HelpItem title="Course Structure">
              <p>Each course has three default grade categories:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Daily/Homework</strong> - 25% weight</li>
                <li><strong>Quizzes</strong> - 25% weight</li>
                <li><strong>Tests</strong> - 50% weight</li>
              </ul>
              <p className="mt-2">You can adjust these weights to match your teaching style. Weights must total 100%.</p>
            </HelpItem>

            <HelpItem title="Adding Grades">
              <p>Click on a course to open it, then:</p>
              <ol className="list-decimal pl-5 mt-2 space-y-1">
                <li>Choose a category (Daily, Quiz, or Test)</li>
                <li>Click "Add Grade"</li>
                <li>Enter the score earned and maximum points possible</li>
                <li>Override the date if entering historical data (defaults to today)</li>
                <li>Add optional notes</li>
                <li>Click the checkmark to save</li>
              </ol>
              <p className="mt-2"><strong>Example:</strong> Score: 85, Max Points: 100 = 85%</p>
              <p className="mt-2"><strong>Custom Dates:</strong> When entering past assignments, use the date picker to set the correct date. This is helpful when catching up on grade entry.</p>
            </HelpItem>

            <HelpItem title="How Grades are Calculated">
              <p>Course grades use weighted averages:</p>
              <ol className="list-decimal pl-5 mt-2 space-y-1">
                <li>Each category average is calculated from all assignments in that category</li>
                <li>Category averages are multiplied by their weight</li>
                <li>Academic grade = sum of all weighted categories</li>
                <li>If attendance is enabled: Final grade = (Academic × 67%) + (Attendance × 33%)</li>
                <li>Letter grade is assigned based on the grading scale (see Settings)</li>
              </ol>
            </HelpItem>

            <HelpItem title="Editing Grades">
              <p>You can edit any grade after it's been saved:</p>
              <ol className="list-decimal pl-5 mt-2 space-y-1">
                <li>Open the course containing the grade</li>
                <li>Hover over the grade you want to edit</li>
                <li>Click the pencil icon that appears</li>
                <li>Modify the score, max score, date, or notes</li>
                <li>Click the checkmark to save or X to cancel</li>
              </ol>
              <p className="mt-2"><strong>Tip:</strong> This is helpful for correcting data entry mistakes or updating scores after reviewing work.</p>
            </HelpItem>

            <HelpItem title="Deleting Grades">
              <p>To remove a grade:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Hover over the grade in the course view</li>
                <li>Click the trash icon that appears</li>
                <li>Confirm the deletion</li>
              </ul>
            </HelpItem>

            <HelpItem title="Editing a Course">
              <p>You can modify course details after creation:</p>
              <ol className="list-decimal pl-5 mt-2 space-y-1">
                <li>Open the course</li>
                <li>Click the three-dot menu (⋮) in the top right</li>
                <li>Select "Edit Course"</li>
                <li>Modify the course name, credits, description, or color</li>
                <li>Click "Save Changes"</li>
              </ol>
              <p className="mt-2"><strong>Example uses:</strong> Fix typos in course names, adjust credit hours, change course colors, or add descriptions.</p>
            </HelpItem>

            <HelpItem title="Deleting a Course">
              <p>Open the course, then:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Click the three-dot menu (⋮) in the top right</li>
                <li>Select "Delete Course"</li>
                <li>Confirm - this permanently deletes all grades and categories in the course</li>
              </ul>
            </HelpItem>
          </div>
        </HelpSection>

        {/* Attendance */}
        <HelpSection
          id="attendance"
          title="Attendance Tracking"
          icon={<Calendar className="w-5 h-5" />}
          isOpen={openSection === 'attendance'}
          onToggle={() => toggleSection('attendance')}
        >
          <div className="space-y-4">
            <HelpItem title="Recording Attendance">
              <p>From a student's profile:</p>
              <ol className="list-decimal pl-5 mt-2 space-y-1">
                <li>Click the "Attendance" button</li>
                <li>You'll see a monthly calendar view</li>
                <li>Click any date to mark it as Present or Absent</li>
                <li>Click again to toggle between Present/Absent</li>
                <li>Navigate between months using the arrow buttons</li>
              </ol>
            </HelpItem>

            <HelpItem title="How Attendance Affects Grades">
              <p>By default, attendance contributes <strong>33%</strong> to the final course grade:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Academic performance: 67%</li>
                <li>Attendance rate: 33%</li>
              </ul>
              <p className="mt-2"><strong>Example:</strong> If a student has a 90% academic average and 100% attendance, their final grade is (90 × 0.67) + (100 × 0.33) = 93.3%</p>
            </HelpItem>

            <HelpItem title="Disabling Attendance for a Course">
              <p>Some courses (like online or self-paced) don't require attendance:</p>
              <ol className="list-decimal pl-5 mt-2 space-y-1">
                <li>Open the course</li>
                <li>Find "Ignore Attendance Weight" toggle</li>
                <li>Enable it to base grades 100% on academic performance</li>
              </ol>
            </HelpItem>

            <HelpItem title="Viewing Attendance Statistics">
              <p>The attendance page shows:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Monthly attendance rate</li>
                <li>Total days present vs. absent</li>
                <li>Visual calendar with color-coded days</li>
              </ul>
            </HelpItem>
          </div>
        </HelpSection>

        {/* GPA Calculation */}
        <HelpSection
          id="gpa"
          title="GPA Calculation"
          icon={<TrendingUp className="w-5 h-5" />}
          isOpen={openSection === 'gpa'}
          onToggle={() => toggleSection('gpa')}
        >
          <div className="space-y-4">
            <HelpItem title="How GPA is Calculated">
              <p>GPA uses a weighted average based on credit hours:</p>
              <ol className="list-decimal pl-5 mt-2 space-y-1">
                <li>Each course's letter grade is converted to GPA points (A=4.0, B=3.0, etc.)</li>
                <li>GPA points are multiplied by credit hours</li>
                <li>Sum all (GPA points × credit hours)</li>
                <li>Divide by total credit hours</li>
              </ol>
              <p className="mt-2"><strong>Example:</strong></p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Math (1.0 credit, A = 4.0): 4.0 × 1.0 = 4.0</li>
                <li>English (1.0 credit, B = 3.0): 3.0 × 1.0 = 3.0</li>
                <li>Science (0.5 credit, A = 4.0): 4.0 × 0.5 = 2.0</li>
                <li>Total: 9.0 points ÷ 2.5 credits = <strong>3.6 GPA</strong></li>
              </ul>
            </HelpItem>

            <HelpItem title="Viewing GPA">
              <p>You can see a student's GPA in multiple places:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>In the sidebar next to the student's name</li>
                <li>At the top of the student's profile page</li>
                <li>On the dashboard (if viewing all students)</li>
              </ul>
            </HelpItem>

            <HelpItem title="Credit Hours">
              <p>Credit hours represent the weight of a course:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Full-year course:</strong> 1.0 credit</li>
                <li><strong>Half-year/semester:</strong> 0.5 credit</li>
                <li><strong>Quarter course:</strong> 0.25 credit</li>
              </ul>
              <p className="mt-2">Courses with more credits have greater impact on GPA.</p>
            </HelpItem>
          </div>
        </HelpSection>

        {/* Grading Scales */}
        <HelpSection
          id="grading-scale"
          title="Grading Scales"
          icon={<BarChart3 className="w-5 h-5" />}
          isOpen={openSection === 'grading-scale'}
          onToggle={() => toggleSection('grading-scale')}
        >
          <div className="space-y-4">
            <HelpItem title="Simple vs. Advanced Grading">
              <p>Family Gradebook offers two grading scales:</p>

              <div className="mt-3">
                <p className="font-semibold">Simple Scale (5 grades):</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>A (90-100%) = 4.0 GPA</li>
                  <li>B (80-89%) = 3.0 GPA</li>
                  <li>C (70-79%) = 2.0 GPA</li>
                  <li>D (60-69%) = 1.0 GPA</li>
                  <li>F (0-59%) = 0.0 GPA</li>
                </ul>
              </div>

              <div className="mt-3">
                <p className="font-semibold">Advanced Scale (13 grades):</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>A+ (97-100%) = 4.0 GPA</li>
                  <li>A (93-96%) = 4.0 GPA</li>
                  <li>A- (90-92%) = 3.7 GPA</li>
                  <li>B+, B, B- (80-89%)</li>
                  <li>C+, C, C- (70-79%)</li>
                  <li>D+, D, D- (60-69%)</li>
                  <li>F (0-59%) = 0.0 GPA</li>
                </ul>
              </div>
            </HelpItem>

            <HelpItem title="Switching Grading Scales">
              <p>To switch between simple and advanced:</p>
              <ol className="list-decimal pl-5 mt-2 space-y-1">
                <li>Go to <strong>Settings</strong></li>
                <li>Find the "Grading Scale" section</li>
                <li>Click "Switch to Advanced Grades" or "Switch to Simple Grades"</li>
                <li>All existing grades will automatically recalculate</li>
              </ol>
            </HelpItem>

            <HelpItem title="Customizing Grade Thresholds">
              <p>You can modify the percentage thresholds and GPA points:</p>
              <ol className="list-decimal pl-5 mt-2 space-y-1">
                <li>Go to Settings → Grading Scale</li>
                <li>Edit the "Minimum %" or "GPA Points" for any grade</li>
                <li>Changes save automatically</li>
                <li>All courses will recalculate with the new scale</li>
              </ol>
            </HelpItem>
          </div>
        </HelpSection>

        {/* Reports */}
        <HelpSection
          id="reports"
          title="Reports & Printing"
          icon={<Printer className="w-5 h-5" />}
          isOpen={openSection === 'reports'}
          onToggle={() => toggleSection('reports')}
        >
          <div className="space-y-4">
            <HelpItem title="Generating Report Cards">
              <p>Create professional, print-ready grade reports:</p>
              <ol className="list-decimal pl-5 mt-2 space-y-1">
                <li>Click "Reports" in the sidebar</li>
                <li>Select a student from the dropdown</li>
                <li>Select a school year</li>
                <li>Click "Generate Report"</li>
              </ol>
              <p className="mt-2">The report will display with all course grades, GPA, attendance, and more.</p>
            </HelpItem>

            <HelpItem title="What's Included in Reports">
              <p>Each report card includes:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Student Information:</strong> Name, grade level, school year, report date</li>
                <li><strong>Academic Summary:</strong> Cumulative GPA, credits earned, credits attempted</li>
                <li><strong>Course Grades:</strong> Complete table with course names, credits, percentage, letter grade, and GPA points</li>
                <li><strong>Attendance Summary:</strong> Days present, days absent, attendance rate</li>
                <li><strong>Grading Scale Reference:</strong> Shows your current grading scale for context</li>
              </ul>
            </HelpItem>

            <HelpItem title="Printing Reports">
              <p>To print a report card:</p>
              <ol className="list-decimal pl-5 mt-2 space-y-1">
                <li>Generate the report as described above</li>
                <li>Click the "Print" button at the top</li>
                <li>Your browser's print dialog will open</li>
                <li>Adjust print settings if needed</li>
                <li>Click Print to send to your printer</li>
              </ol>
              <p className="mt-2">The report is automatically formatted for 8.5" × 11" (letter) paper with proper margins.</p>
            </HelpItem>

            <HelpItem title="Exporting to PDF">
              <p>To save a report as a PDF file:</p>
              <ol className="list-decimal pl-5 mt-2 space-y-1">
                <li>Generate the report</li>
                <li>Click the "Export PDF" button (or use the Print button)</li>
                <li>In the print dialog, select "Save as PDF" as your printer</li>
                <li>Choose a location and filename</li>
                <li>Click Save</li>
              </ol>
              <p className="mt-2"><strong>Tip:</strong> PDF reports are great for sharing with administrators, keeping digital records, or submitting to umbrella schools.</p>
            </HelpItem>

            <HelpItem title="Multiple Reports">
              <p>Generate reports for different scenarios:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Mid-year progress:</strong> Generate reports during the school year</li>
                <li><strong>Final transcripts:</strong> Generate at year end with complete grades</li>
                <li><strong>Multiple students:</strong> Generate separate reports for each child</li>
                <li><strong>Historical records:</strong> Generate reports for previous school years</li>
              </ul>
            </HelpItem>
          </div>
        </HelpSection>

        {/* School Years */}
        <HelpSection
          id="school-years"
          title="School Years"
          icon={<Calendar className="w-5 h-5" />}
          isOpen={openSection === 'school-years'}
          onToggle={() => toggleSection('school-years')}
        >
          <div className="space-y-4">
            <HelpItem title="Creating School Years">
              <p>School years help organize your records by academic year:</p>
              <ol className="list-decimal pl-5 mt-2 space-y-1">
                <li>Go to <strong>Settings</strong> → School Years</li>
                <li>Click "Add Year"</li>
                <li>Enter a name (e.g., "2024-2025")</li>
                <li>Set start date (e.g., September 1)</li>
                <li>Set end date (e.g., June 30)</li>
              </ol>
            </HelpItem>

            <HelpItem title="Switching Between Years">
              <p>Use the year dropdown in the sidebar:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>The active year is marked with "(Active)"</li>
                <li>Select any year to view that year's data</li>
                <li>Only one year can be active at a time</li>
              </ul>
            </HelpItem>

            <HelpItem title="Setting Active Year">
              <p>The active year is where new students and courses are added:</p>
              <ol className="list-decimal pl-5 mt-2 space-y-1">
                <li>Go to Settings → School Years</li>
                <li>Find the year you want to activate</li>
                <li>Click "Set Active"</li>
              </ol>
            </HelpItem>

            <HelpItem title="Editing School Years">
              <p>To modify a school year:</p>
              <ol className="list-decimal pl-5 mt-2 space-y-1">
                <li>Go to Settings → School Years</li>
                <li>Click the edit icon (pencil) next to the year</li>
                <li>Update the name or dates</li>
                <li>Click "Update Year"</li>
              </ol>
            </HelpItem>
          </div>
        </HelpSection>

        {/* Data Management */}
        <HelpSection
          id="data"
          title="Data Management"
          icon={<FileText className="w-5 h-5" />}
          isOpen={openSection === 'data'}
          onToggle={() => toggleSection('data')}
        >
          <div className="space-y-4">
            <HelpItem title="Exporting Your Data">
              <p>Create a backup of all your gradebook data:</p>
              <ol className="list-decimal pl-5 mt-2 space-y-1">
                <li>Go to <strong>Settings</strong> → Data Management</li>
                <li>Click "Export"</li>
                <li>A JSON file will download with the current date in the filename</li>
                <li>Store this file safely (cloud storage, external drive, etc.)</li>
              </ol>
              <p className="mt-2"><strong>What's included:</strong> All students, courses, grades, attendance, school years, and settings.</p>
            </HelpItem>

            <HelpItem title="Importing Data">
              <p>Restore from a previous backup:</p>
              <ol className="list-decimal pl-5 mt-2 space-y-1">
                <li>Go to Settings → Data Management</li>
                <li>Click "Import"</li>
                <li>Select your backup JSON file</li>
                <li>Confirm - this will replace all current data</li>
                <li>The page will reload with the imported data</li>
              </ol>
              <p className="mt-2"><strong>Warning:</strong> Importing will overwrite all existing data. Export first if you want to keep your current data.</p>
            </HelpItem>

            <HelpItem title="Where Data is Stored">
              <p>All your data is stored locally on your computer:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Web version:</strong> Browser's localStorage</li>
                <li><strong>Desktop app:</strong> Application data folder on your computer</li>
                <li><strong>Privacy:</strong> Your data never leaves your device</li>
                <li><strong>No internet required:</strong> Works completely offline</li>
              </ul>
            </HelpItem>

            <HelpItem title="Clearing All Data">
              <p>To start fresh:</p>
              <ol className="list-decimal pl-5 mt-2 space-y-1">
                <li>Go to Settings → Data Management</li>
                <li>Click "Clear All"</li>
                <li>Confirm the deletion</li>
                <li><strong>Important:</strong> This is permanent. Export your data first if you might need it later.</li>
              </ol>
            </HelpItem>
          </div>
        </HelpSection>

        {/* Appearance */}
        <HelpSection
          id="appearance"
          title="Appearance & Settings"
          icon={<Settings className="w-5 h-5" />}
          isOpen={openSection === 'appearance'}
          onToggle={() => toggleSection('appearance')}
        >
          <div className="space-y-4">
            <HelpItem title="Dark Mode">
              <p>Switch between light and dark themes:</p>
              <ol className="list-decimal pl-5 mt-2 space-y-1">
                <li>Go to <strong>Settings</strong> → Appearance</li>
                <li>Click "Dark Mode" or "Light Mode"</li>
                <li>The theme changes instantly</li>
                <li>Your preference is saved automatically</li>
              </ol>
            </HelpItem>

            <HelpItem title="Course Colors">
              <p>Assign colors to courses for easy identification:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>When creating or editing a course, choose from preset colors</li>
                <li>Colors appear on course cards and headers</li>
                <li>Helps quickly identify courses at a glance</li>
              </ul>
            </HelpItem>
          </div>
        </HelpSection>

        {/* Tips & Best Practices */}
        <HelpSection
          id="tips"
          title="Tips & Best Practices"
          icon={<GraduationCap className="w-5 h-5" />}
          isOpen={openSection === 'tips'}
          onToggle={() => toggleSection('tips')}
        >
          <div className="space-y-4">
            <HelpItem title="Regular Backups">
              <p>Create regular backups to prevent data loss:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Export your data monthly or quarterly</li>
                <li>Store backups in multiple locations (cloud, external drive)</li>
                <li>Name files with dates (e.g., "gradebook-2024-12-01.json")</li>
              </ul>
            </HelpItem>

            <HelpItem title="Grade Entry">
              <p>For best results:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Enter grades regularly to keep calculations accurate</li>
                <li>Use the notes field to remember what each assignment was</li>
                <li>Override dates when entering historical data or past assignments</li>
                <li>Don't worry about mistakes - you can always edit grades later by clicking the pencil icon</li>
                <li>Adjust category weights at the start of each course</li>
                <li>Review calculated grades to ensure they match your expectations</li>
              </ul>
            </HelpItem>

            <HelpItem title="Organizing Courses">
              <p>Keep your gradebook organized:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Use descriptive course names (e.g., "Algebra I" not just "Math")</li>
                <li>Assign consistent credit values (1.0 for full-year, 0.5 for semester)</li>
                <li>Choose different colors for each course</li>
                <li>Archive old years to keep the interface clean</li>
              </ul>
            </HelpItem>

            <HelpItem title="Attendance Tracking">
              <p>Make attendance tracking easier:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Mark attendance daily or weekly, whichever works for your schedule</li>
                <li>For year-round homeschooling, mark days off as absent or just skip them</li>
                <li>Disable attendance weight for independent study courses</li>
              </ul>
            </HelpItem>

            <HelpItem title="End of Year">
              <p>When completing a school year:</p>
              <ol className="list-decimal pl-5 mt-2 space-y-1">
                <li>Export your data as a final backup</li>
                <li>Generate and save final report cards for each student (Reports → Generate → Export PDF)</li>
                <li>Review all GPAs and transcripts</li>
                <li>Create a new school year for the upcoming year</li>
                <li>Set the new year as active</li>
                <li>Previous years remain accessible via the year dropdown</li>
              </ol>
            </HelpItem>
          </div>
        </HelpSection>

        {/* Troubleshooting */}
        <HelpSection
          id="troubleshooting"
          title="Troubleshooting"
          icon={<Settings className="w-5 h-5" />}
          isOpen={openSection === 'troubleshooting'}
          onToggle={() => toggleSection('troubleshooting')}
        >
          <div className="space-y-4">
            <HelpItem title="Data Not Saving">
              <p>If your data isn't persisting:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Check if your browser allows localStorage</li>
                <li>Disable private/incognito mode</li>
                <li>Check available storage space</li>
                <li>Try exporting and re-importing your data</li>
              </ul>
            </HelpItem>

            <HelpItem title="Incorrect Grade Calculations">
              <p>If grades don't seem right:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Verify category weights total 100%</li>
                <li>Check if attendance is enabled/disabled as intended</li>
                <li>Review the grading scale thresholds in Settings</li>
                <li>Ensure all assignments have valid scores</li>
              </ul>
            </HelpItem>

            <HelpItem title="Can't Find a Student or Course">
              <p>Check the school year:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Students and courses are tied to school years</li>
                <li>Use the year dropdown in the sidebar to switch years</li>
                <li>Verify you're viewing the correct year</li>
              </ul>
            </HelpItem>

            <HelpItem title="Performance Issues">
              <p>If the app is running slowly:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Clear your browser cache</li>
                <li>Close other browser tabs</li>
                <li>Export data, clear all data, then re-import</li>
                <li>Consider using the desktop app for better performance</li>
              </ul>
            </HelpItem>
          </div>
        </HelpSection>
      </div>

      {/* Footer */}
      <div className="mt-12 p-6 bg-warmgray-50 dark:bg-gray-800 rounded-xl border border-warmgray-200 dark:border-gray-700">
        <h3 className="font-semibold text-warmgray-900 dark:text-gray-100 mb-2">
          Still need help?
        </h3>
        <p className="text-warmgray-600 dark:text-gray-400 text-sm">
          This app is designed to be intuitive and easy to use. If you're still having trouble,
          try exploring the interface - most features are discoverable by clicking around.
          Remember to export your data regularly to keep it safe!
        </p>
      </div>
    </div>
  )
}

function HelpSection({ id, title, icon, children, isOpen, onToggle }) {
  return (
    <div className="card overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-warmgray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="text-terracotta-500">
            {icon}
          </div>
          <h2 className="font-display text-xl font-semibold text-warmgray-900 dark:text-gray-100">
            {title}
          </h2>
        </div>
        <div className="text-warmgray-400 dark:text-gray-500">
          {isOpen ? (
            <ChevronDown className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="px-5 pb-5 border-t border-warmgray-100 dark:border-gray-700 pt-5">
          {children}
        </div>
      )}
    </div>
  )
}

function HelpItem({ title, children }) {
  return (
    <div>
      <h4 className="font-semibold text-warmgray-900 dark:text-gray-100 mb-2">
        {title}
      </h4>
      <div className="text-sm text-warmgray-600 dark:text-gray-400 space-y-2">
        {children}
      </div>
    </div>
  )
}
