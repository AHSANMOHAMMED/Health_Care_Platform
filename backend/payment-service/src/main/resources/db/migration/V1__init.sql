CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    appointment_id BIGINT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    status VARCHAR(50) NOT NULL,
    payhere_payment_id VARCHAR(255),
    timestamp TIMESTAMP
);
