/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Check if sign-in button exists and click it if found
       * @example cy.checkSignIn()
       */
      checkSignIn(): Chainable<void>
    }
  }
}

// Custom command to check for sign-in button and click it if found
Cypress.Commands.add('checkSignIn', () => {
  cy.get('body').then(($body) => {
    // Try different possible selectors for sign-in button
    const signInSelectors = [
      'input[type="submit"][name="commit"]'
    ]
    
    let found = false
    for (const selector of signInSelectors) {
      if ($body.find(selector).length > 0) {
        cy.log(`Found sign-in button with selector: ${selector}`)
        cy.get(selector).first().click()
        found = true
        break
      }
    }
    
    if (!found) {
      cy.log('No sign-in button found')
    }
  })
})

export {}
