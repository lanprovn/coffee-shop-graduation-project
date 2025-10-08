#!/bin/bash

# 🚀 Highland Coffee Project - Ubuntu Auto Setup Script
# Tác giả: Highland Coffee Team
# Phiên bản: 1.0.0

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}"
    echo "=================================================="
    echo "  🚀 Highland Coffee Project - Ubuntu Setup"
    echo "=================================================="
    echo -e "${NC}"
}

print_step() {
    echo -e "${YELLOW}[STEP]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        print_error "This script should not be run as root"
        exit 1
    fi
}

# Update system
update_system() {
    print_step "Updating system packages..."
    sudo apt update && sudo apt upgrade -y
    print_success "System updated successfully"
}

# Install Java 17
install_java() {
    print_step "Installing Java 17..."
    sudo apt install openjdk-17-jdk -y
    
    # Set JAVA_HOME
    echo 'export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64' >> ~/.bashrc
    echo 'export PATH=$JAVA_HOME/bin:$PATH' >> ~/.bashrc
    source ~/.bashrc
    
    # Verify installation
    java_version=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2)
    print_success "Java $java_version installed successfully"
}

# Install Maven
install_maven() {
    print_step "Installing Maven..."
    sudo apt install maven -y
    
    maven_version=$(mvn -version | head -n 1 | cut -d' ' -f3)
    print_success "Maven $maven_version installed successfully"
}

# Install Node.js 18
install_nodejs() {
    print_step "Installing Node.js 18..."
    
    # Add NodeSource repository
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    
    # Install Yarn
    sudo npm install -g yarn
    
    # Verify installation
    node_version=$(node -v)
    npm_version=$(npm -v)
    yarn_version=$(yarn -v)
    
    print_success "Node.js $node_version, npm $npm_version, yarn $yarn_version installed successfully"
}

# Install Git
install_git() {
    print_step "Installing Git..."
    sudo apt install git -y
    
    git_version=$(git --version | cut -d' ' -f3)
    print_success "Git $git_version installed successfully"
}

# Install Docker
install_docker() {
    print_step "Installing Docker..."
    
    # Install required packages
    sudo apt install apt-transport-https ca-certificates curl software-properties-common -y
    
    # Add Docker GPG key
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    
    # Add Docker repository
    sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
    
    # Install Docker
    sudo apt update
    sudo apt install docker-ce -y
    
    # Add user to docker group
    sudo usermod -aG docker $USER
    
    # Install Docker Compose
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    
    # Verify installation
    docker_version=$(docker --version | cut -d' ' -f3 | cut -d',' -f1)
    docker_compose_version=$(docker-compose --version | cut -d' ' -f3 | cut -d',' -f1)
    
    print_success "Docker $docker_version and Docker Compose $docker_compose_version installed successfully"
    print_info "Please log out and log back in for Docker group changes to take effect"
}

# Install MySQL
install_mysql() {
    print_step "Installing MySQL..."
    sudo apt install mysql-server -y
    
    # Start and enable MySQL
    sudo systemctl start mysql
    sudo systemctl enable mysql
    
    print_success "MySQL installed successfully"
    print_info "Please run 'sudo mysql_secure_installation' to secure your MySQL installation"
}

# Install RabbitMQ
install_rabbitmq() {
    print_step "Installing RabbitMQ..."
    
    # Install Erlang
    sudo apt install erlang -y
    
    # Install RabbitMQ
    sudo apt install rabbitmq-server -y
    
    # Start and enable RabbitMQ
    sudo systemctl start rabbitmq-server
    sudo systemctl enable rabbitmq-server
    
    # Enable management plugin
    sudo rabbitmq-plugins enable rabbitmq_management
    
    # Create admin user
    sudo rabbitmqctl add_user admin admin123
    sudo rabbitmqctl set_user_tags admin administrator
    sudo rabbitmqctl set_permissions -p / admin ".*" ".*" ".*"
    
    print_success "RabbitMQ installed successfully"
    print_info "RabbitMQ Management UI available at: http://localhost:15672"
    print_info "Username: admin, Password: admin123"
}

# Clone project
clone_project() {
    print_step "Cloning Highland Coffee project..."
    
    if [ -d "coffee-shop-graduation-project" ]; then
        print_info "Project directory already exists, skipping clone"
        return
    fi
    
    git clone https://github.com/lanprovn/coffee-shop-graduation-project.git
    cd coffee-shop-graduation-project
    
    print_success "Project cloned successfully"
}

# Setup project
setup_project() {
    print_step "Setting up project..."
    
    # Install frontend dependencies
    print_info "Installing frontend dependencies..."
    npm install
    
    # Build backend (if backend directory exists)
    if [ -d "backend" ]; then
        print_info "Building backend services..."
        cd backend
        mvn clean install -DskipTests
        cd ..
    fi
    
    print_success "Project setup completed"
}

# Create environment file
create_env_file() {
    print_step "Creating environment configuration..."
    
    cat > .env << EOF
# Highland Coffee Environment Configuration
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_NAME=Highland Coffee
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=highland_coffee
DB_USER=highland_user
DB_PASSWORD=highland_password

# RabbitMQ Configuration
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USER=admin
RABBITMQ_PASSWORD=admin123

# Service Ports
EUREKA_PORT=8761
API_GATEWAY_PORT=8080
USER_SERVICE_PORT=8081
PRODUCT_SERVICE_PORT=8082
ORDER_SERVICE_PORT=8083
PAYMENT_SERVICE_PORT=8084
NOTIFICATION_SERVICE_PORT=8085
LOYALTY_SERVICE_PORT=8086
ANALYTICS_SERVICE_PORT=8087
STORE_SERVICE_PORT=8088
EOF
    
    print_success "Environment file created"
}

# Create startup script
create_startup_script() {
    print_step "Creating startup script..."
    
    cat > start-highland.sh << 'EOF'
#!/bin/bash

# Highland Coffee Startup Script

echo "🚀 Starting Highland Coffee Project..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start backend services with Docker Compose
echo "📦 Starting backend services..."
if [ -f "docker-compose.yml" ]; then
    docker-compose up -d
    echo "✅ Backend services started"
else
    echo "⚠️  docker-compose.yml not found, skipping backend services"
fi

# Wait a moment for services to start
sleep 5

# Start frontend
echo "🎨 Starting frontend..."
npm run dev &

echo "🎉 Highland Coffee is starting up!"
echo ""
echo "📱 Frontend: http://localhost:5173"
echo "🔗 API Gateway: http://localhost:8080"
echo "🔍 Eureka Server: http://localhost:8761"
echo "🐰 RabbitMQ Management: http://localhost:15672"
echo ""
echo "Press Ctrl+C to stop all services"
EOF
    
    chmod +x start-highland.sh
    print_success "Startup script created: ./start-highland.sh"
}

# Create stop script
create_stop_script() {
    print_step "Creating stop script..."
    
    cat > stop-highland.sh << 'EOF'
#!/bin/bash

# Highland Coffee Stop Script

echo "🛑 Stopping Highland Coffee Project..."

# Stop Docker Compose services
if [ -f "docker-compose.yml" ]; then
    docker-compose down
    echo "✅ Backend services stopped"
fi

# Kill frontend process
pkill -f "npm run dev" || true
echo "✅ Frontend stopped"

echo "🎉 All services stopped"
EOF
    
    chmod +x stop-highland.sh
    print_success "Stop script created: ./stop-highland.sh"
}

# Create health check script
create_health_check_script() {
    print_step "Creating health check script..."
    
    cat > health-check.sh << 'EOF'
#!/bin/bash

# Highland Coffee Health Check Script

echo "🏥 Highland Coffee Health Check"
echo "================================"

# Check Docker
if docker info > /dev/null 2>&1; then
    echo "✅ Docker: Running"
else
    echo "❌ Docker: Not running"
fi

# Check MySQL
if systemctl is-active --quiet mysql; then
    echo "✅ MySQL: Running"
else
    echo "❌ MySQL: Not running"
fi

# Check RabbitMQ
if systemctl is-active --quiet rabbitmq-server; then
    echo "✅ RabbitMQ: Running"
else
    echo "❌ RabbitMQ: Not running"
fi

# Check services
echo ""
echo "🔍 Service Status:"

services=(
    "8761:Eureka Server"
    "8080:API Gateway"
    "8081:User Service"
    "8082:Product Service"
    "8083:Order Service"
    "8084:Payment Service"
    "8085:Notification Service"
    "8086:Loyalty Service"
    "8087:Analytics Service"
    "8088:Store Service"
    "5173:Frontend"
)

for service in "${services[@]}"; do
    port=$(echo $service | cut -d':' -f1)
    name=$(echo $service | cut -d':' -f2)
    
    if netstat -tuln | grep -q ":$port "; then
        echo "✅ $name (Port $port): Running"
    else
        echo "❌ $name (Port $port): Not running"
    fi
done

echo ""
echo "🌐 Access URLs:"
echo "Frontend: http://localhost:5173"
echo "API Gateway: http://localhost:8080"
echo "Eureka Server: http://localhost:8761"
echo "RabbitMQ Management: http://localhost:15672"
EOF
    
    chmod +x health-check.sh
    print_success "Health check script created: ./health-check.sh"
}

# Main installation function
main() {
    print_header
    
    # Check if not running as root
    check_root
    
    # Update system
    update_system
    
    # Install required tools
    install_java
    install_maven
    install_nodejs
    install_git
    install_docker
    install_mysql
    install_rabbitmq
    
    # Setup project
    clone_project
    setup_project
    create_env_file
    create_startup_script
    create_stop_script
    create_health_check_script
    
    # Final instructions
    echo ""
    print_success "🎉 Highland Coffee setup completed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Log out and log back in for Docker group changes to take effect"
    echo "2. Run: sudo mysql_secure_installation (to secure MySQL)"
    echo "3. Run: ./start-highland.sh (to start all services)"
    echo "4. Run: ./health-check.sh (to check service status)"
    echo ""
    echo "🌐 Access URLs:"
    echo "Frontend: http://localhost:5173"
    echo "API Gateway: http://localhost:8080"
    echo "Eureka Server: http://localhost:8761"
    echo "RabbitMQ Management: http://localhost:15672"
    echo ""
    echo "📚 For detailed documentation, see: UBUNTU_SETUP_GUIDE.md"
}

# Run main function
main "$@"
