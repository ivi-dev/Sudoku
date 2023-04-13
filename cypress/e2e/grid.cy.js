describe('Grid operations', () => {
  it('Clicking on a grid cell highlights it', () => {
    cy.visit('http://localhost:8080')
    cy.get('#grid .subgrid:first-of-type .cell:first-of-type')
      .click({ force: true })
      .should('have.class', 'active')
  })

  it('Entering a digit into an empty grid cell chenges the cell\'s ' +
     'content', () => {
    cy.visit('http://localhost:8080')
    cy.get('#grid .subgrid:first-of-type .cell').each(cell => { 
      if (cell.text() === '') {
        cy.wrap(cell).as('cell').click({ force: true })
        cy.get('body').trigger('keypress', { key: '1' })
        cy.get('@cell').should('have.text', '1')
        return false
      } 
    })
  })

  it('Entering a non-digit into an empty grid cell does not change the ' +
     'cell\'s content', () => {
    cy.visit('http://localhost:8080')
    cy.get('#grid .subgrid:first-of-type .cell').each(cell => { 
      if (cell.text() === '') {
        cy.wrap(cell).as('cell').click({ force: true })
        cy.get('body').trigger('keypress', { key: 'a' })
        cy.get('@cell').should('have.text', '')
        return false
      } 
    })
  })

  it('Pressing \'Esc\' unhighlights a previously highlighted grid cell', () => {
    cy.visit('http://localhost:8080')
    cy.get('#grid .subgrid:first-of-type .cell:first-of-type')
      .as('cell')
      .click({ force: true })
    cy.get('body').trigger('keydown', { key: 'Escape' })
    cy.get('@cell').should('not.have.class', 'active')
  })

  describe('Game completion', () => {
    const expectedSuccessNotification = "Congrats! You've completed the game! "  +
                                        "Go ahead and start a new one. Increase " +
                                        "the difficulty for an extra challenge."

    const expectedErrorNotification = "Sorry! You've made one or more errors " +
                                        "filling the grid! Find and correct them " +
                                        "to complete the game."

    it('A notification is displayed if the game is completed successfully', () => {
      cy.visit('http://localhost:8080')
      cy.get('script#complete').then(grid => {
        const solution = JSON.parse(grid.text());
        const solutionMap = { 
            0: { 
              0: { r: 0, c: 0 }, 1: { r: 0, c: 1 }, 2: { r: 0, c: 2 }, 
              3: { r: 1, c: 0 }, 4: { r: 1, c: 1 }, 5: { r: 1, c: 2 },
              6: { r: 2, c: 0 }, 7: { r: 2, c: 1 }, 8: { r: 2, c: 2 } 
            }, 
            1: {
              0: { r: 0, c: 3 }, 1: { r: 0, c: 4 }, 2: { r: 0, c: 5 }, 
              3: { r: 1, c: 3 }, 4: { r: 1, c: 4 }, 5: { r: 1, c: 5 },
              6: { r: 2, c: 3 }, 7: { r: 2, c: 4 }, 8: { r: 2, c: 5 }
            },
            2: {
              0: { r: 0, c: 6 }, 1: { r: 0, c: 7 }, 2: { r: 0, c: 8 }, 
              3: { r: 1, c: 6 }, 4: { r: 1, c: 7 }, 5: { r: 1, c: 8 },
              6: { r: 2, c: 6 }, 7: { r: 2, c: 7 }, 8: { r: 2, c: 8 }
            },

            3: { 
              0: { r: 3, c: 0 }, 1: { r: 3, c: 1 }, 2: { r: 3, c: 2 }, 
              3: { r: 4, c: 0 }, 4: { r: 4, c: 1 }, 5: { r: 4, c: 2 },
              6: { r: 5, c: 0 }, 7: { r: 5, c: 1 }, 8: { r: 5, c: 2 } 
            }, 
            4: {
              0: { r: 3, c: 3 }, 1: { r: 3, c: 4 }, 2: { r: 3, c: 5 }, 
              3: { r: 4, c: 3 }, 4: { r: 4, c: 4 }, 5: { r: 4, c: 5 },
              6: { r: 5, c: 3 }, 7: { r: 5, c: 4 }, 8: { r: 5, c: 5 }
            },
            5: {
              0: { r: 3, c: 6 }, 1: { r: 3, c: 7 }, 2: { r: 3, c: 8 }, 
              3: { r: 4, c: 6 }, 4: { r: 4, c: 7 }, 5: { r: 4, c: 8 },
              6: { r: 5, c: 6 }, 7: { r: 5, c: 7 }, 8: { r: 5, c: 8 }
            },

            6: { 
              0: { r: 6, c: 0 }, 1: { r: 6, c: 1 }, 2: { r: 6, c: 2 }, 
              3: { r: 7, c: 0 }, 4: { r: 7, c: 1 }, 5: { r: 7, c: 2 },
              6: { r: 8, c: 0 }, 7: { r: 8, c: 1 }, 8: { r: 8, c: 2 } 
            }, 
            7: {
              0: { r: 6, c: 3 }, 1: { r: 6, c: 4 }, 2: { r: 6, c: 5 }, 
              3: { r: 7, c: 3 }, 4: { r: 7, c: 4 }, 5: { r: 7, c: 5 },
              6: { r: 8, c: 3 }, 7: { r: 8, c: 4 }, 8: { r: 8, c: 5 }
            },
            8: {
              0: { r: 6, c: 6 }, 1: { r: 6, c: 7 }, 2: { r: 6, c: 8 }, 
              3: { r: 7, c: 6 }, 4: { r: 7, c: 7 }, 5: { r: 7, c: 8 },
              6: { r: 8, c: 6 }, 7: { r: 8, c: 7 }, 8: { r: 8, c: 8 }
            },
          };
        cy.get('#grid .subgrid').each((subgr, subgr_i) => {
          cy.wrap(subgr).find('.cell').each((cell, cell_i) => {
            const val = solutionMap[subgr_i][cell_i]
            if (cell.text().trim() === '')
              cy.wrap(cell)
                .click({ force: true })
                .trigger('keypress', { key: solution[val.r][val.c].toString(), force: true })
          })
        })
        cy.get('.note.success').then(note => 
          expect(note.text().replace(/\*/gm, '').replace(/\s{2,}/gm, ' ').trim())  // TODO: Find out why there are '*'s
          .to.equal(expectedSuccessNotification))
      })
    })

    it('A notification is displayed if the game is not completed successfully', () => {
      cy.visit('http://localhost:8080')
      cy.get('#grid .subgrid .cell').each(cell => {
        if (cell.text().trim() === '')
          cy.wrap(cell)
            .click({ force: true })
            .trigger('keypress', { key: '1', force: true })
      })
      cy.get('.note.error').then(note => 
          expect(note.text().replace(/\*/gm, '').replace(/\s{2,}/gm, ' ').trim())  // TODO: Find out why there are '*'s
          .to.equal(expectedErrorNotification))
    })
  })
})