# Generate SSH deploy key for GitHub
ssh-keygen -t ed25519 -C "deploy@kuberproperty" -f kuberproperty_deploy -q
Write-Host "Deploy key generated successfully!"
Write-Host "Public key (kuberproperty_deploy.pub) - Add this to GitHub:"
Get-Content kuberproperty_deploy.pub
Write-Host "Private key (kuberproperty_deploy) - Keep this secure!"
