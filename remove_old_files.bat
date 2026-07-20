@echo off
cd /d "%~dp0"
echo Removing unrelated files from git...
git rm "ebay-product-listing.html"
git rm "london-stock-market-report.html"
echo Committing...
git commit -m "chore: remove unrelated test files"
echo Pushing...
git push
echo.
echo Done! Check https://github.com/awais259/Listmate
pause
