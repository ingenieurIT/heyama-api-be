# Heyama API Backend Setup Script for Windows

Write-Host "Starting Heyama API Backend Setup..." -ForegroundColor Green

# Start Docker containers
Write-Host "Starting MongoDB and MinIO..." -ForegroundColor Yellow
docker-compose up -d

# Wait for services to be ready
Write-Host "Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

# Build the application
Write-Host "Building application..." -ForegroundColor Yellow
npm run build

Write-Host ""
Write-Host "Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Services running:" -ForegroundColor Cyan
Write-Host "  - MongoDB: mongodb://localhost:27017"
Write-Host "  - MinIO Console: http://localhost:9001"
Write-Host "  - MinIO API: http://localhost:9000"
Write-Host ""
Write-Host "To start the API server, run:" -ForegroundColor Cyan
Write-Host "  npm run start:dev"
Write-Host ""
