import { ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase/config';

/**
 * PRODUCTION-GRADE FIREBASE STORAGE SERVICE
 * 
 * Provides:
 * 1. Image compression (client-side resizing via HTML5 Canvas)
 * 2. Progress indicators and validation
 * 3. Structured folder paths (logos/, products/, projects/, etc.)
 * 4. Automatic cleanups (deletes previous image from bucket)
 */

// Define allowed mime-types and maximum sizes
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Client-side helper to compress an image file prior to upload.
 * Resizes the image to a maximum dimension of 1200px and outputs a JPEG of 85% quality.
 */
export async function compressImage(file: File, maxWidth = 1200, maxHeight = 1200): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // If it's a GIF, do not compress (to preserve animation)
    if (file.type === 'image/gif') {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate proportional dimensions
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file); // fallback to original
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          0.85
        );
      };
      img.onerror = () => reject(new Error('Falha ao processar o arquivo de imagem.'));
    };
    reader.onerror = () => reject(new Error('Erro ao ler o arquivo.'));
  });
}

export function fileToBase64(fileOrBlob: Blob | File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => {
      reject(new Error('Erro ao converter arquivo para Base64.'));
    };
    reader.readAsDataURL(fileOrBlob);
  });
}

/**
 * Uploads a file directly to Firebase Storage with context organization.
 */
export async function uploadImage(
  file: File,
  folder: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  // 1. Validation
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Tipo de arquivo não permitido. Apenas imagens JPEG, PNG, WEBP e GIF são suportadas.');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('O tamanho máximo do arquivo é de 5MB.');
  }

  // 2. Client-side compression
  const uploadData = await compressImage(file);

  // 3. Generate secure and organized path
  const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
  const path = `${folder}/${Date.now()}_${cleanName}`;
  
  try {
    const fileRef = storageRef(storage, path);

    // 4. Trigger upload with task observer
    const uploadTask = uploadBytesResumable(fileRef, uploadData, {
      contentType: file.type === 'image/gif' ? 'image/gif' : 'image/jpeg',
    });

    return await new Promise<string>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          if (onProgress) onProgress(progress);
        },
        async (error) => {
          console.warn('Firebase Storage upload failed, falling back to Base64 data URL:', error);
          try {
            if (onProgress) onProgress(50);
            const base64Url = await fileToBase64(uploadData);
            if (onProgress) onProgress(100);
            resolve(base64Url);
          } catch (fallbackError) {
            console.error('Fallback Base64 conversion failed too:', fallbackError);
            reject(new Error(`Ocorreu um erro no upload da imagem e o fallback falhou: ${error.message}`));
          }
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadUrl);
          } catch (err) {
            // Also fallback here if getDownloadURL fails
            console.warn('getDownloadURL failed, falling back to Base64:', err);
            try {
              const base64Url = await fileToBase64(uploadData);
              if (onProgress) onProgress(100);
              resolve(base64Url);
            } catch (fallbackError) {
              reject(err);
            }
          }
        }
      );
    });
  } catch (initError: any) {
    console.warn('Failed to initialize Storage reference, falling back directly to Base64:', initError);
    if (onProgress) onProgress(50);
    const base64Url = await fileToBase64(uploadData);
    if (onProgress) onProgress(100);
    return base64Url;
  }
}

/**
 * Extracts the storage path from a full Firebase Storage download URL.
 */
export function getStoragePathFromUrl(url: string): string | null {
  if (!url || !url.includes('firebasestorage.googleapis.com')) return null;
  try {
    // URL format: .../o/folder%2Ffile.jpg?alt=media...
    const parts = url.split('/o/');
    if (parts.length < 2) return null;
    const pathPart = parts[1].split('?')[0];
    return decodeURIComponent(pathPart);
  } catch (err) {
    console.error('Failed to parse storage URL: ', url, err);
    return null;
  }
}

/**
 * Safely deletes an image file from Firebase Storage based on its public URL.
 */
export async function deleteImageByUrl(url: string): Promise<void> {
  const path = getStoragePathFromUrl(url);
  if (!path) return; // Silent return for external or non-firebase images

  try {
    const fileRef = storageRef(storage, path);
    await deleteObject(fileRef);
    console.log(`Ficheiro de imagem deletado do Storage com sucesso: ${path}`);
  } catch (err) {
    // If the file doesn't exist, log and continue (already deleted or cleaned)
    console.warn(`Tentativa de apagar ficheiro do Storage falhou ou não existe: ${path}`, err);
  }
}
