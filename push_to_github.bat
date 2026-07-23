@echo off
:: ============================================================
:: ListMate — Push all changes to GitHub
:: Double-click this file to run, OR drag it into Git Bash.
::
:: FIRST TIME: Make sure you have a repo on GitHub first.
:: Create one at: https://github.com/new
:: Suggested name: listmate   (or lookntook)
::
:: Then edit the REPO variable on the next line:
set REPO=listmate
:: ============================================================

set GITHUB_USER=awais259
set REMOTE=https://github.com/%GITHUB_USER%/%REPO%.git
set COMMIT_MSG=feat: legal compliance updates (trading identity, consent, transfers) + subscription portal

echo.
echo  ListMate ^> GitHub Push Script
echo  Remote: %REMOTE%
echo.

cd /d "%~dp0"

:: Init git if not already done
if not exist ".git" (
    echo [1/5] Initialising git repo...
    git init -b main
) else (
    echo [1/5] Git repo already initialised.
)

:: Set or update remote
git remote get-url origin >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [2/5] Adding remote origin...
    git remote add origin %REMOTE%
) else (
    echo [2/5] Updating remote origin...
    git remote set-url origin %REMOTE%
)

:: Stage everything (respects .gitignore — no node_modules, no .env)
echo [3/5] Staging all files...
git add -A

:: Commit
echo [4/5] Committing...
git commit -m "%COMMIT_MSG%" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo      Nothing new to commit, or commit failed.
)

:: Push
echo [5/5] Pushing to GitHub...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo  All done! Visit https://github.com/%GITHUB_USER%/%REPO%
) else (
    echo.
    echo  Push failed. Common fixes:
    echo    - Create the repo first at https://github.com/new
    echo    - Make sure the REPO name in this file matches your GitHub repo name
    echo    - If the remote branch is 'master' not 'main', run:
    echo        git push -u origin master
)

echo.
pause
