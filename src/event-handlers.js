/**
 * A module providing the app with tha ability
 * to attach event handlers to DOM elements.
 * 
 * @module
 */


import { set as save, DIFFICULTY } from './persistence.js';
import { isOutsideClick, isAnyOf } from './util.js';

/**
 * Attach the game's event handlers to their corresponding
 * DOM elements. 
 * 
 * @param {object} this_ A reference to the constructed
 * [app]{@link https://vuejs.org/api/application.html} object.
 * 
 * @see https://vuejs.org/guide/introduction.html#api-styles
 */
function attachEeventHandlers(this_) {
	// Show the page loading indicator upon page initial load
	document.querySelector('#coverall .content').classList.remove('hidden');
	// Hide the splash screen when the page is fully loaded
	window.addEventListener('load', () => {
		document.querySelector('#coverall').classList.add('hidden');
	});
	// Place a number in the currently active grid cell on pressing
	// a digit key on the keyboard
	document.addEventListener('keypress', event => {
		const val = Number(event.key);
		if (_.includes(this_.numbers, val) && this_.isCellActive()) {
			this_.setCell(this_.activeCell, val);
			const gameComplete  = this_.validateGrid(),
				  hasEmptyCells = this_.hasEmptyCells();
			if (!hasEmptyCells) {
				if (gameComplete) {
					this_.gameComplete = true;
					this_.playSound('#game-success');
				} else {
					this_.gameComplete = false;
					this_.playSound('#game-error');
				}
			}
		}
	});
	// Promp for confirmation on starting a new game on pressing 'N'
	document.addEventListener('keydown', event => {
		if (event.key === 'n') {
			this_.startNewGame();
		}
	});
	// Start a new game on clicking the prompt's 'Yes' button
	document.querySelector('.prompt.new-game button.yes')
		    .addEventListener('click', () => {
		this_.fillGrid();
    	this_.prompts.newGame = false;
    	this_.gameComplete = null;
	});
    // Continue the current game on clicking the prompt's 'No' button
	document.querySelector('.prompt.new-game button.no')
		    .addEventListener('click', () => {
    	this_.prompts.newGame = false;
	});
    // Change the game's difficulty on clicking the prompt's 'Yes' button
	document.querySelector('.prompt.change-difficulty button.yes')
		    .addEventListener('click', () => {
    	const selector = document.querySelector(
    		'.menu.settings .control.difficulty'
    	);
    	this_.menus.settings.difficulty.active = selector.value;
    	save(DIFFICULTY, this_.menus.settings.difficulty.active);
		this_.fillGrid();
    	this_.prompts.difficultyChange = false;
    	this_.gameComplete = null;
	});
    // Continue on the current difficulty on clicking the prompt's 'No' button
	document.querySelector('.prompt.change-difficulty button.no')
		    .addEventListener('click', () => {
    	const selector = document.querySelector(
    		'.menu.settings .control.difficulty'
    	);
    	selector.value = this_.menus.settings.difficulty.active;
    	this_.prompts.difficultyChange = false;
	});
    // Close all prompts on pressing 'Escape'
	document.addEventListener('keydown', event => {
		if (event.key === 'Escape') {
			for (const prompt in this_.prompts) {
				this_.prompts[prompt] = false;
			}
		}
	});
	// Toggle the settings menu on pressing 'S'
	document.addEventListener('keydown', event => {
		if (event.key === 's') {
			this_.toggleSettings(!this_.menus.settings.visible);
		}
	});
	// Close the Settings menu on pressing 'Escape'
	document.addEventListener('keydown', event => {
		if (event.key === 'Escape') {
			this_.toggleSettings(false);
		}
	});
	// Toggle the help menu on pressing 'H'
	document.addEventListener('keydown', event => {
		if (event.key === 'h') {
			this_.toggleHelp(!this_.menus.help.visible);
		}
	});
	// Close the Help menu on pressing 'Escape'
	document.addEventListener('keydown', event => {
		if (event.key === 'Escape') {
			this_.toggleHelp(false);
		}
	});
	// Close all menus on clicking outside them
	document.addEventListener('click', event => {
		const menus = document.querySelectorAll('.menu'),
		      fixedButtons = document.querySelectorAll('.fixed-button');
		if (isOutsideClick(event, menus) && 
			isOutsideClick(event, fixedButtons)) {
			this_.toggleSettings(false);
			this_.toggleHelp(false);
		}
	});
	// Remove the highlight from the currently selected grid cell
	// on pressing 'Escape'
	document.addEventListener('keydown', event => {
		if (event.key === 'Escape') {
			this_.activeCell = { row: null, col: null };
		}
	});
	// Remove the highlight from the currently highlighted grid cell
	document.querySelector('*').addEventListener('click', event => {
		const grid = document.querySelector('#grid');
		if (isOutsideClick(event, grid))
			this_.activeCell = { row: null, col: null }; 
	});
	// Move the cell highlight (if present) up/down/left/right 
	// on pressing an arrow key
	document.querySelector('*').addEventListener('keydown', e => {
		const dir = {
			'ArrowUp'   : 'up',
			'ArrowDown' : 'down',
			'ArrowLeft' : 'left',
			'ArrowRight': 'right',
		};
		moveActiveCell(dir[e.key], this_);
	})
}

/**
 * Move the currently highlighted grid cell
 * in the requested direction.
 * 
 * @param {string} dir The direction to
 * mmove the currently highlighted grid
 * cell in, one of 'up', 'down', 'left' 
 * or 'right'.
 * @param {object} this_ A reference to the 
 * [app]{@link https://vuejs.org/api/application.html} 
 * object.
 * @see https://vuejs.org/guide/introduction.html#api-styles
 */
function moveActiveCell(dir, app) {
	switch (dir) {
		case 'up':
			if (app.activeCell.row > 0)
				app.activeCell = { 
					...app.activeCell, 
					row: app.activeCell.row - 1
				};
			break;
		case 'down':
			if (app.activeCell.row < app.grid.length - 1)
				app.activeCell = { 
					...app.activeCell, 
					row: app.activeCell.row + 1
				};
			break;
		case 'left':
			if (app.activeCell.col > 0)
				app.activeCell = { 
					...app.activeCell, 
					col: app.activeCell.col - 1
				};
			break;
		case 'right':
			if (app.activeCell.col < app.grid[0].length - 1)
				app.activeCell = { 
					...app.activeCell, 
					col: app.activeCell.col + 1
				};
			break;
	}
}

export default attachEeventHandlers;