# Compress
For compression, [UglifyJS](https://github.com/mishoo/UglifyJS) is used.

The sources for the tool are managed directly in the project, since it is used
essentially and the version used is a fixed component of the own tests. The
tool can be updated at any time.


# Usage
Initially or for an update, the sources must be synchronized with GitHub repository.  
For this purpose, only the required data is fetched into the project.
For the build process, this step can be skipped.

```BATCH
IF EXIST .\temp rd /S /Q .\temp
git clone https://github.com/mishoo/UglifyJS.git .\temp

IF EXIST .\bin RD /S /Q .\bin
xcopy .\temp\bin .\bin\ /S /E /Y
IF EXIST .\lib RD /S /Q .\lib
xcopy .\temp\lib .\lib\ /S /E /Y
IF EXIST .\tools rd /S /Q .\tools
xcopy .\temp\tools .\tools\ /S /E /Y
IF EXIST .\LICENSE del /S /Q .\LICENSE
copy /Y .\temp\LICENSE .\LICENSE
IF EXIST .\package.json del /S /Q .\package.json
copy /Y .\temp\package.json .\package.json

rd /S /Q .\temp
```

For build process, UglifyJS is temporarily linked, used and then uninstalled.  
The following call is an example and is included in the build script.

```BATCH
npm link .
uglifyjs ..\releases\aspect-js.js -c -m -o ..\releases\aspect-js-min.js
npm uninstall -g uglify-js
```
