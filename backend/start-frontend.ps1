cd "C:\Users\AmolLondhe\Desktop\Soulconnect\frontend"
$env:VITE_API_URL = "http://localhost:3000/api"
$env:VITE_LAUNCH_READY = "true"

Write-Host "Frontend starting on port 5173..." -ForegroundColor Green
Write-Host "API URL: $($env:VITE_API_URL)" -ForegroundColor Yellow

npm run dev
