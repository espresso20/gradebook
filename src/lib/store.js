// Mock data store for browser-based development
// This simulates the SQLite database until Electron is integrated

import { 
  calculateCategoryAverage, 
  calculateWeightedGrade, 
  getLetterGrade 
} from './database';

// Initialize from localStorage or use defaults
const getStoredData = (key, defaultValue) => {
  try {
    const stored = localStorage.getItem(`gradebook_${key}`);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveData = (key, data) => {
  try {
    localStorage.setItem(`gradebook_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save data:', e);
  }
};

// Simple grading scale (A, B, C, D, F)
const simpleGradingScale = [
  { id: 1, letter_grade: 'A', min_percentage: 90, gpa_points: 4.0 },
  { id: 2, letter_grade: 'B', min_percentage: 80, gpa_points: 3.0 },
  { id: 3, letter_grade: 'C', min_percentage: 70, gpa_points: 2.0 },
  { id: 4, letter_grade: 'D', min_percentage: 60, gpa_points: 1.0 },
  { id: 5, letter_grade: 'F', min_percentage: 0, gpa_points: 0.0 },
];

// Advanced grading scale (A+, A, A-, B+, B, B-, etc.)
const advancedGradingScale = [
  { id: 1, letter_grade: 'A+', min_percentage: 97, gpa_points: 4.0 },
  { id: 2, letter_grade: 'A', min_percentage: 93, gpa_points: 4.0 },
  { id: 3, letter_grade: 'A-', min_percentage: 90, gpa_points: 3.7 },
  { id: 4, letter_grade: 'B+', min_percentage: 87, gpa_points: 3.3 },
  { id: 5, letter_grade: 'B', min_percentage: 83, gpa_points: 3.0 },
  { id: 6, letter_grade: 'B-', min_percentage: 80, gpa_points: 2.7 },
  { id: 7, letter_grade: 'C+', min_percentage: 77, gpa_points: 2.3 },
  { id: 8, letter_grade: 'C', min_percentage: 73, gpa_points: 2.0 },
  { id: 9, letter_grade: 'C-', min_percentage: 70, gpa_points: 1.7 },
  { id: 10, letter_grade: 'D+', min_percentage: 67, gpa_points: 1.3 },
  { id: 11, letter_grade: 'D', min_percentage: 63, gpa_points: 1.0 },
  { id: 12, letter_grade: 'D-', min_percentage: 60, gpa_points: 0.7 },
  { id: 13, letter_grade: 'F', min_percentage: 0, gpa_points: 0.0 },
];

const defaultGradingScale = simpleGradingScale;

const defaultSchoolYear = {
  id: 1,
  name: '2024-2025',
  start_date: '2024-08-01',
  end_date: '2025-06-01',
  is_active: true,
};

// In-memory data store
let store = {
  students: getStoredData('students', []),
  schoolYears: getStoredData('schoolYears', [defaultSchoolYear]),
  gradingScale: getStoredData('gradingScale', defaultGradingScale),
  courses: getStoredData('courses', []),
  gradeCategories: getStoredData('gradeCategories', []),
  grades: getStoredData('grades', []),
  attendance: getStoredData('attendance', []),
  books: getStoredData('books', []),
  activities: getStoredData('activities', []),
};

let nextIds = {
  students: Math.max(0, ...store.students.map(s => s.id)) + 1,
  courses: Math.max(0, ...store.courses.map(c => c.id)) + 1,
  gradeCategories: Math.max(0, ...store.gradeCategories.map(c => c.id)) + 1,
  grades: Math.max(0, ...store.grades.map(g => g.id)) + 1,
  attendance: Math.max(0, ...store.attendance.map(a => a.id)) + 1,
  schoolYears: Math.max(0, ...store.schoolYears.map(s => s.id)) + 1,
};

// Persist helper
const persist = () => {
  Object.keys(store).forEach(key => saveData(key, store[key]));
};

// API-like interface
export const db = {
  // Students
  getStudents: () => [...store.students],
  
  getStudent: (id) => store.students.find(s => s.id === id),
  
  addStudent: (student) => {
    const newStudent = {
      ...student,
      id: nextIds.students++,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    store.students.push(newStudent);
    persist();
    return newStudent;
  },
  
  updateStudent: (id, updates) => {
    const index = store.students.findIndex(s => s.id === id);
    if (index !== -1) {
      store.students[index] = {
        ...store.students[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      persist();
      return store.students[index];
    }
    return null;
  },
  
  deleteStudent: (id) => {
    store.students = store.students.filter(s => s.id !== id);
    // Cascade delete courses, grades, etc.
    const courseIds = store.courses.filter(c => c.student_id === id).map(c => c.id);
    store.courses = store.courses.filter(c => c.student_id !== id);
    const categoryIds = store.gradeCategories.filter(c => courseIds.includes(c.course_id)).map(c => c.id);
    store.gradeCategories = store.gradeCategories.filter(c => !courseIds.includes(c.course_id));
    store.grades = store.grades.filter(g => !categoryIds.includes(g.category_id));
    store.attendance = store.attendance.filter(a => a.student_id !== id);
    persist();
  },

  // School Years
  getSchoolYears: () => [...store.schoolYears],
  
  getActiveSchoolYear: () => store.schoolYears.find(y => y.is_active),
  
  addSchoolYear: (year) => {
    const newYear = {
      ...year,
      id: nextIds.schoolYears++,
      created_at: new Date().toISOString(),
    };
    store.schoolYears.push(newYear);
    persist();
    return newYear;
  },
  
  setActiveSchoolYear: (id) => {
    store.schoolYears = store.schoolYears.map(y => ({
      ...y,
      is_active: y.id === id,
    }));
    persist();
  },

  updateSchoolYear: (id, updates) => {
    const index = store.schoolYears.findIndex(y => y.id === id);
    if (index !== -1) {
      store.schoolYears[index] = {
        ...store.schoolYears[index],
        ...updates,
      };
      persist();
      return store.schoolYears[index];
    }
    return null;
  },

  // Grading Scale
  getGradingScale: () => [...store.gradingScale],

  updateGradingScale: (scale) => {
    store.gradingScale = scale;
    persist();
  },

  isSimpleGradingScale: () => {
    // Check if current scale is simple (5 grades) or advanced (13 grades)
    return store.gradingScale.length === 5;
  },

  toggleGradingScale: () => {
    // Switch between simple and advanced grading scales
    const isCurrentlySimple = store.gradingScale.length === 5;
    store.gradingScale = isCurrentlySimple ? [...advancedGradingScale] : [...simpleGradingScale];
    persist();
    return {
      scale: [...store.gradingScale],
      isSimple: !isCurrentlySimple
    };
  },

  resetGradingScale: () => {
    store.gradingScale = defaultGradingScale;
    persist();
    return [...store.gradingScale];
  },

  // Courses
  getCourses: (studentId, schoolYearId) => {
    return store.courses.filter(c => 
      c.student_id === studentId && 
      c.school_year_id === schoolYearId
    );
  },
  
  getCourse: (id) => store.courses.find(c => c.id === id),
  
  addCourse: (course) => {
    const newCourse = {
      ...course,
      id: nextIds.courses++,
      created_at: new Date().toISOString(),
    };
    store.courses.push(newCourse);
    
    // Create default categories
    const defaultCategories = [
      { name: 'Grades', weight: 0.25, sort_order: 0 },
      { name: 'Quizzes', weight: 0.25, sort_order: 1 },
      { name: 'Tests', weight: 0.5, sort_order: 2 },
    ];
    
    defaultCategories.forEach(cat => {
      store.gradeCategories.push({
        ...cat,
        id: nextIds.gradeCategories++,
        course_id: newCourse.id,
      });
    });
    
    persist();
    return newCourse;
  },
  
  updateCourse: (id, updates) => {
    const index = store.courses.findIndex(c => c.id === id);
    if (index !== -1) {
      store.courses[index] = { ...store.courses[index], ...updates };
      persist();
      return store.courses[index];
    }
    return null;
  },
  
  deleteCourse: (id) => {
    store.courses = store.courses.filter(c => c.id !== id);
    const categoryIds = store.gradeCategories.filter(c => c.course_id === id).map(c => c.id);
    store.gradeCategories = store.gradeCategories.filter(c => c.course_id !== id);
    store.grades = store.grades.filter(g => !categoryIds.includes(g.category_id));
    persist();
  },

  // Grade Categories
  getCategories: (courseId) => {
    return store.gradeCategories
      .filter(c => c.course_id === courseId)
      .sort((a, b) => a.sort_order - b.sort_order);
  },
  
  updateCategory: (id, updates) => {
    const index = store.gradeCategories.findIndex(c => c.id === id);
    if (index !== -1) {
      store.gradeCategories[index] = { ...store.gradeCategories[index], ...updates };
      persist();
      return store.gradeCategories[index];
    }
    return null;
  },
  
  addCategory: (category) => {
    const newCategory = {
      ...category,
      id: nextIds.gradeCategories++,
    };
    store.gradeCategories.push(newCategory);
    persist();
    return newCategory;
  },

  // Grades
  getGrades: (categoryId) => {
    return store.grades
      .filter(g => g.category_id === categoryId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },
  
  addGrade: (grade) => {
    const newGrade = {
      ...grade,
      id: nextIds.grades++,
      created_at: new Date().toISOString(),
    };
    store.grades.push(newGrade);
    persist();
    return newGrade;
  },
  
  updateGrade: (id, updates) => {
    const index = store.grades.findIndex(g => g.id === id);
    if (index !== -1) {
      store.grades[index] = { ...store.grades[index], ...updates };
      persist();
      return store.grades[index];
    }
    return null;
  },
  
  deleteGrade: (id) => {
    store.grades = store.grades.filter(g => g.id !== id);
    persist();
  },

  // Attendance
  getAttendance: (studentId, schoolYearId, month = null) => {
    let records = store.attendance.filter(a => 
      a.student_id === studentId && 
      a.school_year_id === schoolYearId
    );
    if (month) {
      records = records.filter(a => a.date.startsWith(month));
    }
    return records.sort((a, b) => new Date(a.date) - new Date(b.date));
  },
  
  setAttendance: (studentId, schoolYearId, date, status, notes = '') => {
    const existing = store.attendance.findIndex(a => 
      a.student_id === studentId && 
      a.school_year_id === schoolYearId && 
      a.date === date
    );
    
    if (existing !== -1) {
      if (status === null) {
        store.attendance.splice(existing, 1);
      } else {
        store.attendance[existing] = { ...store.attendance[existing], status, notes };
      }
    } else if (status !== null) {
      store.attendance.push({
        id: nextIds.attendance++,
        student_id: studentId,
        school_year_id: schoolYearId,
        date,
        status,
        notes,
      });
    }
    persist();
  },
  
  getAttendanceStats: (studentId, schoolYearId) => {
    const records = store.attendance.filter(a =>
      a.student_id === studentId &&
      a.school_year_id === schoolYearId
    );
    return {
      total: records.length,
      present: records.filter(r => r.status === 'present').length,
      absent: records.filter(r => r.status === 'absent').length,
    };
  },

  getAttendancePercentage: (studentId, schoolYearId) => {
    const records = store.attendance.filter(a =>
      a.student_id === studentId &&
      a.school_year_id === schoolYearId
    );

    if (records.length === 0) return null;

    // Calculate percentage: only count present days
    const daysPresent = records.filter(r => r.status === 'present').length;
    const totalDays = records.length;

    return totalDays > 0 ? (daysPresent / totalDays) * 100 : null;
  },

  // Computed: Get course with calculated grade
  getCourseWithGrade: (courseId) => {
    const course = store.courses.find(c => c.id === courseId);
    if (!course) return null;

    const categories = store.gradeCategories
      .filter(c => c.course_id === courseId)
      .map(cat => {
        const grades = store.grades.filter(g => g.category_id === cat.id);
        return {
          ...cat,
          grades,
          average: calculateCategoryAverage(grades),
        };
      });

    // Calculate academic grade (67% of total)
    const academicGrade = calculateWeightedGrade(categories);

    // Get attendance percentage (33% of total)
    const attendancePercentage = db.getAttendancePercentage(course.student_id, course.school_year_id);

    let finalGrade = null;

    // Check if this course ignores attendance weight
    if (course.ignore_attendance_weight) {
      // Use only academic grade (100%)
      finalGrade = academicGrade;
    } else {
      // Use standard weighting: 67% academic + 33% attendance
      if (academicGrade !== null && attendancePercentage !== null) {
        finalGrade = (academicGrade * 0.67) + (attendancePercentage * 0.33);
      } else if (academicGrade !== null) {
        // If no attendance data, use only academic grade
        finalGrade = academicGrade;
      }
    }

    const letterGrade = finalGrade !== null ? getLetterGrade(finalGrade, store.gradingScale) : null;

    return {
      ...course,
      categories,
      academicGrade,
      attendanceGrade: attendancePercentage,
      grade: finalGrade,
      letterGrade,
    };
  },

  // Get student summary with all courses and GPA
  getStudentSummary: (studentId, schoolYearId) => {
    const student = store.students.find(s => s.id === studentId);
    if (!student) return null;
    
    const courses = store.courses
      .filter(c => c.student_id === studentId && c.school_year_id === schoolYearId)
      .map(course => db.getCourseWithGrade(course.id));
    
    const validCourses = courses.filter(c => c.grade !== null);
    let gpa = null;
    
    if (validCourses.length > 0) {
      const totalCredits = validCourses.reduce((sum, c) => sum + c.credits, 0);
      const weightedSum = validCourses.reduce((sum, c) => {
        const gradeInfo = store.gradingScale.find(g => g.letter_grade === c.letterGrade);
        return sum + (gradeInfo ? gradeInfo.gpa_points * c.credits : 0);
      }, 0);
      gpa = totalCredits > 0 ? weightedSum / totalCredits : null;
    }
    
    const attendance = db.getAttendanceStats(studentId, schoolYearId);
    
    return {
      ...student,
      courses,
      gpa,
      attendance,
    };
  },
  
  // Export all data (for backup)
  exportData: () => JSON.stringify(store, null, 2),
  
  // Import data (from backup)
  importData: (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      store = { ...store, ...data };
      persist();
      return true;
    } catch {
      return false;
    }
  },
  
  // Clear all data
  clearAllData: () => {
    store = {
      students: [],
      schoolYears: [defaultSchoolYear],
      gradingScale: defaultGradingScale,
      courses: [],
      gradeCategories: [],
      grades: [],
      attendance: [],
      books: [],
      activities: [],
    };
    nextIds = {
      students: 1,
      courses: 1,
      gradeCategories: 1,
      grades: 1,
      attendance: 1,
      schoolYears: 2,
    };
    persist();
  },
};

export default db;
