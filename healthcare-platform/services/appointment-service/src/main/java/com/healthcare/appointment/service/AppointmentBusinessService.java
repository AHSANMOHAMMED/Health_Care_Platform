package com.healthcare.appointment.service;

import com.healthcare.appointment.client.DoctorInternalClient;
import com.healthcare.appointment.client.TelemedicineClient;
import com.healthcare.appointment.client.UserInternalClient;
import com.healthcare.appointment.client.dto.VideoSessionRequest;
import com.healthcare.appointment.domain.Appointment;
import com.healthcare.appointment.repo.AppointmentRepository;
import feign.FeignException;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AppointmentBusinessService {

  private final AppointmentRepository appointments;
  private final UserInternalClient users;
  private final DoctorInternalClient doctors;
  private final TelemedicineClient telemedicine;
  private final OptionalEventPublisher events;

  @Transactional
  public Appointment book(UUID patientUserId, UUID doctorUserId, Instant start, Instant end, String notes) {
    assertPatient(patientUserId);
    if (!end.isAfter(start)) throw new IllegalArgumentException("Invalid range");
    if (!doctors.covers(doctorUserId, start, end)) {
      throw new IllegalArgumentException("Slot not available");
    }
    Appointment a =
        Appointment.builder()
            .patientUserId(patientUserId)
            .doctorUserId(doctorUserId)
            .startAt(start)
            .endAt(end)
            .status(Appointment.Status.PENDING)
            .build();
    a = appointments.save(a);
    events.publishBooked(a.getId(), patientUserId, doctorUserId);
    return a;
  }

  private void assertPatient(UUID patientUserId) {
    try {
      users.getPatient(patientUserId);
    } catch (FeignException e) {
      if (e.status() == 404) throw new IllegalArgumentException("Patient profile required");
      throw e;
    }
  }

  public List<Appointment> minePatient(UUID id) {
    return appointments.findByPatientUserIdOrderByStartAtDesc(id);
  }

  public List<Appointment> mineDoctor(UUID id) {
    return appointments.findByDoctorUserIdOrderByStartAtDesc(id);
  }

  public Appointment get(UUID id, ApptActor actor, UUID userId) {
    Appointment a =
        appointments.findById(id).orElseThrow(() -> new IllegalArgumentException("Not found"));
    if (actor == ApptActor.ADMIN) return a;
    if (actor == ApptActor.PATIENT && !a.getPatientUserId().equals(userId)) {
      throw new SecurityException("Forbidden");
    }
    if (actor == ApptActor.DOCTOR && !a.getDoctorUserId().equals(userId)) {
      throw new SecurityException("Forbidden");
    }
    return a;
  }

  public enum ApptActor {
    PATIENT,
    DOCTOR,
    ADMIN
  }

  @Transactional
  public Appointment doctorDecision(UUID doctorUserId, UUID apptId, Appointment.Status status) {
    Appointment a =
        appointments.findById(apptId).orElseThrow(() -> new IllegalArgumentException("Not found"));
    if (!a.getDoctorUserId().equals(doctorUserId)) throw new SecurityException("Forbidden");
    if (a.getStatus() != Appointment.Status.PENDING) throw new IllegalArgumentException("Invalid state");
    if (status == Appointment.Status.CONFIRMED) {
      a.setStatus(Appointment.Status.CONFIRMED);
      try {
        var v =
            telemedicine.createSession(
                new VideoSessionRequest(a.getId(), a.getPatientUserId(), a.getDoctorUserId()));
        a.setVideoChannel(v.channel());
        a.setVideoToken(v.token());
      } catch (Exception ex) {
        // telemedicine optional in local dev
      }
    } else if (status == Appointment.Status.REJECTED) {
      a.setStatus(Appointment.Status.REJECTED);
    } else {
      throw new IllegalArgumentException("Invalid decision");
    }
    return appointments.save(a);
  }

  @Transactional
  public Appointment patientCancel(UUID patientUserId, UUID apptId) {
    Appointment a =
        appointments.findById(apptId).orElseThrow(() -> new IllegalArgumentException("Not found"));
    if (!a.getPatientUserId().equals(patientUserId)) throw new SecurityException("Forbidden");
    if (a.getStatus() != Appointment.Status.PENDING && a.getStatus() != Appointment.Status.CONFIRMED) {
      throw new IllegalArgumentException("Cannot cancel");
    }
    a.setStatus(Appointment.Status.CANCELLED);
    return appointments.save(a);
  }

  @Transactional
  public Appointment prescribe(UUID doctorUserId, UUID apptId, String text) {
    Appointment a =
        appointments.findById(apptId).orElseThrow(() -> new IllegalArgumentException("Not found"));
    if (!a.getDoctorUserId().equals(doctorUserId)) throw new SecurityException("Forbidden");
    if (a.getStatus() != Appointment.Status.CONFIRMED) throw new IllegalArgumentException("Not confirmed");
    a.setPrescriptionText(text);
    a.setStatus(Appointment.Status.COMPLETED);
    events.publishCompleted(a.getId(), a.getPatientUserId(), a.getDoctorUserId());
    return appointments.save(a);
  }

  public List<Appointment> prescriptionsForPatient(UUID patientUserId) {
    return appointments.findByPatientUserIdOrderByStartAtDesc(patientUserId).stream()
        .filter(x -> x.getPrescriptionText() != null)
        .toList();
  }
}
