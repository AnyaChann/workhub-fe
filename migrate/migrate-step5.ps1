# Nếu có files bị thất lạc, script này sẽ tìm và di chuyển
Write-Host "`n=== RESCUE LOST FILES ===" -ForegroundColor Red

# Tìm files JavaScript/JSX bị thất lạc
$lostFiles = Get-ChildItem "src" -Recurse -File -Include "*.js", "*.jsx" | Where-Object {
    $_.FullName -notmatch "(features|shared|core|assets)" -and
    $_.FullName -notmatch "(App\.|index\.|reportWebVitals)"
}

if ($lostFiles) {
    Write-Host "Found lost files:" -ForegroundColor Yellow
    foreach ($file in $lostFiles) {
        Write-Host "  📄 $($file.FullName)" -ForegroundColor Red
        
        # Auto-categorize based on file name/path
        $destination = switch -Regex ($file.Name) {
            "(auth|login|register)" { "src/features/auth/components/" }
            "(job|Job)" { "src/features/jobs/components/shared/" }
            "(dashboard|Dashboard)" { "src/features/dashboard/components/" }
            "(home|pricing|hero|companies)" { "src/features/marketing/components/" }
            default { "src/shared/components/" }
        }
        
        Write-Host "    → Suggest moving to: $destination" -ForegroundColor Green
    }
}