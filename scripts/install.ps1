# Headless OTOBO install. Safe to run again: an existing installation is left in place.
# Agent login after a fresh install: root@localhost / root

$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")

if (-not (Test-Path .env)) {
    Copy-Item env.example .env
}

docker compose up -d db elastic prepare web

$deadline = (Get-Date).AddMinutes(4)
do {
    $status = docker inspect otobo-znuny-skin-web-1 --format "{{.State.Health.Status}}"
    if ($status -eq "healthy") { break }
    Start-Sleep -Seconds 5
} while ((Get-Date) -lt $deadline)
if ($status -ne "healthy") {
    Write-Error "web did not become healthy"
}

$installed = docker compose exec -T web bash -lc "test -f /opt/otobo/Kernel/Config/Files/ZZZAAuto.pm"
if ($LASTEXITCODE -ne 0) {
    $passwordLine = Get-Content .env | Where-Object { $_ -match '^OTOBO_DB_ROOT_PASSWORD=' } | Select-Object -First 1
    if (-not $passwordLine) {
        Write-Error "OTOBO_DB_ROOT_PASSWORD is missing from .env"
    }
    $dbPassword = $passwordLine.Substring("OTOBO_DB_ROOT_PASSWORD=".Length).Trim()
    docker compose exec -T -u otobo -w /opt/otobo web bash -lc "rm -f Kernel/Config/Files/ZZZAAuto.pm; bin/docker/quick_setup.pl --db-password '$dbPassword' --http-type http --http-port 8111 --fqdn 127.0.0.1"
    if ($LASTEXITCODE -ne 0) {
        Write-Error "quick_setup.pl failed"
    }
}

& (Join-Path $PSScriptRoot "register-skin.ps1")
docker compose up -d daemon
Write-Host "OTOBO is ready at http://127.0.0.1:8111/otobo/index.pl"
Write-Host "Agent: root@localhost / root"
