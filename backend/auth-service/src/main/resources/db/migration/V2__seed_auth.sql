INSERT INTO users (email, password, role, is_approved) VALUES 
('patient@mediconnect.lk', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HCGKK.l1X6Gq.lJwF.o/q', 'PATIENT', true),
('dr.sarah@mediconnect.lk', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HCGKK.l1X6Gq.lJwF.o/q', 'DOCTOR', true),
('dr.amal@mediconnect.lk', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HCGKK.l1X6Gq.lJwF.o/q', 'DOCTOR', true),
('admin@mediconnect.lk', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HCGKK.l1X6Gq.lJwF.o/q', 'ADMIN', true)
ON CONFLICT (email) DO NOTHING;
