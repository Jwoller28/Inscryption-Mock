@echo off
REM Run script for Inscryption Roguelike
REM Executes the compiled game

set JAVAFX_PATH=C:\Program Files\javafx-sdk-21.0.7\lib
set CLASSPATH=bin

echo Launching Inscryption...
java --module-path "%JAVAFX_PATH%" --add-modules javafx.controls,javafx.fxml -cp "%CLASSPATH%" game.Main
