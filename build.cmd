@echo off
setlocal

if "%1"=="" goto :help

if "%1"=="install" goto :install
if "%1"=="dev" goto :dev
if "%1"=="build" goto :build
if "%1"=="start" goto :start
if "%1"=="lint" goto :lint
if "%1"=="test" goto :test
if "%1"=="webpack" goto :webpack
goto :help

:install
cd app && npm install
goto :eof

:dev
cd app && npm run dev
goto :eof

:build
cd app && npm run build
goto :eof

:start
cd app && npm run start
goto :eof

:lint
cd app && npm run lint
goto :eof

:test
cd app && npm run test
goto :eof

:webpack
cd app && npm run webpack:build
goto :eof

:help
echo Usage: build [command]
echo.
echo Commands:
echo   install    - Install dependencies for the app
echo   dev        - Start development server
echo   build      - Build the Next.js application
echo   start      - Start the production server
echo   lint       - Run the linter
echo   test       - Run tests
echo   webpack    - Build using webpack
echo. 