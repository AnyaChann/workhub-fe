# ====================================
#   WorkHub Frontend Migration Script
# ====================================
# Script: migrate-files.ps1
# Purpose: Automate migration to modular folder structure
# Author: To Xuan Bach (Bach CT - Anya Chann)
# Date: 2025-06-16
# GitHub: https://github.com/AnyaChann/workhub-fe.git
# AI Support: Claude Sonnet 4 + others
#
# How to run (PowerShell):
# powershell -ExecutionPolicy Bypass -File migrate-files.ps1
# ====================================

Write-Host "`n  WorkHub Frontend Migration Script" -ForegroundColor Magenta
Write-Host "======================================" -ForegroundColor Magenta

# Change to project directory
Set-Location "D:\Semester4\workHub\workhub-fe"  # Adjust path as needed

# Run each migration step
$steps = @(
    "migrate-step1.ps1",  # Create folders
    "migrate-step2.ps1",  # Move shared
    "migrate-step3.ps1",  # Move features
    "migrate-step4.ps1",  # Verification
    "migrate-step5.ps1"   # Check missing files
)

foreach ($step in $steps) {
    $path = ".\migrate\$step"
    if (Test-Path $path) {
        Write-Host "`n▶ Running $step..." -ForegroundColor Cyan
        try {
            . $path
        } catch {
            # Write-Warning " Error while executing $step: $($_.Exception.Message)"
            Write-Host " Please check the script and try again." -ForegroundColor Yellow
        }
    } else {
        Write-Warning "  Missing: $step not found at $path"
    }
}

Write-Host "`n Migration completed!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Update import paths in files" -ForegroundColor White
Write-Host "  2. Create index.js barrel exports" -ForegroundColor White  
Write-Host "  3. Update jsconfig.json for absolute imports" -ForegroundColor White
Write-Host "  4. Test the application" -ForegroundColor White

# Final migration phase
$finalStep = ".\migrate\migrate-step6.ps1"
Write-Host "`n Running final migration step..." -ForegroundColor Cyan

if (Test-Path $finalStep) {
    try {
        . $finalStep
        Write-Host "`n All phases completed successfully!" -ForegroundColor Green
        Write-Host "You can now run: npm start" -ForegroundColor Cyan
    } catch {
        Write-Host "`n Error during final step: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Check the script and try again." -ForegroundColor Yellow
    }
} else {
    Write-Warning "  Final script migrate-step6.ps1 not found!"
}

