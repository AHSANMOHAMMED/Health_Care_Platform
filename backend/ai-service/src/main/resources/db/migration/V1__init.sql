CREATE TABLE symptom_history (
    id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT,
    symptoms TEXT,
    analysis_result TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
