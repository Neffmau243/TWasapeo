// ============================================
// AUTH CONTROLLER
// ============================================
// Controlador de autenticación
// Maneja: registro, login, refresh token, forgot/reset password

import { Request, Response } from 'express';
import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../services/tokenService';
import { sendEmail, EmailType } from '../services/emailService';
import { successResponse, errorResponse } from '../utils/response';
import crypto from 'crypto';

/**
 * @desc    Registrar nuevo usuario
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, phone } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return errorResponse(res, 'El email ya está registrado', 400);
    }

    // Hash de la contraseña
    const hashedPassword = await hashPassword(password);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        phone: phone || null,
        role: 'USER',
        isVerified: false,
      },
    });

    // Generar token de verificación (válido por 24 horas)
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Guardar token en la BD
    await prisma.user.update({
      where: { id: user.id },
      data: { verificationToken },
    });

    // Enviar email de bienvenida con link de verificación
    await sendEmail(
      user.email,
      EmailType.WELCOME,
      {
        name: user.name,
        verificationLink: `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`,
      }
    );

    // Generar tokens JWT
    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    // Respuesta exitosa (sin incluir la contraseña)
    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    };

    return successResponse(res, {
      user: userResponse,
      accessToken,
      refreshToken,
      message: 'Usuario registrado exitosamente. Revisa tu email para verificar tu cuenta.',
    }, 201);

  } catch (error) {
    console.error('Error en register:', error);
    return errorResponse(res, 'Error al registrar usuario', 500);
  }
};

/**
 * @desc    Iniciar sesión
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    console.log('🔍 Login attempt:', { email, passwordLength: password ? password.length : 0 });

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      console.warn('⚠️ Login failed: User not found for email:', email);
      return errorResponse(res, 'Credenciales inválidas', 401);
    }

    console.log('✅ User found:', { id: user.id, email: user.email, storedPasswordHash: user.password.substring(0, 20) + '...' });

    // Verificar contraseña
    const isPasswordValid = await comparePassword(password, user.password);

    console.log('🔐 Password validation result:', isPasswordValid);

    if (!isPasswordValid) {
      console.warn('⚠️ Login failed: Invalid password for user:', email);
      return errorResponse(res, 'Credenciales inválidas', 401);
    }

    // Generar tokens JWT
    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    // Respuesta exitosa (sin incluir la contraseña)
    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    };

    return successResponse(res, {
      user: userResponse,
      accessToken,
      refreshToken,
      message: 'Inicio de sesión exitoso',
    });

  } catch (error) {
    console.error('Error en login:', error);
    return errorResponse(res, 'Error al iniciar sesión', 500);
  }
};

/**
 * @desc    Refrescar token JWT
 * @route   POST /api/auth/refresh
 * @access  Public
 */
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return errorResponse(res, 'Refresh token requerido', 401);
    }

    // Verificar refresh token
    const decoded = verifyToken(refreshToken, true);

    if (!decoded || !decoded.userId) {
      return errorResponse(res, 'Refresh token inválido o expirado', 401);
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return errorResponse(res, 'Usuario no encontrado', 404);
    }

    // Generar nuevos tokens
    const newAccessToken = generateAccessToken(user.id, user.role);
    const newRefreshToken = generateRefreshToken(user.id);

    return successResponse(res, {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });

  } catch (error) {
    console.error('Error en refreshToken:', error);
    return errorResponse(res, 'Error al refrescar token', 500);
  }
};

/**
 * @desc    Solicitar recuperación de contraseña
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Validar email
    if (!email) {
      return errorResponse(res, 'Email requerido', 400);
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Por seguridad, siempre respondemos exitosamente aunque el usuario no exista
    if (!user) {
      return successResponse(res, {
        message: 'Si el email existe, recibirás instrucciones para recuperar tu contraseña',
      });
    }

    // Generar token de reseteo (válido por 1 hora)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date();
    resetTokenExpires.setHours(resetTokenExpires.getHours() + 1);

    // Guardar token en la BD
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpires,
      },
    });

    // Enviar email con link de reseteo
    await sendEmail(
      user.email,
      EmailType.RESET_PASSWORD,
      {
        name: user.name,
        resetLink: `${process.env.FRONTEND_URL}/reset-password/${resetToken}`,
      }
    );

    return successResponse(res, {
      message: 'Si el email existe, recibirás instrucciones para recuperar tu contraseña',
    });

  } catch (error) {
    console.error('Error en forgotPassword:', error);
    return errorResponse(res, 'Error al procesar solicitud', 500);
  }
};

/**
 * @desc    Resetear contraseña con token
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return errorResponse(res, 'Token y nueva contraseña requeridos', 400);
    }

    // Buscar usuario por el token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: {
          gte: new Date(), // Token no expirado
        },
      },
    });

    if (!user) {
      return errorResponse(res, 'Token inválido o expirado', 400);
    }

    // Hash de la nueva contraseña
    const hashedPassword = await hashPassword(newPassword);

    // Actualizar contraseña y limpiar tokens
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      },
    });

    return successResponse(res, {
      message: 'Contraseña actualizada exitosamente',
    });

  } catch (error) {
    console.error('Error en resetPassword:', error);
    return errorResponse(res, 'Error al resetear contraseña', 500);
  }
};

/**
 * @desc    Verificar email con token
 * @route   POST /api/auth/verify-email
 * @access  Public
 */
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return errorResponse(res, 'Token de verificación requerido', 400);
    }

    // Buscar usuario por el token
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
      },
    });

    if (!user) {
      return errorResponse(res, 'Token de verificación inválido', 400);
    }

    if (user.isVerified) {
      return errorResponse(res, 'El email ya ha sido verificado', 400);
    }

    // Actualizar usuario como verificado y limpiar token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
      },
    });

    return successResponse(res, {
      message: 'Email verificado exitosamente',
    });

  } catch (error) {
    console.error('Error en verifyEmail:', error);
    return errorResponse(res, 'Error al verificar email', 500);
  }
};

/**
 * @desc    Reenviar email de verificación
 * @route   POST /api/auth/resend-verification
 * @access  Public
 */
export const resendVerification = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return errorResponse(res, 'Email requerido', 400);
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Por seguridad, no revelamos si el email existe
      return successResponse(res, {
        message: 'Si el email existe, recibirás un nuevo link de verificación',
      });
    }

    if (user.isVerified) {
      return errorResponse(res, 'El email ya ha sido verificado', 400);
    }

    // Generar nuevo token de verificación
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Actualizar token en la BD
    await prisma.user.update({
      where: { id: user.id },
      data: { verificationToken },
    });

    // Enviar email
    await sendEmail(
      user.email,
      EmailType.WELCOME,
      {
        name: user.name,
        verificationLink: `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`,
      }
    );

    return successResponse(res, {
      message: 'Si el email existe, recibirás un nuevo link de verificación',
    });

  } catch (error) {
    console.error('Error en resendVerification:', error);
    return errorResponse(res, 'Error al reenviar verificación', 500);
  }
};
