import { grid } from './grid.js';
import hooks from './hooks.js';
import data from './data.js';
import methods from './methods.js';

/**
 * Start the game up for the player.
 */
export function initGame() {
	Vue.createApp({...hooks, data, methods})
	   .mount('#game');
}