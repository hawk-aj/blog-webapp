# Portfolio Website - Docker Deployment Guide

This guide covers the Docker-based deployment of Aarya Jha's portfolio website, including both local development and AWS CloudFormation deployment.

## 🐳 Docker Architecture

The application consists of three main services:

1. **Frontend** - React application served by Nginx
2. **Backend** - Flask API server
3. **Jupyter** - Jupyter Notebook server for data science work

## 📋 Prerequisites

### Local Development
- Docker Desktop for Windows
- Git
- Node.js (for local frontend development)

### AWS Deployment
- AWS CLI configured
- Valid AWS account with EC2 permissions
- EC2 Key Pair created in your target region

## 🚀 Quick Start (Local Development)

### Option 1: Using the Deployment Script (Recommended)
```cmd
# Full deployment (build and start)
deploy.bat deploy

# Or step by step
deploy.bat build
deploy.bat start

# View logs
deploy.bat logs

# Stop application
deploy.bat stop
```

### Option 2: Using Docker Compose Directly
```cmd
# Build and start all services
docker-compose up -d --build

# View running containers
docker-compose ps

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## 📁 Project Structure

```
portfolio-webapp/
├── backend/
│   ├── app.py              # Flask application
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile         # Backend container config
├── frontend/
│   ├── src/               # React source code
│   ├── public/            # Static assets
│   ├── build/             # Built React app (generated)
│   ├── package.json       # Node.js dependencies
│   ├── nginx.conf         # Nginx configuration
│   └── Dockerfile         # Frontend container config
├── notebooks/             # Jupyter notebooks directory
├── docker-compose.yml     # Multi-container configuration
├── cloudformation.yaml    # AWS deployment template
├── deploy.bat            # Windows deployment script
└── ami-selection-guide.md # AMI selection guide
```

## 🔧 Configuration

### Environment Variables
The application supports the following environment variables:

#### Backend (Flask)
- `FLASK_ENV`: Set to `production` for production deployment
- `FLASK_APP`: Entry point file (default: `app.py`)

#### Frontend (Nginx)
- Configured via `nginx.conf` file
- Proxy settings for API calls to backend

#### Jupyter
- `JUPYTER_ENABLE_LAB`: Enable JupyterLab interface
- `JUPYTER_TOKEN`: Authentication token (empty for no auth)

### Port Configuration
- **Frontend**: Port 80 (HTTP)
- **Backend**: Port 5000 (API)
- **Jupyter**: Port 8888 (Notebook interface)

## 🌐 Local Access URLs

After starting the application locally:

- **Website**: http://localhost
- **API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/profile
- **Jupyter Notebook**: http://localhost:8888

## ☁️ AWS CloudFormation Deployment

### 1. Update AMI ID (if needed)
Refer to `ami-selection-guide.md` to find the appropriate AMI for your region.

### 2. Deploy the Stack
```cmd
aws cloudformation create-stack \
    --stack-name portfolio-website \
    --template-body file://cloudformation.yaml \
    --parameters ParameterKey=KeyName,ParameterValue=your-key-pair \
                 ParameterKey=DomainName,ParameterValue=yourdomain.com \
    --region us-east-1
```

### 3. Monitor Deployment
```cmd
aws cloudformation describe-stacks --stack-name portfolio-website
```

### 4. Get Outputs
```cmd
aws cloudformation describe-stacks \
    --stack-name portfolio-website \
    --query 'Stacks[0].Outputs'
```

## 🔍 Monitoring and Troubleshooting

### Local Development

#### Check Container Status
```cmd
deploy.bat status
# or
docker-compose ps
```

#### View Logs
```cmd
# All services
deploy.bat logs

# Specific service
deploy.bat logs backend
deploy.bat logs frontend
deploy.bat logs jupyter
```

#### Restart Services
```cmd
deploy.bat restart
```

#### Clean Up
```cmd
deploy.bat cleanup
```

### AWS Deployment

#### SSH into EC2 Instance
```cmd
ssh -i your-key.pem ec2-user@your-instance-ip
```

#### Check Docker Containers on AWS
```bash
cd /opt/portfolio
docker-compose ps
docker-compose logs -f
```

#### Monitor System Resources
```bash
# Check disk usage
df -h

# Check memory usage
free -h

# Check running processes
top
```

## 🛠️ Development Workflow

### Making Changes to Backend
1. Modify files in `backend/` directory
2. Rebuild and restart:
   ```cmd
   deploy.bat stop
   deploy.bat build
   deploy.bat start
   ```

### Making Changes to Frontend
1. Modify files in `frontend/src/` directory
2. Rebuild and restart:
   ```cmd
   deploy.bat stop
   deploy.bat build
   deploy.bat start
   ```

### Adding New Dependencies

#### Backend (Python)
1. Add package to `backend/requirements.txt`
2. Rebuild container:
   ```cmd
   deploy.bat build
   ```

#### Frontend (Node.js)
1. Add package to `frontend/package.json` or use npm:
   ```cmd
   cd frontend
   npm install package-name
   cd ..
   deploy.bat build
   ```

## 🔒 Security Considerations

### Local Development
- Jupyter runs without authentication (development only)
- All services accessible on localhost

### Production Deployment
- SSL certificates automatically obtained via Let's Encrypt
- Security groups restrict access to necessary ports only
- Nginx serves as reverse proxy with security headers

## 📊 Performance Optimization

### Docker Image Optimization
- Multi-stage builds for frontend
- Minimal base images (Alpine Linux)
- Layer caching for faster builds

### Resource Allocation
- Default instance type: `t3.small`
- Can be adjusted via CloudFormation parameter
- Health checks ensure container reliability

## 🚨 Common Issues and Solutions

### Issue: Docker containers won't start
**Solution**: Check Docker Desktop is running and has sufficient resources allocated.

### Issue: Port conflicts
**Solution**: Ensure ports 80, 5000, and 8888 are not in use by other applications.

### Issue: Frontend build fails
**Solution**: 
```cmd
cd frontend
npm install
npm run build
cd ..
deploy.bat build
```

### Issue: AWS deployment fails
**Solution**: 
- Verify AMI ID is correct for your region
- Check EC2 key pair exists
- Ensure sufficient IAM permissions

### Issue: SSL certificate fails on AWS
**Solution**: 
- Verify domain DNS is pointing to the EC2 instance
- Wait for DNS propagation (can take up to 48 hours)

## 📝 Logs and Debugging

### Log Locations

#### Local Development
- Container logs: `docker-compose logs`
- Individual service logs: `docker-compose logs [service-name]`

#### AWS Deployment
- User data logs: `/var/log/user-data.log`
- Docker monitor logs: `/var/log/docker-monitor.log`
- Nginx logs: `/var/log/nginx/`
- Container logs: `docker-compose logs` (in `/opt/portfolio/`)

## 🔄 Backup and Recovery

### Local Development
- Source code is version controlled
- Docker images can be rebuilt from source

### AWS Deployment
- Create AMI snapshots of running instances
- Database backups (if using external database)
- Configuration files stored in version control

## 📞 Support

For issues related to:
- **Docker**: Check Docker Desktop documentation
- **AWS**: Refer to AWS CloudFormation documentation
- **Application**: Check application logs and GitHub repository

## 🎯 Next Steps

1. **Custom Domain**: Configure your domain to point to the AWS instance
2. **Database**: Add persistent database for dynamic content
3. **CI/CD**: Set up automated deployment pipeline
4. **Monitoring**: Add application monitoring and alerting
5. **Scaling**: Consider load balancers and auto-scaling groups

---

**Note**: This deployment uses Docker for containerization, making it easy to develop locally and deploy consistently to AWS. The CloudFormation template handles all AWS resource provisioning automatically.
