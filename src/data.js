import { grid } from './grid.js';

/**
 * The app's data.
 */
export default function() {
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