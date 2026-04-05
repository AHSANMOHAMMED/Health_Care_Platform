INSERT INTO doctor_profiles (user_id, first_name, last_name, specialization, qualifications, hospital_affiliation, consultation_fee, available_days, available_time_start, available_time_end) VALUES
(2, 'Sarah', 'Jenkins', 'Cardiologist', 'MBBS, MD', 'Apollo Hospital', 3500.00, 'MON,WED,FRI', '09:00', '17:00'),
(3, 'Amal', 'Perera', 'General Physician', 'MBBS', 'Nawaloka Hospital', 2000.00, 'TUE,THU', '10:00', '14:00')
ON CONFLICT (user_id) DO NOTHING;
