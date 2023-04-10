describe('Grid operations', () => {
  it('Clicking on a grid cell highlights it', () => {
    cy.visit('http://localhost/sudoku')
    cy.get('#grid .subgrid:first-of-type .cell:first-of-type')
      .click()
      .should('have.class', 'active')
  })

  it('Entering a digit into an empty grid cell chenges the cell\'s ' +
     'content', () => {
    cy.visit('http://localhost/sudoku')
    cy.get('#grid .subgrid:first-of-type .cell').each(cell => { 
      if (cell.text() === '') {
        cy.wrap(cell).as('cell').click()
        cy.get('body').trigger('keypress', { key: '1' })
        cy.get('@cell').should('have.text', '1')
        return false
      } 
    })
  })

  it('Entering a non-digit into an empty grid cell does not change the ' +
     'cell\'s content', () => {
    cy.visit('http://localhost/sudoku')
    cy.get('#grid .subgrid:first-of-type .cell').each(cell => { 
      if (cell.text() === '') {
        cy.wrap(cell).as('cell').click()
        cy.get('body').trigger('keypress', { key: 'a' })
        cy.get('@cell').should('have.text', '')
        return false
      } 
    })
  })

  it('Pressing \'Esc\' unhighlights a previously highlighted grid cell', () => {
    cy.visit('http://localhost/sudoku')
    cy.get('#grid .subgrid:first-of-type .cell:first-of-type').as('cell').click()
    cy.get('body').trigger('keydown', { key: 'Escape' })
    cy.get('@cell').should('not.have.class', 'active')
  })
})