/**
 * A modules defining general helpful utilities.
 * 
 * @module
 */

/**
 * The callback invoked with the result of perc.
 * 
 * @callback percDoneCb
 * @param {number} result
 */


/**
 * Return the percentage value of a certain amount.
 * 
 * @examlpe
 * perc(25, 10);
 * // returns 2.5 (25% of 10 = 2.5)
 * 
 * @param {number} val The percentage value to calculate.
 * @param {number} amount The amount to calculate the percentage of.
 * @param {percDoneCb} done A callback to invoke with the result of
 * the calculation. E.g. perc(25, 10, Math.floor);  // 2
 */
function perc(val, amount, done) { 
	const result = val / 100 * amount; 
	return !done ? result : done(result);
}

/**
 * Return the indices of the provided array.
 * 
 * @param {object[]} arr An array to get the indices of.
 * @return {number[]} The indices of the provided array.
 */
function indices(arr) {
	return _.map(arr, (_, index) => index);
}

export { perc, indices };