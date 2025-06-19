# ============================================
#  WorkHub Recruiter Structure Migration
# ============================================

Write-Host " Starting WorkHub Recruiter Migration..." -ForegroundColor Green

# Set base paths
$ProjectRoot = "d:\Semester4\workHub\workhub-fe\src"
$FeaturesPath = "$ProjectRoot\features"
$OldDashboardPath = "$FeaturesPath\dashboard"
$NewRecruiterPath = "$FeaturesPath\recruiter"

# Create new folder structure
Write-Host " Creating new folder structure..." -ForegroundColor Yellow

$NewFolders = @(
    "$NewRecruiterPath",
    "$NewRecruiterPath\components",
    "$NewRecruiterPath\components\layout",
    "$NewRecruiterPath\components\layout\RecruiterHeader",
    "$NewRecruiterPath\components\layout\RecruiterSidebar", 
    "$NewRecruiterPath\components\layout\RecruiterAccountDropdown",
    "$NewRecruiterPath\components\layout\RecruiterLayout",
    "$NewRecruiterPath\components\common",
    "$NewRecruiterPath\components\common\PageHeader",
    "$NewRecruiterPath\components\common\SearchSection",
    "$NewRecruiterPath\components\common\EmptyState",
    "$NewRecruiterPath\components\jobs",
    "$NewRecruiterPath\components\jobs\JobsList",
    "$NewRecruiterPath\components\jobs\JobCard",
    "$NewRecruiterPath\components\jobs\JobForm",
    "$NewRecruiterPath\components\jobs\JobActions",
    "$NewRecruiterPath\components\account",
    "$NewRecruiterPath\components\account\Profile",
    "$NewRecruiterPath\components\account\Company",
    "$NewRecruiterPath\components\account\Billing",
    "$NewRecruiterPath\components\account\TeamManagement",
    "$NewRecruiterPath\components\analytics",
    "$NewRecruiterPath\components\analytics\Dashboard",
    "$NewRecruiterPath\components\analytics\JobReports",
    "$NewRecruiterPath\components\analytics\Charts",
    "$NewRecruiterPath\components\candidates",
    "$NewRecruiterPath\components\candidates\CandidateList",
    "$NewRecruiterPath\components\candidates\CandidateCard",
    "$NewRecruiterPath\components\candidates\CandidateFilters",
    "$NewRecruiterPath\pages",
    "$NewRecruiterPath\pages\Dashboard",
    "$NewRecruiterPath\pages\Jobs",
    "$NewRecruiterPath\pages\Jobs\ActiveJobs",
    "$NewRecruiterPath\pages\Jobs\DraftJobs",
    "$NewRecruiterPath\pages\Jobs\ExpiredJobs",
    "$NewRecruiterPath\pages\Jobs\CreateJob",
    "$NewRecruiterPath\pages\Account",
    "$NewRecruiterPath\pages\Account\Settings",
    "$NewRecruiterPath\pages\Account\Profile",
    "$NewRecruiterPath\pages\Account\Team",
    "$NewRecruiterPath\pages\Account\Billing",
    "$NewRecruiterPath\pages\Analytics",
    "$NewRecruiterPath\pages\Candidates",
    "$NewRecruiterPath\pages\Company",
    "$NewRecruiterPath\services",
    "$NewRecruiterPath\hooks",
    "$NewRecruiterPath\routing"
)

foreach ($folder in $NewFolders) {
    if (!(Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder -Force | Out-Null
        Write-Host "✅ Created: $folder" -ForegroundColor Green
    } else {
        Write-Host " Exists: $folder" -ForegroundColor Gray
    }
}

# ============================================
#  Move and rename existing files
# ============================================

Write-Host "`n Moving existing files..." -ForegroundColor Yellow

# Define file migrations
$FileMigrations = @{
    # Layout Components
    "$OldDashboardPath\components\recruiter\DashboardHeader\DashboardHeader.jsx" = "$NewRecruiterPath\components\layout\RecruiterHeader\RecruiterHeader.jsx"
    "$OldDashboardPath\components\recruiter\DashboardHeader\DashboardHeader.css" = "$NewRecruiterPath\components\layout\RecruiterHeader\RecruiterHeader.css"
    
    "$OldDashboardPath\components\recruiter\DashboardSidebar\DashboardSidebar.jsx" = "$NewRecruiterPath\components\layout\RecruiterSidebar\RecruiterSidebar.jsx"
    "$OldDashboardPath\components\recruiter\DashboardSidebar\DashboardSidebar.css" = "$NewRecruiterPath\components\layout\RecruiterSidebar\RecruiterSidebar.css"
    
    "$OldDashboardPath\components\recruiter\Dropdowns\AccountDropdown\AccountDropdown.jsx" = "$NewRecruiterPath\components\layout\RecruiterAccountDropdown\RecruiterAccountDropdown.jsx"
    "$OldDashboardPath\components\recruiter\Dropdowns\AccountDropdown\AccountDropdown.css" = "$NewRecruiterPath\components\layout\RecruiterAccountDropdown\RecruiterAccountDropdown.css"
    
    # Shared Components
    "$OldDashboardPath\components\shared\PageHeader\PageHeader.jsx" = "$NewRecruiterPath\components\common\PageHeader\PageHeader.jsx"
    "$OldDashboardPath\components\shared\PageHeader\PageHeader.css" = "$NewRecruiterPath\components\common\PageHeader\PageHeader.css"
    
    "$OldDashboardPath\components\shared\SearchSection\SearchSection.jsx" = "$NewRecruiterPath\components\common\SearchSection\SearchSection.jsx"
    "$OldDashboardPath\components\shared\SearchSection\SearchSection.css" = "$NewRecruiterPath\components\common\SearchSection\SearchSection.css"
    
    # Account Components
    "$OldDashboardPath\components\recruiter\Account\Account.jsx" = "$NewRecruiterPath\pages\Account\Settings\AccountSettingsPage.jsx"
    "$OldDashboardPath\components\recruiter\Account\Account.css" = "$NewRecruiterPath\pages\Account\Settings\AccountSettingsPage.css"
    
    "$OldDashboardPath\components\recruiter\Account\Profile\Profile.jsx" = "$NewRecruiterPath\pages\Account\Profile\UserProfilePage.jsx"
    "$OldDashboardPath\components\recruiter\Account\Profile\Profile.css" = "$NewRecruiterPath\pages\Account\Profile\UserProfilePage.css"
    
    "$OldDashboardPath\components\recruiter\Account\ManageUsers\ManageUsers.jsx" = "$NewRecruiterPath\pages\Account\Team\TeamManagementPage.jsx"
    "$OldDashboardPath\components\recruiter\Account\ManageUsers\ManageUsers.css" = "$NewRecruiterPath\pages\Account\Team\TeamManagementPage.css"
    
    "$OldDashboardPath\components\recruiter\Account\Inventory\Inventory.jsx" = "$NewRecruiterPath\pages\Account\Billing\BillingPage.jsx"
    "$OldDashboardPath\components\recruiter\Account\Inventory\Inventory.css" = "$NewRecruiterPath\pages\Account\Billing\BillingPage.css"
    
    # Company/Brand Components
    "$OldDashboardPath\components\recruiter\Brands\Brands.jsx" = "$NewRecruiterPath\pages\Company\CompanyProfilePage.jsx"
    "$OldDashboardPath\components\recruiter\Brands\Brands.css" = "$NewRecruiterPath\pages\Company\CompanyProfilePage.css"
    
    # Main Layout
    "$OldDashboardPath\layouts\RecruiterDashboardLayout.jsx" = "$NewRecruiterPath\components\layout\RecruiterLayout\RecruiterLayout.jsx"
    "$OldDashboardPath\layouts\DashboardLayout.css" = "$NewRecruiterPath\components\layout\RecruiterLayout\RecruiterLayout.css"
}

# Execute file migrations
foreach ($migration in $FileMigrations.GetEnumerator()) {
    $source = $migration.Key
    $destination = $migration.Value
    
    if (Test-Path $source) {
        # Create destination directory if it doesn't exist
        $destDir = Split-Path $destination -Parent
        if (!(Test-Path $destDir)) {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
        }
        
        # Move and rename file
        Move-Item -Path $source -Destination $destination -Force
        Write-Host "✅ Moved: $(Split-Path $source -Leaf) → $destination" -ForegroundColor Green
    } else {
        Write-Host " Source not found: $source" -ForegroundColor Red
    }
}

# ============================================
#  Create new template files
# ============================================

Write-Host "`n Creating new template files..." -ForegroundColor Yellow

# Create ActiveJobsPage template - Using @' '@ for proper here-string
$ActiveJobsPageContent = @'
import React from 'react';
import PageHeader from '../../../components/common/PageHeader/PageHeader';
import SearchSection from '../../../components/common/SearchSection/SearchSection';
import JobsList from '../../../components/jobs/JobsList/JobsList';
import './ActiveJobsPage.css';

const ActiveJobsPage = ({ onCreateJob }) => {
  return (
    <div className="active-jobs-page">
      <PageHeader 
        title="Active Jobs"
        showCreateButton={true}
        onCreateJob={onCreateJob}
        createButtonText="Create New Job"
      />
      
      <SearchSection 
        placeholder="Search active jobs..."
        sortOptions={[
          { value: 'updated_at', label: 'Recently Updated' },
          { value: 'created_at', label: 'Recently Created' },
          { value: 'title', label: 'Job Title (A-Z)' },
          { value: 'applications', label: 'Most Applications' }
        ]}
      />
      
      <JobsList 
        status="active"
        emptyMessage="No active jobs found"
        emptyDescription="Create your first job posting to get started"
        onCreateJob={onCreateJob}
      />
    </div>
  );
};

export default ActiveJobsPage;
'@

$ActiveJobsPageContent | Out-File -FilePath "$NewRecruiterPath\pages\Jobs\ActiveJobs\ActiveJobsPage.jsx" -Encoding UTF8
Write-Host "✅ Created: ActiveJobsPage.jsx" -ForegroundColor Green

# Create basic CSS for ActiveJobsPage
$ActiveJobsPageCSS = @'
.active-jobs-page {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.active-jobs-page .page-header {
  margin-bottom: 1.5rem;
}

.active-jobs-page .search-section {
  margin-bottom: 1.5rem;
}
'@

$ActiveJobsPageCSS | Out-File -FilePath "$NewRecruiterPath\pages\Jobs\ActiveJobs\ActiveJobsPage.css" -Encoding UTF8
Write-Host "✅ Created: ActiveJobsPage.css" -ForegroundColor Green

# Create other job pages
$JobPages = @('DraftJobs', 'ExpiredJobs', 'CreateJob')
foreach ($page in $JobPages) {
    $pageContent = @"
import React from 'react';
import PageHeader from '../../../components/common/PageHeader/PageHeader';
import './$($page)Page.css';

const $($page)Page = ({ onCreateJob }) => {
  return (
    <div className=`"$($page.ToLower())-page`">
      <PageHeader 
        title=`"$page`"
        showCreateButton={true}
        onCreateJob={onCreateJob}
      />
      
      <div className=`"page-content`">
        <p>$page page content goes here...</p>
      </div>
    </div>
  );
};

export default $($page)Page;
"@
    
    $pageContent | Out-File -FilePath "$NewRecruiterPath\pages\Jobs\$page\$($page)Page.jsx" -Encoding UTF8
    
    $pageCSS = @"
.$($page.ToLower())-page {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}
"@
    
    $pageCSS | Out-File -FilePath "$NewRecruiterPath\pages\Jobs\$page\$($page)Page.css" -Encoding UTF8
    Write-Host "✅ Created: $($page)Page.jsx" -ForegroundColor Green
}

# Create other pages
$OtherPages = @{
    'CandidatesPage' = 'Candidates'
    'CompanyProfilePage' = 'Company'
    'AnalyticsPage' = 'Analytics'
}

foreach ($pageInfo in $OtherPages.GetEnumerator()) {
    $fileName = $pageInfo.Key
    $folder = $pageInfo.Value
    
    $pageContent = @"
import React from 'react';
import PageHeader from '../../components/common/PageHeader/PageHeader';
import './$fileName.css';

const $fileName = () => {
  return (
    <div className=`"$($fileName.ToLower().Replace('page', ''))-page`">
      <PageHeader title=`"$folder`" />
      
      <div className=`"page-content`">
        <p>$folder page content goes here...</p>
      </div>
    </div>
  );
};

export default $fileName;
"@
    
    $pageContent | Out-File -FilePath "$NewRecruiterPath\pages\$folder\$fileName.jsx" -Encoding UTF8
    
    $pageCSS = @"
.$($fileName.ToLower().Replace('page', ''))-page {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}
"@
    
    $pageCSS | Out-File -FilePath "$NewRecruiterPath\pages\$folder\$fileName.css" -Encoding UTF8
    Write-Host "✅ Created: $fileName.jsx" -ForegroundColor Green
}

# ============================================
#  Create service files - Using proper here-string
# ============================================

Write-Host "`n Creating service files..." -ForegroundColor Yellow

$RecruiterServiceContent = @'
class RecruiterService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
  }

  // Job management methods
  async getJobs(status = 'active', filters = {}) {
    // Implementation here
    console.log(' RecruiterService: Getting jobs', { status, filters });
  }

  async createJob(jobData) {
    // Implementation here
    console.log(' RecruiterService: Creating job', jobData);
  }

  async updateJob(jobId, jobData) {
    // Implementation here
    console.log(' RecruiterService: Updating job', { jobId, jobData });
  }

  async deleteJob(jobId) {
    // Implementation here
    console.log(' RecruiterService: Deleting job', jobId);
  }

  // Candidate management methods
  async getCandidates(filters = {}) {
    // Implementation here
    console.log(' RecruiterService: Getting candidates', filters);
  }

  // Analytics methods
  async getAnalytics(dateRange = {}) {
    // Implementation here
    console.log(' RecruiterService: Getting analytics', dateRange);
  }
}

export const recruiterService = new RecruiterService();
export default recruiterService;
'@

$RecruiterServiceContent | Out-File -FilePath "$NewRecruiterPath\services\recruiterService.js" -Encoding UTF8
Write-Host "✅ Created: recruiterService.js" -ForegroundColor Green

# ============================================
#  Create hook files - Using proper here-string
# ============================================

Write-Host "`n Creating hook files..." -ForegroundColor Yellow

$UseRecruiterDataContent = @'
import { useState, useEffect } from 'react';
import { recruiterService } from '../services/recruiterService';

export const useRecruiterData = () => {
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadJobs = async (status = 'active', filters = {}) => {
    setLoading(true);
    try {
      const data = await recruiterService.getJobs(status, filters);
      setJobs(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCandidates = async (filters = {}) => {
    setLoading(true);
    try {
      const data = await recruiterService.getCandidates(filters);
      setCandidates(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async (dateRange = {}) => {
    setLoading(true);
    try {
      const data = await recruiterService.getAnalytics(dateRange);
      setAnalytics(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    jobs,
    candidates,
    analytics,
    loading,
    error,
    loadJobs,
    loadCandidates,
    loadAnalytics
  };
};
'@

$UseRecruiterDataContent | Out-File -FilePath "$NewRecruiterPath\hooks\useRecruiterData.js" -Encoding UTF8
Write-Host "✅ Created: useRecruiterData.js" -ForegroundColor Green

# ============================================
#  Cleanup empty directories
# ============================================

Write-Host "`n Cleaning up empty directories..." -ForegroundColor Yellow

$DirsToCheck = @(
    "$OldDashboardPath\components\recruiter\Account",
    "$OldDashboardPath\components\recruiter\Brands",
    "$OldDashboardPath\components\recruiter\Dropdowns",
    "$OldDashboardPath\components\recruiter",
    "$OldDashboardPath\components\shared",
    "$OldDashboardPath\components"
)

foreach ($dir in $DirsToCheck) {
    if (Test-Path $dir) {
        $items = Get-ChildItem $dir -Recurse
        if ($items.Count -eq 0) {
            Remove-Item $dir -Recurse -Force
            Write-Host " Removed empty directory: $dir" -ForegroundColor Gray
        }
    }
}

# ============================================
#  Generate migration report
# ============================================

Write-Host "`n Generating migration report..." -ForegroundColor Yellow

$ReportContent = @'
#  WorkHub Recruiter Migration Report
Generated: {0}

## ✅ Completed Actions:

###  New Folder Structure Created:
- features/recruiter/
  - components/layout/
  - components/common/
  - components/jobs/
  - components/account/
  - components/analytics/
  - components/candidates/
  - pages/Jobs/
  - pages/Account/
  - pages/Analytics/
  - pages/Candidates/
  - pages/Company/
  - services/
  - hooks/
  - routing/

###  Files Migrated:
- DashboardHeader → RecruiterHeader
- DashboardSidebar → RecruiterSidebar
- AccountDropdown → RecruiterAccountDropdown
- RecruiterDashboardLayout → RecruiterLayout
- Account components → Account pages
- Brands → CompanyProfilePage
- Shared components → Common components

###  New Files Created:
- ActiveJobsPage.jsx
- DraftJobsPage.jsx
- ExpiredJobsPage.jsx
- CreateJobPage.jsx
- CandidatesPage.jsx
- CompanyProfilePage.jsx
- AnalyticsPage.jsx
- recruiterService.js
- useRecruiterData.js

##  Next Steps:

1. Update import statements in existing files
2. Update route configurations
3. Test all functionality
4. Update component names in migrated files
5. Implement missing services and hooks

##  Manual Updates Required:

1. Update all import statements
2. Rename component names in migrated JSX files
3. Update CSS class names to match new component names
4. Test and fix any broken functionality
'@ -f (Get-Date)

$ReportContent | Out-File -FilePath "$ProjectRoot\..\migration-report.md" -Encoding UTF8

Write-Host "`n Migration completed successfully!" -ForegroundColor Green
Write-Host " Report saved to: migration-report.md" -ForegroundColor Cyan
Write-Host "`n Next steps:" -ForegroundColor Yellow
Write-Host "   1. Update import statements" -ForegroundColor White
Write-Host "   2. Rename component references" -ForegroundColor White
Write-Host "   3. Update route configurations" -ForegroundColor White
Write-Host "   4. Test functionality" -ForegroundColor White

# Pause to see results
Read-Host "`nPress Enter to exit"