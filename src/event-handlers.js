/**
 * Attach the game's event handlers to their corresponding
 * elements. 
 */
export default function(this_) {
	// Set the value of the currently active grid cell on pressing
	// a digit key on the keyboard
	document.addEventListener('keypress', event => {
		const val = Number(event.key);
		if (_.includes(this_.numbers, val) && this_.activeCell) {
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
	// Promp starting a new game on pressing 'N'
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
	});
    // Continue current game on clicking the prompt's 'No' button
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
		this_.fillGrid();
    	this_.prompts.difficultyChange = false;
	});
    // Don't change the game's difficulty on clicking the prompt's 'No' button
	document.querySelector('.prompt.change-difficulty button.no')
		    .addEventListener('click', () => {
    	const selector = document.querySelector(
    		'.menu.settings .control.difficulty'
    	);
    	selector.value = this_.menus.settings.difficulty.active;
    	this_.prompts.difficultyChange = false;
	});
    // Close prompts on pressing Escape
	document.addEventListener('keydown', event => {
		if (event.key === 'Escape') {
			for (const prompt in this_.prompts) {
				this_.prompts[prompt] = false;
			}
		}
	});
	// Open/close the settings menu on pressing 'S'
	document.addEventListener('keydown', event => {
		if (event.key === 's') {
			this_.toggleSettings(!this_.menus.settings.visible);
		}
	});
	// Close the Settings menu on pressing Escape
	document.addEventListener('keydown', event => {
		if (event.key === 'Escape') {
			this_.toggleSettings(false);
		}
	});
	// Open/close the help menu on pressing 'H'
	document.addEventListener('keydown', event => {
		if (event.key === 'h') {
			this_.toggleHelp(!this_.menus.help.visible);
		}
	});
	// Close the Help menu on pressing Escape
	document.addEventListener('keydown', event => {
		if (event.key === 'Escape') {
			this_.toggleHelp(false);
		}
	});
	// Remove the highlight from the currently selected grid cell
	document.addEventListener('keydown', event => {
		if (event.key === 'Escape') {
			this_.activeCell = { row: null, col: null };
		}
	});
}