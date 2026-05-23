@echo off
ssh-keygen -t ed25519 -C "deploy@kuberproperty" -f kuberproperty_deploy -q
echo Deploy key generated successfully!
echo.
echo Public key (kuberproperty_deploy.pub) - Add this to GitHub:
type kuberproperty_deploy.pub
echo.
echo Private key (kuberproperty_deploy) - Keep this secure!
pause
