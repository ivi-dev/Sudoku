/**
 * The app's main/entry module.
 * 
 * @module
 */


import { grid } from './grid.js';
import hooks from './hooks.js';
import data from './data.js';
import methods from './methods.js';

/**
 * Initialize the game. Essentially
 * invokes external:Vue.createApp with 
 * the required options to create the 
 * external:Application instance, and then 
 * external:Application#mount to mount it 
 * to the DOM.
 * 
 * @see https://vuejs.org/api/application.html#createapp
 * @see https://vuejs.org/api/application.html
 */
export function initGame() {
	Vue.createApp({...hooks, data, methods}).mount('#game');
}