# Aarya Jha Portfolio Website - AWS Deployment

This repository contains the CloudFormation template and deployment scripts for deploying Aarya Jha's portfolio website on AWS EC2.

## 🚀 Quick Start

### Windows Users
```cmd
deploy-fixed.bat your-key-pair-name
```

### Linux/macOS Users
```bash
./deploy-fixed.sh your-key-pair-name
```

## 📁 File Structure

### Core Files
- `cloudformation-fixed.yaml` - **Fixed CloudFormation template (use this one!)**
- `cloudformation.yaml` - Original template (has issues, don't use)

### Windows Deployment
- `deploy-fixed.bat` - Windows deployment script
- `cleanup-fixed.bat` - Windows cleanup script
- `DEPLOYMENT-GUIDE-WINDOWS.md` - Complete Windows deployment guide

### Linux/macOS Deployment
- `deploy-fixed.sh` - Linux/macOS deployment script
- `cleanup-fixed.sh` - Linux/macOS cleanup script
- `deployment-guide.md` - Complete Linux/macOS deployment guide

### Documentation
- `README.md` - This file
- `TROUBLESHOOTING.md` - Comprehensive troubleshooting guide
- `nginx.conf` - Nginx configuration reference
- `nginx-ip-access.conf` - IP-based access configuration

### Application Files
- `backend/` - Flask backend application
  - `app.py` - Main Flask application with your portfolio data
  - `requirements.txt` - Python dependencies
- `frontend/` - React frontend application
  - `package.json` - Node.js dependencies
  - `src/` - React source code

## 🔧 What's Fixed

The `cloudformation-fixed.yaml` template addresses all the cloud-init failures from the original template:

### Issues Fixed:
1. ✅ **Script Syntax Errors** - Fixed EOF markers and shell script formatting
2. ✅ **Error Handling** - Added comprehensive error handling that continues execution
3. ✅ **Service Management** - Improved systemd service configurations
4. ✅ **Node.js Installation** - Reliable installation method with fallbacks
5. ✅ **Nginx Configuration** - Corrected proxy settings and security headers
6. ✅ **Application Integration** - Includes your actual Flask and React code
7. ✅ **Monitoring** - Service monitoring and auto-restart capabilities
8. ✅ **Logging** - Enhanced logging for troubleshooting

### New Features:
- 🔄 **Automatic Service Recovery** - Services restart automatically if they fail
- 📊 **Service Monitoring** - Built-in monitoring script runs every 5 minutes
- 🛡️ **Security Headers** - Proper security headers in Nginx
- 📝 **Comprehensive Logging** - All operations logged for troubleshooting
- 🔒 **SSL Support** - Automatic SSL certificate setup with certbot
- 💾 **Fallback Mechanisms** - If React build fails, serves a basic HTML page

## 🌐 What Gets Deployed

After successful deployment, you'll have:

### 1. Main Website (`http://your-ip/`)
- React frontend with your portfolio
- Responsive design
- API integration with Flask backend

### 2. Backend API (`http://your-ip/api/`)
- `/api/profile` - Your profile information
- `/api/experience` - Work experience data
- `/api/blogs` - Blog posts
- `/api/ramblings` - Personal thoughts and observations

### 3. Jupyter Notebook (`http://your-ip/jupyter`)
- Interactive Python environment
- Pre-configured for easy access
- No password required (can be changed for production)

## 📋 Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** installed and configured (`aws configure`)
3. **EC2 Key Pair** created in your target region
4. **Domain name** (optional, defaults to aaryajha.com)

## 🚀 Deployment Instructions

### Option 1: Automated Scripts (Recommended)

#### Windows:
```cmd
cd portfolio-webapp
deploy-fixed.bat your-key-pair-name
```

#### Linux/macOS:
```bash
cd portfolio-webapp
./deploy-fixed.sh your-key-pair-name
```

### Option 2: AWS Console
1. Upload `cloudformation-fixed.yaml` to CloudFormation
2. Set parameters (KeyName, DomainName, InstanceType)
3. Create stack and wait for completion

### Option 3: AWS CLI
```bash
aws cloudformation create-stack \
  --stack-name portfolio-website-fixed \
  --template-body file://cloudformation-fixed.yaml \
  --parameters ParameterKey=KeyName,ParameterValue=your-key-pair \
  --capabilities CAPABILITY_IAM \
  --region us-east-1
```

## 🔍 Monitoring & Troubleshooting

### Check Deployment Status
- **AWS Console**: CloudFormation → Stacks → portfolio-website-fixed
- **Command Line**: `aws cloudformation describe-stacks --stack-name portfolio-website-fixed`

### Access Logs
```bash
# SSH into the instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Check deployment logs
sudo tail -f /var/log/user-data.log

# Check service status
sudo systemctl status nginx portfolio-backend jupyter

# Check service logs
sudo journalctl -u portfolio-backend -f
```

### Common Issues
- **Cloud-init failures**: Check `/var/log/user-data.log`
- **Service startup issues**: Check `systemctl status <service-name>`
- **Website not accessible**: Verify security groups and DNS settings
- **API not working**: Check Flask backend service status

See `TROUBLESHOOTING.md` for detailed solutions.

## 🧹 Cleanup

### Windows:
```cmd
cleanup-fixed.bat
```

### Linux/macOS:
```bash
./cleanup-fixed.sh
```

This will delete all AWS resources and stop billing.

## 💰 Cost Estimate

- **t3.micro instance**: ~$8-10/month (Free Tier eligible)
- **Elastic IP**: Free when attached to running instance
- **Data transfer**: Minimal for personal portfolio
- **Total**: ~$8-10/month (or free with AWS Free Tier)

## 🔒 Security Features

- **Restricted SSH access** (configurable IP ranges)
- **Security headers** in Nginx configuration
- **Automatic SSL certificates** with Let's Encrypt
- **Service isolation** with proper user permissions
- **Firewall rules** via AWS Security Groups

## 📚 Documentation

- **Windows Users**: Read `DEPLOYMENT-GUIDE-WINDOWS.md`
- **Linux/macOS Users**: Read `deployment-guide.md`
- **Troubleshooting**: Read `TROUBLESHOOTING.md`
- **Application Details**: Check `backend/app.py` and `frontend/src/`

## 🤝 Support

If you encounter issues:

1. Check the appropriate deployment guide for your OS
2. Review the troubleshooting guide
3. Check AWS CloudFormation events in the console
4. Examine the user-data logs on the EC2 instance

## 📝 Notes

- The template includes comprehensive error handling and fallback mechanisms
- Most issues should be automatically resolved or clearly logged
- The deployment is production-ready with monitoring and auto-recovery
- All your actual portfolio data is included in the Flask backend

---

**Ready to deploy?** Choose your platform and run the deployment script! 🚀
