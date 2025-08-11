# Ubuntu-based Deployment Guide for Aarya Jha Portfolio Website

This guide provides instructions for deploying the portfolio website to AWS using the Ubuntu-based CloudFormation template.

## Overview of the New Approach

This deployment uses an Ubuntu 22.04 LTS AMI instead of Amazon Linux. The key differences in this approach are:

1. **Ubuntu Base**: Uses Ubuntu 22.04 LTS which may provide better compatibility with certain packages
2. **Deferred Setup**: The main installation happens on first login via .bashrc, reducing the chance of CloudFormation timeout issues
3. **Service Monitoring**: Includes a service checker script that runs every 5 minutes to ensure all services stay running

## Prerequisites

1. An AWS account
2. AWS CLI installed and configured with appropriate credentials
3. A registered domain name (aaryajha.com) with DNS managed by Route 53 or another DNS provider
4. An EC2 key pair for SSH access to the instance

## Deployment Steps

### 1. Deploy Using AWS Management Console

1. Log in to the AWS Management Console
2. Navigate to CloudFormation service
3. Click "Create stack" > "With new resources (standard)"
4. Select "Upload a template file" and upload the `cloudformation-ubuntu.yaml` file
5. Click "Next"
6. Enter a stack name (e.g., "aarya-portfolio-ubuntu")
7. Configure parameters:
   - **KeyName**: Select your EC2 key pair
   - **SSHLocation**: For better security, restrict to your IP address (e.g., your-ip/32)
   - **DomainName**: Confirm or change the domain name (default: aaryajha.com)
   - **InstanceType**: Select the instance type (default: t3.small)
8. Click "Next", then "Next" again on the Configure stack options page
9. Review the settings and click "Create stack"

### 2. Deploy Using AWS CLI

Alternatively, you can deploy using the AWS CLI:

```bash
aws cloudformation create-stack \
  --stack-name aarya-portfolio-ubuntu \
  --template-body file://cloudformation-ubuntu.yaml \
  --parameters \
    ParameterKey=KeyName,ParameterValue=your-key-pair-name \
    ParameterKey=SSHLocation,ParameterValue=your-ip/32 \
    ParameterKey=DomainName,ParameterValue=aaryajha.com \
  --capabilities CAPABILITY_IAM \
  --region ap-south-1
```

### 3. Complete the Setup

After the stack creation completes:

1. SSH into the instance using the command provided in the CloudFormation outputs:
   ```bash
   ssh -i your-key.pem ubuntu@your-instance-ip
   ```

2. The setup script will run automatically on first login. This will:
   - Update the system
   - Install Docker, Docker Compose, Git, Nginx, and other required packages
   - Clone the repository
   - Build and start the Docker containers
   - Configure Nginx as a reverse proxy
   - Set up SSL certificates if the domain is configured

3. Wait for the setup to complete. This may take 5-10 minutes depending on your instance type and network speed.

### 4. Configure DNS

After the setup completes:

1. Go to the CloudFormation console and select your stack
2. Go to the "Outputs" tab
3. Note the "InstancePublicIP" value
4. Update your domain's DNS settings to point to this IP address:
   - Create an A record for aaryajha.com pointing to the IP address
   - Create an A record for www.aaryajha.com pointing to the same IP address

## Verification and Troubleshooting

### Verifying Deployment

1. You can immediately access the website using the public IP address:
   - Visit `http://<InstancePublicIP>` in your browser

2. Once DNS propagation is complete:
   - Visit https://aaryajha.com to verify the website is working
   - Visit https://aaryajha.com/jupyter to access Jupyter Notebook

### Checking Logs

To check the logs of the setup process:

1. Initial CloudFormation user data log:
   ```bash
   sudo cat /var/log/user-data.log
   ```

2. Setup script log (if you need to run it manually):
   ```bash
   /home/ubuntu/setup.sh > setup.log 2>&1
   cat setup.log
   ```

3. Docker container logs:
   ```bash
   cd /opt/portfolio
   docker-compose logs
   ```

4. Nginx logs:
   ```bash
   sudo tail -n 100 /var/log/nginx/error.log
   sudo cat /var/log/nginx/access.log
   ```

5. Service checker logs:
   ```bash
   sudo cat /var/log/service-checker.log
   ```

### Common Issues and Solutions

1. **Setup script didn't run on login**:
   - Check if the file exists: `ls -la /home/ubuntu/setup.sh`
   - Check if it's executable: `chmod +x /home/ubuntu/setup.sh`
   - Run it manually: `/home/ubuntu/setup.sh`

2. **Docker containers not running**:
   - Check status: `docker ps`
   - Start manually: `cd /opt/portfolio && docker-compose up -d`
   - Check logs: `docker-compose logs`

3. **Nginx not configured properly**:
   - Check configuration: `sudo nginx -t`
   - Check if running: `sudo systemctl status nginx`
   - Restart: `sudo systemctl restart nginx`

4. **SSL certificate issues**:
   - Run certbot manually: `sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com`

## Maintenance

### Using the Deployment Scripts

We've created several scripts to simplify deployment and management:

1. **run-frontend.sh**: Builds and runs only the frontend container
   ```bash
   cd /opt/portfolio
   chmod +x run-frontend.sh
   ./run-frontend.sh
   ```

2. **run-backend.sh**: Builds and runs only the backend container
   ```bash
   cd /opt/portfolio
   chmod +x run-backend.sh
   ./run-backend.sh
   ```

3. **run-all.sh**: Builds and runs both frontend and backend containers
   ```bash
   cd /opt/portfolio
   chmod +x run-all.sh
   ./run-all.sh
   ```

4. **stop-all.sh**: Stops and removes all containers
   ```bash
   cd /opt/portfolio
   chmod +x stop-all.sh
   ./stop-all.sh
   ```

These scripts provide a simpler alternative to docker-compose, especially if you encounter issues with the docker-compose configuration.

### Updating the Website

To update the website:

1. SSH into the EC2 instance:
   ```bash
   ssh -i your-key.pem ubuntu@your-instance-ip
   ```

2. Navigate to the repository and pull the latest changes:
   ```bash
   cd /opt/portfolio
   git pull
   ```

3. Option 1: Using docker-compose (if working correctly):
   ```bash
   docker-compose down
   docker-compose build
   docker-compose up -d
   ```

4. Option 2: Using our deployment scripts:
   ```bash
   ./stop-all.sh
   ./run-all.sh
   ```

### Monitoring

The service checker script runs every 5 minutes to ensure all services are running. You can check its logs:

```bash
cat /var/log/service-checker.log
```

## Cleanup

To delete all resources when no longer needed:

```bash
aws cloudformation delete-stack --stack-name aarya-portfolio-ubuntu --region ap-south-1
```

Note: This will delete the EC2 instance and all associated resources. Make sure to back up any important data first.
