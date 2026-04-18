-- MediConnect Azure Database Initialization Script
-- Run this script against your Azure PostgreSQL server (my-dsproject-deploy-2026.postgres.database.azure.com)
-- This will create the individual databases required for each microservice.

-- Note: You may need to run these commands individually if your client does not support multi-statement database creation.

CREATE DATABASE auth_db;
CREATE DATABASE patient_db;
CREATE DATABASE doctor_db;
CREATE DATABASE appointment_db;
CREATE DATABASE payment_db;
CREATE DATABASE prescription_db;
CREATE DATABASE telemedicine_db;
CREATE DATABASE ai_db;
CREATE DATABASE admin_db;
CREATE DATABASE notification_db;

-- Verify creation
-- \l   (in psql)
