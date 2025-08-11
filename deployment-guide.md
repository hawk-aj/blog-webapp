# Deployment Guide for Aarya Jha Portfolio Website

This guide provides instructions for deploying the portfolio website to AWS using CloudFormation.

## Prerequisites

1. An AWS account
2. AWS CLI installed and configured with appropriate credentials
3. A registered domain name (aaryajha.com) with DNS managed by Route 53 or another DNS provider
4. An EC2 key pair for SSH access to the instance

## Deployment Steps

### 1. Prepare Your Repository

Ensure your code is in a Git repository that can be accessed by the EC2 instance. You have two options:

- **Public GitHub repository**: Update the CloudFormation template with your repository URL
- **Private repository**: Set up deployment keys or use AWS CodeCommit

Update the following line in the CloudFormation template with your actual repository URL:

```yaml
git clone https://github.com/your-username/portfolio-webapp.git
```

### 2. Deploy Using AWS Management Console

1. Log in to the AWS Management Console
2. Navigate to CloudFormation service
3. Click "Create stack" > "With new resources (standard)"
4. Select "Upload a template file" and upload the `cloudformation.yaml` file
5. Click "Next"
6. Enter a stack name (e.g., "aarya-portfolio")
7. Configure parameters:
   - **KeyName**: Select your EC2 key pair
   - **SSHLocation**: For better security, restrict to your IP address (e.g., your-ip/32)
   - **DomainName**: Confirm or change the domain name (default: aaryajha.com)
8. Click "Next", then "Next" again on the Configure stack options page
9. Review the settings and click "Create stack"

### 3. Deploy Using AWS CLI

Alternatively, you can deploy using the AWS CLI:

```bash
aws cloudformation create-stack \
  --stack-name aarya-portfolio \
  --template-body file://cloudformation.yaml \
  --parameters \
    ParameterKey=KeyName,ParameterValue=your-key-pair-name \
    ParameterKey=SSHLocation,ParameterValue=your-ip/32 \
    ParameterKey=DomainName,ParameterValue=aaryajha.com \
  --capabilities CAPABILITY_IAM \
  --region ap-south-1
```

### 4. Configure DNS

After the stack creation completes (which may take 10-15 minutes):

1. Go to the CloudFormation console and select your stack
2. Go to the "Outputs" tab
3. Note the "InstancePublicIP" value
4. Update your domain's DNS settings to point to this IP address:
   - Create an A record for aaryajha.com pointing to the IP address
   - Create an A record for www.aaryajha.com pointing to the same IP address

If using Route 53:

1. Go to Route 53 console
2. Select your hosted zone
3. Click "Create Record"
4. Create A records for both the apex domain (aaryajha.com) and www subdomain

### 5. Verify Deployment

Once DNS propagation is complete (may take up to 48 hours, but often much faster):

1. Visit https://aaryajha.com to verify the website is working
2. Visit https://aaryajha.com/jupyter to access Jupyter Notebook (secure this with a password for production)

## Security Considerations

1. **Jupyter Notebook Security**: The current setup has no password for Jupyter. For production, generate a password:

   ```python
   from notebook.auth import passwd
   passwd()  # Follow prompts to create a password
   ```

   Then update the Jupyter config in the CloudFormation template with the hashed password.

2. **SSH Access**: The default template allows SSH access from any IP. For better security, restrict to your IP address.

3. **HTTPS**: The template automatically configures HTTPS using Let's Encrypt certificates.

## Maintenance

### Updating the Website

To update the website:

1. SSH into the EC2 instance:
   ```bash
   ssh -i your-key.pem ec2-user@your-instance-ip
   ```

2. Navigate to the repository and pull the latest changes:
   ```bash
   cd /var/www/portfolio-webapp
   git pull
   ```

3. Rebuild the frontend:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

4. Restart the backend service if needed:
   ```bash
   sudo systemctl restart portfolio-backend
   ```

### Monitoring

- Check the status of services:
  ```bash
  sudo systemctl status nginx
  sudo systemctl status portfolio-backend
  sudo systemctl status jupyter
  ```

- View logs:
  ```bash
  # Nginx logs
  sudo tail -f /var/log/nginx/aaryajha.com.error.log
  sudo tail -f /var/log/nginx/aaryajha.com.access.log
  
  # Backend logs (via journalctl)
  sudo journalctl -u portfolio-backend -f
  
  # Jupyter logs
  sudo journalctl -u jupyter -f
  ```

## Troubleshooting

### Common Issues

1. **Website not accessible**:
   - Check if Nginx is running: `sudo systemctl status nginx`
   - Verify DNS settings are correct
   - Check security group settings in AWS console

2. **Backend API not working**:
   - Check if the Flask service is running: `sudo systemctl status portfolio-backend`
   - Check logs for errors: `sudo journalctl -u portfolio-backend -f`

3. **Jupyter Notebook not accessible**:
   - Check if Jupyter service is running: `sudo systemctl status jupyter`
   - Verify port 8888 is open in the security group
   - Check logs: `sudo journalctl -u jupyter -f`

### SSL Certificate Renewal

Let's Encrypt certificates expire after 90 days. The renewal process should happen automatically via a cron job, but you can manually renew with:

```bash
sudo certbot renew
```

## Cost Optimization

The deployment uses a t2.micro instance, which is eligible for the AWS Free Tier for the first 12 months. After that period, consider:

1. Scheduling the instance to stop during periods of low traffic
2. Using Reserved Instances for long-term cost savings
3. Monitoring usage with AWS Cost Explorer

## Cleanup

To delete all resources when no longer needed:

```bash
aws cloudformation delete-stack --stack-name aarya-portfolio --region ap-south-1
```

Note: This will delete the EC2 instance and all associated resources. Make sure to back up any important data first.
