INSERT INTO user_credentials (email, password, role, status, email_verified) VALUES 
('patient@mediconnect.lk', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HCGKK.l1X6Gq.lJwF.o/q', 'PATIENT', 'APPROVED', true),
('dr.sarah@mediconnect.lk', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HCGKK.l1X6Gq.lJwF.o/q', 'DOCTOR', 'APPROVED', true),
('dr.amal@mediconnect.lk', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HCGKK.l1X6Gq.lJwF.o/q', 'DOCTOR', 'APPROVED', true),
('admin@mediconnect.lk', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HCGKK.l1X6Gq.lJwF.o/q', 'ADMIN', 'APPROVED', true)
ON CONFLICT (email) DO NOTHING;
