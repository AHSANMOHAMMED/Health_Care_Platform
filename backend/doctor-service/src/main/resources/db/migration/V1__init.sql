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
