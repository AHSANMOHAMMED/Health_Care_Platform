package com.mediconnect.notificationservice.service.email;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    
    private final SendGrid sendGridClient;
    
    @Value("${sendgrid.from.email:noreply@mediconnect.lk}")
    private String fromEmail;
    
    public void sendAppointmentConfirmation(String to, String patientName, String doctorName, 
                                           String appointmentDate, String appointmentTime, String meetingUrl) {
        String subject = "Appointment Confirmed - MediConnect Lanka";
        String htmlContent = buildAppointmentEmail(patientName, doctorName, appointmentDate, 
                                                  appointmentTime, meetingUrl);
        
        sendEmail(to, subject, htmlContent);
    }
    
    public void sendPrescriptionNotification(String to, String patientName, String doctorName) {
        String subject = "New Prescription Available - MediConnect Lanka";
        String htmlContent = buildPrescriptionEmail(patientName, doctorName);
        
        sendEmail(to, subject, htmlContent);
    }
    
    public void sendPaymentConfirmation(String to, String patientName, String amount, String appointmentId) {
        String subject = "Payment Successful - MediConnect Lanka";
        String htmlContent = buildPaymentEmail(patientName, amount, appointmentId);
        
        sendEmail(to, subject, htmlContent);
    }
    
    public void sendAppointmentReminder(String to, String patientName, String doctorName, 
                                       String appointmentTime) {
        String subject = "Appointment Reminder - MediConnect Lanka";
        String htmlContent = buildReminderEmail(patientName, doctorName, appointmentTime);
        
        sendEmail(to, subject, htmlContent);
    }
    
    private void sendEmail(String to, String subject, String htmlContent) {
        try {
            Email from = new Email(fromEmail);
            Email recipient = new Email(to);
            Content content = new Content("text/html", htmlContent);
            Mail mail = new Mail(from, subject, recipient, content);
            
            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            
            Response response = sendGridClient.api(request);
            
            if (response.getStatusCode() == 202) {
                log.info("Email sent successfully to: {}", to);
            } else {
                log.error("Failed to send email. Status: {}, Body: {}", 
                    response.getStatusCode(), response.getBody());
            }
        } catch (Exception e) {
            log.error("Error sending email to {}: {}", to, e.getMessage());
        }
    }
    
    private String buildAppointmentEmail(String patientName, String doctorName, String date, 
                                        String time, String meetingUrl) {
        String meetingButton = meetingUrl != null ? 
            "<p><a href='" + meetingUrl + "' style='background: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Join Video Consultation</a></p>" : "";
        return String.format(
            "<html><body style='font-family: Arial, sans-serif;'>" +
            "<h2 style='color: #4F46E5;'>Appointment Confirmed</h2>" +
            "<p>Hi %s,</p>" +
            "<p>Your appointment with <strong>Dr. %s</strong> has been confirmed.</p>" +
            "<div style='background: #F3F4F6; padding: 15px; border-radius: 8px;'>" +
            "<p><strong>Date:</strong> %s</p>" +
            "<p><strong>Time:</strong> %s</p>" +
            "</div>" + meetingButton +
            "<p>Thank you for choosing MediConnect Lanka!</p>" +
            "</body></html>",
            patientName, doctorName, date, time
        );
    }
    
    private String buildPrescriptionEmail(String patientName, String doctorName) {
        return String.format(
            "<html><body style='font-family: Arial, sans-serif;'>" +
            "<h2 style='color: #4F46E5;'>New Prescription Available</h2>" +
            "<p>Hi %s,</p>" +
            "<p>Dr. %s has issued a new prescription for you.</p>" +
            "<p>Please log in to your MediConnect account to view the details.</p>" +
            "<p><a href='https://mediconnect.lk/prescriptions' style='background: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>View Prescription</a></p>" +
            "<p>Thank you for choosing MediConnect Lanka!</p>" +
            "</body></html>",
            patientName, doctorName
        );
    }
    
    private String buildPaymentEmail(String patientName, String amount, String appointmentId) {
        return String.format(
            "<html><body style='font-family: Arial, sans-serif;'>" +
            "<h2 style='color: #4F46E5;'>Payment Successful</h2>" +
            "<p>Hi %s,</p>" +
            "<p>Your payment of <strong>%s</strong> for appointment #%s has been received.</p>" +
            "<p>Thank you for choosing MediConnect Lanka!</p>" +
            "</body></html>",
            patientName, amount, appointmentId
        );
    }
    
    private String buildReminderEmail(String patientName, String doctorName, String appointmentTime) {
        return String.format(
            "<html><body style='font-family: Arial, sans-serif;'>" +
            "<h2 style='color: #4F46E5;'>Appointment Reminder</h2>" +
            "<p>Hi %s,</p>" +
            "<p>This is a reminder that you have an appointment with <strong>Dr. %s</strong> at <strong>%s</strong>.</p>" +
            "<p>Please join on time. The video link will be available in your account.</p>" +
            "<p>Thank you for choosing MediConnect Lanka!</p>" +
            "</body></html>",
            patientName, doctorName, appointmentTime
        );
    }
}
