import { db } from '../database';
import { apartments, apartmentImages, apartmentAmenities } from '../database/schema';
import { eq, and, or, like, asc, desc, count, ne, gte, lte } from 'drizzle-orm';
import { AppError } from '../middleware/errorHandler';
import { supabaseStorage } from './supabase.service';

export const apartmentService = {
  async getAll(options: { page?: number; limit?: number; available?: boolean; featured?: boolean; minPrice?: number; maxPrice?: number; search?: string; sortBy?: string; sortOrder?: 'asc' | 'desc' }) {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const offset = (page - 1) * limit;

    let whereClause: any = undefined;
    const conditions = [];

    if (options.available !== undefined) {
      conditions.push(eq(apartments.available, options.available));
    }

    if (options.featured !== undefined) {
      conditions.push(eq(apartments.featured, options.featured));
    }

    if (options.minPrice !== undefined) {
      conditions.push(gte(apartments.price, options.minPrice.toString()));
    }

    if (options.maxPrice !== undefined) {
      conditions.push(lte(apartments.price, options.maxPrice.toString()));
    }

    if (options.search) {
      conditions.push(or(
        like(apartments.title, `%${options.search}%`),
        like(apartments.description, `%${options.search}%`),
        like(apartments.location, `%${options.search}%`),
      ));
    }

    if (conditions.length > 0) {
      whereClause = and(...conditions);
    }

    let orderBy: any = desc(apartments.createdAt);
    if (options.sortBy) {
      const orderFunc = options.sortOrder === 'asc' ? asc : desc;
      if (options.sortBy === 'price') {
        orderBy = orderFunc(apartments.price);
      } else if (options.sortBy === 'createdAt') {
        orderBy = orderFunc(apartments.createdAt);
      } else if (options.sortBy === 'roomCount') {
        orderBy = orderFunc(apartments.roomCount);
      }
    }

    const items = await db.query.apartments.findMany({
      where: whereClause,
      limit,
      offset,
      orderBy,
      with: {
        images: { orderBy: [asc(apartmentImages.order), asc(apartmentImages.createdAt)] },
        amenities: { with: { amenity: true } },
      },
    });

    const [totalResult] = await db.select({ count: count() }).from(apartments).where(whereClause);
    const total = totalResult.count;
    const totalPages = Math.ceil(total / limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages,
    };
  },

  async getById(id: string) {
    const apartment = await db.query.apartments.findFirst({
      where: eq(apartments.id, id),
      with: {
        images: { orderBy: [asc(apartmentImages.order), asc(apartmentImages.createdAt)] },
        amenities: { with: { amenity: true } },
      },
    });

    if (!apartment) {
      throw new AppError('Apartment not found', 404);
    }

    return apartment;
  },

  async getBySlug(slug: string) {
    const apartment = await db.query.apartments.findFirst({
      where: eq(apartments.slug, slug),
      with: {
        images: { orderBy: [asc(apartmentImages.order), asc(apartmentImages.createdAt)] },
        amenities: { with: { amenity: true } },
      },
    });

    if (!apartment) {
      throw new AppError('Apartment not found', 404);
    }

    return apartment;
  },

  async create(data: any, files?: Express.Multer.File[]) {
    const existing = await db.query.apartments.findFirst({
      where: eq(apartments.slug, data.slug),
    });

    if (existing) {
      throw new AppError('Apartment with this slug already exists', 409);
    }

    // Parse form data (since multer gives us string values for numbers/booleans)
    const parsedData:any = {
      title: data.title,
      slug: data.slug,
      description: data.description,
      price: parseFloat(data.price),
      roomCount: parseInt(data.roomCount),
      bathrooms: parseInt(data.bathrooms),
      squareFootage: data.squareFootage ? parseInt(data.squareFootage) : undefined,
      furnished: data.furnished === 'true',
      available: data.available === 'true',
      featured: data.featured === 'true',
      tourUrl: data.tourUrl,
      location: data.location,
    };

    const [apartment] = await db.insert(apartments).values(parsedData).returning();

    // Upload new images
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = `${Date.now()}-${file.originalname}`;
        const filePath = `apartments/${apartment.id}/${fileName}`;
        const uploadResult = await supabaseStorage.uploadFile(
          file.buffer,
          'apartment-images',
          filePath,
          { contentType: file.mimetype }
        );
        await db.insert(apartmentImages).values({
          apartmentId: apartment.id,
          url: uploadResult.url,
          order: i,
          isPrimary: i === 0,
        });
      }
    }

    // Handle amenities if provided
    if (data.amenities) {
      const amenityIds = Array.isArray(data.amenities) ? data.amenities : [data.amenities];
      for (const amenityId of amenityIds) {
        await db.insert(apartmentAmenities).values({
          apartmentId: apartment.id,
          amenityId,
        });
      }
    }

    return this.getById(apartment.id);
  },

  async update(id: string, data: any, files?: Express.Multer.File[]) {
    const existing = await this.getById(id);

    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await db.query.apartments.findFirst({
        where: and(eq(apartments.slug, data.slug), ne(apartments.id, id)),
      });

      if (slugExists) {
        throw new AppError('Apartment with this slug already exists', 409);
      }
    }

    // Parse form data
    const parsedData:any = {
      title: data.title,
      slug: data.slug,
      description: data.description,
      price: data.price ? parseFloat(data.price) : undefined,
      roomCount: data.roomCount ? parseInt(data.roomCount) : undefined,
      bathrooms: data.bathrooms ? parseInt(data.bathrooms) : undefined,
      squareFootage: data.squareFootage ? parseInt(data.squareFootage) : undefined,
      furnished: data.furnished !== undefined ? data.furnished === 'true' : undefined,
      available: data.available !== undefined ? data.available === 'true' : undefined,
      featured: data.featured !== undefined ? data.featured === 'true' : undefined,
      tourUrl: data.tourUrl,
      location: data.location,
      updatedAt: new Date(),
    };

    await db.update(apartments).set(parsedData).where(eq(apartments.id, id)).returning();

    // Handle existing images to keep
    const existingImageUrls = data.existingImages 
      ? (Array.isArray(data.existingImages) ? data.existingImages : [data.existingImages])
      : [];

    // Delete images that are no longer in existingImages
    for (const img of existing.images) {
      if (!existingImageUrls.includes(img.url)) {
        await this.deleteImage(img.id);
      }
    }

    // Upload new images
    if (files && files.length > 0) {
      const currentImagesCount = existing.images.filter(img => existingImageUrls.includes(img.url)).length;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = `${Date.now()}-${file.originalname}`;
        const filePath = `apartments/${id}/${fileName}`;
        const uploadResult = await supabaseStorage.uploadFile(
          file.buffer,
          'apartment-images',
          filePath,
          { contentType: file.mimetype }
        );
        await db.insert(apartmentImages).values({
          apartmentId: id,
          url: uploadResult.url,
          order: currentImagesCount + i,
          isPrimary: currentImagesCount + i === 0,
        });
      }
    }

    // Handle amenities if provided
    if (data.amenities) {
      await db.delete(apartmentAmenities).where(eq(apartmentAmenities.apartmentId, id));
      const amenityIds = Array.isArray(data.amenities) ? data.amenities : [data.amenities];
      for (const amenityId of amenityIds) {
        await db.insert(apartmentAmenities).values({
          apartmentId: id,
          amenityId,
        });
      }
    }

    return this.getById(id);
  },

  async delete(id: string) {
    const apartment = await this.getById(id);
    
    // Delete all images from Supabase first
    for (const img of apartment.images) {
      // Extract file path from URL
      const filePath = this.extractFilePathFromUrl(img.url);
      if (filePath) {
        try {
          await supabaseStorage.deleteFile('apartment-images', filePath);
        } catch (error) {
          console.error('Failed to delete image from Supabase:', error);
        }
      }
    }
    
    await db.delete(apartments).where(eq(apartments.id, id));
  },

  async addImage(
    apartmentId: string,
    imageUrl: string,
    order: number = 0,
    isPrimary: boolean = false
  ) {
    await this.getById(apartmentId);
    
    const [image] = await db.insert(apartmentImages).values({
      apartmentId,
      url: imageUrl,
      order,
      isPrimary,
    }).returning();

    return image;
  },

  async updateImage(imageId: string, data: { order?: number; isPrimary?: boolean }) {
    const [image] = await db.update(apartmentImages)
      .set(data)
      .where(eq(apartmentImages.id, imageId))
      .returning();

    if (!image) {
      throw new AppError('Image not found', 404);
    }

    return image;
  },

  async deleteImage(imageId: string) {
    const image = await db.query.apartmentImages.findFirst({
      where: eq(apartmentImages.id, imageId),
    });

    if (!image) {
      throw new AppError('Image not found', 404);
    }

    // Delete from Supabase storage
    const filePath = this.extractFilePathFromUrl(image.url);
    if (filePath) {
      try {
        await supabaseStorage.deleteFile('apartment-images', filePath);
      } catch (error) {
        console.error('Failed to delete image from Supabase:', error);
      }
    }

    await db.delete(apartmentImages).where(eq(apartmentImages.id, imageId));
    return { success: true };
  },

  extractFilePathFromUrl(url: string): string | null {
    // Example URL: https://xxx.supabase.co/storage/v1/object/public/apartment-images/apartments/xxx/xxx.jpg
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      const index = pathParts.indexOf('object');
      if (index !== -1 && pathParts.length > index + 3) {
        return pathParts.slice(index + 3).join('/');
      }
      return null;
    } catch (error) {
      return null;
    }
  },
};
