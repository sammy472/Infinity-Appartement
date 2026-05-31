import { createClient } from '@supabase/supabase-js';
import { config } from '../config';

class SupabaseStorageService {
  private client;

  constructor() {
    if (!config.supabase.url || !config.supabase.serviceRoleKey) {
      throw new Error('Supabase URL and Service Role Key are required for storage operations');
    }
    this.client = createClient(config.supabase.url, config.supabase.serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }

  async uploadFile(
    file: Buffer,
    bucketName: string,
    path: string,
    options?: {
      contentType?: string;
      upsert?: boolean;
    }
  ) {
    const { data, error } = await this.client.storage
      .from(bucketName)
      .upload(path, file, {
        contentType: options?.contentType,
        upsert: options?.upsert,
      });

    if (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = this.client.storage
      .from(bucketName)
      .getPublicUrl(path);

    return {
      path,
      url: urlData.publicUrl,
      bucket: bucketName,
    };
  }

  async deleteFile(bucketName: string, path: string) {
    const { error } = await this.client.storage
      .from(bucketName)
      .remove([path]);

    if (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }

    return { success: true, path };
  }

  async getFileUrl(bucketName: string, path: string) {
    const { data } = this.client.storage
      .from(bucketName)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  async listFiles(bucketName: string, path?: string) {
    const { data, error } = await this.client.storage
      .from(bucketName)
      .list(path);

    if (error) {
      throw new Error(`Failed to list files: ${error.message}`);
    }

    return data;
  }
}

export const supabaseStorage = new SupabaseStorageService();
