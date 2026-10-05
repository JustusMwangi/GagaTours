# How to Set Up GitHub Issues + Projects for a Solo Dev Project

A step-by-step guide to managing a software project using GitHub's built-in tools — Issues for task tracking and Projects for visual progress boards.

---

## Prerequisites

- A GitHub account
- A repository already created and pushed to GitHub
- The GitHub CLI (`gh`) installed and authenticated

### Install the GitHub CLI

```bash
# Ubuntu / WSL
sudo apt install gh

# macOS
brew install gh

# Verify installation
gh --version
```

### Authenticate

```bash
gh auth login
```

Follow the prompts — choose GitHub.com, SSH or HTTPS, and authenticate via browser.

---

## Step 1: Create Labels for Your Phases

Labels let you categorize issues. Create one label per project phase so you can filter and group work.

```bash
gh label create "phase-1-core" --color "1D76DB" --description "Phase 1: Core Foundation"
gh label create "phase-2-rbac" --color "0E8A16" --description "Phase 2: Access Control"
gh label create "phase-3-saas" --color "D93F0B" --description "Phase 3: SaaS Business Layer"
gh label create "phase-4-monetization" --color "FBCA04" --description "Phase 4: Monetization"
gh label create "phase-5-polish" --color "5319E7" --description "Phase 5: Polish & Docs"
```

**Notes:**
- Run these from inside your repo directory, or add `-R owner/repo-name` to each command
- Colors are hex codes without the `#` prefix
- You can also create labels in the browser: repo > Issues tab > Labels

### Verify your labels

```bash
gh label list
```

---

## Step 2: Create Issues

Each issue represents a trackable unit of work. Structure them with a description, a checklist of subtasks, and acceptance criteria.

### Basic syntax

```bash
gh issue create \
  --title "Your issue title" \
  --label "phase-1-core" \
  --body "Issue description here"
```

### Example: Creating an issue with a checklist

For multi-line bodies, use a heredoc:

```bash
gh issue create \
  --title "Core models: User, Tenant, Store, Role, Permission" \
  --label "phase-1-core" \
  --body "$(cat <<'EOF'
## Description
Define all primary entity models and junction tables for the multi-tenant system.

## Tasks
- [ ] Create base mixins (BaseModel, TenantMixin, TimestampMixin)
- [ ] Create User model
- [ ] Create Tenant model
- [ ] Create Store model
- [ ] Create Role and Permission models
- [ ] Create junction tables (TenantUser, StoreUser, UserRole, RolePermission)
- [ ] Run first migration

## Acceptance Criteria
- All models reflect the relationships in the architecture doc
- Migration runs cleanly against PostgreSQL
- Tenant-scoped models include tenant_id foreign key
EOF
)"
```

This creates an issue with:
- A markdown description
- Checkboxes you can tick off in the GitHub UI as you complete subtasks
- Clear acceptance criteria so you know when the issue is "done"

### Create multiple issues for your phase

Repeat the command for each feature/task group. For example:

```bash
# Issue for authentication
gh issue create \
  --title "Authentication: register, login, JWT tokens" \
  --label "phase-1-core" \
  --body "$(cat <<'EOF'
## Tasks
- [ ] Implement password hashing utilities
- [ ] Create AuthService (register, login, token generation)
- [ ] Create auth routes (POST /auth/register, POST /auth/login)

## Acceptance Criteria
- User can register and receive a JWT
- Invalid credentials return 401
EOF
)"

# Issue for middleware
gh issue create \
  --title "Tenant and Store middleware" \
  --label "phase-1-core" \
  --body "$(cat <<'EOF'
## Tasks
- [ ] Implement TenantMiddleware
- [ ] Implement StoreMiddleware
- [ ] Implement SQLAlchemy auto-filter hook

## Acceptance Criteria
- Queries are automatically scoped to the current tenant
- Requests without valid tenant context are rejected
EOF
)"
```

### List your issues

```bash
# All open issues
gh issue list

# Filter by label
gh issue list --label "phase-1-core"

# View a specific issue
gh issue view 1
```

---

## Step 3: Create a GitHub Project Board

Projects give you a kanban-style board to visualize progress.

### Grant project permissions to the CLI

The `gh` CLI needs extra OAuth scopes for Projects. Run:

```bash
gh auth refresh -h github.com -s project,read:project
```

This will give you a one-time code and a URL. If the browser doesn't open automatically (common on WSL), copy the URL manually:

```
https://github.com/login/device
```

Paste your code there and authorize.

### Create the project

```bash
gh project create --owner YOUR_GITHUB_USERNAME --title "Your Project Name"
```

Example:

```bash
gh project create --owner Byekibe --title "Property Management SaaS"
# Returns: https://github.com/users/Byekibe/projects/3
```

Note the project number (e.g., `3`) — you'll need it for the next step.

### Add issues to the project

```bash
gh project item-add PROJECT_NUMBER --owner YOUR_GITHUB_USERNAME --url ISSUE_URL
```

Example — adding all 6 issues:

```bash
gh project item-add 3 --owner Byekibe --url https://github.com/Byekibe/property-mngt-sys/issues/1
gh project item-add 3 --owner Byekibe --url https://github.com/Byekibe/property-mngt-sys/issues/2
gh project item-add 3 --owner Byekibe --url https://github.com/Byekibe/property-mngt-sys/issues/3
gh project item-add 3 --owner Byekibe --url https://github.com/Byekibe/property-mngt-sys/issues/4
gh project item-add 3 --owner Byekibe --url https://github.com/Byekibe/property-mngt-sys/issues/5
gh project item-add 3 --owner Byekibe --url https://github.com/Byekibe/property-mngt-sys/issues/6
```

### Verify items are on the board

```bash
gh project item-list 3 --owner Byekibe
```

### View your board

Open in browser:

```
https://github.com/users/YOUR_USERNAME/projects/PROJECT_NUMBER
```

By default, all items land in a single column. In the browser UI, you can switch to "Board" layout and drag issues between columns: **Todo**, **In Progress**, **Done**.

---

## Step 4: Link Commits to Issues

This is where the real value of GitHub Issues comes in. When you commit, reference the issue number:

### Reference an issue (keeps it open)

```bash
git commit -m "Implement User and Tenant models. Ref #1"
```

This adds a link on issue #1 showing the commit, but keeps the issue open.

### Close an issue via commit

```bash
git commit -m "Complete all core models and run migration

Closes #1"
```

When this commit is pushed (or merged via PR), GitHub automatically closes issue #1.

### Keywords that close issues

Any of these keywords followed by `#NUMBER` will close the issue on push:
- `Closes #1`
- `Fixes #1`
- `Resolves #1`

---

## Step 5: Daily Workflow

Here's how this all fits together day-to-day:

### Starting work

```bash
# See what's on your plate
gh issue list --label "phase-1-core"

# Pick an issue and read it
gh issue view 1

# Move it to "In Progress" on the board (or do this in the browser)
```

### While working

- Check off subtasks in the GitHub UI as you complete them
- Reference the issue in your commits: `Ref #1`

### Finishing a task

```bash
# Commit with a closing keyword
git commit -m "Implement tenant middleware with auto-filter hook

Closes #3"

# Push
git push
```

The issue closes automatically and the project board reflects the change.

### End of day

```bash
# Quick status check
gh issue list --label "phase-1-core" --state all
```

---

## Useful Commands Reference

| Command | Description |
|---------|-------------|
| `gh issue create --title "..." --label "..." --body "..."` | Create a new issue |
| `gh issue list` | List all open issues |
| `gh issue list --label "phase-1-core"` | Filter issues by label |
| `gh issue view 1` | View issue #1 details |
| `gh issue close 1` | Manually close issue #1 |
| `gh issue reopen 1` | Reopen a closed issue |
| `gh issue edit 1 --add-label "bug"` | Add a label to an issue |
| `gh label create "name" --color "hex" --description "..."` | Create a label |
| `gh label list` | List all labels |
| `gh project create --owner USER --title "..."` | Create a project board |
| `gh project item-add NUM --owner USER --url ISSUE_URL` | Add issue to project |
| `gh project item-list NUM --owner USER` | List project items |

---

## Summary

| Tool | What It Does | Where It Lives |
|------|-------------|----------------|
| **Labels** | Categorize issues by phase | Repo > Issues > Labels |
| **Issues** | Track individual tasks with checklists | Repo > Issues tab |
| **Projects** | Visual kanban board (Todo/In Progress/Done) | User > Projects tab |
| **Commit references** | Link code changes to issues (`Ref #1`, `Closes #1`) | In your git commits |

The combination gives you traceability from task to code — you can always answer "why was this change made?" by following the issue link.
