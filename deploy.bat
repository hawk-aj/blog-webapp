@echo off
REM Portfolio Docker Deployment Script for Windows
REM This script helps build and deploy the portfolio application using Docker

setlocal enabledelayedexpansion

REM Function to print colored output (Windows doesn't support colors in batch easily, so using plain text)
:print_status
echo [INFO] %~1
goto :eof

:print_success
echo [SUCCESS] %~1
goto :eof

:print_warning
echo [WARNING] %~1
goto :eof

:print_error
echo [ERROR] %~1
goto :eof

REM Function to check if Docker is installed and running
:check_docker
call :print_status "Checking Docker installation..."

docker --version >nul 2>&1
if errorlevel 1 (
    call :print_error "Docker is not installed. Please install Docker Desktop first."
    exit /b 1
)

docker info >nul 2>&1
if errorlevel 1 (
    call :print_error "Docker is not running. Please start Docker Desktop first."
    exit /b 1
)

call :print_success "Docker is installed and running"
goto :eof

REM Function to check if Docker Compose is installed
:check_docker_compose
call :print_status "Checking Docker Compose installation..."

docker-compose --version >nul 2>&1
if errorlevel 1 (
    call :print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit /b 1
)

call :print_success "Docker Compose is installed"
goto :eof

REM Function to build the application
:build_app
call :print_status "Building Docker containers..."

REM Build frontend if it has a proper React app structure
if exist "frontend\package.json" (
    call :print_status "Building React frontend..."
    cd frontend
    if not exist "node_modules" (
        call :print_status "Installing npm dependencies..."
        npm install
        if errorlevel 1 (
            call :print_error "Failed to install npm dependencies"
            cd ..
            exit /b 1
        )
    )
    call :print_status "Building React app..."
    npm run build
    if errorlevel 1 (
        call :print_error "Failed to build React app"
        cd ..
        exit /b 1
    )
    cd ..
) else (
    call :print_warning "Frontend package.json not found, using static build"
)

REM Build Docker containers
docker-compose build --no-cache
if errorlevel 1 (
    call :print_error "Failed to build Docker containers"
    exit /b 1
)

call :print_success "Docker containers built successfully"
goto :eof

REM Function to start the application
:start_app
call :print_status "Starting Docker containers..."

docker-compose up -d
if errorlevel 1 (
    call :print_error "Failed to start Docker containers"
    exit /b 1
)

call :print_success "Application started successfully"

REM Wait a moment for containers to start
timeout /t 5 /nobreak >nul

REM Check container status
call :print_status "Container status:"
docker-compose ps

call :print_success "Application is running!"
echo.
echo Access your application at:
echo   Frontend: http://localhost
echo   Backend API: http://localhost:5000
echo   Jupyter Notebook: http://localhost:8888
goto :eof

REM Function to stop the application
:stop_app
call :print_status "Stopping Docker containers..."

docker-compose down
if errorlevel 1 (
    call :print_error "Failed to stop Docker containers"
    exit /b 1
)

call :print_success "Application stopped successfully"
goto :eof

REM Function to restart the application
:restart_app
call :print_status "Restarting application..."

call :stop_app
if errorlevel 1 exit /b 1

call :start_app
if errorlevel 1 exit /b 1
goto :eof

REM Function to view logs
:view_logs
call :print_status "Viewing application logs..."

if "%~2"=="" (
    docker-compose logs -f
) else (
    docker-compose logs -f %2
)
goto :eof

REM Function to clean up Docker resources
:cleanup
call :print_status "Cleaning up Docker resources..."

docker-compose down -v --remove-orphans
docker system prune -f

call :print_success "Cleanup completed"
goto :eof

REM Function to show help
:show_help
echo Portfolio Docker Deployment Script for Windows
echo.
echo Usage: %~nx0 [COMMAND]
echo.
echo Commands:
echo   build     Build Docker containers
echo   start     Start the application
echo   stop      Stop the application
echo   restart   Restart the application
echo   logs      View application logs
echo   status    Show container status
echo   cleanup   Clean up Docker resources
echo   deploy    Build and start (full deployment)
echo   help      Show this help message
echo.
echo Examples:
echo   %~nx0 deploy          # Build and start the application
echo   %~nx0 logs backend    # View backend container logs
echo   %~nx0 restart         # Restart all containers
goto :eof

REM Function to show container status
:show_status
call :print_status "Container status:"
docker-compose ps

call :print_status "Docker system info:"
docker system df
goto :eof

REM Function to perform full deployment
:full_deploy
call :print_status "Starting full deployment..."

call :check_docker
if errorlevel 1 exit /b 1

call :check_docker_compose
if errorlevel 1 exit /b 1

call :build_app
if errorlevel 1 exit /b 1

call :start_app
if errorlevel 1 exit /b 1

call :print_success "Full deployment completed!"
goto :eof

REM Main script logic
if "%1"=="build" (
    call :check_docker
    if errorlevel 1 exit /b 1
    call :check_docker_compose
    if errorlevel 1 exit /b 1
    call :build_app
) else if "%1"=="start" (
    call :check_docker
    if errorlevel 1 exit /b 1
    call :check_docker_compose
    if errorlevel 1 exit /b 1
    call :start_app
) else if "%1"=="stop" (
    call :stop_app
) else if "%1"=="restart" (
    call :restart_app
) else if "%1"=="logs" (
    call :view_logs %1 %2
) else if "%1"=="status" (
    call :show_status
) else if "%1"=="cleanup" (
    call :cleanup
) else if "%1"=="deploy" (
    call :full_deploy
) else if "%1"=="help" (
    call :show_help
) else if "%1"=="--help" (
    call :show_help
) else if "%1"=="-h" (
    call :show_help
) else if "%1"=="" (
    call :print_warning "No command specified. Use 'help' to see available commands."
    call :show_help
) else (
    call :print_error "Unknown command: %1"
    call :show_help
    exit /b 1
)

endlocal
