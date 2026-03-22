param(
    [Parameter(Mandatory = $true)]
    [string]$Message
)

$ErrorActionPreference = "Stop"

$repoRoot = git rev-parse --show-toplevel
if (-not $repoRoot) {
    throw "Not inside a git repository."
}

Set-Location $repoRoot

$status = git status --porcelain
if (-not $status) {
    Write-Host "Nothing to commit."
    exit 0
}

git add -A
git commit -m $Message

$branch = git branch --show-current
if (-not $branch) {
    throw "Could not determine current branch."
}

$upstream = git rev-parse --abbrev-ref --symbolic-full-name "@{u}" 2>$null
if ($LASTEXITCODE -eq 0 -and $upstream) {
    git push
} else {
    git push -u origin $branch
}
