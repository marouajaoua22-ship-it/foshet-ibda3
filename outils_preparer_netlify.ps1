# Deplace les fichiers lourds hors du site (rien n'est supprime), puis verifie.
$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$dst = Join-Path (Split-Path -Parent $PSScriptRoot) 'medias_hors_site'
New-Item -ItemType Directory -Force -Path $dst | Out-Null

if (Test-Path -LiteralPath 'media') {
  Get-ChildItem -LiteralPath 'media' -Force | Where-Object { $_.Name -notin @('web', 'docs') } | ForEach-Object {
    $target = Join-Path $dst $_.Name
    if (Test-Path -LiteralPath $target) { $target = Join-Path $dst ($_.BaseName + '_' + (Get-Date -Format 'HHmmss') + $_.Extension) }
    Move-Item -LiteralPath $_.FullName -Destination $target
    Write-Host ('  deplace : media\' + $_.Name)
  }
}

$all = Get-ChildItem -Recurse -File -Force
$heavy = $all | Where-Object { $_.Length -gt 10MB -or $_.Extension -in @('.mp4', '.mov', '.m4v', '.mp3', '.wav', '.pptx') }
$total = ($all | Measure-Object Length -Sum).Sum / 1MB
Write-Host ''
if ($heavy) {
  Write-Host 'ATTENTION, fichiers encore lourds dans le site :' -ForegroundColor Red
  $heavy | ForEach-Object { Write-Host ('  ' + $_.FullName + '  ' + [math]::Round($_.Length / 1MB, 1) + ' Mo') }
} else {
  Write-Host ('OK : aucun fichier lourd. ' + $all.Count + ' fichiers, ' + [math]::Round($total, 1) + ' Mo au total.') -ForegroundColor Green
  Write-Host 'Glissez maintenant le dossier hub_pedagogique sur https://app.netlify.com/drop'
}
Write-Host ('Fichiers deplaces vers : ' + $dst)
