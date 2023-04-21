/**
 * A modules defining general supporting utilities.
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

/**
 * Determine whether a mouse click happened outside
 * of a certain DOM element.
 * 
 * @param {MouseEvent} event The click event.
 * @param {Node|Node[]} boundary the DOM node(s) serving 
 * as a boundary for determining the click position.
 * If the clicked-on element is inside of that boundary 
 * node, or the boudnary node itself has been clicked on, 
 * then the click is considered internal (has happened 
 * inside the boundary), otherwise the click is considered 
 * an external one (has happened outside of the boundary).
 * If an array is passed, then each of the boundaries is
 * checked in sequence.
 * @return {boolean} True if the click has happened outside
 * of the boundary node, meaning the boundary node itslef or 
 * any of its childern has been clicked on, false otherwise.
 */
function isOutsideClick(event, boundary) {
    if (!(boundary instanceof NodeList))
        return !isParent(boundary, event.target) && 
               event.target !== boundary
    else {
        const res = [];
        for (const el of boundary) 
            if (!isParent(el, event.target) && 
                event.target !== el)
                res.push(false);
            else res.push(true);
        return res.every(r => r === false);
    }
}

/**
 * Get the parents of the provided DOM node.
 * 
 * @param {Node} node A DOM node to get the 
 * parent nodes of.
 * @return {Node[]} An array of the parents 
 * of the provided DOM node.
 */
function parents(node) {
    let parent = node.parentNode
    const parents_ = [parent]
    while (true) {
        if (parent === null)
            break
        else {
            parent = parent.parentNode
            parents_.push(parent)
        }
    }
    return parents_
}

/**
 * Determine whether nodeA is a parent of nodeB.
 * 
 * @param {Node} nodeA A node to test for parenthood.
 * @param {Node} nodeB A node to test for childhood.
 * @return {boolean} True if nodeA is a parent of nodeB, 
 * false otherwise.
 */
function isParent(nodeA, nodeB) {
    const parents_ = parents(nodeB)
    for (const parent of parents_)
        if (parent === nodeA) return true
    return false
}

/**
 * Determine whether a DOM node is any of 
 * the provided comparison nodes.
 * 
 * @param {Node} node A DOM node to check
 * for equality.
 * @param {NodeList} nodes A NodeList nodes 
 * to compare to.
 * @return {boolean} True if the provided
 * node is equal to one of the provided
 * comparison nodes, false otherwise.
 */
function isAnyOf(node, nodes) {
    for (const n of nodes)
        if (node === n) return true;
    return false;
}

export { perc, indices, isOutsideClick, isAnyOf };