# PowerShell script to clear all Expo caches
Write-Host "🧹 Clearing Expo and Metro caches..." -ForegroundColor Cyan

# Clear Metro bundler cache
if (Test-Path "node_modules\.cache") {
    Write-Host "Removing node_modules\.cache..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "node_modules\.cache"
}

# Clear Expo cache
if (Test-Path "$env:LOCALAPPDATA\Expo") {
    Write-Host "Removing Expo cache..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "$env:LOCALAPPDATA\Expo" -ErrorAction SilentlyContinue
}

# Clear temp folders
if (Test-Path ".expo") {
    Write-Host "Removing .expo folder..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force ".expo" -ErrorAction SilentlyContinue
}

Write-Host "✅ Cache cleared! Now run: npm run web:clear" -ForegroundColor Green
Write-Host "⚠️  Also clear your browser cache (Ctrl+Shift+Delete)" -ForegroundColor Yellow
