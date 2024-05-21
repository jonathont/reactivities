 dotnet publish -r linux-musl-x64 --output "..\linux64_musl" --self-contained true -p:PublishSingleFile=true 
 
 
 Note: Migrations/EF does not seem to like: -p:PublishTrimmed=true