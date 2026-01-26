package com.BookingSystem.TravelSmartBackend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender javaMailSender;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Value("${spring.mail.username:noreply@travelsmart.com}")
    private String fromEmail;

    public EmailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    /**
     * Sends a simple text email (backward compatibility).
     */
    public void send(String toEmail, String subject, String body) {
        try {
            sendHtmlEmail(toEmail, subject, body);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }

    /**
     * Sends an HTML email with professional styling.
     */
    public void sendHtmlEmail(String toEmail, String subject, String htmlContent) throws MessagingException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(toEmail);
        helper.setSubject(subject);
        helper.setText(htmlContent, true); // true indicates HTML

        javaMailSender.send(mimeMessage);
    }

    /**
     * Sends a professional verification email with HTML template.
     */
    public void sendVerificationEmail(String toEmail, String username, String token) throws MessagingException {
        String verificationLink = frontendUrl + "/confirm-account?token=" + token;
        String subject = "Welcome to TravelSmart - Verify Your Email";
        String htmlContent = buildVerificationEmailTemplate(username, verificationLink);

        sendHtmlEmail(toEmail, subject, htmlContent);
    }

    /**
     * Builds a professional HTML email template for verification.
     */
    private String buildVerificationEmailTemplate(String username, String verificationLink) {
        return "<!DOCTYPE html>" +
                "<html lang=\"en\">" +
                "<head>" +
                "    <meta charset=\"UTF-8\">" +
                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
                "    <title>Verify Your Email - TravelSmart</title>" +
                "</head>" +
                "<body style=\"margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #f3f4f6;\">" +
                "    <table role=\"presentation\" style=\"width: 100%; border-collapse: collapse; background-color: #f3f4f6;\">" +
                "        <tr>" +
                "            <td style=\"padding: 40px 20px;\">" +
                "                <table role=\"presentation\" style=\"max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);\">" +
                "                    " +
                "                    <!-- Header with Gradient -->" +
                "                    <tr>" +
                "                        <td style=\"background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); padding: 40px 30px; text-align: center;\">" +
                "                            <table role=\"presentation\" style=\"margin: 0 auto;\">" +
                "                                <tr>" +
                "                                    <td style=\"background-color: rgba(255, 255, 255, 0.2); border-radius: 12px; padding: 12px; display: inline-block;\">" +
                "                                        <svg width=\"40\" height=\"40\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"white\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">" +
                "                                            <path d=\"M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z\"></path>" +
                "                                        </svg>" +
                "                                    </td>" +
                "                                </tr>" +
                "                            </table>" +
                "                            <h1 style=\"color: #ffffff; font-size: 32px; font-weight: 700; margin: 20px 0 10px 0; letter-spacing: -0.5px;\">TravelSmart</h1>" +
                "                            <p style=\"color: rgba(255, 255, 255, 0.9); font-size: 16px; margin: 0;\">Your Journey Begins Here</p>" +
                "                        </td>" +
                "                    </tr>" +
                "                    " +
                "                    <!-- Main Content -->" +
                "                    <tr>" +
                "                        <td style=\"padding: 40px 30px;\">" +
                "                            <h2 style=\"color: #111827; font-size: 24px; font-weight: 700; margin: 0 0 16px 0;\">Welcome, " + username + "! 👋</h2>" +
                "                            <p style=\"color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;\">" +
                "                                Thank you for joining TravelSmart! We're excited to have you on board. To get started and unlock all the amazing features, please verify your email address." +
                "                            </p>" +
                "                            " +
                "                            <!-- Features List -->" +
                "                            <div style=\"background-color: #f9fafb; border-radius: 12px; padding: 20px; margin: 24px 0;\">" +
                "                                <p style=\"color: #111827; font-size: 14px; font-weight: 600; margin: 0 0 12px 0;\">✨ What you'll get:</p>" +
                "                                <ul style=\"color: #4b5563; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;\">" +
                "                                    <li>Search and book flights, hotels, trains, and buses</li>" +
                "                                    <li>AI-powered trip planning and recommendations</li>" +
                "                                    <li>Exclusive deals and discounts</li>" +
                "                                    <li>24/7 customer support</li>" +
                "                                </ul>" +
                "                            </div>" +
                "                            " +
                "                            <!-- CTA Button -->" +
                "                            <table role=\"presentation\" style=\"margin: 32px 0;\">" +
                "                                <tr>" +
                "                                    <td style=\"text-align: center;\">" +
                "                                        <a href=\"" + verificationLink + "\" style=\"display: inline-block; background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(6, 182, 212, 0.3); transition: all 0.3s ease;\">" +
                "                                            Verify Email Address" +
                "                                        </a>" +
                "                                    </td>" +
                "                                </tr>" +
                "                            </table>" +
                "                            " +
                "                            <!-- Alternative Link -->" +
                "                            <p style=\"color: #6b7280; font-size: 14px; line-height: 1.6; margin: 24px 0 0 0; text-align: center;\">" +
                "                                If the button doesn't work, copy and paste this link into your browser:" +
                "                            </p>" +
                "                            <p style=\"color: #06b6d4; font-size: 13px; word-break: break-all; margin: 8px 0 0 0; text-align: center;\">" +
                "                                <a href=\"" + verificationLink + "\" style=\"color: #06b6d4; text-decoration: none;\">" + verificationLink + "</a>" +
                "                            </p>" +
                "                            " +
                "                            <!-- Security Note -->" +
                "                            <div style=\"background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 32px 0 0 0; border-radius: 8px;\">" +
                "                                <p style=\"color: #92400e; font-size: 13px; line-height: 1.6; margin: 0;\">" +
                "                                    <strong>🔒 Security Note:</strong> This link will expire in 24 hours. If you didn't create an account with TravelSmart, please ignore this email." +
                "                                </p>" +
                "                            </div>" +
                "                        </td>" +
                "                    </tr>" +
                "                    " +
                "                    <!-- Footer -->" +
                "                    <tr>" +
                "                        <td style=\"background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;\">" +
                "                            <p style=\"color: #6b7280; font-size: 14px; margin: 0 0 12px 0;\">" +
                "                                Need help? Contact us at <a href=\"mailto:support@travelsmart.com\" style=\"color: #06b6d4; text-decoration: none;\">support@travelsmart.com</a>" +
                "                            </p>" +
                "                            <p style=\"color: #9ca3af; font-size: 12px; margin: 0;\">" +
                "                                © 2025 TravelSmart. All rights reserved." +
                "                            </p>" +
                "                            <p style=\"color: #9ca3af; font-size: 12px; margin: 8px 0 0 0;\">" +
                "                                Your trusted travel companion for unforgettable journeys." +
                "                            </p>" +
                "                        </td>" +
                "                    </tr>" +
                "                </table>" +
                "            </td>" +
                "        </tr>" +
                "    </table>" +
                "</body>" +
                "</html>";
    }
}