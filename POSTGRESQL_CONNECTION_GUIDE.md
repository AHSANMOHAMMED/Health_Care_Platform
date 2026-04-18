# PostgreSQL Connection Guide - MediConnect Lanka

## 🔌 Database Connection Information

### **For VS Code PostgreSQL Extension:**

| Setting | Value |
|---------|-------|
| **Host** | `localhost` or `127.0.0.1` |
| **Port** | `5432` |
| **User** | `root` |
| **Password** | `rootpassword` |

### **Connection Strings:**

```
# Auth Service Database
postgresql://root:rootpassword@localhost:5432/auth_db

# Patient Service Database
postgresql://root:rootpassword@localhost:5432/patient_db

# Doctor Service Database
postgresql://root:rootpassword@localhost:5432/doctor_db

# Appointment Service Database
postgresql://root:rootpassword@localhost:5432/appointment_db

# Payment Service Database
postgresql://root:rootpassword@localhost:5432/payment_db

# Prescription Service Database
postgresql://root:rootpassword@localhost:5432/prescription_db

# Telemedicine Service Database
postgresql://root:rootpassword@localhost:5432/telemedicine_db

# AI Service Database
postgresql://root:rootpassword@localhost:5432/ai_db

# Admin Service Database
postgresql://root:rootpassword@localhost:5432/admin_db

# Notification Service Database (if used)
postgresql://root:rootpassword@localhost:5432/notification_db
```

---

## 📦 VS Code PostgreSQL Extension Setup

### **Option 1: PostgreSQL Extension by Weijan Chen**
1. Install from VS Code Marketplace: `PostgreSQL` by Weijan Chen
2. Click the database icon in left sidebar
3. Click "+" to add connection
4. Fill in:
   - Host: `localhost`
   - Port: `5432`
   - User: `root`
   - Password: `rootpassword`
   - Database: Select from list above

### **Option 2: SQLTools Extension**
1. Install "SQLTools" and "SQLTools PostgreSQL Driver"
2. Press `Ctrl+Shift+P` → "SQLTools: Add New Connection"
3. Select PostgreSQL
4. Enter connection details

### **Option 3: Using psql Command Line**
```bash
# Connect to a specific database
psql -h localhost -p 5432 -U root -d auth_db

# List all databases
psql -h localhost -p 5432 -U root -c "\l"

# Password: rootpassword
```

---

## 🐳 Docker PostgreSQL Access

### **If PostgreSQL is running in Docker:**

```bash
# Access PostgreSQL container directly
docker exec -it mediconnect-postgres psql -U root -d auth_db

# List all databases
docker exec -it mediconnect-postgres psql -U root -c "\l"

# Run SQL file
docker exec -i mediconnect-postgres psql -U root -d auth_db < your_script.sql
```

---

## 📊 Database Schemas Overview

### **Each microservice has its own database:**

| Database | Tables | Description |
|----------|--------|-------------|
| `auth_db` | users, roles, refresh_tokens | Authentication & authorization |
| `patient_db` | patients, medical_records | Patient profiles & history |
| `doctor_db` | doctors, specializations, availabilities | Doctor profiles & schedules |
| `appointment_db` | appointments | Appointment bookings |
| `payment_db` | transactions | Payment records & Stripe data |
| `prescription_db` | prescriptions, prescription_medicines | Medical prescriptions |
| `telemedicine_db` | video_sessions | Video call sessions |
| `ai_db` | (config/usage logs) | AI service data |
| `admin_db` | (aggregated views) | Admin dashboard data |

---

## 🔧 Environment Variables (from .env file)

```bash
# Database Connection
DB_HOST=localhost
DB_PORT=5432
DB_USER=root
DB_PASSWORD=rootpassword

# Individual Database Names
AUTH_DB=auth_db
PATIENT_DB=patient_db
DOCTOR_DB=doctor_db
APPOINTMENT_DB=appointment_db
PAYMENT_DB=payment_db
PRESCRIPTION_DB=prescription_db
TELEMEDICINE_DB=telemedicine_db
AI_DB=ai_db
ADMIN_DB=admin_db
```

---

## 📱 Database Management Tools

### **Recommended GUI Tools:**
1. **pgAdmin 4** - Official PostgreSQL tool
   - Download: https://www.pgadmin.org/
   - Connection: localhost:5432

2. **DBeaver** - Universal database tool
   - Download: https://dbeaver.io/
   - Create new PostgreSQL connection

3. **TablePlus** - Modern database client
   - Download: https://tableplus.com/

4. **DataGrip** - JetBrains IDE (paid)
   - Part of JetBrains suite

---

## 🚀 Quick Start Commands

```bash
# Start only PostgreSQL
docker-compose up -d postgres

# Check if PostgreSQL is running
docker ps | grep postgres

# View PostgreSQL logs
docker logs mediconnect-postgres

# Restart PostgreSQL
docker-compose restart postgres

# Reset all databases (WARNING: DELETES ALL DATA)
docker-compose down -v
docker-compose up -d postgres
```

---

## 🔐 Security Notes

- **Default credentials** are for development only
- **Change passwords** in production
- **Use .env file** for sensitive data
- **Never commit** real credentials to git

---

## 🆘 Troubleshooting

### **Connection refused error:**
```bash
# Check if PostgreSQL container is running
docker ps | grep postgres

# If not running, start it
docker-compose up -d postgres

# Check logs
docker logs mediconnect-postgres
```

### **Authentication failed:**
```bash
# Reset PostgreSQL data (WARNING: DELETES DATA)
docker-compose down -v
rm -rf postgres-data/
docker-compose up -d postgres
```

### **Port already in use:**
```bash
# Find process using port 5432
lsof -i :5432

# Kill the process or change port in docker-compose.yml
```

---

## 📞 Support

For issues, check:
1. PostgreSQL logs: `docker logs mediconnect-postgres`
2. Service logs: `docker logs <service-name>`
3. README.md in project root
