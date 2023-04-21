/**
 * 
 * @module
 */


import { set as save, THEME } from './persistence.js';

/**
 * The app's data watchers, a part of the app's 
 * definition according to the Options API style.
 * 
 * @see https://vuejs.org/guide/essentials/watchers.html
 * @see https://vuejs.org/guide/introduction.html#api-styles
 */
export default {
	menus: {
	  handler(menus, _) {
	    save(THEME, menus.settings.theme.active);
	  },
	  deep: true
	}
}