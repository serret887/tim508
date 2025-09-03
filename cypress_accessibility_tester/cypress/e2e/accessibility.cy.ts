import { routes } from '../../routes'

describe('Accessibility Tests', () => {
  routes.forEach((route) => {
    const { path, controller, action } = route
    describe(`Route: ${path} (Controller: ${controller}, Action: ${action})`, () => {
      it('has no detectable accessibility violations', () => {
        cy.visit(path)
        cy.injectAxe()
        cy.checkA11y()
      })
    })
  })
})
