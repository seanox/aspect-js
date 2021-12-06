@echo off

rem Seanox Devwex is started from working directory ./devwex/program.
rem Here, following variables are used:
rem
rem   CLASSPATH     path of java resources
rem
rem   JAVAPATH      path of java runtime environment
rem
rem   LIBRARIESPATH semicolon separate paths, from which the server invites
rem                 startup modules
rem
rem   OPTIONS       spaces separated arguments for the java virtual machin,
rem                 in format -Dname=value;...
rem
rem   SYSTEMDRIVE   standard variable SYSTEMDRIVE of Windows, this is used of
rem                 some CGI application to find systems components
rem
rem   SYSTEMPATH    based on standard variable PATH of Windows, this is used of
rem                 some CGI application to find systems components
rem
rem   SYSTEMROOT    standard variable SYSTEMROOT of Windows, this is used of
rem                 some CGI application to find systems components
rem
rem With startup all batch scripts are loaded from path ../runtime/scripts.
rem Please note, that scripts to extend of runtime environment are relative to
rem working directory.

cls

set CLASSPATH=
set JAVAPATH=
set LIBRARIESPATH=
set OPTIONS=
set SYSTEMPATH=%PATH%

for %%f in (../runtime/scripts/*.bat ../runtime/scripts/*.cmd) do call ../runtime/scripts/%%f

set OPTIONS=%OPTIONS% -Dpath="%SYSTEMPATH%;"
set OPTIONS=%OPTIONS% -Dsystemdrive=%SYSTEMDRIVE%
set OPTIONS=%OPTIONS% -Dsystemroot="%SYSTEMROOT%"
set OPTIONS=%OPTIONS% -Dlibraries="..\libraries;%LIBRARIESPATH%;"

%JAVAPATH%java -cp "devwex.jar;%CLASSPATH%" %OPTIONS% com.seanox.devwex.Service %1
