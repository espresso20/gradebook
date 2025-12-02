# Family Gradebook

A beautiful, warm, and approachable gradebook application designed specifically for homeschool families. Track your children's academic progress, manage courses, grades, and attendance all in one elegant desktop application.

![Family Gradebook](https://img.shields.io/badge/version-1.0.0-terracotta)
![License](https://img.shields.io/badge/license-MIT-sage)
![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue)

## ✨ Features

### 📚 Course Management
- **Multiple Students**: Track unlimited students, each with their own courses and grades
- **Flexible Grading**: Switch between simple (A-F) and advanced (A+, A, A-, etc.) grading scales
- **Weighted Categories**: Customize grade categories (Tests, Quizzes, Homework) with custom weights
- **Credit Hours**: Track credit hours for transcript generation
- **Course Colors**: Assign unique colors to courses for easy visual identification

### 📊 Grade Tracking
- **Individual Assignments**: Record scores for individual assignments within categories
- **Automatic Calculation**: Grades are calculated automatically using weighted averages
- **GPA Calculation**: Cumulative GPA calculated based on course letter grades and credits
- **Letter Grade Assignment**: Automatic letter grade assignment based on percentage thresholds
- **Customizable Scale**: Modify grade thresholds and GPA points to match your standards

### 📅 Attendance Tracking
- **Monthly Calendar View**: Visual calendar for marking attendance
- **Attendance Impact**: Attendance contributes 33% to final grades (configurable per course)
- **Statistics Dashboard**: View attendance rates and trends
- **Flexible Override**: Option to exclude attendance from grade calculation on a per-course basis

### 🗂️ School Year Management
- **Multiple School Years**: Archive past years and create new ones
- **Year Switching**: Easily switch between current and archived years
- **Active Year Indicator**: Clear indication of which year is currently active
- **Date Range Tracking**: Set start and end dates for each school year

### 🎨 Beautiful Design
- **Warm Color Palette**: Terracotta, sage, gold, and cream tones create a welcoming interface
- **Dark Mode**: Full dark mode support with seamless switching
- **Responsive Layout**: Works beautifully on all screen sizes
- **Smooth Animations**: Subtle transitions and hover effects
- **Custom Typography**: Clean, readable fonts optimized for educational content

### 💾 Data Management
- **Export/Import**: Backup and restore all your data as JSON files
- **Local Storage**: All data stored locally on your computer for privacy
- **No Internet Required**: Works completely offline
- **Secure**: Your data never leaves your device

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org)
- **npm** (v7 or higher) - Comes with Node.js

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/gradebook-app.git
   cd gradebook-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run in development mode (web browser):**
   ```bash
   npm run dev
   ```
   Open your browser to `http://localhost:5173`

4. **Run as Electron app (development):**
   ```bash
   npm run electron:dev
   ```

## 📦 Building for Production

### Desktop Application (Electron)

**Quick Build:**

```bash
# Using the build script (recommended)
./build.sh

# Or using npm
npm run electron:build
```

This creates platform-specific installers in the `dist-electron` folder:
- **macOS**: `dist-electron/mac/Family Gradebook.app`
- **Windows**: `dist-electron/win/Family Gradebook Setup.exe`
- **Linux**: `dist-electron/linux/Family Gradebook.AppImage`

**📚 For detailed build instructions, troubleshooting, and distribution info, see [BUILD_GUIDE.md](BUILD_GUIDE.md)**

### Installation

#### macOS
1. Locate `Family Gradebook.app` in `dist-electron/mac/`
2. Drag to Applications folder
3. Double-click to run
4. If you see "unidentified developer" warning:
   - Right-click the app → Open → Open

#### Windows
1. Run `Family Gradebook Setup.exe` from `dist-electron/win/`
2. Follow installation wizard

#### Linux
1. Make the AppImage executable:
   ```bash
   chmod +x Family-Gradebook.AppImage
   ```
2. Double-click to run or execute from terminal

### Web Application (Optional)

Build static files for web hosting:

```bash
npm run build
```

Deploy the `dist/` folder to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

## 🎯 Usage Guide

### Getting Started

1. **Add Your First Student**
   - Click "Add Your First Student" on the welcome screen
   - Enter student name and grade level

2. **Create Courses**
   - Navigate to a student's profile
   - Click "Add Course"
   - Set course name, credits, and color

3. **Set Up Grade Categories**
   - Open a course
   - Adjust category weights (must total 100%)
   - Default categories: Grades (25%), Quizzes (25%), Tests (50%)

4. **Record Grades**
   - Click "Add Grade" in any category
   - Enter score and maximum points
   - Add optional notes

5. **Track Attendance**
   - Click "Attendance" from student profile
   - Click dates to mark Present/Absent
   - View monthly statistics

### Advanced Features

#### Delete Student or Course
- **Delete Student**: Click the three-dot menu (⋮) in the student profile header → "Delete Student"
- **Delete Course**: Open the course → Click the three-dot menu (⋮) → "Delete Course"

#### Attendance Weight Override
If a course doesn't require attendance (e.g., online course):
1. Open the course
2. Toggle "Ignore Attendance Weight"
3. Grade will be based 100% on academic performance

#### Switching Grading Scales
1. Go to Settings
2. Click "Switch to Advanced/Simple Grades"
3. All existing grades automatically recalculate
   - **Simple Scale**: 5 grades (A, B, C, D, F)
   - **Advanced Scale**: 13 grades (A+, A, A-, B+, B, B-, C+, C, C-, D+, D, D-, F)

#### Exporting Data
1. Go to Settings → Data Management
2. Click "Export"
3. Save JSON file to safe location
4. Use "Import" to restore later

## 🛠️ Technology Stack

- **Frontend Framework**: React 18
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Desktop**: Electron
- **Build Tool**: Vite
- **Date Handling**: date-fns
- **Data Storage**: Browser LocalStorage

## 📁 Project Structure

```
gradebook-app/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── AddCourseModal.jsx
│   │   ├── AddStudentModal.jsx
│   │   └── Layout.jsx
│   ├── pages/              # Main application pages
│   │   ├── Attendance.jsx
│   │   ├── CourseView.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Settings.jsx
│   │   ├── StudentProfile.jsx
│   │   └── Welcome.jsx
│   ├── lib/                # Core logic and utilities
│   │   ├── database.js     # Grade calculation logic
│   │   └── store.js        # Data management layer
│   ├── App.jsx             # Main application component
│   ├── index.css           # Global styles and Tailwind
│   └── main.jsx            # React entry point
├── electron/               # Electron configuration
│   ├── main.js
│   └── preload.js
├── public/                 # Static assets
├── dist/                   # Built web files (generated)
├── dist-electron/          # Built desktop apps (generated)
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🎨 Customization

### Color Scheme

The app uses a warm, educational color palette defined in `tailwind.config.js`:

- **Terracotta** (`#C97C5D`): Primary actions, active elements
- **Sage** (`#6B8A62`): Success states, positive indicators
- **Gold** (`#D4A574`): Warnings, highlights
- **Warm Gray** (`#4A4A4A`): Text, neutral elements
- **Cream** (`#F5F1E8`): Background, light surfaces

### Grading Scale

Customize grading scales in `src/lib/store.js`:

**Simple Scale (default):**
```javascript
const simpleGradingScale = [
  { id: 1, letter_grade: 'A', min_percentage: 90, gpa_points: 4.0 },
  { id: 2, letter_grade: 'B', min_percentage: 80, gpa_points: 3.0 },
  { id: 3, letter_grade: 'C', min_percentage: 70, gpa_points: 2.0 },
  { id: 4, letter_grade: 'D', min_percentage: 60, gpa_points: 1.0 },
  { id: 5, letter_grade: 'F', min_percentage: 0, gpa_points: 0.0 },
];
```

**Advanced Scale:**
```javascript
const advancedGradingScale = [
  { id: 1, letter_grade: 'A+', min_percentage: 97, gpa_points: 4.0 },
  { id: 2, letter_grade: 'A', min_percentage: 93, gpa_points: 4.0 },
  { id: 3, letter_grade: 'A-', min_percentage: 90, gpa_points: 3.7 },
  // ... and so on
];
```

### Attendance Weight

Default: 67% academic, 33% attendance

Modify in `src/lib/store.js` (line 379):

```javascript
finalGrade = (academicGrade * 0.67) + (attendancePercentage * 0.33);
```

## 🐛 Troubleshooting

### Build Fails on macOS
**Issue**: Code signing error
**Solution**: Electron builder tries to sign the app. For development builds, add to `package.json`:
```json
"build": {
  "mac": {
    "identity": null
  }
}
```

### Data Not Persisting
**Issue**: LocalStorage disabled or full
**Solution**:
- Check browser settings allow localStorage
- Clear old data via Settings → Clear All Data
- Export data before clearing

### Dark Mode Not Working
**Issue**: System preference override
**Solution**: Toggle dark mode manually using the moon/sun icon in the sidebar

### "Cannot find module" errors
**Issue**: Dependencies not installed
**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style (React functional components, Tailwind CSS)
- Test dark mode compatibility for all new UI
- Ensure responsive design works on mobile
- Update README if adding new features
- Add comments for complex logic
- Test data export/import after changes to data structure

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspired by modern educational tools
- Built with love for homeschool families
- Icons by [Lucide](https://lucide.dev/)
- Font families: Inter, Instrument Sans

## 📮 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/gradebook-app/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/gradebook-app/discussions)
- **Email**: your.email@example.com

## 🗺️ Roadmap

Future enhancements being considered:

- [ ] PDF transcript generation
- [ ] Custom report cards
- [ ] Assignment due date reminders
- [ ] Multiple grading periods per year
- [ ] Cloud sync option (optional)
- [ ] Mobile app version
- [ ] Import from CSV
- [ ] Grade charts and visualizations
- [ ] Parent/teacher role separation
- [ ] Curriculum planning integration
- [ ] Print-friendly views
- [ ] Assignment templates
- [ ] Bulk grade entry

## 📸 Screenshots

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Student Profile
![Student Profile](screenshots/student-profile.png)

### Course View
![Course View](screenshots/course-view.png)

### Attendance Calendar
![Attendance](screenshots/attendance.png)

### Dark Mode
![Dark Mode](screenshots/dark-mode.png)

---

**Made with ❤️ for homeschool families**
