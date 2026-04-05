import os

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        f.write(content.strip() + "\n")

def update_yml(path):
    if not os.path.exists(path): return
    with open(path, 'r') as f:
        content = f.read()
    content = content.replace("ddl-auto: update", "ddl-auto: validate")
    content = content.replace("enabled: false", "enabled: true")
    with open(path, 'w') as f:
        f.write(content)

# Update application.yml files
services = ['auth-service', 'patient-service', 'doctor-service', 
            'appointment-service', 'payment-service', 'ai-service']
for s in services:
    update_yml(f"backend/{s}/src/main/resources/application.yml")

# V1__init.sql for auth-service
write_file("backend/auth-service/src/main/resources/db/migration/V1__init.sql", """
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    is_approved BOOLEAN NOT NULL DEFAULT FALSE
);
""")

# V1__init.sql for patient-service
write_file("backend/patient-service/src/main/resources/db/migration/V1__init.sql", """
CREATE TABLE patient_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    date_of_birth DATE,
    phone VARCHAR(20),
    address VARCHAR(255),
    blood_group VARCHAR(10),
    medical_history TEXT
);
""")

# V1__init.sql for doctor-service
write_file("backend/doctor-service/src/main/resources/db/migration/V1__init.sql", """
CREATE TABLE doctor_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    specialization VARCHAR(150),
    qualifications TEXT,
    hospital_affiliation VARCHAR(255),
    consultation_fee NUMERIC(10, 2),
    available_days VARCHAR(100),
    available_time_start VARCHAR(10),
    available_time_end VARCHAR(10)
);
""")

# V1__init.sql for appointment-service
write_file("backend/appointment-service/src/main/resources/db/migration/V1__init.sql", """
CREATE TABLE appointments (
    id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(50) NOT NULL,
    meeting_link VARCHAR(255),
    symptoms TEXT
);
""")

# V1__init.sql for payment-service
write_file("backend/payment-service/src/main/resources/db/migration/V1__init.sql", """
CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    appointment_id BIGINT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    status VARCHAR(50) NOT NULL,
    payhere_payment_id VARCHAR(255),
    timestamp TIMESTAMP
);
""")

# V1__init.sql for ai-service (Optional, but created for schema baseline)
write_file("backend/ai-service/src/main/resources/db/migration/V1__init.sql", """
CREATE TABLE symptom_history (
    id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT,
    symptoms TEXT,
    analysis_result TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
""")

print("Flyway SQL files and YAML configs successfully generated.")
