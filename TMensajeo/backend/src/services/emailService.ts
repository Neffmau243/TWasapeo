// ============================================
// EMAIL SERVICE
// ============================================
// Servicio para enviar emails con Nodemailer
// Incluye templates HTML para diferentes tipos de emails

import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Tipos de emails disponibles
export enum EmailType {
  WELCOME = 'welcome',
  BUSINESS_APPROVED = 'business-approved',
  BUSINESS_REJECTED = 'business-rejected',
  NEW_REVIEW = 'new-review',
  RESET_PASSWORD = 'reset-password',
}

// Configurar transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_PORT === '465', // true para 465, false para otros puertos
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Función genérica para enviar emails con templates
 */
export const sendEmail = async (
  to: string,
  type: EmailType,
  data: Record<string, any>
): Promise<void> => {
  try {
    // Cargar template HTML
    const templatePath = path.join(__dirname, '..', 'templates', `${type}.html`);
    let htmlContent = fs.readFileSync(templatePath, 'utf-8');

    // Reemplazar variables en el template
    Object.keys(data).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      htmlContent = htmlContent.replace(regex, data[key]);
    });

    // Configurar asuntos según tipo
    const subjects: Record<EmailType, string> = {
      [EmailType.WELCOME]: '¡Bienvenido a Locales!',
      [EmailType.BUSINESS_APPROVED]: 'Tu negocio ha sido aprobado',
      [EmailType.BUSINESS_REJECTED]: 'Actualización sobre tu negocio',
      [EmailType.NEW_REVIEW]: 'Nueva reseña en tu negocio',
      [EmailType.RESET_PASSWORD]: 'Recuperación de contraseña',
    };

    // Enviar email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Locales" <noreply@locales.com>',
      to,
      subject: subjects[type],
      html: htmlContent,
    });

    console.log(`✅ Email enviado: ${type} a ${to}`);
  } catch (error) {
    console.error(`❌ Error enviando email ${type}:`, error);
    // No lanzamos error para no bloquear el flujo principal
  }
};

/**
 * Enviar email de bienvenida
 */
export const sendWelcomeEmail = async (email: string, name: string, verificationLink: string) => {
  await sendEmail(email, EmailType.WELCOME, { name, verificationLink });
};

/**
 * Enviar email de negocio aprobado
 */
export const sendBusinessApprovedEmail = async (email: string, businessName: string, businessUrl: string) => {
  await sendEmail(email, EmailType.BUSINESS_APPROVED, { businessName, businessUrl });
};

/**
 * Enviar email de negocio rechazado
 */
export const sendBusinessRejectedEmail = async (email: string, businessName: string, reason: string) => {
  await sendEmail(email, EmailType.BUSINESS_REJECTED, { businessName, reason });
};

/**
 * Enviar email de nueva reseña
 */
export const sendNewReviewEmail = async (email: string, businessName: string, reviewerName: string, rating: number) => {
  await sendEmail(email, EmailType.NEW_REVIEW, { businessName, reviewerName, rating });
};

/**
 * Enviar email de recuperación de contraseña
 */
export const sendPasswordResetEmail = async (email: string, name: string, resetLink: string) => {
  await sendEmail(email, EmailType.RESET_PASSWORD, { name, resetLink });
};
