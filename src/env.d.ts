interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly BASE_URL: string;
  readonly DEV: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
