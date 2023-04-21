/**
 * A module defining the app's lifecycle hooks as 
 * per 
 * [Vue.js's Options API style specification]{@link https://vuejs.org/guide/introduction.html#api-styles}.
 * 
 * @module
 * @see https://vuejs.org/api/options-lifecycle.html#options-lifecycle
 */


import attachEventHandlers from './event-handlers.js';
import { get as load, DIFFICULTY, THEME } from './persistence.js';

/**
 * Load the user's preferences from the browser's
 * local storage and then apply them.
 * 
 * @param {object} this_ A reference to the constructed
 * [app]{@link https://vuejs.org/api/application.html} object.
 */
function loadSettings(this_) {
	this_.menus.settings.difficulty.active = 
		load(DIFFICULTY) ?? this_.menus.settings.difficulty.active;
	this_.menus.settings.theme.active = 
		load(THEME) ?? this_.menus.settings.theme.active;
}

/**
 * The app's lifecycle hooks, a part of the app's 
 * definition according to the Options API style.
 * 
 * @see https://vuejs.org/guide/introduction.html#api-styles
 */
const hooks = {
	/**
	 * Execute as soon as the app is mounted to the DOM.
	 * 
	 * @method
	 * @see https://vuejs.org/api/options-lifecycle.html#options-lifecycle
	 */
	mounted() {
        loadSettings(this);
		this.numbers = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
		this.fillGrid();
		attachEventHandlers(this);
	}
}

export default hooks;