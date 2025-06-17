# Di chuyển files theo plan chuẩn
Write-Host "Starting clean migration..." -ForegroundColor Green

# 1. Tạo cấu trúc folders mới (nếu chưa có)
$foldersToCreate = @(
    "src/shared/components/ui",
    "src/shared/components/layout", 
    "src/shared/hooks/api",
    "src/shared/hooks/form",
    "src/shared/utils/helpers",
    "src/features/auth/components",
    "src/features/auth/pages",
    "src/features/auth/services",
    "src/features/jobs/components/shared",
    "src/features/jobs/components/create",
    "src/features/jobs/components/manage",
    "src/features/jobs/services",
    "src/features/jobs/utils",
    "src/features/dashboard/layouts",
    "src/features/dashboard/components/employer",
    "src/features/marketing/components",
    "src/features/marketing/pages",
    "src/features/common/components",
    "src/core/contexts",
    "src/core/routing"
)

foreach ($folder in $foldersToCreate) {
    if (!(Test-Path $folder)) {
        New-Item -Path $folder -ItemType Directory -Force
        Write-Host "Created: $folder" -ForegroundColor Green
    } else {
        Write-Host "Exists: $folder" -ForegroundColor Yellow
    }
}