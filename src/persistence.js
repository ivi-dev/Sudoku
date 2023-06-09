/**
 * A module providing utilities for saving 
 * user preferences  to the browser's local 
 * storage.
 * 
 * @module
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
 */


/**
 * The key of the persisted data's root-level 
 * object. That object can then be retreived 
 * from the browser's local storage by doing 
 * localStorage.getItem(STORAGE_KEY).
 * 
 * @default
 */
const STORAGE_KEY = 'dev.ivi.Sudoku';

/**
 * The path to the game's difficulty setting
 * sotred in the browser's local storage.
 * 
 * @default
 */
const DIFFICULTY = 'settings.difficulty';

/**
 * The path to the game's theme setting
 * sotred in the browser's local storage.
 * 
 * @default
 */
const THEME = 'settings.theme';

/**
 * The model of the data being stored in the 
 * browser's local storage.
 */
const model = { 
    settings: { 
        difficulty: null, 
        theme:      null 
    } 
};


/**
 * Initialize the object representing editable
 * data in the browser's local storage if such 
 * object doesn't already exist.
 */
function init() {
	localStorage.setItem(
		STORAGE_KEY, JSON.stringify(model)
	);
	return JSON.parse(
		localStorage.getItem(STORAGE_KEY)
	);
}

/**
 * Save a value to the browser's local storage.
 * 
 * @param {string} path The path to the
 * value's key, relative to the root-level 
 * persistence object. Use this module's constants,
 * like DIFFICULTY, THEME etc., for convenience.
 * @param val {*} val The value to store under
 * path.
 * @example
 * // Persist the game's difficulty setting as 'Medium'.
 * set(DIFFICULTY, 'Medium')
 * @see module:persistence~STORAGE_KEY
 */
function set(path, val) {
	const data = JSON.parse(
		localStorage.getItem(STORAGE_KEY)
	) ?? init();
    let section = data;
	const keys = path.split('.');
	for (let i = 0; i < keys.length - 1; i++)
		section = section[keys[i]];
	section[keys[keys.length - 1]] = val;
    localStorage.setItem(
        STORAGE_KEY, JSON.stringify(data)
    );
}

/**
 * Retreive a value from the browser's local storage.
 * 
 * @param {string} path The path to the value of interest, 
 * relative to the root-level persistence object.
 * @return The value as retreived from the browser's 
 * local storage.
 * @example
 * // Retrieve the game's difficulty
 * // setting from the browser's local storage.
 * get(DIFFICULTY)
 * @see module:persistence~STORAGE_KEY
 */
function get(path) {
	let data = JSON.parse(
		localStorage.getItem(STORAGE_KEY)
	) ?? init();
    let section = data;
	const keys = path.split('.');
	for (let i = 0; i < keys.length - 1; i++) {
		section = section[keys[i]];
	}
	return section[keys[keys.length - 1]];
}

export { get, set, DIFFICULTY, THEME };