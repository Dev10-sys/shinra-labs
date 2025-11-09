# PowerShell script to upload repository to GitHub
# This script helps you add a remote and push to GitHub

Write-Host "=== GitHub Repository Upload Script ===" -ForegroundColor Green
Write-Host ""

# Check if git is available
try {
    $gitVersion = git --version
    Write-Host "Git found: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: Git is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Check if we're in a git repository
$gitDir = git rev-parse --git-dir 2>$null
if (-not $gitDir) {
    Write-Host "Error: Not in a git repository" -ForegroundColor Red
    exit 1
}

Write-Host "Current repository status:" -ForegroundColor Yellow
git status --short
Write-Host ""

# Get GitHub username
$username = Read-Host "Enter your GitHub username"
if ([string]::IsNullOrWhiteSpace($username)) {
    Write-Host "Error: Username cannot be empty" -ForegroundColor Red
    exit 1
}

# Get repository name
$repoName = Read-Host "Enter repository name (default: shinra-labs)"
if ([string]::IsNullOrWhiteSpace($repoName)) {
    $repoName = "shinra-labs"
}

# Check if remote already exists
$existingRemote = git remote get-url origin 2>$null
if ($existingRemote) {
    Write-Host "Warning: Remote 'origin' already exists: $existingRemote" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to update it? (y/n)"
    if ($overwrite -eq "y" -or $overwrite -eq "Y") {
        git remote set-url origin "https://github.com/$username/$repoName.git"
        Write-Host "Remote updated successfully" -ForegroundColor Green
    } else {
        Write-Host "Operation cancelled" -ForegroundColor Yellow
        exit 0
    }
} else {
    # Add remote
    Write-Host "Adding remote repository..." -ForegroundColor Yellow
    git remote add origin "https://github.com/$username/$repoName.git"
    Write-Host "Remote added successfully" -ForegroundColor Green
}

# Confirm repository exists on GitHub
Write-Host ""
Write-Host "Before proceeding, make sure you have:" -ForegroundColor Yellow
Write-Host "1. Created the repository on GitHub: https://github.com/new" -ForegroundColor Yellow
Write-Host "2. Named it: $repoName" -ForegroundColor Yellow
Write-Host "3. Did NOT initialize it with README, .gitignore, or license" -ForegroundColor Yellow
Write-Host ""

$proceed = Read-Host "Have you created the repository on GitHub? (y/n)"
if ($proceed -ne "y" -and $proceed -ne "Y") {
    Write-Host "Please create the repository first, then run this script again" -ForegroundColor Yellow
    exit 0
}

# Check current branch
$currentBranch = git branch --show-current
Write-Host "Current branch: $currentBranch" -ForegroundColor Yellow

# Push to GitHub
Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
try {
    git push -u origin $currentBranch
    Write-Host ""
    Write-Host "Success! Repository uploaded to GitHub" -ForegroundColor Green
    Write-Host "Repository URL: https://github.com/$username/$repoName" -ForegroundColor Cyan
} catch {
    Write-Host "Error: Failed to push to GitHub" -ForegroundColor Red
    Write-Host "Make sure:" -ForegroundColor Yellow
    Write-Host "1. The repository exists on GitHub" -ForegroundColor Yellow
    Write-Host "2. You have the correct permissions" -ForegroundColor Yellow
    Write-Host "3. You're authenticated (you may need to use a personal access token)" -ForegroundColor Yellow
    exit 1
}

