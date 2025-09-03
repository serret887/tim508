import { defineConfig } from 'cypress'
import reporter from 'cypress-mochawesome-reporter/plugin'

export default defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'reports',
    charts: true,
    reportPageTitle: 'Accessibility Report',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
    html: true,
    json: true
  },
  e2e: {
    setupNodeEvents(on, config) {
      reporter(on)
      return config
    },
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.ts'
  }
})
