#!/bin/bash
unset DOCKER_HOST
AZURE_HOST="my-dsproject-deploy-2026.postgres.database.azure.com"
AZURE_USER="adminuser"
PASSWORD="Dsproject123"

DATABASES=("auth_db" "patient_db" "doctor_db" "appointment_db" "payment_db" "ai_db" "prescription_db" "telemedicine_db" "admin_db" "notification_db")

echo "Creating databases on Azure Cloud via master connection..."
for DB in "${DATABASES[@]}"
do
    echo "Creating $DB..."
    docker exec -e PGSSLMODE="disable" -e PGPASSWORD="$PASSWORD" mediconnect-postgres psql -h "$AZURE_HOST" -p 5432 -U "$AZURE_USER" -d postgres -c "CREATE DATABASE $DB;"
done
echo "All Azure databases initialized!"
