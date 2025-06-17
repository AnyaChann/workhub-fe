# === VERIFICATION ===
Write-Host "`n=== VERIFICATION: Final Structure ===" -ForegroundColor Cyan

function Show-FolderStructure {
    param($Path, $Indent = "")

    if (Test-Path $Path) {
        try {
            $items = Get-ChildItem $Path | Sort-Object Name
            foreach ($item in $items) {
                if ($item.PSIsContainer) {
                    Write-Host "$Indent[DIR]  $($item.Name)/" -ForegroundColor Yellow
                    if ($item.Name -notmatch '(node_modules|\.git|\.next|dist|build)') {
                        Show-FolderStructure -Path $item.FullName -Indent ("$Indent  ")
                    }
                } else {
                    $color = switch ($item.Extension.ToLower()) {
                        ".js"   { "Green" }
                        ".jsx"  { "Green" }
                        ".ts"   { "Green" }
                        ".tsx"  { "Green" }
                        ".css"  { "Blue" }
                        ".scss" { "Blue" }
                        ".json" { "Cyan" }
                        default { "White" }
                    }
                    Write-Host "$Indent[FILE] $($item.Name)" -ForegroundColor $color
                }
            }
        } catch {
            Write-Warning "❌ Failed to list contents of $Path. $_"
        }
    } else {
        Write-Warning "❌ Path '$Path' not found."
    }
}

Show-FolderStructure -Path "src"

Write-Host "`n=== FILE COUNTS ===" -ForegroundColor Cyan

$features = @("auth", "jobs", "dashboard", "marketing", "common")

foreach ($feature in $features) {
    $path = "src/features/$feature"
    if (Test-Path $path) {
        try {
            $count = (Get-ChildItem -Path $path -Recurse -File | Measure-Object).Count
            Write-Host "  $feature : $count files" -ForegroundColor Green
        } catch {
            Write-Warning "❌ Failed to count files in $path. $_"
        }
    } else {
        Write-Warning "❌ $feature folder not found at $path"
    }
}

if (Test-Path "src/shared") {
    try {
        $sharedCount = (Get-ChildItem -Path "src/shared" -Recurse -File | Measure-Object).Count
        Write-Host "  shared  : $sharedCount files" -ForegroundColor Green
    } catch {
        Write-Warning "❌ Failed to count files in src/shared. $_"
    }
} else {
    Write-Warning "❌ src/shared folder not found."
}

if (Test-Path "src/core") {
    try {
        $coreCount = (Get-ChildItem -Path "src/core" -Recurse -File | Measure-Object).Count
        Write-Host "  core    : $coreCount files" -ForegroundColor Green
    } catch {
        Write-Warning "❌ Failed to count files in src/core. $_"
    }
} else {
    Write-Warning "❌ src/core folder not found."
}
