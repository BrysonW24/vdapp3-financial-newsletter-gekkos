# Code Organization Guidelines

**Last Updated:** November 24, 2024
**Purpose:** Define where code and documentation live

---

## Directory Structure

```
newsletter-daily-prod/
├── apps/backend/
│   ├── app/
│   │   ├── models/              ← SQLAlchemy models only
│   │   ├── services/            ← Business logic services
│   │   ├── routers/             ← FastAPI routes
│   │   ├── api/
│   │   ├── core/
│   │   └── db/
│   ├── migrations/              ← SQL migration files
│   ├── pyproject.toml           ← Dependencies
│   └── [NO .md files here]      ← NO DOCS IN BACKEND!
│
├── documentation/
│   ├── FEATURES_4_5_README.md   ← Latest features overview
│   ├── COMMODITIES_AND_VC_GUIDE.md
│   ├── STATUS_REPORT.md
│   ├── VALIDATION_REPORT.md
│   ├── FILES_MANIFEST.md
│   ├── API_REFERENCE.md
│   ├── QUICK_START.md
│   └── [All other .md files]    ← ALL DOCS HERE
│
├── web/                         ← Frontend
└── worker/                      ← Background jobs
```

---

## Rule

### Code Files → apps/backend/
**What goes here:**
- Python models (models/*.py)
- Python services (services/*.py)
- Python routers (routers/*.py)
- Configuration (core/, db/)
- Database migrations (migrations/*.sql)
- Dependencies (pyproject.toml)

**Examples:**
- ✅ app/models/commodities.py
- ✅ app/services/commodities_service.py
- ✅ app/routers/portfolio.py
- ✅ migrations/001_create_chart_tables.sql

### Documentation Files → documentation/
**What goes here:**
- All .md files
- Implementation guides
- API documentation
- Feature overviews
- Setup guides
- Architecture docs
- Quick start guides

**Examples:**
- ✅ documentation/COMMODITIES_AND_VC_GUIDE.md
- ✅ documentation/FEATURES_4_5_README.md
- ✅ documentation/STATUS_REPORT.md
- ✅ documentation/API_REFERENCE.md

---

## Why This Matters

### Problem with Docs in Code Directory
❌ Clutters git history with documentation changes
❌ Makes it harder to navigate actual code
❌ Mixes content and code concerns
❌ Violates separation of concerns
❌ Creates confusion about what's production code vs docs

### Benefits of Organized Structure
✅ Clean codebase - only Python/migration files
✅ Clear separation of concerns
✅ Documentation easy to find and maintain
✅ Git history cleaner and more meaningful
✅ Better for developers who only care about code
✅ Better for users who only care about documentation

---

## When Creating New Features

### 1. Create Code Files
Location: `apps/backend/app/[models|services|routers]/`
Files: `.py` files only

Example:
```bash
# Create model
apps/backend/app/models/new_feature.py

# Create service
apps/backend/app/services/new_feature_service.py

# Create router
apps/backend/app/routers/new_feature.py
```

### 2. Create Documentation
Location: `documentation/`
Files: `.md` files

Example:
```bash
# Feature guide
documentation/NEW_FEATURE_GUIDE.md

# API reference
documentation/NEW_FEATURE_API.md

# Implementation notes
documentation/NEW_FEATURE_IMPLEMENTATION.md
```

### 3. Update Main Documentation
Location: `documentation/`
File: `DOCUMENTATION_INDEX.md`

Add reference to your new feature.

---

## Recent Implementation (Features 4 & 5)

### Code Files Created ✅
```
apps/backend/app/models/commodities.py (145 LOC)
apps/backend/app/models/venture_capital.py (255 LOC)
apps/backend/app/services/commodities_service.py (280 LOC)
```

### Documentation Created ✅
```
documentation/COMMODITIES_AND_VC_GUIDE.md
documentation/EXPANSION_COMPLETE.md
documentation/FEATURES_4_5_README.md
```

**All in proper locations!**

---

## File Checklist

When completing a feature:

### Code Checklist
- [ ] Models created in `app/models/`
- [ ] Services created in `app/services/`
- [ ] Routers created in `app/routers/` (if needed)
- [ ] Migrations created in `migrations/`
- [ ] Dependencies added to `pyproject.toml`
- [ ] Type hints complete (100% coverage)
- [ ] Docstrings complete

### Documentation Checklist
- [ ] Implementation guide in `documentation/`
- [ ] API reference in `documentation/`
- [ ] Feature overview in `documentation/`
- [ ] Updated `documentation/DOCUMENTATION_INDEX.md`
- [ ] Created README in `documentation/` for quick ref

### Verification Checklist
- [ ] No .md files in `apps/backend/`
- [ ] No .py files in `documentation/`
- [ ] All code in proper subdirectories
- [ ] All docs properly indexed

---

## Documentation Index Reference

The main documentation index is in:
```
documentation/DOCUMENTATION_INDEX.md
```

When adding new documentation:
1. Create your `.md` file in `documentation/`
2. Add entry to `DOCUMENTATION_INDEX.md`
3. Link to related documents

---

## Command Reference

### Verify Structure
```bash
# Check no .md files in backend
find apps/backend -name "*.md" -type f

# Check all .md files in docs
ls documentation/*.md | wc -l
```

### Create New Feature
```bash
# 1. Create code files
touch apps/backend/app/models/feature.py
touch apps/backend/app/services/feature_service.py

# 2. Create docs
touch documentation/FEATURE_GUIDE.md
```

---

## Best Practices

### For Code Files
- Keep code files focused and single-purpose
- Use clear naming (commodities.py, not comm.py)
- Add comprehensive docstrings
- Include type hints

### For Documentation
- Use clear, descriptive titles
- Include examples
- Link to related docs
- Keep up-to-date with code changes

### For Migrations
- Use clear naming (001_create_table.sql)
- Include comments explaining changes
- Keep migrations in migrations/ directory
- Never modify old migrations

---

## Common Mistakes to Avoid

❌ **DON'T:**
- Put .md files in apps/backend/
- Put .py files in documentation/
- Create docs in random directories
- Forget to update DOCUMENTATION_INDEX.md

✅ **DO:**
- Keep code in apps/backend/
- Keep docs in documentation/
- Follow naming conventions
- Update indexes when adding docs

---

## Summary

| Item | Location | Type |
|------|----------|------|
| Models | apps/backend/app/models/ | .py |
| Services | apps/backend/app/services/ | .py |
| Routers | apps/backend/app/routers/ | .py |
| Migrations | apps/backend/migrations/ | .sql |
| Configuration | apps/backend/ | .toml, .py |
| Documentation | documentation/ | .md |
| Guides | documentation/ | .md |
| References | documentation/ | .md |

---

## Questions?

Refer to:
- **Current structure:** Check `documentation/DOCUMENTATION_INDEX.md`
- **Feature examples:** See `documentation/FEATURES_4_5_README.md`
- **Code examples:** Look at `apps/backend/app/models/` or `app/services/`

---

**Effective:** November 24, 2024
**Status:** Active
**Maintainer:** Development Team
