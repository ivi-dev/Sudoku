/**
 * Determine whether two arrays are equal,
 * meaning they contain the same number of 
 * items which are all in the same indices.
 * 
 Examples:
   arraysEqual([1,2,3], [1,2,3])  // true
   arraysEqual([1,2,3], [1,2])    // false
   arraysEqual([1,2,3], [3,1,2])  // false

   @param {Array} arr1 An array.
   @param {Array} arr2 Another array.
   @return {boolean} true if arr1 is equal to
   arr2 according to the rules stated above,
   false otherwise.
 */
function arraysEqual(arr1, arr2) {
  if (arr1.length === arr2.length) {
    for (let i = 0; i < arr1.length; i++)
      if (arr1[i] !== arr2[i])
        return false
    return true
  } else {
    return false
  }
}

describe('Menu operations', () => {

  describe('Start a new game', () => {
    const expectedNewGamePromptText = 'By starting a new game you\'ll lose your ' +
                                      'progress in the current one. Are you sure ' +
                                      'you want to do that?'

    // TODO: Consider swaping the browser prompts for DOM ones for testability

    // describe('A confirmation prompt appears on-screen', () => {
    //   it('upon clicking the \'Start a new game\' button', () => {
    //     cy.visit('http://localhost/sudoku')
    //     cy.on('window:confirm', text => {
    //       console.log(text)
    //       expect(text).to.equal(expectedNewGamePromptText)
    //       return false
    //     })
    //     cy.get('.start-new-game').click()
    //   })

    //   it('as well as upon pressing the \'N\' keyboard button', () => {
    //     cy.visit('http://localhost/sudoku')
    //     cy.get('body').trigger('keydown', { key: 'n' })
    //     cy.on('window:confirm', text => {
    //       expect(text).to.equal(expectedNewGamePromptText)
    //       return false
    //     })
    //   })
    // })

    it('The current game continues if user refuses ' +
       'to start a new one', () => {
      cy.visit('http://localhost/sudoku')
      const before = [], after = []
      cy.get('#grid .subgrid .cell')
        .each(cell => before.push(cell.text()))
        .then(() => {
          cy.get('.start-new-game').click()
          cy.on('window:confirm', text => false)
          cy.get('#grid .subgrid .cell')
            .each(cell => after.push(cell.text()))
            .then(() => expect(arraysEqual(before, after)).to.be.true)
      })
    })

    it('A new game is started if the user consents ' +
       'to it', () => {
      cy.visit('http://localhost/sudoku')
      const before = [], after = []
      cy.get('#grid .subgrid .cell')
        .each(cell => before.push(cell.text()))
        .then(() => {
          cy.get('.start-new-game').click()
          cy.get('#grid .subgrid .cell')
            .each(cell => after.push(cell.text()))
            .then(() => expect(arraysEqual(before, after)).to.be.false)
      })
    })
  })

  describe('Settings', () => {
    describe('The settings menu opens', () => {
      it('upon clicking the \'Settings\' button', () => {
        cy.visit('http://localhost/sudoku')
        cy.get('.menu.settings .show-settings').click()
        cy.get('.menu.settings').should('not.have.class', 'hidden-fix-left')
      })

      it('as well as pressing the \'S\' keyboard button', () => {
        cy.visit('http://localhost/sudoku')
        cy.get('.menu.settings .show-settings').trigger('keydown', { key: 's' })
        cy.get('.menu.settings').should('not.have.class', 'hidden-fix-left')
      })
    })

    describe('The settings menu closes', () => {
      it('upon clicking its \'x\' button', () => {
        cy.visit('http://localhost/sudoku')
        cy.get('.menu.settings .show-settings').click()
        cy.get('.menu.settings header button.close').click()
        cy.get('.menu.settings').should('have.class', 'hidden-fix-left')
      })

      it('as well as upon pressing the \'S\' keyboard button again', () => {
        cy.visit('http://localhost/sudoku')
        cy.get('.menu.settings .show-settings').click()
        cy.get('body').trigger('keydown', { key: 's' })
        cy.get('.menu.settings').should('have.class', 'hidden-fix-left')
      })

      it('as well as upon pressing the \'Esc\' keyboard button', () => {
        cy.visit('http://localhost/sudoku')
        cy.get('.menu.settings .show-settings').click()
        cy.get('body').trigger('keydown', { key: 'Escape' })
        cy.get('.menu.settings').should('have.class', 'hidden-fix-left')
      })
    })

    // TODO: More settings tests to come...
  })

  describe('Help', () => {
    const expectedHelpContent = "HelpIntroducing Sudoku Sudoku (/suːˈdoʊkuː, lit.'digit-single') " +
                                "is a logic-based, combinatorial number-placement puzzle.  " +
                                "A puzzle game by the name of 'diabolical magic square', almost " +
                                "identical to modern Sudoku, was first published in the french " +
                                "newspaper La France on July 6, 1895. Such weekly puzzles were " +
                                "a feature of French newspapers of the time for nearly a decade  " +
                                "until disappearing about the time of World War I. " +
                                "The modern Sudoku is thought to be anonymously designed by " +
                                "Howard Garnes, a 74-year-old retired architect and freelance " +
                                "puzzle constructor from Connersville, Indiana. the first modern " +
                                "puzzle was published 1979 by Dell Magazines as Number Place.  " +
                                "The puzzle was introduced in Japan by Maki Kaji as Sūji wa dokushin " +
                                "ni kagiru (数字は独身に限る), which can be translated as \"the digits " +
                                "must be single\", or as \"the digits are limited to one occurrence\". " +
                                "The name was later abbreviated to Sudoku (数独), taking only the " +
                                "first kanji of compound words to form a shorter version. Rules The " +
                                "rules for sudoku are simple. A 9×9 square must be filled in with " +
                                "numbers from 1-9 with no repeated numbers in each line, horizontally " +
                                "or vertically. There are 3×3 squares marked out in the grid, and each " +
                                "of these squares can’t have any repeat numbers either.  Here are some " +
                                "tips to help you out: 1. Look for the Easy Solutions Many puzzles " +
                                "will leave one or two blanks either in a line or in a box. A line " +
                                "might be missing a 5 and a 6, but a box along that line will already " +
                                "have a 6 in it, so you know this blank must be a 5, and the other blank " +
                                "must be the 6. The same may be the case for one or two missing numbers " +
                                "in the smaller boxes. Filling these blanks will get you on your way to a " +
                                "solution. 2. Seek the Missing Numbers As you fill in the easy solutions, " +
                                "you may start to find other missing numbers that are easy to place. In the " +
                                "above example, the box now has a 5, and that may help you solve that 3×3 " +
                                "area, or might help you solve the lines that cross that area. 3. Keep " +
                                "Scanning the Entire Puzzle If you get stuck, don’t concentrate too hard on " +
                                "one part of the grid. Let your eye scan the puzzle to find another place on " +
                                "the grid with new possibilities. You may find another quick solution. 4. " +
                                "Constantly Re-Evaluate the Grid Whenever you place a new number, see if that " +
                                "opens up a new row or box. It might narrow down the possibilities or make " +
                                "another number obvious. If you keep asking yourself which numbers you’re " +
                                "missing in a line or grid, you might find it more quickly. 5. Be Patient and " +
                                "Enjoy the Hunt Remember that although you want to finish a puzzle, the point " +
                                "is to enjoy the challenge and work your brain as you relax. If you find " +
                                "yourself getting frustrated, walk away. Let your mind clear and try again later. " +
                                "The most important thing is to have fun. Gameplay Playing Sudoku is super easy. " +
                                "First look at the grid and considering the rules of Sudoku described previously, " +
                                "try to find out the number that should go into a particular empty cell. When " +
                                "you've found it, just click the empty cell to highlight it and then type in the " +
                                "number by using your device's keyboard.  Once highlighted, a cell remains so " +
                                "allowing you to quickly input a new number if you realize you'd made a mistake. " +
                                "You can unhighlight a cell at any time by pressing the 'Esc' key on your " +
                                "device's keyboard.  Continue filling in the missing numbers until you complete " +
                                "the entire grid. When you do so, you'll get an on-screen notification of " +
                                "whether you've completed the puzzle correctly or not. If you made it, " +
                                "congratulations! If you've made a mistake however, dont'y worry, look at the " +
                                "grid again trying to find your mistake and correct it by using the same " +
                                "highlight-and-type approach described above.  You can always start a new game " +
                                "with a different grid arrangement by clickng on the  button on the top left of " +
                                "the screen or by pressing the 'N' button on your device's keyboard. Settings " +
                                "You can change some of the game's settings to your liking. To accomplish that, " +
                                "first click on the  icon at the top left of the screen or press 'S' on your " +
                                "device's keyboard, to reveal the settings menu. Then find the setting you're " +
                                "interested in and select the desired value for it. Here are the game's available " +
                                "settings: Difficulty Controls the game's difficulty level. Each step towards " +
                                "'Hard' hides more numbers from the grid, hence the more difficult it is to find " +
                                "a solution to the puzzle. Note, since changing the game's difficulty involves " +
                                "rearranging the grid with new numbers scrapping any progress you've made on the " +
                                "current grid, you'll be asked for confirmation before the new setting is applied. " +
                                "Pressing 'Cancel' on the on-screen prompt retains the current difficulty setting " +
                                "and the game continues, and pressing 'OK' starts a new game with the selected " +
                                "difficulty. Theme Controls the game's visual appearance. Feel free to try all " +
                                "appearances out and find the most pleasing one for you. Shortcuts There a few " +
                                "shortcut keys at your disposal allowing you to navigate through the game's interface " +
                                "quicker. Here they are: S Opens/closes the 'Settings' menu. H Opens/closes the " +
                                "'Help' menu. Esc Closes open menus and unhighlights the currently highlighted grid " +
                                "cell. N Starts a new game. Note, since starting a new game will scrap the progress " +
                                "you've made during the current one, you'll be prompted for confirmation beofore the " +
                                "new game is started. "

    describe('The help menu opens', () => {
      it('upon clicking the \'Help\' button', () => {
        cy.visit('http://localhost/sudoku')
        cy.get('.menu.help .show-help').click()
        cy.get('.menu.help').should('not.have.class', 'hidden-fix-left')
      })

      it('as well as pressing the \'H\' keyboard button', () => {
        cy.visit('http://localhost/sudoku')
        cy.get('.menu.help .show-help').trigger('keydown', { key: 'h' })
        cy.get('.menu.help').should('not.have.class', 'hidden-fix-left')
      })
    })

    describe('The help menu closes', () => {
      it('upon clicking its \'x\' button', () => {
        cy.visit('http://localhost/sudoku')
        cy.get('.menu.help .show-help').click()
        cy.get('.menu.help header button.close').click()
        cy.get('.menu.help').should('have.class', 'hidden-fix-left')
      })

      it('as well as upon pressing the \'H\' keyboard button again', () => {
        cy.visit('http://localhost/sudoku')
        cy.get('.menu.help .show-help').click()
        cy.get('body').trigger('keydown', { key: 'h' })
        cy.get('.menu.help').should('have.class', 'hidden-fix-left')
      })

      it('as well as upon pressing the \'Esc\' keyboard button', () => {
        cy.visit('http://localhost/sudoku')
        cy.get('.menu.help .show-help').click()
        cy.get('body').trigger('keydown', { key: 'Escape' })
        cy.get('.menu.help').should('have.class', 'hidden-fix-left')
      })
    })

    it('The help menu contains the correct content', () => {
      cy.visit('http://localhost/sudoku')
      cy.get('.menu.help').then(help => {
          const actual   = help.text().replace(/\s{2,}/gm, ' '),
                expected = expectedHelpContent.replace(/\s{2,}/gm, ' ')
          expect(actual).to.equal(expected)
        }
      )
    })
  })
})