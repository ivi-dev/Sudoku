describe('Global', () => {
  describe('the splash screen', () => {
    it('is initially visible', () => {
      cy.visit('http://localhost:8080')
      cy.get('#coverall .content').should('not.have.class', 'hidden')
    })
    it('and disappears eventually', () => {
      cy.visit('http://localhost:8080')
      cy.get('#coverall').should('have.class', 'hidden')
    })
  })
})