# Newsletter Daily - Folder Structure Setup Script
# Creates the complete monorepo structure

$baseDir = "C:\dev\AiaaS\vivacity-digital-dev\newsletter-daily"

# Define all directories
$directories = @(
    # Apps - Web
    "$baseDir/apps/web/src/app/archive/[date]",
    "$baseDir/apps/web/src/app/about",
    "$baseDir/apps/web/src/app/api/edition",
    "$baseDir/apps/web/src/app/api/trigger",
    "$baseDir/apps/web/src/app/api/health",
    "$baseDir/apps/web/src/components/newsletter/sections",
    "$baseDir/apps/web/src/components/layout",
    "$baseDir/apps/web/src/components/ui",
    "$baseDir/apps/web/src/lib/hooks",
    "$baseDir/apps/web/src/lib/utils",
    "$baseDir/apps/web/src/lib/config",
    "$baseDir/apps/web/src/styles/themes",
    "$baseDir/apps/web/public/images/graphics",

    # Apps - Worker
    "$baseDir/apps/worker/src/jobs",
    "$baseDir/apps/worker/src/services/market-data",
    "$baseDir/apps/worker/src/services/news/sources",
    "$baseDir/apps/worker/src/services/content",
    "$baseDir/apps/worker/src/generators/section-generators",
    "$baseDir/apps/worker/src/summarizers/prompts",
    "$baseDir/apps/worker/src/queue",
    "$baseDir/apps/worker/src/utils",

    # Packages - Database
    "$baseDir/packages/database/prisma/migrations",
    "$baseDir/packages/database/src/repositories",

    # Packages - Types
    "$baseDir/packages/types/src",

    # Packages - UI
    "$baseDir/packages/ui/src/components/Card",
    "$baseDir/packages/ui/src/components/Button",
    "$baseDir/packages/ui/src/components/Chart",
    "$baseDir/packages/ui/src/components/StockTicker",
    "$baseDir/packages/ui/src/styles",

    # Packages - Utils
    "$baseDir/packages/utils/src/formatters",
    "$baseDir/packages/utils/src/validators",

    # Packages - Constants
    "$baseDir/packages/constants/src",

    # Packages - Config
    "$baseDir/packages/config/eslint",
    "$baseDir/packages/config/typescript",
    "$baseDir/packages/config/prettier",

    # GitHub
    "$baseDir/.github/workflows",
    "$baseDir/.github/ISSUE_TEMPLATE",

    # Docs
    "$baseDir/docs",

    # Scripts
    "$baseDir/scripts",

    # Tests
    "$baseDir/tests/e2e",
    "$baseDir/tests/integration"
)

# Create all directories
Write-Host "Creating directory structure for newsletter-daily..." -ForegroundColor Cyan
foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "Created: $dir" -ForegroundColor Green
    } else {
        Write-Host "Exists: $dir" -ForegroundColor Yellow
    }
}

Write-Host "`nDirectory structure created successfully!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Add configuration files and READMEs"
Write-Host "2. Initialize git and create GitHub repository"
Write-Host "3. Install dependencies with 'pnpm install'"
