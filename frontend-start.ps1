$env:VITE_API_URL = "http://localhost:3000/api"
$env:VITE_LAUNCH_READY = "true"

cd "C:\Users\AmolLondhe\Desktop\Soulconnect\frontend"
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "SOULCONNECT FRONTEND" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Starting on port 5173..." -ForegroundColor Yellow
Write-Host "API URL: http://localhost:3000/api" -ForegroundColor Yellow
Write-Host ""

npm run dev
