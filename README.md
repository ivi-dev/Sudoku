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

## Compiling templates and styles

Before starting the app locally you need to perform a one-time
compilation of its templates and style files by running this:

	npm run build

## Running locally

To run the app locally in a browser, do:

	npm run start

which will start the local development 
[http server](https://www.npmjs.com/package/http-server) 
and launch the app in your default browser.

## Available NPM scripts

The project defines several NPM scripts facilitating development and
testing related activities. Here they are at the time of this writing:

Serve the app through the local [http-server](https://www.npmjs.com/package/http-server).
Do this before running any [Cypress](https://www.cypress.io/) 
E2E tests:

	npm run serve

Serve the app through the local [http-server](https://www.npmjs.com/package/http-server)
and launch the app in your default broswer:

	npm run start

Continiously compile .sass files as soon as there had been a change
in any one of them, producing .css files in the process:

	npm run sass:watch

Perform a single .sass files compilation, producing .css files:

	npm run sass:compile

Perform a single compilation of .ejs template files, producing .html
files in the process:

	npm run ejs:compile

Regenerate the project's source code documentation:

	npm run docs

Perform a *full build* of the application, including
compiling .sass and .ejs files and regenerating source
documentation:

	npm run build

Launch the [Cypress](https://docs.cypress.io/guides/getting-started/opening-the-app)'s 
helper application in a browser:

	npm run cyp:open

Run [Cypress](https://www.cypress.io/) E2E tests in the corresponding browser headlessly:

	npm run cyp:run:chrome

	npm run cyp:run:firefox

	npm run cyp:run:edge

Run [Cypress](https://www.cypress.io/) E2E tests in all 
[Cypress-supported browsers](https://docs.cypress.io/guides/guides/launching-browsers#Browser-versions-supported)
headlessly, sequentially:

	npm run cyp:all

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

# Technical documentation

The app's full technical API documentation is hosted 
[here](https://ivi-dev.github.io/Sudoku/docs). 
You'll find low-level details about the source code's 
structure and organization there.

# Try it out

The game's currenly hosted 
[here](https://ivi-dev.github.io/Sudoku/). 
Go ahead and give it a try!