# Contributing to Family Gradebook

Thank you for your interest in contributing to Family Gradebook! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on what's best for the homeschool community
- Be constructive in feedback and discussions

## How Can I Contribute?

### Reporting Bugs

Before creating a bug report:
- Check the [existing issues](https://github.com/yourusername/gradebook-app/issues) to avoid duplicates
- Try the latest version to see if the bug still exists
- Gather information about your environment (OS, browser, version)

**When creating a bug report, include:**
- Clear, descriptive title
- Steps to reproduce the bug
- Expected vs actual behavior
- Screenshots if applicable
- Your environment details (OS, browser, app version)
- Any error messages from the console

### Suggesting Enhancements

Enhancement suggestions are welcome! Please:
- Use a clear, descriptive title
- Explain the use case and why it would benefit homeschool families
- Describe the current behavior and proposed behavior
- Include mockups or examples if possible

### Contributing Code

#### Getting Started

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub, then clone your fork
   git clone https://github.com/YOUR-USERNAME/gradebook-app.git
   cd gradebook-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

4. **Make your changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic
   - Test your changes thoroughly

5. **Test dark mode**
   - All UI changes must work in both light and dark mode
   - Toggle dark mode and verify appearance

6. **Test responsive design**
   - Check on mobile, tablet, and desktop sizes
   - Use browser dev tools to test different screen sizes

7. **Commit your changes**
   ```bash
   git add .
   git commit -m "Brief description of changes"
   ```

   **Good commit messages:**
   - `Add PDF export feature for transcripts`
   - `Fix grade calculation bug when attendance is 0%`
   - `Update dark mode colors for better contrast`

   **Bad commit messages:**
   - `Update`
   - `Fix stuff`
   - `Changes`

8. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

9. **Open a Pull Request**
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill in the PR template with details
   - Link related issues

## Development Guidelines

### Code Style

- **React**: Use functional components with hooks
- **CSS**: Use Tailwind utility classes
- **Formatting**:
  - 2 spaces for indentation
  - Use semicolons
  - Single quotes for strings
  - Trailing commas in objects/arrays

### File Organization

```
src/
├── components/    # Reusable UI components
├── pages/         # Page-level components
├── lib/           # Utilities, database, store
├── App.jsx        # Main app component
└── index.css      # Global styles
```

### Component Guidelines

**Good component example:**
```javascript
export default function StudentCard({ student, onUpdate }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleClick = () => {
    setIsExpanded(!isExpanded)
    onUpdate()
  }

  return (
    <div className="card p-4 dark:bg-gray-800">
      <h3 className="text-warmgray-800 dark:text-gray-100">
        {student.name}
      </h3>
      {/* More content */}
    </div>
  )
}
```

**Key points:**
- Descriptive function names
- Props destructuring
- Clear variable names
- Dark mode classes included
- Proper indentation

### Dark Mode Requirements

All UI elements must have dark mode support:

```javascript
// ✅ Good - includes dark mode
<div className="bg-white dark:bg-gray-800 text-warmgray-800 dark:text-gray-100">

// ❌ Bad - no dark mode
<div className="bg-white text-warmgray-800">
```

Common dark mode patterns:
- Background: `bg-white dark:bg-gray-800`
- Text: `text-warmgray-800 dark:text-gray-100`
- Borders: `border-warmgray-200 dark:border-gray-600`
- Cards: Use the `.card` class (already has dark mode)

### Testing Checklist

Before submitting a PR, verify:

- [ ] Code runs without errors (`npm run dev`)
- [ ] Dark mode works correctly
- [ ] Responsive on mobile/tablet/desktop
- [ ] No console errors or warnings
- [ ] Data persists correctly (test localStorage)
- [ ] Export/Import still works (if you changed data structure)
- [ ] All buttons and links work
- [ ] Forms validate properly
- [ ] No breaking changes to existing features

### Adding New Features

When adding features:

1. **Keep it simple** - Don't over-engineer
2. **User-focused** - Think like a homeschool parent
3. **Accessible** - Use semantic HTML and proper labels
4. **Documented** - Update README if needed
5. **Tested** - Manually test all use cases

### Data Structure Changes

If you modify `src/lib/store.js`:

1. **Test existing data** - Make sure old data still loads
2. **Migration** - Add migration logic if needed
3. **Export/Import** - Verify still works
4. **Document** - Update comments about data structure

Example migration:
```javascript
// Migrate old data format to new format
if (!store.courses[0].color) {
  store.courses = store.courses.map(course => ({
    ...course,
    color: '#6B8A62' // Add default color
  }))
}
```

## Pull Request Process

### PR Checklist

Your PR should:
- [ ] Have a clear, descriptive title
- [ ] Reference related issues (Fixes #123)
- [ ] Include a description of changes
- [ ] Pass all tests
- [ ] Include screenshots for UI changes
- [ ] Update documentation if needed
- [ ] Not include unrelated changes

### PR Template

```markdown
## Description
Brief description of what this PR does

## Related Issues
Fixes #123

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Screenshots (if applicable)
[Add screenshots here]

## Testing
How did you test this?

## Checklist
- [ ] Code runs without errors
- [ ] Dark mode tested
- [ ] Responsive design verified
- [ ] Documentation updated
```

### Review Process

1. Maintainers will review your PR
2. They may request changes
3. Make requested changes and push updates
4. Once approved, your PR will be merged
5. Your contribution will be in the next release!

## Getting Help

- **Questions?** Open a [Discussion](https://github.com/yourusername/gradebook-app/discussions)
- **Bug?** Open an [Issue](https://github.com/yourusername/gradebook-app/issues)
- **Want to chat?** Comment on existing issues or PRs

## Recognition

Contributors will be:
- Listed in release notes
- Credited in the README (if desired)
- Forever appreciated by homeschool families! 🎉

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for making Family Gradebook better for homeschool families! ❤️
