# GitHub Repository Setup Guide

This guide will help you push your Family Gradebook app to GitHub.

## Prerequisites

- Git installed on your computer ([Download Git](https://git-scm.com/downloads))
- GitHub account ([Sign up](https://github.com/signup))

## Step-by-Step Instructions

### 1. Initialize Git Repository (if not already done)

Open Terminal and navigate to your project:

```bash
cd /Users/roffler/Documents/gradebook-app
```

Initialize git (if you haven't already):

```bash
git init
```

### 2. Create a New Repository on GitHub

1. Go to [GitHub](https://github.com)
2. Click the **+** icon in the top right → **New repository**
3. Fill in the details:
   - **Repository name**: `gradebook-app` (or your preferred name)
   - **Description**: "A beautiful gradebook application for homeschool families"
   - **Visibility**: Choose Public or Private
   - **DO NOT** check "Initialize with README" (we already have one)
4. Click **Create repository**

### 3. Connect Your Local Repository to GitHub

GitHub will show you commands. Use these (replace `yourusername` with your GitHub username):

```bash
# Add all files to git
git add .

# Create your first commit
git commit -m "Initial commit: Family Gradebook app"

# Add the remote repository
git remote add origin https://github.com/yourusername/gradebook-app.git

# Rename the default branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

### 4. Verify Upload

1. Refresh your GitHub repository page
2. You should see all your files uploaded
3. The README.md will automatically display on the main page

## Important Files to Update

Before pushing to GitHub, update these placeholders:

### README.md

1. Change `https://github.com/yourusername/gradebook-app.git` to your actual repository URL
2. Update contact information:
   - Replace `your.email@example.com` with your email
3. Add screenshots (optional but recommended):
   - Create a `screenshots/` folder
   - Add PNG images of your app
   - Update the screenshot paths in README.md

### LICENSE

1. Replace `[Your Name]` with your actual name
2. Update the year if needed

## Using SSH Instead of HTTPS (Optional)

If you prefer SSH authentication:

```bash
# Add SSH remote instead
git remote add origin git@github.com:yourusername/gradebook-app.git

# Then push
git push -u origin main
```

## Future Updates

After your initial push, update your repository with:

```bash
# Check which files changed
git status

# Add changed files
git add .

# Commit with a message
git commit -m "Description of changes"

# Push to GitHub
git push
```

## Common Git Commands

```bash
# See current status
git status

# See commit history
git log --oneline

# Create a new branch
git checkout -b feature-name

# Switch branches
git checkout main

# Pull latest changes from GitHub
git pull

# View remote repository URL
git remote -v
```

## Troubleshooting

### "Permission denied" error

- Make sure you're logged into GitHub
- Check your authentication method (HTTPS vs SSH)
- You may need to set up a Personal Access Token for HTTPS

### "Repository not found" error

- Double-check the repository URL
- Make sure the repository exists on GitHub
- Verify you have access to the repository

### "Cannot push to main branch" error

- Some organizations protect the main branch
- Create a new branch and open a Pull Request instead

## Adding Collaborators

To allow others to contribute:

1. Go to your repository on GitHub
2. Click **Settings** → **Collaborators**
3. Click **Add people**
4. Enter their GitHub username or email

## Creating Releases

To create official releases:

1. Go to your repository on GitHub
2. Click **Releases** → **Create a new release**
3. Tag version: `v1.0.0`
4. Release title: `Family Gradebook v1.0.0`
5. Describe the release
6. Attach the built `.app`, `.exe`, or `.AppImage` files
7. Click **Publish release**

## Next Steps

After pushing to GitHub:

- [ ] Add screenshots to the repository
- [ ] Update README with actual repository URL
- [ ] Add your contact information
- [ ] Create first release with built applications
- [ ] Share with the homeschool community!

---

**Questions?** Check the [GitHub Docs](https://docs.github.com) or open an issue in your repository.
