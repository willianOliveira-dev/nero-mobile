import { z } from 'zod';

const envSchema = z.object({
    EXPO_PUBLIC_API_URL: z.string().url().default('http://localhost:8000'),
    EXPO_PUBLIC_BETTER_AUTH_URL: z
        .string()
        .url()
        .default('http://localhost:8000/api/v1/auth'),
    EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID: z.string(),
    EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID: z.string(),
    EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
