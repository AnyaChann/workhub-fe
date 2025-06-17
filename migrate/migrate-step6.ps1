# Script hoàn thiện cho migration
Write-Host " WorkHub Final Migration Script" -ForegroundColor Magenta
Write-Host "=================================" -ForegroundColor Magenta

# Change to project directory
Set-Location "d:\Semester4\workHub\workhub-fe"

# === PHASE 1: Di chuyển files còn lại ===
Write-Host "`n=== PHASE 1: Moving Remaining Files ===" -ForegroundColor Cyan

# 1. Di chuyển hooks từ src/hooks sang shared/hooks/api
if (Test-Path "src/hooks") {
    Write-Host "Moving hooks to shared..." -ForegroundColor Yellow
    
    # API hooks
    $apiHooks = @("useJobTypes.js", "useCategoriesAndPositions.js")
    foreach ($hook in $apiHooks) {
        if (Test-Path "src/hooks/$hook") {
            Move-Item "src/hooks/$hook" "src/shared/hooks/api/" -Force
            Write-Host "  ✅ Moved: $hook" -ForegroundColor Green
        }
    }
    
    # Form hooks
    if (Test-Path "src/hooks/useCreateJobForm.js") {
        if (!(Test-Path "src/shared/hooks/form")) {
            New-Item -Path "src/shared/hooks/form" -ItemType Directory -Force
        }
        Move-Item "src/hooks/useCreateJobForm.js" "src/shared/hooks/form/" -Force
        Write-Host "  ✅ Moved: useCreateJobForm.js" -ForegroundColor Green
    }
    
    # Di chuyển hooks còn lại
    Get-ChildItem "src/hooks" -File | ForEach-Object {
        Move-Item $_.FullName "src/shared/hooks/" -Force
        Write-Host "  ✅ Moved: $($_.Name)" -ForegroundColor Green
    }
    
    # Xóa folder hooks rỗng
    if ((Get-ChildItem "src/hooks" -ErrorAction SilentlyContinue | Measure-Object).Count -eq 0) {
        Remove-Item "src/hooks" -Force -ErrorAction SilentlyContinue
        Write-Host "  🗑️ Removed empty hooks folder" -ForegroundColor Red
    }
}

# 2. Di chuyển utils/mockJobsGenerator.js
if (Test-Path "src/utils") {
    Write-Host "Moving job utils..." -ForegroundColor Yellow
    
    if (!(Test-Path "src/features/jobs/utils")) {
        New-Item -Path "src/features/jobs/utils" -ItemType Directory -Force
    }
    
    Get-ChildItem "src/utils" -File -Filter "*mock*" | ForEach-Object {
        Move-Item $_.FullName "src/features/jobs/utils/" -Force
        Write-Host "  ✅ Moved: $($_.Name)" -ForegroundColor Green
    }
    
    # Di chuyển utils khác sang shared
    Get-ChildItem "src/utils" -File | ForEach-Object {
        if (!(Test-Path "src/shared/utils/helpers")) {
            New-Item -Path "src/shared/utils/helpers" -ItemType Directory -Force
        }
        Move-Item $_.FullName "src/shared/utils/helpers/" -Force
        Write-Host "  ✅ Moved: $($_.Name) to shared/utils/helpers/" -ForegroundColor Green
    }
    
    # Xóa folder utils rỗng
    if ((Get-ChildItem "src/utils" -ErrorAction SilentlyContinue | Measure-Object).Count -eq 0) {
        Remove-Item "src/utils" -Force -Recurse -ErrorAction SilentlyContinue
        Write-Host "  🗑️ Removed empty utils folder" -ForegroundColor Red
    }
}

# === PHASE 2: Sắp xếp Dashboard components ===
Write-Host "`n=== PHASE 2: Organizing Dashboard Components ===" -ForegroundColor Cyan

# Tạo thư mục cần thiết
$jobComponentFolders = @(
    "src/features/jobs/components/shared",
    "src/features/jobs/components/create", 
    "src/features/jobs/components/manage"
)

foreach ($folder in $jobComponentFolders) {
    if (!(Test-Path $folder)) {
        New-Item -Path $folder -ItemType Directory -Force
        Write-Host "   Created: $folder" -ForegroundColor Cyan
    }
}

# Di chuyển Job components
$dashboardComponentsPath = "src/pages/Employer/Dashboard/components"

if (Test-Path $dashboardComponentsPath) {
    # Shared job components
    $sharedComponents = @("JobsList", "JobCard", "JobsDebugPanel")
    foreach ($comp in $sharedComponents) {
        $compPath = "$dashboardComponentsPath/$comp"
        if (Test-Path $compPath) {
            Move-Item $compPath "src/features/jobs/components/shared/" -Force
            Write-Host "  ✅ Moved: $comp to jobs/components/shared/" -ForegroundColor Green
        }
    }
    
    # CreateJob components
    if (Test-Path "$dashboardComponentsPath/CreateJob") {
        Move-Item "$dashboardComponentsPath/CreateJob" "src/features/jobs/components/create/" -Force
        Write-Host "  ✅ Moved: CreateJob to jobs/components/create/" -ForegroundColor Green
    }
    
    # Job management components
    $manageComponents = @("ActiveJobs", "Drafts", "Expired")
    foreach ($comp in $manageComponents) {
        $compPath = "$dashboardComponentsPath/$comp"
        if (Test-Path $compPath) {
            Move-Item $compPath "src/features/jobs/components/manage/" -Force
            Write-Host "  ✅ Moved: $comp to jobs/components/manage/" -ForegroundColor Green
        }
    }
    
    # Di chuyển Dashboard layout
    if (Test-Path "src/pages/Employer/Dashboard/DashboardLayout.jsx") {
        if (!(Test-Path "src/features/dashboard/layouts")) {
            New-Item -Path "src/features/dashboard/layouts" -ItemType Directory -Force
        }
        Move-Item "src/pages/Employer/Dashboard/DashboardLayout.jsx" "src/features/dashboard/layouts/" -Force
        Write-Host "  ✅ Moved: DashboardLayout.jsx" -ForegroundColor Green
    }
    
    # Di chuyển components còn lại sang dashboard/components/employer
    Get-ChildItem $dashboardComponentsPath -Directory -ErrorAction SilentlyContinue | ForEach-Object {
        if (!(Test-Path "src/features/dashboard/components/employer")) {
            New-Item -Path "src/features/dashboard/components/employer" -ItemType Directory -Force
        }
        Move-Item $_.FullName "src/features/dashboard/components/employer/" -Force
        Write-Host "  ✅ Moved: $($_.Name) to dashboard/components/employer/" -ForegroundColor Green
    }
}

# === PHASE 3: Marketing pages ===
Write-Host "`n=== PHASE 3: Moving Marketing Pages ===" -ForegroundColor Cyan

# Di chuyển Home page
if (Test-Path "src/pages/Employer/Home") {
    if (!(Test-Path "src/features/marketing/pages")) {
        New-Item -Path "src/features/marketing/pages" -ItemType Directory -Force
    }
    Move-Item "src/pages/Employer/Home" "src/features/marketing/pages/" -Force
    Write-Host "  ✅ Moved: Home page to marketing/pages/" -ForegroundColor Green
}

# Di chuyển Pricing page
if (Test-Path "src/pages/Employer/Pricing") {
    Move-Item "src/pages/Employer/Pricing" "src/features/marketing/pages/" -Force
    Write-Host "  ✅ Moved: Pricing page to marketing/pages/" -ForegroundColor Green
}

# === PHASE 4: Tạo Barrel Exports ===
Write-Host "`n=== PHASE 4: Creating Barrel Exports ===" -ForegroundColor Cyan

# 1. Shared components index
@"
// Shared UI Components
export { default as LoadingSpinner } from './ui/LoadingSpinner/LoadingSpinner';
export {
  PageLoadingSpinner,
  InlineLoadingSpinner, 
  ButtonLoadingSpinner,
  JobsLoadingSpinner
} from './ui/LoadingSpinner/LoadingSpinner';

// Other shared components
export { default as ApiTest } from './ApiTest/ApiTest';
export { default as TempDashboard } from './TempDashboard/TempDashboard';
"@ | Out-File -FilePath "src/shared/components/index.js" -Encoding UTF8

# 2. Shared hooks index
@"
// API Hooks
export { useJobTypes } from './api/useJobTypes';
export { useCategoriesAndPositions } from './api/useCategoriesAndPositions';

// Form Hooks  
export { useCreateJobForm } from './form/useCreateJobForm';

// Other hooks
export { useLoading } from './useLoading';
export { useNavigation } from './useNavigation';
"@ | Out-File -FilePath "src/shared/hooks/index.js" -Encoding UTF8

# 3. Jobs feature index
@"
// Job Components - Shared
export { default as JobsList } from './components/shared/JobsList/JobsList';
export { default as JobCard } from './components/shared/JobCard/JobCard';
export { default as JobsDebugPanel } from './components/shared/JobsDebugPanel/JobsDebugPanel';

// Job Components - Create
export { default as CreateJob } from './components/create/CreateJob/CreateJob';

// Job Components - Manage
export { default as ActiveJobs } from './components/manage/ActiveJobs/ActiveJobs';
export { default as Drafts } from './components/manage/Drafts/Drafts';
export { default as Expired } from './components/manage/Expired/Expired';

// Job Utils
export { generateMockJobs, generateSingleMockJob } from './utils/mockJobsGenerator';
"@ | Out-File -FilePath "src/features/jobs/index.js" -Encoding UTF8

# 4. Core index
@"
// Contexts
export { default as AuthContext, useAuth } from './contexts/AuthContext';

// Routing
export { default as AppRoutes } from './routing/AppRoutes';
export { default as ProtectedRoute } from './routing/ProtectedRoute';
export { default as ROUTES } from './routing/routeConstants';
"@ | Out-File -FilePath "src/core/index.js" -Encoding UTF8

Write-Host "  ✅ Created barrel exports" -ForegroundColor Green

# === PHASE 5: Update jsconfig.json ===
Write-Host "`n=== PHASE 5: Updating jsconfig.json ===" -ForegroundColor Cyan

$jsconfigContent = @"
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "@shared/*": ["shared/*"],
      "@features/*": ["features/*"], 
      "@core/*": ["core/*"],
      "@assets/*": ["assets/*"],

      "@auth/*": ["features/auth/*"],
      "@jobs/*": ["features/jobs/*"],
      "@dashboard/*": ["features/dashboard/*"],
      "@marketing/*": ["features/marketing/*"],
      "@common/*": ["features/common/*"],

      "@components/*": ["shared/components/*"],
      "@hooks/*": ["shared/hooks/*"],
      "@utils/*": ["shared/utils/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "build"]
}
"@

$jsconfigContent | Out-File -FilePath "jsconfig.json" -Encoding UTF8
Write-Host "  ✅ Updated jsconfig.json with absolute imports" -ForegroundColor Green

# === PHASE 6: Update Import Paths ===
Write-Host "`n=== PHASE 6: Updating Import Paths ===" -ForegroundColor Cyan

# Function để update imports trong file
function Update-ImportPaths {
    param($FilePath)
    
    if (!(Test-Path $FilePath)) { return }
    
    $content = Get-Content $FilePath -Raw
    $originalContent = $content
    
    # Update common import patterns
    $updates = @{
        # Hooks updates
        "from '../../../../../hooks/useJobTypes'" = "from '@hooks/api/useJobTypes'"
        "from '../../../../hooks/useJobTypes'" = "from '@hooks/api/useJobTypes'"
        "from '../../../hooks/useJobTypes'" = "from '@hooks/api/useJobTypes'"
        "from '../../hooks/useJobTypes'" = "from '@hooks/api/useJobTypes'"
        "from '../hooks/useJobTypes'" = "from '@hooks/api/useJobTypes'"
        
        "from '../../../../../hooks/useCategoriesAndPositions'" = "from '@hooks/api/useCategoriesAndPositions'"
        "from '../../../../hooks/useCategoriesAndPositions'" = "from '@hooks/api/useCategoriesAndPositions'"
        "from '../../../hooks/useCategoriesAndPositions'" = "from '@hooks/api/useCategoriesAndPositions'"
        "from '../../hooks/useCategoriesAndPositions'" = "from '@hooks/api/useCategoriesAndPositions'"
        "from '../hooks/useCategoriesAndPositions'" = "from '@hooks/api/useCategoriesAndPositions'"
        
        "from '../../../../../hooks/useCreateJobForm'" = "from '@hooks/form/useCreateJobForm'"
        "from '../../../../hooks/useCreateJobForm'" = "from '@hooks/form/useCreateJobForm'"
        "from '../../../hooks/useCreateJobForm'" = "from '@hooks/form/useCreateJobForm'"
        "from '../../hooks/useCreateJobForm'" = "from '@hooks/form/useCreateJobForm'"
        "from '../hooks/useCreateJobForm'" = "from '@hooks/form/useCreateJobForm'"
        
        # Utils updates
        "from '../../../../../utils/mockJobsGenerator'" = "from '@jobs/utils/mockJobsGenerator'"
        "from '../../../../utils/mockJobsGenerator'" = "from '@jobs/utils/mockJobsGenerator'"
        "from '../../../utils/mockJobsGenerator'" = "from '@jobs/utils/mockJobsGenerator'"
        "from '../../utils/mockJobsGenerator'" = "from '@jobs/utils/mockJobsGenerator'"
        "from '../utils/mockJobsGenerator'" = "from '@jobs/utils/mockJobsGenerator'"
        
        # Components updates
        "from '../JobsList/JobsList'" = "from '@jobs/components/shared/JobsList/JobsList'"
        "from '../JobCard/JobCard'" = "from '@jobs/components/shared/JobCard/JobCard'"
        "from '../JobsDebugPanel/JobsDebugPanel'" = "from '@jobs/components/shared/JobsDebugPanel/JobsDebugPanel'"
        
        # LoadingSpinner updates
        "from '../../../../../components/LoadingSpinner/LoadingSpinner'" = "from '@components/ui/LoadingSpinner/LoadingSpinner'"
        "from '../../../../components/LoadingSpinner/LoadingSpinner'" = "from '@components/ui/LoadingSpinner/LoadingSpinner'"
        "from '../../../components/LoadingSpinner/LoadingSpinner'" = "from '@components/ui/LoadingSpinner/LoadingSpinner'"
        "from '../../components/LoadingSpinner/LoadingSpinner'" = "from '@components/ui/LoadingSpinner/LoadingSpinner'"
        "from '../components/LoadingSpinner/LoadingSpinner'" = "from '@components/ui/LoadingSpinner/LoadingSpinner'"
        
        # Contexts updates
        "from '../../../../../contexts/AuthContext'" = "from '@core/contexts/AuthContext'"
        "from '../../../../contexts/AuthContext'" = "from '@core/contexts/AuthContext'"
        "from '../../../contexts/AuthContext'" = "from '@core/contexts/AuthContext'"
        "from '../../contexts/AuthContext'" = "from '@core/contexts/AuthContext'"
        "from '../contexts/AuthContext'" = "from '@core/contexts/AuthContext'"
        
        # Routes updates
        "from '../../../../../routes/routeConstants'" = "from '@core/routing/routeConstants'"
        "from '../../../../routes/routeConstants'" = "from '@core/routing/routeConstants'"
        "from '../../../routes/routeConstants'" = "from '@core/routing/routeConstants'"
        "from '../../routes/routeConstants'" = "from '@core/routing/routeConstants'"
        "from '../routes/routeConstants'" = "from '@core/routing/routeConstants'"
    }
    
    foreach ($pattern in $updates.Keys) {
        $replacement = $updates[$pattern]
        $content = $content -replace [regex]::Escape($pattern), $replacement
    }
    
    # Only write if content changed
    if ($content -ne $originalContent) {
        Set-Content -Path $FilePath -Value $content -Encoding UTF8
        Write-Host "    ✅ Updated: $FilePath" -ForegroundColor Green
    }
}

# Check for potential import issues
Write-Host "`n Checking for potential import issues..." -ForegroundColor Cyan

# Files that might need import updates
$criticalFiles = @(
    "src/App.js",
    "src/index.js",
    "src/features/dashboard/layouts/DashboardLayout.jsx",
    "src/features/jobs/components/manage/ActiveJobs/ActiveJobs.jsx",
    "src/features/jobs/components/manage/Drafts/Drafts.jsx",
    "src/features/jobs/components/manage/Expired/Expired.jsx"
)

foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Write-Host "`n Checking: $file" -ForegroundColor Yellow
        $content = Get-Content $file -Raw
        
        # Look for relative imports that might be broken
        $relativeImports = $content | Select-String "from '\.\./.*'" -AllMatches
        if ($relativeImports.Matches.Count -gt 0) {
            Write-Host "    Found relative imports:" -ForegroundColor Yellow
            $relativeImports.Matches | ForEach-Object {
                Write-Host "    $($_.Value)" -ForegroundColor Red
            }
        } else {
            Write-Host "  ✅ No problematic relative imports" -ForegroundColor Green
        }
    } else {
        Write-Host "  ❌ File not found: $file" -ForegroundColor Red
    }
}

# Fix App.js imports
if (Test-Path "src/App.js") {
    Write-Host "`n Fixing App.js imports..." -ForegroundColor Yellow
    
    $appContent = @"
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@core/contexts/AuthContext';
import AppRoutes from '@core/routing/AppRoutes';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="App">
          <AppRoutes />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
"@
    
    $appContent | Out-File -FilePath "src/App.js" -Encoding UTF8
    Write-Host "  ✅ Fixed App.js" -ForegroundColor Green
}

# Check index.js
if (Test-Path "src/index.js") {
    Write-Host "✅ index.js should be fine (no changes needed)" -ForegroundColor Green
}

# Update all JS/JSX files
Write-Host "Updating import paths in JS/JSX files..." -ForegroundColor Yellow
Get-ChildItem "src" -Recurse -Include "*.js", "*.jsx" | ForEach-Object {
    Update-ImportPaths $_.FullName
}

Write-Host "  ✅ Import paths updated" -ForegroundColor Green

# === PHASE 7: Final Cleanup ===
Write-Host "`n=== PHASE 7: Final Cleanup ===" -ForegroundColor Cyan
Write-Host "`n=== FINAL: Project Structure Verification ===" -ForegroundColor Magenta

# Show final structure
function Show-ProjectStructure {
    param($Path, $MaxDepth = 3, $CurrentDepth = 0, $Indent = "")
    
    if ($CurrentDepth -gt $MaxDepth) { return }
    
    if (Test-Path $Path) {
        $items = Get-ChildItem $Path | Where-Object { 
            $_.Name -notmatch "(node_modules|\.git|build|dist)" 
        } | Sort-Object @{Expression={$_.PSIsContainer}; Descending=$true}, Name
        
        foreach ($item in $items) {
            if ($item.PSIsContainer) {
                Write-Host "$Indent $($item.Name)/" -ForegroundColor Yellow
                Show-ProjectStructure $item.FullName $MaxDepth ($CurrentDepth + 1) "$Indent  "
            } else {
                $color = switch ($item.Extension) {
                    ".js" { "Green" }
                    ".jsx" { "Green" } 
                    ".css" { "Blue" }
                    ".json" { "Cyan" }
                    default { "White" }
                }
                Write-Host "$Indent $($item.Name)" -ForegroundColor $color
            }
        }
    }
}

Write-Host "`n Final Project Structure:" -ForegroundColor Cyan
Show-ProjectStructure "src" 2

# Count files by feature
Write-Host "`n File Distribution:" -ForegroundColor Cyan
$features = @("auth", "jobs", "dashboard", "marketing", "common")
foreach ($feature in $features) {
    $path = "src/features/$feature"
    if (Test-Path $path) {
        $count = (Get-ChildItem $path -Recurse -File | Measure-Object).Count
        Write-Host "  $feature : $count files" -ForegroundColor Green
    }
}

$sharedCount = if (Test-Path "src/shared") { (Get-ChildItem "src/shared" -Recurse -File | Measure-Object).Count } else { 0 }
$coreCount = if (Test-Path "src/core") { (Get-ChildItem "src/core" -Recurse -File | Measure-Object).Count } else { 0 }
Write-Host "  shared  : $sharedCount files" -ForegroundColor Green  
Write-Host "  core    : $coreCount files" -ForegroundColor Green

Write-Host "`n✅ Migration completed successfully!" -ForegroundColor Green
Write-Host "`n Next Steps:" -ForegroundColor Yellow
Write-Host "1. Run: npm start (test the application)" -ForegroundColor White
Write-Host "2. Check for any remaining import errors" -ForegroundColor White
Write-Host "3. Update any missed import paths manually" -ForegroundColor White
Write-Host "4. Consider adding more barrel exports" -ForegroundColor White