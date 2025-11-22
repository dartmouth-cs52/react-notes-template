import { defineConfig } from 'cypress';

const baseUrl = process.env.PORT ? `http://localhost:${process.env.PORT}` : 'http://localhost:8080';

export default defineConfig({
  e2e: {
    baseUrl,
    video: false,
    supportFile: false,
    screenshotOnRunFailure: false,
    setupNodeEvents(on, config) {},
  },
});
