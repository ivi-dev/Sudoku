/**
 * A module defining the app's state data as 
 * per [Vue.js's Options API style specification]{@link https://vuejs.org/guide/introduction.html#api-styles}.
 * 
 * @module
 * @see https://vuejs.org/api/options-state.html#data
 */


import { grid } from './grid.js';

/**
 * Return the app's mutable state definition 
 * according to the Options API style.
 * 
 * @return {Object} The app's mutable state.
 * @see https://vuejs.org/guide/introduction.html#api-styles
 */
function data() {
	return {
	  	debug: false,
	    grid: grid.flat,
	   	subgrids: grid.subgrids,
	   	activeCell:   { row: null, col: null },
	   	validationResults: {
	   		subgrids: { valid: false, results: { } },
	   		rows:     { valid: false, results: { } },
	   		cols:     { valid: false, results: { } },
	   	},
	   	gameComplete: null,
	   	prompts: {
	   		newGame:          false,
	   		difficultyChange: false,
	   	},
	   	newGamePromptVisible: false,
	   	menus: {
	   		anyVisible: false, // True if at least one menu is open, false otherwise
	   		settings: {
		   		visible: false,
		   		difficulty: {
			   		active: 'Easy',
			   		options: {
						Easy:   { missingPerRow: 25 /* % */ },
						Medium: { missingPerRow: 50 /* % */ },
						Hard:   { missingPerRow: 75 /* % */ },
			   		}
				},
				theme: { active: 'Light', options: [ 'Light', 'Dark' ] }
		   	},
		   	help: { visible: false }
	   	},
	}
}

export default data;