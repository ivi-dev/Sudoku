# What is Sudoku?

That one doesn't really need a whole lot of 
explanation because Sudoku is so popular around the 
world by now, but anyway here's a short intro for 
those that haven't yet played it:

Sudoku is a logical puzzle game consisting
of a grid of squares, sized 9x9. The grid is subdivided
into 9 subgrids, 3x3 squares each. Your job as the player 
is simple (well, at least on lower difficulty settings), 
fill the blank squares with the correct numbers, making 
sure that any number appears exactly once in any of the 
grid's rows, columns and 3x3 subgrids.

Here are some tips to help you out:

1. **Look for the Easy Solutions**

Many puzzles will leave one or two blanks either in a line or in 
a box. A line might be missing a 5 and a 6, but a box along that 
line will already have a 6 in it, so you know this blank must be 
a 5, and the other blank must be the 6. The same may be the case 
for one or two missing numbers in the smaller boxes. Filling these 
blanks will get you on your way to a solution.

2. **Seek the Missing Numbers**

As you fill in the easy solutions, you may start to find other 
missing numbers that are easy to place. In the above example, 
the box now has a 5, and that may help you solve that 3×3 area,
or might help you solve the lines that cross that area.

3. **Keep Scanning the Entire Puzzle**

If you get stuck, don’t concentrate too hard on one part of the 
grid. Let your eye scan the puzzle to find another place on the 
grid with new possibilities. You may find another quick solution.

4. **Constantly Re-Evaluate the Grid**

Whenever you place a new number, see if that opens up a new row 
or box. It might narrow down the possibilities or make another 
number obvious. If you keep asking yourself which numbers you’re 
missing in a line or grid, you might find it more quickly.

5. **Be Patient and Enjoy the Hunt**

Remember that although you want to finish a puzzle, the point is 
to enjoy the challenge and work your brain as you relax. If you 
find yourself getting frustrated, walk away. Let your mind clear 
and try again later. The most important thing is to have fun.

If you need help at any point in the game, just open up the in-game
help menu by clicking the question mark button on the side of the 
screen or pressing 'H' on the keyboard.

# What's this app about?

This app delivers Sudoku to your device's browser, so that
it's right there for you to enjoy.

# The stack

The app employs a fairly simple and familiar tech stack.
[Vue.js](https://vuejs.org/guide/introduction.html) is used for
the logic, data binding and some event-handling parts. The
programming language used is JavaScript. The mostly small and 
straightforward templates are compiled by [EJS](https://ejs.co/). 
Styling the app is taken care of by CSS stylesheets compiled by the 
[SASS](https://sass-lang.com/) preprocessor.

# Contributing

## Getting the source code

Developers wishing to contribute to the project have to get the 
source code first by cloning this repo:

	git clone https://github.com/ivi-dev/Sudoku sudoku

## Installing dependencies

The app is a Node package, so installing dependencies is as easy as:

	npm i

## Running locally

To run the app locally in a browser, do:

	npm run start

which will start the local development 
[http server](https://www.npmjs.com/package/http-server) 
and will launch the app in your default browser.

# Technical documentation

The app's full technical API documentation is hosted 
[here](https://ivi-dev.github.io/Sudoku/docs). 
You'll find low-level details about the source code's 
structure and organization there.

# Testing

The app currently adopts an E2E-only testing strategy. It uses 
[Cypress](https://www.cypress.io/) for managing its test 
package. Before running any E2E tests, make sure you've started the
local http server ([http-server](https://www.npmjs.com/package/http-server), 
comes as part of the app's dev dependencies) by running:

	npm run serve

The scripts containing *cyp* (short for *cypress*) in 
`./package.json` correspond to various testing activities. Here's
how you perform the main ones:

Opening the 
[Cypress Launchpad](https://docs.cypress.io/guides/getting-started/opening-the-app#The-Launchpad)
for running, monitoring and debugging tests in a browser environment:

	npm run cyp:open

Running all tests in a particular browser headlessly:

	npm run cyp:run:<chrome|firefox|edge>

Running all tests in all supported browsers headlessly, sequentially:

	npm run cyp:all

# Try it out for yourself

The game's currenly hosted 
[here](https://ivi-dev.github.io/Sudoku/). 
Go ahead and give it a try!