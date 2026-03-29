package com.healthcare.appointment.repo;

import com.healthcare.appointment.domain.Appointment;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {
  List<Appointment> findByPatientUserIdOrderByStartAtDesc(UUID patientUserId);

  List<Appointment> findByDoctorUserIdOrderByStartAtDesc(UUID doctorUserId);
}
