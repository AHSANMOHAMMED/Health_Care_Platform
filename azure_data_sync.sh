#!/bin/bash

# MediConnect Data Sync Utility: Local Docker -> Azure Cloud
# This script helps you move your existing data from Docker Desktop to Azure.

AZURE_HOST="my-dsproject-deploy-2026.postgres.database.azure.com"
AZURE_USER="adminuser"
LOCAL_POSTGRES_CONTAINER="mediconnect-postgres"

DATABASES=("auth_db" "patient_db" "doctor_db" "appointment_db" "payment_db" "ai_db" "prescription_db" "telemedicine_db" "admin_db" "notification_db")

echo "Starting Data Migration to Azure..."

for DB in "${DATABASES[@]}"
do
    echo "------------------------------------------------"
    echo "Processing $DB..."
    
    # Check if DB exists locally before dumping
    if ! docker exec "$LOCAL_POSTGRES_CONTAINER" psql -U root -lqt | cut -d \| -f 1 | grep -qw "$DB"; then
        echo "⚠️  Skipping $DB - Does not exist in local Docker."
        continue
    fi

    # 1. Export from Local Docker
    echo "Exporting $DB from local Docker..."
    docker exec "$LOCAL_POSTGRES_CONTAINER" pg_dump -U root --no-owner --no-privileges -t '*' "$DB" > "${DB}_dump.sql"
    
    # 1.5 Ensure Database exists in Azure (connecting to 'postgres' master database)
    echo "Ensuring $DB exists in Azure cloud..."
    docker exec -e PGSSLMODE="disable" -e PGPASSWORD="Dsproject123" "$LOCAL_POSTGRES_CONTAINER" psql -h "$AZURE_HOST" -p 5432 -U "$AZURE_USER" -d postgres -c "CREATE DATABASE $DB;" 2>/dev/null || true
    
    # 2. Upload to Azure
    echo "Uploading $DB to Azure..."
    docker exec -i -e PGSSLMODE="disable" -e PGPASSWORD="Dsproject123" "$LOCAL_POSTGRES_CONTAINER" psql -h "$AZURE_HOST" -p 5432 -U "$AZURE_USER" -d "$DB" < "${DB}_dump.sql"
    
    # 3. Cleanup
    rm -f "${DB}_dump.sql"
done

echo "------------------------------------------------"
echo "All done! Your Azure databases are now synced with your local Docker data."
