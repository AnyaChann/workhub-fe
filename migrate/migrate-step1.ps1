# Kiểm tra structure hiện tại
Write-Host "=== CURRENT STRUCTURE ===" -ForegroundColor Green
tree src /F /A

# Hoặc check từng folder quan trọng
Write-Host "`n=== CHECKING KEY FOLDERS ===" -ForegroundColor Yellow
Get-ChildItem -Path "src" -Directory | Select-Object Name
Get-ChildItem -Path "src/features" -Directory -ErrorAction SilentlyContinue | Select-Object Name
Get-ChildItem -Path "src/hooks" -File -ErrorAction SilentlyContinue | Select-Object Name
Get-ChildItem -Path "src/pages" -Directory -ErrorAction SilentlyContinue | Select-Object Name