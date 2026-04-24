package com.mediconnect.authservice.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    @Value("${spring.mail.username:noreply@mediconnect.lk}")
    private String fromEmail;

    public void sendVerificationEmail(String to, String token, String firstName) {
        try {
            String verificationUrl = frontendUrl + "/verify-email?token=" + token;

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, "MediConnect Lanka");
            helper.setTo(to);
            helper.setSubject("Verify Your Email - MediConnect Lanka");

            String htmlContent = buildVerificationEmail(firstName, verificationUrl);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Verification email sent to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send verification email to: {}", to, e);
            throw new RuntimeException("Failed to send verification email", e);
        }
    }

    public void sendPasswordResetEmail(String to, String token, String firstName) {
        try {
            String resetUrl = frontendUrl + "/reset-password?token=" + token;

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, "MediConnect Lanka");
            helper.setTo(to);
            helper.setSubject("Password Reset Request - MediConnect Lanka");

            String htmlContent = buildPasswordResetEmail(firstName, resetUrl);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Password reset email sent to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send password reset email to: {}", to, e);
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }

    public void sendDoctorApprovalEmail(String to, String firstName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, "MediConnect Lanka");
            helper.setTo(to);
            helper.setSubject("Doctor Account Approved - MediConnect Lanka");

            String htmlContent = buildDoctorApprovalEmail(firstName);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Doctor approval email sent to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send doctor approval email to: {}", to, e);
            throw new RuntimeException("Failed to send doctor approval email", e);
        }
    }

    public void sendDoctorRejectionEmail(String to, String firstName, String reason) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, "MediConnect Lanka");
            helper.setTo(to);
            helper.setSubject("Doctor Account Application - MediConnect Lanka");

            String htmlContent = buildDoctorRejectionEmail(firstName, reason);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Doctor rejection email sent to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send doctor rejection email to: {}", to, e);
            throw new RuntimeException("Failed to send doctor rejection email", e);
        }
    }

    private String buildVerificationEmail(String firstName, String verificationUrl) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .logo { color: #0EA5E9; font-size: 24px; font-weight: bold; }
                    .content { color: #333333; line-height: 1.6; }
                    .button { display: inline-block; padding: 12px 30px; background-color: #0EA5E9; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                    .footer { text-align: center; color: #666666; font-size: 12px; margin-top: 30px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">MediConnect Lanka</div>
                    </div>
                    <div class="content">
                        <h2>Welcome to MediConnect Lanka, %s!</h2>
                        <p>Thank you for registering with Sri Lanka's national health network. To complete your registration and access all features, please verify your email address.</p>
                        <center><a href="%s" class="button">Verify My Email</a></center>
                        <p>If the button doesn't work, copy and paste this link into your browser:</p>
                        <p style="word-break: break-all; color: #0EA5E9;">%s</p>
                        <p>This link will expire in 24 hours for security reasons.</p>
                    </div>
                    <div class="footer">
                        <p>If you didn't create this account, please ignore this email.</p>
                        <p>&copy; 2026 MediConnect Lanka. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(firstName, verificationUrl, verificationUrl);
    }

    private String buildPasswordResetEmail(String firstName, String resetUrl) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .logo { color: #0EA5E9; font-size: 24px; font-weight: bold; }
                    .content { color: #333333; line-height: 1.6; }
                    .button { display: inline-block; padding: 12px 30px; background-color: #0EA5E9; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                    .footer { text-align: center; color: #666666; font-size: 12px; margin-top: 30px; }
                    .warning { background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 12px; margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">MediConnect Lanka</div>
                    </div>
                    <div class="content">
                        <h2>Password Reset Request</h2>
                        <p>Hi %s,</p>
                        <p>We received a request to reset your password for your MediConnect Lanka account.</p>
                        <center><a href="%s" class="button">Reset My Password</a></center>
                        <div class="warning">
                            <strong>Security Notice:</strong> This link expires in 1 hour. If you didn't request this reset, please ignore this email or contact support if you're concerned.
                        </div>
                    </div>
                    <div class="footer">
                        <p>&copy; 2026 MediConnect Lanka. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(firstName, resetUrl);
    }

    private String buildDoctorApprovalEmail(String firstName) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .logo { color: #0EA5E9; font-size: 24px; font-weight: bold; }
                    .content { color: #333333; line-height: 1.6; }
                    .success { background-color: #D1FAE5; border-left: 4px solid #10B981; padding: 12px; margin: 20px 0; }
                    .button { display: inline-block; padding: 12px 30px; background-color: #0EA5E9; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                    .footer { text-align: center; color: #666666; font-size: 12px; margin-top: 30px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">MediConnect Lanka</div>
                    </div>
                    <div class="content">
                        <h2>Congratulations, Dr. %s!</h2>
                        <div class="success">
                            <strong>Account Approved</strong> - Your doctor account has been verified and approved by our administrative team.
                        </div>
                        <p>You can now access all doctor features including:</p>
                        <ul>
                            <li>Patient management dashboard</li>
                            <li>Appointment scheduling</li>
                            <li>Digital prescriptions</li>
                            <li>Telemedicine consultations</li>
                            <li>Medical reports and analytics</li>
                        </ul>
                        <center><a href="%s/login" class="button">Access Dashboard</a></center>
                    </div>
                    <div class="footer">
                        <p>&copy; 2026 MediConnect Lanka. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(firstName, frontendUrl);
    }

    private String buildDoctorRejectionEmail(String firstName, String reason) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .logo { color: #0EA5E9; font-size: 24px; font-weight: bold; }
                    .content { color: #333333; line-height: 1.6; }
                    .error { background-color: #FEE2E2; border-left: 4px solid #EF4444; padding: 12px; margin: 20px 0; }
                    .footer { text-align: center; color: #666666; font-size: 12px; margin-top: 30px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">MediConnect Lanka</div>
                    </div>
                    <div class="content">
                        <h2>Account Application Update</h2>
                        <p>Hi Dr. %s,</p>
                        <p>Thank you for your interest in joining MediConnect Lanka's network of healthcare professionals.</p>
                        <div class="error">
                            <strong>Application Not Approved</strong><br>
                            Reason: %s
                        </div>
                        <p>If you believe this was an error or would like to provide additional documentation, please contact our support team.</p>
                    </div>
                    <div class="footer">
                        <p>Contact: support@mediconnect.lk</p>
                        <p>&copy; 2026 MediConnect Lanka. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(firstName, reason != null ? reason : "Documentation verification failed");
    }

    // Simple text email fallback
    public void sendSimpleEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }
}
