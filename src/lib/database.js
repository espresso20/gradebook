// Database schema and operations for the gradebook
// This will be used by Electron's main process with better-sqlite3

export const schema = `
-- Students table
CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  grade_level TEXT,
  birth_date TEXT,
  photo_url TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- School years table
CREATE TABLE IF NOT EXISTS school_years (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  is_active INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Grading scales (customizable per school year)
CREATE TABLE IF NOT EXISTS grading_scales (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  school_year_id INTEGER NOT NULL,
  letter_grade TEXT NOT NULL,
  min_percentage REAL NOT NULL,
  gpa_points REAL,
  FOREIGN KEY (school_year_id) REFERENCES school_years(id)
);

-- Courses/subjects
CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  school_year_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  credits REAL DEFAULT 1.0,
  color TEXT DEFAULT '#6B8A62',
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (school_year_id) REFERENCES school_years(id)
);

-- Grade categories (Daily, Quizzes, Tests, etc.)
CREATE TABLE IF NOT EXISTS grade_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  weight REAL DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Individual grade entries
CREATE TABLE IF NOT EXISTS grades (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  score REAL NOT NULL,
  max_score REAL DEFAULT 100,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (category_id) REFERENCES grade_categories(id)
);

-- Attendance tracking
CREATE TABLE IF NOT EXISTS attendance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  school_year_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'half', 'absent', 'sick', 'holiday')),
  notes TEXT,
  UNIQUE(student_id, school_year_id, date),
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (school_year_id) REFERENCES school_years(id)
);

-- Reading log / book list
CREATE TABLE IF NOT EXISTS books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  school_year_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  author TEXT,
  date_read TEXT,
  notes TEXT,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (school_year_id) REFERENCES school_years(id)
);

-- Activities log
CREATE TABLE IF NOT EXISTS activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  school_year_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (school_year_id) REFERENCES school_years(id)
);

-- Default grading scale insert
INSERT OR IGNORE INTO school_years (id, name, start_date, end_date, is_active) 
VALUES (1, '2024-2025', '2024-08-01', '2025-06-01', 1);

INSERT OR IGNORE INTO grading_scales (school_year_id, letter_grade, min_percentage, gpa_points) VALUES
(1, 'A+', 98, 4.0),
(1, 'A', 93, 4.0),
(1, 'A-', 90, 3.7),
(1, 'B+', 88, 3.3),
(1, 'B', 83, 3.0),
(1, 'B-', 80, 2.7),
(1, 'C+', 78, 2.3),
(1, 'C', 73, 2.0),
(1, 'C-', 70, 1.7),
(1, 'D', 65, 1.0),
(1, 'F', 0, 0.0);
`;

// Grade calculation utilities (matches your Excel template logic)
export function calculateCategoryAverage(grades) {
  if (!grades || grades.length === 0) return null;
  const sum = grades.reduce((acc, g) => acc + (g.score / g.max_score * 100), 0);
  return sum / grades.length;
}

export function calculateWeightedGrade(categories) {
  // categories = [{ average, weight }, ...]
  const validCategories = categories.filter(c => c.average !== null && c.weight > 0);
  if (validCategories.length === 0) return null;
  
  const totalWeight = validCategories.reduce((acc, c) => acc + c.weight, 0);
  if (totalWeight === 0) return null;
  
  const weightedSum = validCategories.reduce((acc, c) => acc + (c.average * c.weight), 0);
  return weightedSum / totalWeight;
}

export function calculateGPA(courses, gradingScale) {
  // courses = [{ grade, credits }, ...]
  const validCourses = courses.filter(c => c.grade !== null && c.credits > 0);
  if (validCourses.length === 0) return null;
  
  let totalPoints = 0;
  let totalCredits = 0;
  
  for (const course of validCourses) {
    const letterGrade = getLetterGrade(course.grade, gradingScale);
    const gradeInfo = gradingScale.find(g => g.letter_grade === letterGrade);
    if (gradeInfo) {
      totalPoints += gradeInfo.gpa_points * course.credits;
      totalCredits += course.credits;
    }
  }
  
  return totalCredits > 0 ? totalPoints / totalCredits : null;
}

export function getLetterGrade(percentage, gradingScale) {
  if (percentage === null || percentage === undefined) return null;
  
  // Sort descending by min_percentage
  const sorted = [...gradingScale].sort((a, b) => b.min_percentage - a.min_percentage);
  
  for (const grade of sorted) {
    if (percentage >= grade.min_percentage - 0.01) {
      return grade.letter_grade;
    }
  }
  return 'F';
}

export function getGradeColorClass(letterGrade) {
  if (!letterGrade) return '';
  const first = letterGrade.charAt(0).toUpperCase();
  switch (first) {
    case 'A': return 'grade-a';
    case 'B': return 'grade-b';
    case 'C': return 'grade-c';
    case 'D': return 'grade-d';
    case 'F': return 'grade-f';
    default: return '';
  }
}
