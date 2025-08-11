@echo off
setlocal enabledelayedexpansion

echo ===================================================
echo Aarya Jha Portfolio Website - Ubuntu Cleanup Tool
echo ===================================================
echo.

REM Check if AWS CLI is installed
where aws >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ERROR: AWS CLI is not installed or not in PATH.
    echo Please install AWS CLI from https://aws.amazon.com/cli/
    goto :EOF
)

REM Check if AWS CLI is configured
aws sts get-caller-identity >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ERROR: AWS CLI is not configured properly.
    echo Please run 'aws configure' to set up your credentials.
    goto :EOF
)

REM Get stack name from user
set /p STACK_NAME="Enter stack name to delete [aarya-portfolio-ubuntu]: "
if "!STACK_NAME!"=="" set STACK_NAME=aarya-portfolio-ubuntu

REM Check if stack exists
aws cloudformation describe-stacks --stack-name !STACK_NAME! --region ap-south-1 >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo.
    echo ERROR: Stack '!STACK_NAME!' does not exist or you don't have permission to access it.
    goto :EOF
)

echo.
echo WARNING: This will delete the CloudFormation stack '!STACK_NAME!' and all associated resources.
echo          This action cannot be undone. Make sure to back up any important data first.
echo.

set /p CONFIRM="Are you sure you want to delete the stack? (y/n): "
if /i "!CONFIRM!" neq "y" goto :EOF

echo.
echo Deleting CloudFormation stack '!STACK_NAME!'...
echo.

aws cloudformation delete-stack --stack-name !STACK_NAME! --region ap-south-1

if %ERRORLEVEL% neq 0 (
    echo.
    echo ERROR: Failed to delete CloudFormation stack.
    goto :EOF
)

echo.
echo Stack deletion initiated successfully.
echo.
echo To monitor the stack deletion progress, go to:
echo https://ap-south-1.console.aws.amazon.com/cloudformation/home?region=ap-south-1#/stacks
echo.

REM Wait for stack deletion to complete
set /p WAIT="Do you want to wait for stack deletion to complete? (y/n): "
if /i "!WAIT!" neq "y" goto :EOF

echo.
echo Waiting for stack deletion to complete...
echo This may take 5-10 minutes...
echo.

:wait_loop
aws cloudformation describe-stacks --stack-name !STACK_NAME! --region ap-south-1 --query "Stacks[0].StackStatus" --output text > temp.txt 2>nul
if %ERRORLEVEL% neq 0 (
    echo.
    echo Stack deletion completed successfully!
    del temp.txt 2>nul
    goto :EOF
)

set /p STACK_STATUS=<temp.txt
del temp.txt

if "!STACK_STATUS!"=="DELETE_IN_PROGRESS" (
    echo Stack status: !STACK_STATUS!
    timeout /t 30 /nobreak >nul
    goto :wait_loop
)

echo.
echo Stack deletion failed or was rolled back.
echo Status: !STACK_STATUS!
echo Please check the AWS CloudFormation console for details.

endlocal
