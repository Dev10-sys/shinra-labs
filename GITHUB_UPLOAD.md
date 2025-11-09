# Upload to GitHub - Quick Guide

## Option 1: Manual Steps

### Step 1: Create Repository on GitHub
1. Go to https://github.com/new
2. Repository name: `shinra-labs` (or your preferred name)
3. Description: "SHINRA LABS - Multi-modal AI Data Annotation and Dataset Marketplace Platform"
4. Choose Public or Private
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

### Step 2: Connect and Push
After creating the repository, GitHub will show you commands. Use these:

```powershell
# Add the remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/shinra-labs.git

# Rename branch to main if needed (already on main)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Option 2: Using the Script
Run the PowerShell script: `upload-to-github.ps1`

It will prompt you for your GitHub username and repository name, then execute the commands automatically.

