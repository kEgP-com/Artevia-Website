# Design wireframes/mockups for all main
pages.- Decide color scheme, typography,
and layout.- Prepare responsive layout
guidelines.- Document design rationale.

Figma Link: https://www.figma.com/design/7ALJxoy9zgzrsRtF1T8ltK/E-COMMERCE-WIREFRAME--Community-?node-id=0-1&p=f&t=ao710xujxKzATKDa-0



# 🐳 Docker React Development Environment

A complete Docker-based development and production environment for React applications with hot reload, optimized builds, and production-ready deployment.

## 🚀 Quick Start

### Development Mode (Recommended for coding)
---powershell
# Easy way - use the script
.\start-dev.ps1

# Manual way
docker-compose up -d


### Production Mode (Optimized build)
---powershell
# Easy way - use the script  
.\start-prod.ps1

# Manual way
docker-compose -f docker-compose.prod.yml up -d --build


## 📦 What's Included

### 🛠️ Development Environment
- **React 18** with hot reload
- **React Router** for client-side routing
- **Fast Refresh** for instant updates
- **Volume mounting** for live code editing
- **Node.js 20** Alpine-based image

### 🏭 Production Environment
- **Multi-stage build** for optimized size
- **Nginx** web server with custom configuration
- **Gzip compression** for faster loading
- **Security headers** built-in
- **Health checks** for monitoring
- **Non-root user** for security

## 🌐 Access Points

| Environment | URL | Port |
|------------|-----|------|
| Development | http://localhost:3000 | 3000 |
| Production | http://localhost:8080 | 8080 |
| Health Check | http://localhost:8080/health | 8080 |

## 📁 Project Structure

---
docker-react/
├── src/                    # React source code
│   ├── App.js              # Main React component
│   ├── App.css             # Styles
│   └── index.js            # React entry point
├── public/                 # Public assets
│   └── index.html          # HTML template
├── Dockerfile              # Production build configuration
├── docker-compose.yml      # Development environment
├── docker-compose.prod.yml # Production environment
├── nginx.conf              # Nginx configuration
├── .dockerignore           # Docker ignore rules
├── start-dev.ps1           # Development startup script
├── start-prod.ps1          # Production startup script
└── README.md               # This file
---

## 🛠️ Development Commands

---powershell
# Start development environment
docker-compose up -d

# View logs
docker-compose logs -f react-dev

# Stop environment
docker-compose down

# Restart services
docker-compose restart

# Execute commands inside container
docker-compose exec react-dev npm install package-name
docker-compose exec react-dev npm test


## 🏭 Production Commands

---powershell
# Build and start production
docker-compose -f docker-compose.prod.yml up -d --build

# View production logs
docker-compose -f docker-compose.prod.yml logs -f react-prod

# Stop production environment
docker-compose -f docker-compose.prod.yml down

# Check health
curl http://localhost:8080/health


## 🔧 Customization

### Adding New Dependencies
---powershell
# Add to package.json, then rebuild
docker-compose exec react-dev npm install new-package
---

### Environment Variables
Create a `.env` file in the root directory:
---env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENVIRONMENT=development
---

### Nginx Configuration
Edit `nginx.conf` for custom server settings, caching rules, or proxy configurations.

## 🚨 Troubleshooting

### Development Issues
- **Port 3000 in use**: Change port in `docker-compose.yml`
- **Hot reload not working**: Ensure `CHOKIDAR_USEPOLLING=true` is set
- **Permission errors**: Check Docker Desktop file sharing settings

### Production Issues
- **Build fails**: Check `docker-compose -f docker-compose.prod.yml logs react-prod`
- **Nginx errors**: Verify `nginx.conf` syntax
- **Static files not loading**: Check build output in `/app/build`

### Windows-Specific
- **File watching issues**: The environment variables `CHOKIDAR_USEPOLLING` and `WATCHPACK_POLLING` are set for Windows compatibility
- **Path issues**: Use PowerShell or CMD, not WSL for running scripts

## 📈 Performance Features

### Development
- ✅ Hot reload with Fast Refresh
- ✅ Persistent node_modules volume
- ✅ Optimized file watching for Windows

### Production  
- ✅ Multi-stage build (smaller image size)
- ✅ Gzip compression
- ✅ Static asset caching
- ✅ Security headers
- ✅ Health monitoring
- ✅ Non-root user execution

## 🔍 Monitoring

### Health Checks
Both environments include health checks:
- Development: Checks React dev server
- Production: Nginx health endpoint

### Logs
---powershell
# Development logs
docker-compose logs -f react-dev

# Production logs  
docker-compose -f docker-compose.prod.yml logs -f react-prod
---

## 🛡️ Security Features

- Non-root user in production
- Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- Minimal attack surface with Alpine images
- Proper signal handling with dumb-init


