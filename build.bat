@echo off
setlocal EnableExtensions EnableDelayedExpansion

REM Build script for Inscryption Roguelike
REM Compiles the Java source code with JavaFX modules

set "JAVAFX_PATH=C:\Program Files\javafx-sdk-21.0.7\lib"
set "SOURCE_DIR=src\game"
set "OUTPUT_DIR=bin"

if not exist "%OUTPUT_DIR%" mkdir "%OUTPUT_DIR%"

set "SOURCES="
for %%F in ("%SOURCE_DIR%\*.java") do (
    if exist "%%~fF" set "SOURCES=!SOURCES! "%%~fF""
)

if not defined SOURCES (
    echo No Java source files found in %SOURCE_DIR%.
    exit /b 1
)

echo Compiling Inscryption game...
javac --module-path "%JAVAFX_PATH%" --add-modules javafx.controls,javafx.fxml -d "%OUTPUT_DIR%" !SOURCES!

if %ERRORLEVEL% EQU 0 (
    echo Compilation successful!
) else (
    echo Compilation failed!
    exit /b 1
)
