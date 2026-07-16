$env:DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/emotion_library"
$env:NODE_ENV = "development"
$env:PORT = "3000"

cd "C:\Users\AmolLondhe\Desktop\Soulconnect\frontend\backend"

Write-Host ""
Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║   SOULCONNECT BACKEND SERVER START   ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "Port: 3000" -ForegroundColor Yellow
Write-Host "Database: emotion_library (postgres:postgres)" -ForegroundColor Yellow
Write-Host ""

npm run dev
