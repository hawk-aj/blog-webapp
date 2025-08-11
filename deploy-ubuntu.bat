@echo off
setlocal enabledelayedexpansion

echo ===================================================
echo Aarya Jha Portfolio Website - Ubuntu Deployment Tool
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

REM Get parameters from user
set /p STACK_NAME="Enter stack name [aarya-portfolio-ubuntu]: "
if "!STACK_NAME!"=="" set STACK_NAME=aarya-portfolio-ubuntu

set /p KEY_NAME="Enter your EC2 key pair name: "
if "!KEY_NAME!"=="" (
    echo ERROR: EC2 key pair name is required.
    goto :EOF
)

set /p IP_ADDRESS="Enter your IP address for SSH access [0.0.0.0/0]: "
if "!IP_ADDRESS!"=="" set IP_ADDRESS=0.0.0.0/0

set /p DOMAIN_NAME="Enter domain name [aaryajha.com]: "
if "!DOMAIN_NAME!"=="" set DOMAIN_NAME=aaryajha.com

set /p INSTANCE_TYPE="Enter instance type [t3.small]: "
if "!INSTANCE_TYPE!"=="" set INSTANCE_TYPE=t3.small

echo.
echo Deployment Parameters:
echo - Stack Name: !STACK_NAME!
echo - EC2 Key Pair: !KEY_NAME!
echo - SSH Access From: !IP_ADDRESS!
echo - Domain Name: !DOMAIN_NAME!
echo - Instance Type: !INSTANCE_TYPE!
echo.

set /p CONFIRM="Do you want to proceed with deployment? (y/n): "
if /i "!CONFIRM!" neq "y" goto :EOF

echo.
echo Creating CloudFormation stack...
echo.

aws cloudformation create-stack ^
  --stack-name !STACK_NAME! ^
  --template-body file://cloudformation-ubuntu.yaml ^
  --parameters ^
    ParameterKey=KeyName,ParameterValue=!KEY_NAME! ^
    ParameterKey=SSHLocation,ParameterValue=!IP_ADDRESS! ^
    ParameterKey=DomainName,ParameterValue=!DOMAIN_NAME! ^
    ParameterKey=InstanceType,ParameterValue=!INSTANCE_TYPE! ^
  --capabilities CAPABILITY_IAM ^
  --region ap-south-1

if %ERRORLEVEL% neq 0 (
    echo.
    echo ERROR: Failed to create CloudFormation stack.
    goto :EOF
)

echo.
echo Stack creation initiated successfully.
echo.
echo To monitor the stack creation progress, go to:
echo https://ap-south-1.console.aws.amazon.com/cloudformation/home?region=ap-south-1#/stacks
echo.
echo Once the stack is created, you can SSH into the instance using:
echo ssh -i !KEY_NAME!.pem ubuntu@[instance-ip]
echo.
echo The setup script will run automatically on first login.
echo.

REM Wait for stack creation to complete
set /p WAIT="Do you want to wait for stack creation to complete? (y/n): "
if /i "!WAIT!" neq "y" goto :EOF

echo.
echo Waiting for stack creation to complete...
echo This may take 5-10 minutes...
echo.

:wait_loop
aws cloudformation describe-stacks --stack-name !STACK_NAME! --region ap-south-1 --query "Stacks[0].StackStatus" --output text > temp.txt
set /p STACK_STATUS=<temp.txt
del temp.txt

if "!STACK_STATUS!"=="CREATE_COMPLETE" (
    echo.
    echo Stack creation completed successfully!
    goto :stack_outputs
)

if "!STACK_STATUS!"=="CREATE_IN_PROGRESS" (
    echo Stack status: !STACK_STATUS!
    timeout /t 30 /nobreak >nul
    goto :wait_loop
)

echo.
echo Stack creation failed or was rolled back.
echo Status: !STACK_STATUS!
echo Please check the AWS CloudFormation console for details.
goto :EOF

:stack_outputs
echo.
echo Stack Outputs:
echo.

aws cloudformation describe-stacks --stack-name !STACK_NAME! --region ap-south-1 --query "Stacks[0].Outputs" --output json > outputs.json

echo Instance Public IP:
aws cloudformation describe-stacks --stack-name !STACK_NAME! --region ap-south-1 --query "Stacks[0].Outputs[?OutputKey=='InstancePublicIP'].OutputValue" --output text

echo.
echo SSH Command:
aws cloudformation describe-stacks --stack-name !STACK_NAME! --region ap-south-1 --query "Stacks[0].Outputs[?OutputKey=='SSHCommand'].OutputValue" --output text

echo.
echo Website URL:
aws cloudformation describe-stacks --stack-name !STACK_NAME! --region ap-south-1 --query "Stacks[0].Outputs[?OutputKey=='DirectAccessURL'].OutputValue" --output text

echo.
echo All outputs have been saved to outputs.json
echo.
echo Remember to update your DNS settings to point to the instance IP address.
echo.
echo Deployment completed successfully!

endlocal
