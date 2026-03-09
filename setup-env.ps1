# Setup script for AI Agent Evaluator
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "AI Agent Evaluator - Environment Setup" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

$envFile = ".env"

if (Test-Path $envFile) {
    Write-Host "Warning: .env file already exists!" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (y/n)"
    if ($overwrite -ne "y") {
        Write-Host "Setup cancelled." -ForegroundColor Red
        exit
    }
}

Write-Host "Please enter your API keys:" -ForegroundColor Green
Write-Host ""

$openaiKey = Read-Host "Enter your OpenAI API Key"
$anthropicKey = Read-Host "Enter your Anthropic API Key"

$envContent = @"
OPENAI_API_KEY=$openaiKey
ANTHROPIC_API_KEY=$anthropicKey
PORT=3000
"@

$envContent | Out-File -FilePath $envFile -Encoding utf8

Write-Host ""
Write-Host "✓ .env file created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "You can now start the server with: npm start" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
