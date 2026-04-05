package com.mediconnect.doctor_service.service;

import com.mediconnect.doctor_service.dto.DoctorRequest;
import com.mediconnect.doctor_service.entity.DoctorProfile;
import com.mediconnect.doctor_service.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorService {
    
    private final DoctorRepository doctorRepository;

    public DoctorProfile getProfile(Long userId) {
        return doctorRepository.findByUserId(userId)
                .orElseGet(() -> {
                    DoctorProfile profile = new DoctorProfile();
                    profile.setUserId(userId);
                    return doctorRepository.save(profile);
                });
    }

    public DoctorProfile updateProfile(Long userId, DoctorRequest request) {
        DoctorProfile profile = getProfile(userId);
        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profile.setSpecialization(request.getSpecialization());
        profile.setQualifications(request.getQualifications());
        profile.setHospitalAffiliation(request.getHospitalAffiliation());
        profile.setConsultationFee(request.getConsultationFee());
        profile.setAvailableDays(request.getAvailableDays());
        profile.setAvailableTimeStart(request.getAvailableTimeStart());
        profile.setAvailableTimeEnd(request.getAvailableTimeEnd());
        return doctorRepository.save(profile);
    }
    
    public List<DoctorProfile> getAllDoctors() {
        return doctorRepository.findAll();
    }
    
    public List<DoctorProfile> searchBySpecialization(String specialization) {
        return doctorRepository.findBySpecializationContainingIgnoreCase(specialization);
    }
}
