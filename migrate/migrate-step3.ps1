# === PHASE 1: SHARED COMPONENTS ===
Write-Host "`n=== PHASE 1: Moving Shared Components ===" -ForegroundColor Cyan

# Move hooks to shared
if (Test-Path "src/hooks") {
    Write-Host "Moving hooks..." -ForegroundColor Yellow
    
    # API hooks
    $apiHooks = @("useJobTypes.js", "useCategoriesAndPositions.js")
    foreach ($hook in $apiHooks) {
        if (Test-Path "src/hooks/$hook") {
            Move-Item "src/hooks/$hook" "src/shared/hooks/api/" -Force
            Write-Host "  Moved: $hook to shared/hooks/api/" -ForegroundColor Green
        }
    }
    
    # Form hooks  
    if (Test-Path "src/hooks/useCreateJobForm.js") {
        Move-Item "src/hooks/useCreateJobForm.js" "src/shared/hooks/form/" -Force
        Write-Host "  Moved: useCreateJobForm.js to shared/hooks/form/" -ForegroundColor Green
    }
    
    # Move remaining hooks to shared/hooks
    Get-ChildItem "src/hooks" -File | ForEach-Object {
        Move-Item $_.FullName "src/shared/hooks/" -Force
        Write-Host "  Moved: $($_.Name) to shared/hooks/" -ForegroundColor Green
    }
    
    # Remove empty hooks folder
    if ((Get-ChildItem "src/hooks" | Measure-Object).Count -eq 0) {
        Remove-Item "src/hooks" -Force
        Write-Host "  Removed empty hooks folder" -ForegroundColor Red
    }
}

# Move shared components
if (Test-Path "src/components") {
    Write-Host "Moving shared components..." -ForegroundColor Yellow
    Get-ChildItem "src/components" | ForEach-Object {
        if ($_.Name -eq "LoadingSpinner") {
            Move-Item $_.FullName "src/shared/components/ui/" -Force
        } else {
            Move-Item $_.FullName "src/shared/components/" -Force
        }
        Write-Host "  Moved: $($_.Name)" -ForegroundColor Green
    }
    Remove-Item "src/components" -Force -ErrorAction SilentlyContinue
}

# Move contexts to core
if (Test-Path "src/contexts") {
    Write-Host "Moving contexts..." -ForegroundColor Yellow
    Get-ChildItem "src/contexts" | ForEach-Object {
        Move-Item $_.FullName "src/core/contexts/" -Force
        Write-Host "  Moved: $($_.Name)" -ForegroundColor Green
    }
    Remove-Item "src/contexts" -Force -ErrorAction SilentlyContinue
}

# Move routes to core
if (Test-Path "src/routes") {
    Write-Host "Moving routes..." -ForegroundColor Yellow
    Get-ChildItem "src/routes" | ForEach-Object {
        Move-Item $_.FullName "src/core/routing/" -Force
        Write-Host "  Moved: $($_.Name)" -ForegroundColor Green
    }
    Remove-Item "src/routes" -Force -ErrorAction SilentlyContinue
}

# === PHASE 2: AUTH FEATURE ===
Write-Host "`n=== PHASE 2: Moving Auth Feature ===" -ForegroundColor Cyan

if (Test-Path "src/pages/Auth") {
    Write-Host "Moving auth pages..." -ForegroundColor Yellow
    Get-ChildItem "src/pages/Auth" | ForEach-Object {
        Move-Item $_.FullName "src/features/auth/pages/" -Force
        Write-Host "  Moved: $($_.Name)" -ForegroundColor Green
    }
    Remove-Item "src/pages/Auth" -Force -ErrorAction SilentlyContinue
}

# Move auth service
if (Test-Path "src/services") {
    $authServices = @("*auth*", "*Auth*")
    foreach ($pattern in $authServices) {
        Get-ChildItem "src/services" -File -Filter $pattern | ForEach-Object {
            Move-Item $_.FullName "src/features/auth/services/" -Force
            Write-Host "  Moved: $($_.Name) to auth/services/" -ForegroundColor Green
        }
    }
}

# === PHASE 3: JOBS FEATURE ===  
Write-Host "`n=== PHASE 3: Moving Jobs Feature ===" -ForegroundColor Cyan

# Job services
if (Test-Path "src/services") {
    $jobServices = @("*job*", "*Job*", "*position*", "*category*")
    foreach ($pattern in $jobServices) {
        Get-ChildItem "src/services" -File -Filter $pattern | ForEach-Object {
            Move-Item $_.FullName "src/features/jobs/services/" -Force
            Write-Host "  Moved: $($_.Name) to jobs/services/" -ForegroundColor Green
        }
    }
}

# Move utils
if (Test-Path "src/utils") {
    $jobUtils = @("*mock*", "*job*")
    foreach ($pattern in $jobUtils) {
        Get-ChildItem "src/utils" -File -Filter $pattern | ForEach-Object {
            Move-Item $_.FullName "src/features/jobs/utils/" -Force
            Write-Host "  Moved: $($_.Name) to jobs/utils/" -ForegroundColor Green
        }
    }
}

# Dashboard components - move CreateJob to jobs feature
if (Test-Path "src/pages/Employer/Dashboard/components/CreateJob") {
    Write-Host "Moving CreateJob components..." -ForegroundColor Yellow
    Move-Item "src/pages/Employer/Dashboard/components/CreateJob" "src/features/jobs/components/create/CreateJob" -Force
    Write-Host "  Moved: CreateJob to jobs/components/create/" -ForegroundColor Green
}

# Move JobsList and related components
$jobComponents = @("JobsList", "JobCard", "JobsDebugPanel")
foreach ($comp in $jobComponents) {
    $compPath = "src/pages/Employer/Dashboard/components/$comp"
    if (Test-Path $compPath) {
        Move-Item $compPath "src/features/jobs/components/shared/" -Force
        Write-Host "  Moved: $comp to jobs/components/shared/" -ForegroundColor Green
    }
}

# Move job management components
$manageComponents = @("ActiveJobs", "Drafts", "Expired")
foreach ($comp in $manageComponents) {
    $compPath = "src/pages/Employer/Dashboard/components/$comp"
    if (Test-Path $compPath) {
        Move-Item $compPath "src/features/jobs/components/manage/" -Force
        Write-Host "  Moved: $comp to jobs/components/manage/" -ForegroundColor Green
    }
}

# === PHASE 4: DASHBOARD FEATURE ===
Write-Host "`n=== PHASE 4: Moving Dashboard Feature ===" -ForegroundColor Cyan

# Move dashboard layout
if (Test-Path "src/pages/Employer/Dashboard/DashboardLayout.jsx") {
    Move-Item "src/pages/Employer/Dashboard/DashboardLayout.jsx" "src/features/dashboard/layouts/" -Force
    Write-Host "  Moved: DashboardLayout.jsx" -ForegroundColor Green
}

# Move remaining dashboard components  
if (Test-Path "src/pages/Employer/Dashboard/components") {
    Get-ChildItem "src/pages/Employer/Dashboard/components" | ForEach-Object {
        Move-Item $_.FullName "src/features/dashboard/components/employer/" -Force
        Write-Host "  Moved: $($_.Name) to dashboard/components/employer/" -ForegroundColor Green
    }
}

# === PHASE 5: MARKETING FEATURE ===
Write-Host "`n=== PHASE 5: Moving Marketing Feature ===" -ForegroundColor Cyan

# Move Home page
if (Test-Path "src/pages/Employer/Home") {
    Move-Item "src/pages/Employer/Home" "src/features/marketing/pages/Home" -Force
    Write-Host "  Moved: Home page to marketing/pages/" -ForegroundColor Green
}

# Move Pricing page  
if (Test-Path "src/pages/Employer/Pricing") {
    Move-Item "src/pages/Employer/Pricing" "src/features/marketing/pages/Pricing" -Force
    Write-Host "  Moved: Pricing page to marketing/pages/" -ForegroundColor Green
}

# === PHASE 6: COMMON FEATURE ===
Write-Host "`n=== PHASE 6: Moving Common Feature ===" -ForegroundColor Cyan

# Move remaining common components
$commonComponents = @("NotFound", "JobPreview")
foreach ($comp in $commonComponents) {
    $compPath = "src/pages/$comp"
    if (Test-Path $compPath) {
        Move-Item $compPath "src/features/common/components/" -Force
        Write-Host "  Moved: $comp to common/components/" -ForegroundColor Green
    }
}

# Move remaining services to shared
if (Test-Path "src/services") {
    Write-Host "Moving remaining services to shared..." -ForegroundColor Yellow
    Get-ChildItem "src/services" | ForEach-Object {
        Move-Item $_.FullName "src/shared/utils/helpers/" -Force
        Write-Host "  Moved: $($_.Name) to shared/utils/helpers/" -ForegroundColor Green
    }
    Remove-Item "src/services" -Force -ErrorAction SilentlyContinue
}

# Clean up empty pages folder
if (Test-Path "src/pages") {
    if ((Get-ChildItem "src/pages" -Recurse | Measure-Object).Count -eq 0) {
        Remove-Item "src/pages" -Force -Recurse
        Write-Host "  Removed empty pages folder" -ForegroundColor Red
    }
}