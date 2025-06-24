# Git Workflow Optimization for Formula PM

## 🚀 **Git Configuration & Aliases**

### **1. Essential Git Configuration**

```bash
# Set up your identity
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Better diff and merge
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait $MERGED'
git config --global diff.tool vscode
git config --global difftool.vscode.cmd 'code --wait --diff $LOCAL $REMOTE'

# Helpful settings
git config --global core.editor "code --wait"
git config --global push.default current
git config --global pull.rebase true
git config --global init.defaultBranch main
git config --global color.ui auto

# Better log display
git config --global core.pager 'less -F -X'
```

### **2. Git Aliases for Speed**

Add to `~/.gitconfig` or run `git config --global alias.<name> <command>`:

```bash
[alias]
    # Shortcuts
    st = status -sb
    co = checkout
    br = branch
    ci = commit
    df = diff
    dc = diff --cached
    
    # Useful commands
    last = log -1 HEAD --stat
    unstage = reset HEAD --
    undo = reset HEAD~1 --soft
    amend = commit --amend --no-edit
    
    # Beautiful logs
    lg = log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
    ll = log --pretty=format:'%C(yellow)%h%Cred%d %Creset%s%Cblue [%cn]' --decorate --numstat
    ls = log --pretty=format:'%C(yellow)%h%Cred%d %Creset%s%Cblue [%cn]' --decorate
    
    # Branch management
    branches = branch -a
    remotes = remote -v
    cleanup = !git branch --merged | grep -v \"\\*\" | xargs -n 1 git branch -d
    
    # Show what I did today
    today = log --since=midnight --author='Your Name' --oneline
    
    # Stash helpers
    sl = stash list
    sa = stash apply
    ss = stash save
    
    # Quick commits
    cm = commit -m
    cam = commit -am
    
    # File history
    filelog = log -u
    fl = log -u
    
    # Find commits by message
    find = "!f() { git log --pretty=format:'%C(yellow)%h  %Cblue%ad  %Creset%s%Cgreen  [%cn] %Cred%d' --decorate --date=short --grep=$1; }; f"
    
    # Show changed files
    changed = show --pretty="" --name-only
    
    # Interactive rebase
    reb = rebase -i
    
    # Pull and push
    pl = pull
    ps = push
    plr = pull --rebase
    
    # Reset commands
    r = reset
    r1 = reset HEAD^
    r2 = reset HEAD^^
    rh = reset --hard
    rh1 = reset HEAD^ --hard
    rh2 = reset HEAD^^ --hard
```

### **3. Shell Aliases for Git**

Add to `~/.bashrc` or `~/.zshrc`:

```bash
# Git shortcuts
alias g='git'
alias gs='git status'
alias ga='git add'
alias gaa='git add .'
alias gc='git commit'
alias gcm='git commit -m'
alias gp='git push'
alias gpl='git pull'
alias gco='git checkout'
alias gb='git branch'
alias gd='git diff'
alias gl='git log --oneline'
alias glg='git log --graph --oneline --all'

# Advanced git aliases
alias gundo='git reset HEAD~1 --soft'
alias gredo='git commit -c ORIG_HEAD'
alias gwip='git add -A; git commit -m "WIP"'
alias gunwip='git log -n 1 | grep -q -c "WIP" && git reset HEAD~1'

# Git flow helpers
alias gfstart='git checkout -b'
alias gffinish='git checkout main && git merge --no-ff'

# Quick status check
alias gss='git status -s'

# Show recent branches
alias grecent='git for-each-ref --sort=-committerdate refs/heads/ --format="%(refname:short) %(committerdate:relative)"'
```

## 📊 **Efficient Commit Strategies**

### **1. Conventional Commits**

Follow a consistent commit message format:

```bash
# Format: <type>(<scope>): <subject>

# Types:
feat:     # New feature
fix:      # Bug fix
docs:     # Documentation changes
style:    # Code style changes (formatting, semicolons, etc)
refactor: # Code refactoring
perf:     # Performance improvements
test:     # Adding tests
chore:    # Maintenance tasks
build:    # Build system changes

# Examples:
git commit -m "feat(auth): add JWT authentication"
git commit -m "fix(tasks): resolve date formatting issue"
git commit -m "docs(readme): update installation instructions"
git commit -m "refactor(api): simplify error handling"
git commit -m "perf(dashboard): optimize query performance"
```

### **2. Commit Message Template**

Create `.gitmessage` file:

```
# <type>(<scope>): <subject>

# <body>

# <footer>

# Type: feat, fix, docs, style, refactor, perf, test, chore
# Scope: component or file name
# Subject: short description (50 chars max)
# Body: detailed description (72 chars per line)
# Footer: breaking changes, issue references
```

Set as default:
```bash
git config --global commit.template ~/.gitmessage
```

### **3. Interactive Staging**

```bash
# Stage specific parts of files
git add -p

# Options:
# y - stage this hunk
# n - do not stage this hunk
# q - quit
# a - stage this hunk and all later hunks
# d - do not stage this hunk or any later hunks
# s - split the current hunk into smaller hunks
# e - manually edit the current hunk

# Stage specific lines in VS Code
# Use GitLens extension: select lines → right-click → "Stage Changes"
```

### **4. Smart Commits**

```bash
# Fixup commits (to be squashed later)
git commit --fixup <commit-hash>
git rebase -i --autosquash <base-commit>

# Quick WIP commits
git add . && git commit -m "WIP: $(date +%Y-%m-%d\ %H:%M)"

# Commit with co-authors
git commit -m "feat: implement new feature

Co-authored-by: Name <email@example.com>
Co-authored-by: Another Name <another@example.com>"
```

## 🌳 **Branch Management Best Practices**

### **1. Branch Naming Conventions**

```bash
# Feature branches
feature/user-authentication
feature/FPM-123-add-task-filters  # With ticket number

# Bug fix branches
fix/login-error
fix/FPM-456-date-formatting

# Hotfix branches
hotfix/security-patch
hotfix/critical-bug

# Release branches
release/v1.2.0
release/2024-01-sprint

# Other types
chore/update-dependencies
docs/api-documentation
refactor/cleanup-utils
```

### **2. Branch Management Commands**

```bash
# Create and switch to new branch
git checkout -b feature/new-feature

# Create branch from specific commit
git checkout -b fix/bug-fix <commit-hash>

# List all branches with last commit
git branch -vv

# List remote branches
git branch -r

# Delete local branch
git branch -d branch-name
git branch -D branch-name  # Force delete

# Delete remote branch
git push origin --delete branch-name

# Rename branch
git branch -m old-name new-name

# Track remote branch
git branch --set-upstream-to=origin/branch-name

# Clean up merged branches
git branch --merged | grep -v "\*\|main\|develop" | xargs -n 1 git branch -d

# Find unmerged branches
git branch --no-merged main
```

### **3. Git Flow for Formula PM**

```bash
# Main branches
main     # Production-ready code
develop  # Integration branch

# Feature development
git checkout develop
git checkout -b feature/new-dashboard
# ... work on feature ...
git add .
git commit -m "feat(dashboard): implement new dashboard design"
git push -u origin feature/new-dashboard

# Create pull request
# After review and approval:
git checkout develop
git merge --no-ff feature/new-dashboard
git branch -d feature/new-dashboard
git push origin --delete feature/new-dashboard

# Release process
git checkout develop
git checkout -b release/v1.2.0
# ... final testing and fixes ...
git checkout main
git merge --no-ff release/v1.2.0
git tag -a v1.2.0 -m "Release version 1.2.0"
git checkout develop
git merge --no-ff release/v1.2.0
```

## 🤝 **Collaboration Best Practices**

### **1. Pull Request Template**

Create `.github/pull_request_template.md`:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?
- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual testing

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes

## Screenshots (if appropriate)

## Related Issues
Closes #(issue number)
```

### **2. Code Review Workflow**

```bash
# Fetch and checkout PR for review
git fetch origin pull/123/head:pr-123
git checkout pr-123

# Or use GitHub CLI
gh pr checkout 123

# Review changes
git diff main...pr-123

# Test the changes
npm test
npm run build

# Add review comments
gh pr review 123 --comment -b "Great work! Just a few suggestions..."

# Approve PR
gh pr review 123 --approve

# Request changes
gh pr review 123 --request-changes -b "Please address the security concern"
```

### **3. Syncing with Upstream**

```bash
# Add upstream remote (if forked)
git remote add upstream https://github.com/original/repo.git

# Fetch upstream changes
git fetch upstream

# Merge upstream changes
git checkout main
git merge upstream/main

# Push to your fork
git push origin main

# Rebase feature branch
git checkout feature/my-feature
git rebase main
```

## 🔧 **Advanced Git Techniques**

### **1. Interactive Rebase**

```bash
# Rebase last 3 commits
git rebase -i HEAD~3

# Commands in interactive rebase:
# p, pick = use commit
# r, reword = use commit, but edit the commit message
# e, edit = use commit, but stop for amending
# s, squash = use commit, but meld into previous commit
# f, fixup = like "squash", but discard this commit's log message
# x, exec = run command (the rest of the line) using shell
# d, drop = remove commit

# Example: Clean up commit history
git rebase -i HEAD~5
# Change 'pick' to 'squash' for commits to combine
# Save and edit the combined commit message
```

### **2. Cherry-picking**

```bash
# Apply specific commit to current branch
git cherry-pick <commit-hash>

# Cherry-pick multiple commits
git cherry-pick <commit1> <commit2>

# Cherry-pick a range
git cherry-pick <start-commit>..<end-commit>

# Cherry-pick without committing
git cherry-pick -n <commit-hash>
```

### **3. Stash Management**

```bash
# Stash with message
git stash save "WIP: working on task form"

# List stashes with description
git stash list

# Apply specific stash
git stash apply stash@{2}

# Apply and remove stash
git stash pop

# Show stash contents
git stash show -p stash@{0}

# Create branch from stash
git stash branch feature/new-feature stash@{0}

# Stash only staged changes
git stash --keep-index

# Stash including untracked files
git stash -u
```

### **4. Git Bisect for Bug Finding**

```bash
# Start bisect
git bisect start

# Mark current commit as bad
git bisect bad

# Mark known good commit
git bisect good <commit-hash>

# Git will checkout a commit to test
# Test the commit, then mark as good or bad
git bisect good  # or
git bisect bad

# Continue until bug is found
# When done:
git bisect reset
```

## 📈 **Git Performance Tips**

### **1. Optimize Git Performance**

```bash
# Garbage collection
git gc --aggressive

# Prune old objects
git prune

# Optimize repository
git repack -a -d --depth=250 --window=250

# Configure performance settings
git config core.preloadindex true
git config core.fscache true
git config gc.auto 256
```

### **2. Large File Handling**

```bash
# Use Git LFS for large files
git lfs track "*.psd"
git lfs track "*.zip"
git add .gitattributes

# Check LFS status
git lfs status

# Clean up LFS
git lfs prune
```

## 🛡️ **Git Security**

### **1. Signing Commits**

```bash
# Generate GPG key
gpg --gen-key

# List keys
gpg --list-secret-keys --keyid-format LONG

# Configure Git to use GPG key
git config --global user.signingkey <key-id>
git config --global commit.gpgsign true

# Sign a commit
git commit -S -m "feat: secure commit"

# Verify signed commits
git log --show-signature
```

### **2. Sensitive Data Protection**

```bash
# Check for sensitive data before committing
# Create .gitsecrets file
api_key
password
secret
private_key
aws_access_key

# Use pre-commit hook
#!/bin/bash
# .git/hooks/pre-commit
if git diff --cached | grep -E "(api_key|password|secret)"; then
    echo "Error: Sensitive data detected!"
    exit 1
fi
```

## 🎯 **Git Workflow Scripts**

### **1. Daily Workflow Script**

```bash
#!/bin/bash
# git-daily.sh

echo "🌅 Starting daily git workflow..."

# Fetch latest changes
echo "📥 Fetching latest changes..."
git fetch --all --prune

# Show current status
echo "📊 Current status:"
git status -sb

# Show recent commits
echo "📜 Recent commits:"
git log --oneline -10

# Show branches
echo "🌳 Active branches:"
git branch -vv

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    echo "⚠️  You have uncommitted changes!"
fi
```

### **2. Feature Complete Script**

```bash
#!/bin/bash
# git-feature-complete.sh

BRANCH=$(git branch --show-current)
if [[ $BRANCH == "main" ]] || [[ $BRANCH == "develop" ]]; then
    echo "❌ Cannot complete feature on main/develop branch!"
    exit 1
fi

echo "✅ Completing feature: $BRANCH"

# Ensure everything is committed
git add .
git commit -m "feat: finalize $BRANCH"

# Push branch
git push -u origin $BRANCH

# Create PR using GitHub CLI
gh pr create --title "Feature: $BRANCH" --body "Implements $BRANCH functionality"

echo "🎉 Feature complete! PR created."
```

Remember: The best Git workflow is one that your team understands and follows consistently. Adapt these practices to fit your team's needs!