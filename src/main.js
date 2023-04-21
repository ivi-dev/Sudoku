/**
 * The app's main/entry module.
 * 
 * @module
 */


import { grid } from './grid.js';
import hooks from './hooks.js';
import data from './data.js';
import watch from './watch.js';
import methods from './methods.js';

/**
 * Initialize the game. Essentially
 * invokes the Vue's createApp() with 
 * the required options to create an 
 * application instance, and then 
 * Application#mount to mount it 
 * to the DOM.
 * 
 * @see https://vuejs.org/api/application.html#createapp
 * @see https://vuejs.org/api/application.html
 */
export function initGame() {
	Vue.createApp({
        ...hooks, data, watch, methods
    }).mount('#game');
}