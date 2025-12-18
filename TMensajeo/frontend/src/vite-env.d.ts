/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_CLOUDINARY_CLOUD_NAME: string;
  // más variables de entorno aquí
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
