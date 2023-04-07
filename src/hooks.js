import attachEventHandlers from './event-handlers.js';

/**
 * The app's lifecycle hooks.
 */
export default {
	/**
	 * Execute as soon as the app is mounted to the DOM. 
	 */
	mounted() {
		this.numbers = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
		this.fillGrid();
		attachEventHandlers(this);
	}
}