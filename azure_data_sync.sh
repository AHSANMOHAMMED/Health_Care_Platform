#!/bin/bash

# MediConnect Data Sync Utility: Local Docker -> Azure Cloud
# This script helps you move your existing data from Docker Desktop to Azure.

AZURE_HOST="my-dsproject-deploy-2026.postgres.database.azure.com"
AZURE_USER="adminuser"
LOCAL_POSTGRES_CONTAINER="mediconnect-postgres" # Change if your container name is different

DATABASES=("auth_db" "patient_db" "doctor_db" "appointment_db" "payment_db" "ai_db" "prescription_db" "telemedicine_db" "admin_db" "notification_db")

echo "Starting Data Migration to Azure..."

for DB in "${DATABASES[@]}"
do
    echo "------------------------------------------------"
    echo "Processing $DB..."
    
    # 1. Export from Local Docker
    echo "Exporting $DB from local Docker..."
    docker exec $LOCAL_POSTGRES_CONTAINER pg_dump -U root --no-owner --no-privileges -t '*' $DB > "${DB}_dump.sql"
    
    # 2. Upload to Azure
    # Note: This requires 'psql' installed on your Mac or you can run this command inside the Docker container
    echo "Uploading $DB to Azure (This will ask for your Azure Password: Dsproject123)"
    docker exec -i $LOCAL_POSTGRES_CONTAINER psql "host=$AZURE_HOST port=5432 user=$AZURE_USER dbname=$DB sslmode=require" < "${DB}_dump.sql"
    
    # 3. Cleanup
    rm "${DB}_dump.sql"
done

echo "------------------------------------------------"
echo "All done! Your Azure databases are now synced with your local Docker data."
