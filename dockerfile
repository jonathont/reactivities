    FROM mcr.microsoft.com/dotnet/runtime-deps:6.0-alpine-amd64

    EXPOSE 8080

    RUN mkdir /app
    WORKDIR /app
    COPY ./linux64_musl/. ./

    ENV ASPNETCORE_ENVIRONMENT Production
    RUN chmod +x ./API
    CMD ["./API"]