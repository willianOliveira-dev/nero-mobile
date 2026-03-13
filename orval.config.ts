import { defineConfig } from 'orval';
import { env } from './src/config/env';

const API_URL = env.EXPO_PUBLIC_API_URL;

export default defineConfig({
  nero: {
    output: {
      mode: 'tags-split',
      target: 'src/api/generated/nero.ts',
      schemas: 'src/api/generated/model',
      client: 'react-query',
      mock: false,
      httpClient: 'axios',
      override: {
        mutator: {
          path: './src/api/interceptors.ts',
          name: 'customInstance',
        },
      },
    },
    input: {
      target: `${API_URL}/swagger.json`,
    },
  },
});
