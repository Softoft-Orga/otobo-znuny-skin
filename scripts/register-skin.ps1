# After the web installer has created Kernel/Config.pm.
# Rebuilds SysConfig so SkinLab.xml is active, selects skin "lab",
# and loads each CSS file on its own so a refresh shows the edit.

$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")

docker compose exec -T web bash -lc "test -f /opt/otobo/Kernel/Config.pm"
if ($LASTEXITCODE -ne 0) {
    Write-Error "OTOBO is not installed yet. Open http://127.0.0.1:8111/otobo/installer.pl first. Database host is db."
}

function Invoke-Otobo([string[]]$ConsoleArgs) {
    docker compose exec -T -u otobo -w /opt/otobo web ./bin/otobo.Console.pl @ConsoleArgs
    if ($LASTEXITCODE -ne 0) {
        Write-Error "otobo.Console.pl failed: $($ConsoleArgs -join ' ')"
    }
}

Invoke-Otobo @("Maint::Config::Rebuild")
Invoke-Otobo @("Admin::Config::Update", "--setting-name", "Loader::Agent::DefaultSelectedSkin", "--value", "lab")
Invoke-Otobo @("Admin::Config::Update", "--setting-name", "Loader::Enabled::CSS", "--value", "0")
Invoke-Otobo @("Maint::Cache::Delete")

Write-Host "Skin lab is the agent default. CSS files load individually."
