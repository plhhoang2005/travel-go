@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script
@REM ----------------------------------------------------------------------------

@IF "%HOME%" == "" (set "HOME=%HOMEDRIVE%%HOMEPATH%")

@set ERROR_CODE=0

@set MAVEN_PROJECTBASEDIR=%MAVEN_BASEDIR%
@IF "%MAVEN_PROJECTBASEDIR%"== "" set MAVEN_PROJECTBASEDIR=%CD%

@set MAVEN_CONFIG=%MAVEN_PROJECTBASEDIR%\.mvn

@set WRAPPER_JAR="%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"
@set WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain

@IF EXIST %WRAPPER_JAR% goto run

@echo Downloading Maven Wrapper...
@powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object Net.WebClient).DownloadFile('https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar', '%WRAPPER_JAR%')"

:run
@java -classpath %WRAPPER_JAR% "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" %WRAPPER_LAUNCHER% %*

@if ERRORLEVEL 1 set ERROR_CODE=1

@exit /B %ERROR_CODE%
