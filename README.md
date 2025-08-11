# Aarya Jha Portfolio Website

This repository contains Aarya Jha's portfolio website with a React frontend, Flask backend, and Jupyter Notebook server, all containerized with Docker.

## 🚀 Project Overview

The application consists of three main services:

1. **Frontend** - React application with Vite, served by Nginx
2. **Backend** - Flask API server providing portfolio data
3. **Jupyter** - Jupyter Notebook server for data science work

## 📋 Prerequisites

### Local Development
- Docker and Docker Compose
- Node.js (for local frontend development)
- Git

### AWS Deployment
- AWS CLI configured
- Valid AWS account with EC2 permissions
- EC2 Key Pair created in your target region

## 🐳 Docker Deployment (Recommended)

### Quick Start
```bash
# Build and start all services
docker-compose up -d --build

# View running containers
docker-compose ps

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Access URLs (Local Development)
- **Website**: http://localhost
- **API**: http://localhost:5000/api
- **Jupyter Notebook**: http://localhost:8888

## 🔧 Local Development (Without Docker)

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
The frontend will be available at http://localhost:3000

### Backend (Flask)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
flask run
```
The backend will be available at http://localhost:5000

## 📁 Project Structure

```
portfolio-webapp/
├── backend/
│   ├── app.py              # Flask application
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile          # Backend container config
├── frontend/
│   ├── src/                # React source code
│   ├── public/             # Static assets
│   ├── dist/               # Built React app (generated)
│   ├── package.json        # Node.js dependencies
│   ├── vite.config.js      # Vite configuration
│   ├── nginx.conf          # Nginx configuration
│   └── Dockerfile          # Frontend container config
├── notebooks/              # Jupyter notebooks directory
├── docker-compose.yml      # Multi-container configuration
├── cloudformation-ubuntu.yaml # AWS deployment template for Ubuntu
└── ubuntu-deployment-guide.md # Ubuntu deployment guide
```

## 🌟 Features

### Frontend
- Modern React application built with Vite
- Responsive design with CSS
- Framer Motion animations
- Lucide React icons
- React Router for navigation

### Backend
- Flask API server
- RESTful endpoints for portfolio data
- JSON responses for frontend consumption

### Jupyter Notebook
- Interactive Python environment
- Pre-configured for data science work
- No password required (can be changed for production)

## 🔍 API Endpoints

- `/api/profile` - Profile information
- `/api/experience` - Work experience data
- `/api/blogs` - Blog posts
- `/api/ramblings` - Personal thoughts and observations

## ☁️ AWS Deployment

### Ubuntu EC2 Deployment
Refer to `ubuntu-deployment-guide.md` for detailed instructions on deploying to an Ubuntu EC2 instance.

### Key Steps:
1. Launch an Ubuntu EC2 instance
2. Install Docker and Docker Compose
3. Clone this repository
4. Run `docker-compose up -d --build`
5. Configure Nginx for SSL (optional)

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

## 🔍 Monitoring and Troubleshooting

### Check Container Status
```bash
docker-compose ps
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs frontend
docker-compose logs backend
docker-compose logs jupyter
```

### Restart Services
```bash
docker-compose restart
```

## 🛠️ Development Workflow

### Making Changes to Backend
1. Modify files in `backend/` directory
2. Rebuild and restart:
   ```bash
   docker-compose up -d --build backend
   ```

### Making Changes to Frontend
1. Modify files in `frontend/src/` directory
2. Rebuild and restart:
   ```bash
   docker-compose up -d --build frontend
   ```

### Adding New Dependencies

#### Backend (Python)
1. Add package to `backend/requirements.txt`
2. Rebuild container:
   ```bash
   docker-compose up -d --build backend
   ```

#### Frontend (Node.js)
1. Add package to `frontend/package.json` or use npm:
   ```bash
   cd frontend
   npm install package-name
   cd ..
   docker-compose up -d --build frontend
   ```

## 🔒 Security Considerations

### Local Development
- Jupyter runs without authentication (development only)
- All services accessible on localhost

### Production Deployment
- Configure SSL certificates for HTTPS
- Set up proper authentication for Jupyter
- Use environment variables for sensitive information

## 🚨 Common Issues and Solutions

### Issue: Docker containers won't start
**Solution**: Check Docker is running and has sufficient resources allocated.

### Issue: Port conflicts
**Solution**: Ensure ports 80, 5000, and 8888 are not in use by other applications.

### Issue: Frontend build fails
**Solution**: 
```bash
cd frontend
npm install
npm run build
cd ..
docker-compose up -d --build frontend
```

## 📝 Logs and Debugging

### Log Locations
- Container logs: `docker-compose logs`
- Individual service logs: `docker-compose logs [service-name]`
- Nginx logs: Inside the frontend container at `/var/log/nginx/`

## 📞 Support

For issues related to:
- **Docker**: Check Docker documentation
- **React/Vite**: Check Vite documentation
- **Flask**: Check Flask documentation

## 🎯 Next Steps

1. **Custom Domain**: Configure your domain to point to your deployment
2. **Database**: Add persistent database for dynamic content
3. **CI/CD**: Set up automated deployment pipeline
4. **Monitoring**: Add application monitoring and alerting
5. **Scaling**: Consider load balancers and auto-scaling groups

---

**Note**: This deployment uses Docker for containerization, making it easy to develop locally and deploy consistently to any environment.
