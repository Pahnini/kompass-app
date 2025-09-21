#!/bin/bash

# 🤝 Kompass-App Contributor Helper Script
# This script automates common git workflow tasks for contributors

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_header() {
    echo -e "\n${BLUE}🧭 $1${NC}"
    echo "=================================="
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in a git repository
check_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        print_error "Not in a git repository!"
        exit 1
    fi
}

# Check if remotes are properly configured
check_remotes() {
    if ! git remote | grep -q "^origin$"; then
        print_error "No 'origin' remote found. Please set up your fork as origin."
        exit 1
    fi
    
    if ! git remote | grep -q "^upstream$"; then
        print_error "No 'upstream' remote found. Please set up the original repo as upstream."
        exit 1
    fi
}

# Function to sync with upstream
sync_with_upstream() {
    print_header "Syncing with Upstream"
    
    print_info "Fetching latest changes from upstream..."
    git fetch upstream
    
    print_info "Switching to main branch..."
    git checkout main
    
    print_info "Merging upstream changes..."
    git merge upstream/main
    
    print_info "Pushing updated main to your fork..."
    git push origin main
    
    print_success "Successfully synced with upstream!"
}

# Function to create a new feature branch
create_feature_branch() {
    print_header "Creating New Feature Branch"
    
    # Ensure we're on main and up-to-date
    sync_with_upstream
    
    echo -n "Enter branch name (e.g., feature/new-badges, fix/mood-compass): "
    read branch_name
    
    if [[ -z "$branch_name" ]]; then
        print_error "Branch name cannot be empty!"
        exit 1
    fi
    
    print_info "Creating and switching to branch: $branch_name"
    git checkout -b "$branch_name"
    
    print_success "Created and switched to branch: $branch_name"
    print_info "You can now start making your changes!"
}

# Function to check code quality
check_code_quality() {
    print_header "Running Code Quality Checks"
    
    print_info "Checking TypeScript..."
    if npm run type-check; then
        print_success "TypeScript check passed!"
    else
        print_error "TypeScript errors found. Please fix them before committing."
        return 1
    fi
    
    print_info "Running linter..."
    if npm run lint; then
        print_success "Linting passed!"
    else
        print_warning "Linting issues found. Attempting to auto-fix..."
        npm run lint:fix
    fi
    
    print_info "Formatting code..."
    npm run format
    print_success "Code formatted!"
    
    print_success "All code quality checks completed!"
}

# Function to commit changes
commit_changes() {
    print_header "Committing Changes"
    
    # Check for changes
    if git diff --quiet && git diff --staged --quiet; then
        print_warning "No changes to commit!"
        return 0
    fi
    
    # Show status
    print_info "Current git status:"
    git status --short
    
    # Run quality checks
    if ! check_code_quality; then
        print_error "Code quality checks failed. Please fix issues before committing."
        return 1
    fi
    
    echo -n "Add all changes? (y/n): "
    read add_all
    
    if [[ "$add_all" =~ ^[Yy]$ ]]; then
        git add .
    else
        print_info "Please add files manually with 'git add <files>'"
        return 0
    fi
    
    echo -n "Enter commit message: "
    read commit_message
    
    if [[ -z "$commit_message" ]]; then
        print_error "Commit message cannot be empty!"
        return 1
    fi
    
    git commit -m "$commit_message"
    print_success "Changes committed!"
}

# Function to push and create PR
push_and_pr() {
    print_header "Pushing Branch and Creating PR"
    
    current_branch=$(git rev-parse --abbrev-ref HEAD)
    
    if [[ "$current_branch" == "main" ]]; then
        print_error "Cannot push main branch for PR. Please switch to a feature branch."
        return 1
    fi
    
    print_info "Pushing branch '$current_branch' to origin..."
    git push origin "$current_branch"
    
    print_success "Branch pushed successfully!"
    print_info "Go to GitHub to create a Pull Request:"
    print_info "https://github.com/$(git remote get-url origin | sed 's/.*github.com[:/]\([^/]*\/[^/]*\)\.git/\1/')/compare/$current_branch"
}

# Function to cleanup after PR merge
cleanup_after_merge() {
    print_header "Cleaning Up After PR Merge"
    
    current_branch=$(git rev-parse --abbrev-ref HEAD)
    
    if [[ "$current_branch" == "main" ]]; then
        print_info "Already on main branch."
    else
        print_info "Switching to main branch..."
        git checkout main
    fi
    
    # Sync with upstream
    sync_with_upstream
    
    if [[ "$current_branch" != "main" ]]; then
        echo -n "Delete branch '$current_branch'? (y/n): "
        read delete_branch
        
        if [[ "$delete_branch" =~ ^[Yy]$ ]]; then
            print_info "Deleting local branch '$current_branch'..."
            git branch -d "$current_branch"
            
            echo -n "Delete remote branch '$current_branch'? (y/n): "
            read delete_remote
            
            if [[ "$delete_remote" =~ ^[Yy]$ ]]; then
                print_info "Deleting remote branch '$current_branch'..."
                git push origin --delete "$current_branch"
            fi
            
            print_success "Branch cleanup completed!"
        fi
    fi
}

# Function to show project status
show_status() {
    print_header "Project Status"
    
    print_info "Git Status:"
    git status --short
    
    print_info "Current Branch:"
    git rev-parse --abbrev-ref HEAD
    
    print_info "Recent Commits:"
    git log --oneline -5
    
    print_info "Remotes:"
    git remote -v
}

# Function to setup remotes (for first time setup)
setup_remotes() {
    print_header "Setting Up Git Remotes"
    
    echo -n "Enter your GitHub username: "
    read username
    
    if [[ -z "$username" ]]; then
        print_error "Username cannot be empty!"
        exit 1
    fi
    
    print_info "Setting up remotes for user: $username"
    
    # Remove existing origin if it exists
    if git remote | grep -q "^origin$"; then
        git remote remove origin
    fi
    
    # Add your fork as origin
    git remote add origin "git@github.com:$username/kompass-app.git"
    
    # Add upstream if it doesn't exist
    if ! git remote | grep -q "^upstream$"; then
        git remote add upstream "git@github.com:Pahnini/kompass-app.git"
    fi
    
    print_success "Remotes configured successfully!"
    git remote -v
}

# Main menu
show_menu() {
    echo -e "\n${BLUE}🧭 Kompass-App Contributor Helper${NC}"
    echo "=================================="
    echo "1. Setup remotes (first time only)"
    echo "2. Sync with upstream"
    echo "3. Create new feature branch"
    echo "4. Check code quality"
    echo "5. Commit changes"
    echo "6. Push branch and create PR"
    echo "7. Cleanup after PR merge"
    echo "8. Show project status"
    echo "9. Exit"
    echo ""
}

# Main script logic
main() {
    # Check if we're in the right directory
    if [[ ! -f "package.json" ]] || [[ ! -d "src" ]]; then
        print_error "Please run this script from the kompass-app root directory!"
        exit 1
    fi
    
    # Check if it's a git repo
    check_git_repo
    
    while true; do
        show_menu
        echo -n "Choose an option (1-9): "
        read choice
        
        case $choice in
            1) setup_remotes ;;
            2) 
                check_remotes
                sync_with_upstream ;;
            3) 
                check_remotes
                create_feature_branch ;;
            4) check_code_quality ;;
            5) commit_changes ;;
            6) 
                check_remotes
                push_and_pr ;;
            7) 
                check_remotes
                cleanup_after_merge ;;
            8) show_status ;;
            9) 
                print_success "Happy coding! 🚀"
                exit 0 ;;
            *) print_error "Invalid option. Please choose 1-9." ;;
        esac
        
        echo -e "\nPress Enter to continue..."
        read
    done
}

# Run the main function
main "$@"
