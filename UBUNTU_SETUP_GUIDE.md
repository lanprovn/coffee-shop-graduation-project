# 🚀 Highland Coffee Project - Ubuntu Linux Setup Guide

## 📋 **Tổng quan**
Dự án Highland Coffee bao gồm:
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Java Spring Boot Microservices
- **Database**: H2 (embedded) + MySQL (production)
- **Message Queue**: RabbitMQ
- **Service Discovery**: Eureka Server

---

## 🛠️ **1. CÀI ĐẶT CÁC CÔNG CỤ CẦN THIẾT**

### **1.1. Cập nhật hệ thống**
```bash
sudo apt update && sudo apt upgrade -y
```

### **1.2. Cài đặt Java 17 (Backend)**
```bash
# Cài đặt OpenJDK 17
sudo apt install openjdk-17-jdk -y

# Kiểm tra phiên bản
java -version
javac -version

# Cài đặt Maven
sudo apt install maven -y
mvn -version
```

### **1.3. Cài đặt Node.js 18+ (Frontend)**
```bash
# Cài đặt Node.js qua NodeSource
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Kiểm tra phiên bản
node -v
npm -v

# Cài đặt Yarn (tùy chọn)
sudo npm install -g yarn
yarn -v
```

### **1.4. Cài đặt Git**
```bash
sudo apt install git -y
git --version
```

### **1.5. Cài đặt Docker & Docker Compose**
```bash
# Cài đặt Docker
sudo apt install apt-transport-https ca-certificates curl software-properties-common -y
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt update
sudo apt install docker-ce -y

# Thêm user vào docker group
sudo usermod -aG docker $USER

# Cài đặt Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Kiểm tra cài đặt
docker --version
docker-compose --version
```

### **1.6. Cài đặt MySQL (Production Database)**
```bash
# Cài đặt MySQL Server
sudo apt install mysql-server -y

# Bảo mật MySQL
sudo mysql_secure_installation

# Tạo database và user
sudo mysql -u root -p
```

```sql
-- Trong MySQL console
CREATE DATABASE highland_coffee;
CREATE USER 'highland_user'@'localhost' IDENTIFIED BY 'highland_password';
GRANT ALL PRIVILEGES ON highland_coffee.* TO 'highland_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### **1.7. Cài đặt RabbitMQ**
```bash
# Cài đặt Erlang
sudo apt install erlang -y

# Cài đặt RabbitMQ
sudo apt install rabbitmq-server -y

# Khởi động và enable RabbitMQ
sudo systemctl start rabbitmq-server
sudo systemctl enable rabbitmq-server

# Cài đặt RabbitMQ Management Plugin
sudo rabbitmq-plugins enable rabbitmq_management

# Tạo admin user
sudo rabbitmqctl add_user admin admin123
sudo rabbitmqctl set_user_tags admin administrator
sudo rabbitmqctl set_permissions -p / admin ".*" ".*" ".*"
```

---

## 📥 **2. CLONE PROJECT**

### **2.1. Clone repository**
```bash
# Clone project
git clone https://github.com/lanprovn/coffee-shop-graduation-project.git
cd coffee-shop-graduation-project

# Kiểm tra cấu trúc project
ls -la
```

### **2.2. Cấu trúc project**
```
coffee-shop-graduation-project/
├── frontend/                 # React Frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── backend/                  # Spring Boot Microservices
│   ├── api-gateway/
│   ├── eureka-server/
│   ├── user-service/
│   ├── product-service/
│   ├── order-service/
│   ├── payment-service/
│   ├── notification-service/
│   ├── loyalty-service/
│   ├── analytics-service/
│   ├── store-service/
│   └── shared-config/
├── docker-compose.yml        # Docker services
└── README.md
```

---

## 🚀 **3. CHẠY FRONTEND**

### **3.1. Cài đặt dependencies**
```bash
# Vào thư mục frontend (hoặc root nếu frontend ở root)
cd coffee-shop-graduation-project

# Cài đặt npm packages
npm install

# Hoặc sử dụng yarn
yarn install
```

### **3.2. Chạy development server**
```bash
# Chạy dev server
npm run dev

# Hoặc với yarn
yarn dev

# Frontend sẽ chạy tại: http://localhost:5173
```

### **3.3. Build production**
```bash
# Build production
npm run build

# Preview production build
npm run preview
```

---

## ☕ **4. CHẠY BACKEND MICROSERVICES**

### **4.1. Cài đặt dependencies**
```bash
# Vào thư mục backend
cd backend

# Build tất cả services
mvn clean install

# Hoặc build từng service
mvn clean install -pl eureka-server
mvn clean install -pl api-gateway
mvn clean install -pl user-service
# ... các service khác
```

### **4.2. Chạy với Docker Compose (Khuyến nghị)**
```bash
# Vào thư mục root
cd coffee-shop-graduation-project

# Chạy tất cả services
docker-compose up -d

# Xem logs
docker-compose logs -f

# Dừng services
docker-compose down
```

### **4.3. Chạy thủ công từng service**
```bash
# Terminal 1: Eureka Server
cd backend/eureka-server
mvn spring-boot:run

# Terminal 2: API Gateway
cd backend/api-gateway
mvn spring-boot:run

# Terminal 3: User Service
cd backend/user-service
mvn spring-boot:run

# Terminal 4: Product Service
cd backend/product-service
mvn spring-boot:run

# Terminal 5: Order Service
cd backend/order-service
mvn spring-boot:run

# Terminal 6: Payment Service
cd backend/payment-service
mvn spring-boot:run

# Terminal 7: Notification Service
cd backend/notification-service
mvn spring-boot:run

# Terminal 8: Loyalty Service
cd backend/loyalty-service
mvn spring-boot:run

# Terminal 9: Analytics Service
cd backend/analytics-service
mvn spring-boot:run

# Terminal 10: Store Service
cd backend/store-service
mvn spring-boot:run
```

---

## 🌐 **5. TRUY CẬP CÁC SERVICES**

### **5.1. Frontend**
- **URL**: http://localhost:5173
- **Description**: Highland Coffee Frontend Application

### **5.2. Backend Services**
- **Eureka Server**: http://localhost:8761
- **API Gateway**: http://localhost:8080
- **User Service**: http://localhost:8081
- **Product Service**: http://localhost:8082
- **Order Service**: http://localhost:8083
- **Payment Service**: http://localhost:8084
- **Notification Service**: http://localhost:8085
- **Loyalty Service**: http://localhost:8086
- **Analytics Service**: http://localhost:8087
- **Store Service**: http://localhost:8088

### **5.3. Management Interfaces**
- **RabbitMQ Management**: http://localhost:15672
  - Username: admin
  - Password: admin123
- **MySQL**: localhost:3306
  - Database: highland_coffee
  - Username: highland_user
  - Password: highland_password

---

## 🔧 **6. CẤU HÌNH MÔI TRƯỜNG**

### **6.1. Environment Variables**
```bash
# Tạo file .env cho frontend
cat > .env << EOF
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_NAME=Highland Coffee
VITE_APP_VERSION=1.0.0
EOF
```

### **6.2. Database Configuration**
```bash
# Cấu hình MySQL cho production
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

# Thêm các dòng sau:
# bind-address = 0.0.0.0
# max_connections = 200
# innodb_buffer_pool_size = 256M
```

---

## 🐳 **7. DOCKER COMMANDS**

### **7.1. Docker Compose Commands**
```bash
# Chạy tất cả services
docker-compose up -d

# Chạy chỉ một số services
docker-compose up -d eureka-server api-gateway user-service

# Xem logs
docker-compose logs -f [service-name]

# Restart service
docker-compose restart [service-name]

# Scale service
docker-compose up -d --scale user-service=3

# Dừng tất cả
docker-compose down

# Dừng và xóa volumes
docker-compose down -v
```

### **7.2. Docker Commands**
```bash
# Xem containers đang chạy
docker ps

# Xem images
docker images

# Xem logs container
docker logs [container-id]

# Vào container
docker exec -it [container-id] bash

# Xóa containers không dùng
docker container prune

# Xóa images không dùng
docker image prune
```

---

## 🚨 **8. TROUBLESHOOTING**

### **8.1. Lỗi thường gặp**

#### **Port đã được sử dụng**
```bash
# Kiểm tra port đang sử dụng
sudo netstat -tulpn | grep :8080

# Kill process sử dụng port
sudo kill -9 [PID]

# Hoặc thay đổi port trong application.yml
```

#### **Java version không đúng**
```bash
# Kiểm tra Java version
java -version

# Cài đặt Java 17 nếu cần
sudo apt install openjdk-17-jdk -y

# Set JAVA_HOME
echo 'export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64' >> ~/.bashrc
source ~/.bashrc
```

#### **Node.js version không đúng**
```bash
# Kiểm tra Node.js version
node -v

# Cài đặt Node.js 18+ nếu cần
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### **Maven build lỗi**
```bash
# Clean và rebuild
mvn clean install -U

# Skip tests nếu cần
mvn clean install -DskipTests

# Xem chi tiết lỗi
mvn clean install -X
```

### **8.2. Logs và Debugging**
```bash
# Xem logs Spring Boot
tail -f logs/application.log

# Xem logs Docker
docker-compose logs -f [service-name]

# Xem logs system
sudo journalctl -u [service-name] -f
```

---

## 📊 **9. MONITORING & HEALTH CHECKS**

### **9.1. Health Check URLs**
```bash
# Eureka Server
curl http://localhost:8761/actuator/health

# API Gateway
curl http://localhost:8080/actuator/health

# User Service
curl http://localhost:8081/actuator/health

# Product Service
curl http://localhost:8082/actuator/health
```

### **9.2. Monitoring Commands**
```bash
# Kiểm tra memory usage
free -h

# Kiểm tra disk usage
df -h

# Kiểm tra CPU usage
top

# Kiểm tra network connections
netstat -tulpn
```

---

## 🔒 **10. SECURITY**

### **10.1. Firewall Configuration**
```bash
# Cài đặt UFW
sudo apt install ufw -y

# Cho phép SSH
sudo ufw allow ssh

# Cho phép HTTP/HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Cho phép ports cho development
sudo ufw allow 5173  # Frontend
sudo ufw allow 8080  # API Gateway
sudo ufw allow 8761  # Eureka

# Enable firewall
sudo ufw enable
```

### **10.2. SSL/TLS Setup**
```bash
# Cài đặt Certbot
sudo apt install certbot -y

# Tạo SSL certificate (nếu có domain)
sudo certbot --nginx -d yourdomain.com
```

---

## 🚀 **11. DEPLOYMENT**

### **11.1. Production Build**
```bash
# Frontend production build
npm run build

# Backend production build
mvn clean package -Pprod

# Docker production build
docker-compose -f docker-compose.prod.yml up -d
```

### **11.2. PM2 Process Manager (Frontend)**
```bash
# Cài đặt PM2
sudo npm install -g pm2

# Chạy frontend với PM2
pm2 start npm --name "highland-frontend" -- start

# Xem processes
pm2 list

# Restart process
pm2 restart highland-frontend

# Stop process
pm2 stop highland-frontend
```

---

## 📝 **12. USEFUL COMMANDS**

### **12.1. Development Commands**
```bash
# Frontend
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production
npm run lint         # Lint code
npm run test         # Run tests

# Backend
mvn spring-boot:run  # Run Spring Boot app
mvn clean install   # Build project
mvn test            # Run tests
mvn clean           # Clean build
```

### **12.2. System Commands**
```bash
# Restart services
sudo systemctl restart mysql
sudo systemctl restart rabbitmq-server

# Check service status
sudo systemctl status mysql
sudo systemctl status rabbitmq-server

# Enable services
sudo systemctl enable mysql
sudo systemctl enable rabbitmq-server
```

---

## 🎯 **13. QUICK START**

### **13.1. Chạy nhanh tất cả**
```bash
# 1. Clone project
git clone https://github.com/lanprovn/coffee-shop-graduation-project.git
cd coffee-shop-graduation-project

# 2. Cài đặt dependencies
npm install

# 3. Chạy backend với Docker
docker-compose up -d

# 4. Chạy frontend
npm run dev

# 5. Truy cập ứng dụng
# Frontend: http://localhost:5173
# Backend: http://localhost:8080
# Eureka: http://localhost:8761
```

### **13.2. Kiểm tra tất cả services**
```bash
# Kiểm tra Docker containers
docker ps

# Kiểm tra ports
sudo netstat -tulpn | grep -E ':(5173|8080|8761|8081|8082|8083|8084|8085|8086|8087|8088)'

# Kiểm tra logs
docker-compose logs --tail=50
```

---

## 📞 **14. SUPPORT**

### **14.1. Liên hệ**
- **GitHub Issues**: https://github.com/lanprovn/coffee-shop-graduation-project/issues
- **Documentation**: README.md trong project

### **14.2. Resources**
- **Spring Boot**: https://spring.io/projects/spring-boot
- **React**: https://reactjs.org/
- **Docker**: https://docs.docker.com/
- **Ubuntu**: https://ubuntu.com/

---

## 🎉 **15. KẾT LUẬN**

Với hướng dẫn này, bạn có thể:
- ✅ Cài đặt đầy đủ môi trường development trên Ubuntu
- ✅ Chạy được cả frontend và backend microservices
- ✅ Sử dụng Docker để quản lý services
- ✅ Deploy production với các best practices
- ✅ Monitor và troubleshoot các vấn đề

**Chúc bạn thành công với dự án Highland Coffee!** ☕🚀
