// ============================================
// USER CONTROLLER
// ============================================
// Controlador de usuario
// Maneja: perfil, favoritos, seguidos, mis reseñas

import { Request, Response } from 'express';
import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { successResponse, errorResponse } from '../utils/response';
// import { uploadToCloudinary, deleteFromCloudinary } from '../services/imageService';

/**
 * @desc    Obtener perfil del usuario autenticado
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return errorResponse(res, 'Usuario no autenticado', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatar: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            reviews: true,
            favorites: true,
            following: true,
            businesses: true,
          },
        },
      },
    });

    if (!user) {
      return errorResponse(res, 'Usuario no encontrado', 404);
    }

    return successResponse(res, user);
  } catch (error) {
    console.error('Error en getProfile:', error);
    return errorResponse(res, 'Error al obtener perfil', 500);
  }
};

/**
 * @desc    Actualizar perfil del usuario
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { name, phone, currentPassword, newPassword } = req.body;

    if (!userId) {
      return errorResponse(res, 'Usuario no autenticado', 401);
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return errorResponse(res, 'Usuario no encontrado', 404);
    }

    // Preparar datos a actualizar
    const updateData: any = {};

    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone || null;

    // Si quiere cambiar contraseña, verificar la actual
    if (newPassword) {
      if (!currentPassword) {
        return errorResponse(res, 'Contraseña actual requerida', 400);
      }

      const isPasswordValid = await comparePassword(currentPassword, user.password);
      if (!isPasswordValid) {
        return errorResponse(res, 'Contraseña actual incorrecta', 400);
      }

      updateData.password = await hashPassword(newPassword);
    }

    // Actualizar usuario
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatar: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return successResponse(res, updatedUser, 'Perfil actualizado exitosamente');
  } catch (error) {
    console.error('Error en updateProfile:', error);
    return errorResponse(res, 'Error al actualizar perfil', 500);
  }
};

/**
 * @desc    Subir/actualizar avatar del usuario
 * @route   POST /api/users/avatar
 * @access  Private
 * @note    Funcionalidad futura - requiere configuración de Cloudinary
 */
export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return errorResponse(res, 'Usuario no autenticado', 401);
    }

    // TODO: Implementar subida de avatar con Cloudinary
    // const file = req.file;
    // if (!file) {
    //   return errorResponse(res, 'No se ha proporcionado ninguna imagen', 400);
    // }

    // const user = await prisma.user.findUnique({
    //   where: { id: userId },
    //   select: { avatar: true },
    // });

    // // Si ya tiene avatar, eliminarlo de Cloudinary
    // if (user?.avatar) {
    //   await deleteFromCloudinary(user.avatar);
    // }

    // // Subir nuevo avatar
    // const avatarUrl = await uploadToCloudinary(file.buffer, 'avatars');

    // // Actualizar en BD
    // const updatedUser = await prisma.user.update({
    //   where: { id: userId },
    //   data: { avatar: avatarUrl },
    //   select: {
    //     id: true,
    //     email: true,
    //     name: true,
    //     phone: true,
    //     avatar: true,
    //     role: true,
    //   },
    // });

    // return successResponse(res, updatedUser, 'Avatar actualizado exitosamente');

    return errorResponse(res, 'Funcionalidad de avatar pendiente de implementar', 501);
  } catch (error) {
    console.error('Error en uploadAvatar:', error);
    return errorResponse(res, 'Error al subir avatar', 500);
  }
};

/**
 * @desc    Eliminar avatar del usuario
 * @route   DELETE /api/users/avatar
 * @access  Private
 * @note    Funcionalidad futura - requiere configuración de Cloudinary
 */
export const deleteAvatar = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return errorResponse(res, 'Usuario no autenticado', 401);
    }

    // TODO: Implementar eliminación de avatar
    // const user = await prisma.user.findUnique({
    //   where: { id: userId },
    //   select: { avatar: true },
    // });

    // if (user?.avatar) {
    //   await deleteFromCloudinary(user.avatar);
    // }

    // await prisma.user.update({
    //   where: { id: userId },
    //   data: { avatar: null },
    // });

    // return successResponse(res, null, 'Avatar eliminado exitosamente');

    return errorResponse(res, 'Funcionalidad de avatar pendiente de implementar', 501);
  } catch (error) {
    console.error('Error en deleteAvatar:', error);
    return errorResponse(res, 'Error al eliminar avatar', 500);
  }
};

/**
 * @desc    Obtener favoritos del usuario
 * @route   GET /api/users/favorites
 * @access  Private
 */
export const getFavorites = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return errorResponse(res, 'Usuario no autenticado', 401);
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        business: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            logo: true,
            coverImage: true,
            address: true,
            city: true,
            phone: true,
            averageRating: true,
            reviewCount: true,
            status: true,
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
                icon: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return successResponse(res, favorites);
  } catch (error) {
    console.error('Error en getFavorites:', error);
    return errorResponse(res, 'Error al obtener favoritos', 500);
  }
};

/**
 * @desc    Agregar negocio a favoritos
 * @route   POST /api/users/favorites/:businessId
 * @access  Private
 */
export const addFavorite = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { businessId } = req.params;

    if (!userId) {
      return errorResponse(res, 'Usuario no autenticado', 401);
    }

    // Verificar que el negocio existe
    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      return errorResponse(res, 'Negocio no encontrado', 404);
    }

    // Verificar si ya está en favoritos
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_businessId: {
          userId,
          businessId,
        },
      },
    });

    if (existingFavorite) {
      return errorResponse(res, 'El negocio ya está en favoritos', 400);
    }

    // Crear favorito y actualizar contador
    const [favorite] = await prisma.$transaction([
      prisma.favorite.create({
        data: {
          userId,
          businessId,
        },
      }),
      prisma.business.update({
        where: { id: businessId },
        data: {
          favoriteCount: {
            increment: 1,
          },
        },
      }),
    ]);

    return successResponse(res, favorite, 'Agregado a favoritos', 201);
  } catch (error) {
    console.error('Error en addFavorite:', error);
    return errorResponse(res, 'Error al agregar favorito', 500);
  }
};

/**
 * @desc    Remover negocio de favoritos
 * @route   DELETE /api/users/favorites/:businessId
 * @access  Private
 */
export const removeFavorite = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { businessId } = req.params;

    if (!userId) {
      return errorResponse(res, 'Usuario no autenticado', 401);
    }

    // Verificar que el favorito existe
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_businessId: {
          userId,
          businessId,
        },
      },
    });

    if (!favorite) {
      return errorResponse(res, 'El negocio no está en favoritos', 404);
    }

    // Eliminar favorito y actualizar contador
    await prisma.$transaction([
      prisma.favorite.delete({
        where: {
          userId_businessId: {
            userId,
            businessId,
          },
        },
      }),
      prisma.business.update({
        where: { id: businessId },
        data: {
          favoriteCount: {
            decrement: 1,
          },
        },
      }),
    ]);

    return successResponse(res, null, 'Removido de favoritos');
  } catch (error) {
    console.error('Error en removeFavorite:', error);
    return errorResponse(res, 'Error al remover favorito', 500);
  }
};

/**
 * @desc    Obtener negocios que sigue el usuario
 * @route   GET /api/users/following
 * @access  Private
 */
export const getFollowing = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return errorResponse(res, 'Usuario no autenticado', 401);
    }

    const following = await prisma.following.findMany({
      where: { userId },
      include: {
        business: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            logo: true,
            coverImage: true,
            address: true,
            city: true,
            phone: true,
            averageRating: true,
            reviewCount: true,
            status: true,
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
                icon: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return successResponse(res, following);
  } catch (error) {
    console.error('Error en getFollowing:', error);
    return errorResponse(res, 'Error al obtener seguidos', 500);
  }
};

/**
 * @desc    Seguir un negocio
 * @route   POST /api/users/following/:businessId
 * @access  Private
 */
export const followBusiness = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { businessId } = req.params;

    if (!userId) {
      return errorResponse(res, 'Usuario no autenticado', 401);
    }

    // Verificar que el negocio existe
    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      return errorResponse(res, 'Negocio no encontrado', 404);
    }

    // Verificar si ya lo sigue
    const existingFollow = await prisma.following.findUnique({
      where: {
        userId_businessId: {
          userId,
          businessId,
        },
      },
    });

    if (existingFollow) {
      return errorResponse(res, 'Ya sigues este negocio', 400);
    }

    // Crear seguimiento
    const following = await prisma.following.create({
      data: {
        userId,
        businessId,
      },
    });

    return successResponse(res, following, 'Ahora sigues este negocio', 201);
  } catch (error) {
    console.error('Error en followBusiness:', error);
    return errorResponse(res, 'Error al seguir negocio', 500);
  }
};

/**
 * @desc    Dejar de seguir un negocio
 * @route   DELETE /api/users/following/:businessId
 * @access  Private
 */
export const unfollowBusiness = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { businessId } = req.params;

    if (!userId) {
      return errorResponse(res, 'Usuario no autenticado', 401);
    }

    // Verificar que el seguimiento existe
    const following = await prisma.following.findUnique({
      where: {
        userId_businessId: {
          userId,
          businessId,
        },
      },
    });

    if (!following) {
      return errorResponse(res, 'No sigues este negocio', 404);
    }

    // Eliminar seguimiento
    await prisma.following.delete({
      where: {
        userId_businessId: {
          userId,
          businessId,
        },
      },
    });

    return successResponse(res, null, 'Dejaste de seguir este negocio');
  } catch (error) {
    console.error('Error en unfollowBusiness:', error);
    return errorResponse(res, 'Error al dejar de seguir', 500);
  }
};

/**
 * @desc    Obtener reseñas del usuario
 * @route   GET /api/users/reviews
 * @access  Private
 */
export const getMyReviews = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return errorResponse(res, 'Usuario no autenticado', 401);
    }

    const reviews = await prisma.review.findMany({
      where: { userId },
      include: {
        business: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
          },
        },
        _count: {
          select: {
            reactions: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return successResponse(res, reviews);
  } catch (error) {
    console.error('Error en getMyReviews:', error);
    return errorResponse(res, 'Error al obtener reseñas', 500);
  }
};

/**
 * @desc    Cambiar contraseña
 * @route   PUT /api/users/password
 * @access  Private
 */
export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body;

    if (!userId) {
      return errorResponse(res, 'Usuario no autenticado', 401);
    }

    if (!currentPassword || !newPassword) {
      return errorResponse(res, 'Contraseña actual y nueva requeridas', 400);
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return errorResponse(res, 'Usuario no encontrado', 404);
    }

    // Verificar contraseña actual
    const isPasswordValid = await comparePassword(currentPassword, user.password);
    if (!isPasswordValid) {
      return errorResponse(res, 'Contraseña actual incorrecta', 400);
    }

    // Hash de nueva contraseña
    const hashedPassword = await hashPassword(newPassword);

    // Actualizar contraseña
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return successResponse(res, null, 'Contraseña actualizada exitosamente');
  } catch (error) {
    console.error('Error en changePassword:', error);
    return errorResponse(res, 'Error al cambiar contraseña', 500);
  }
};

/**
 * @desc    Eliminar cuenta de usuario
 * @route   DELETE /api/users/account
 * @access  Private
 */
export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { password } = req.body;

    if (!userId) {
      return errorResponse(res, 'Usuario no autenticado', 401);
    }

    if (!password) {
      return errorResponse(res, 'Contraseña requerida para eliminar cuenta', 400);
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return errorResponse(res, 'Usuario no encontrado', 404);
    }

    // Verificar contraseña
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return errorResponse(res, 'Contraseña incorrecta', 400);
    }

    // Eliminar usuario (las relaciones se eliminan en cascada si está configurado)
    await prisma.user.delete({
      where: { id: userId },
    });

    return successResponse(res, null, 'Cuenta eliminada exitosamente');
  } catch (error) {
    console.error('Error en deleteAccount:', error);
    return errorResponse(res, 'Error al eliminar cuenta', 500);
  }
};
