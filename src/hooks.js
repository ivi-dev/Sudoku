/**
 * A module defining the app's lifecycle hooks as 
 * per [Vue.js's Options API style specification]{@link https://vuejs.org/guide/introduction.html#api-styles}.
 * 
 * @module
 * @see https://vuejs.org/api/options-lifecycle.html#options-lifecycle
 */


import attachEventHandlers from './event-handlers.js';

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
	 * @see https://vuejs.org/guide/introduction.html#api-styles
	 */
	mounted() {
		this.numbers = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
		this.fillGrid();
		attachEventHandlers(this);
	}
}

export default hooks;