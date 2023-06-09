/**
 * A module defining the app's methods as 
 * per [Vue.js's Options API style specification]{@link https://vuejs.org/guide/introduction.html#api-styles}.
 * 
 * @module
 * @see https://vuejs.org/api/options-state.html#methods
 */


import { perc, indices } from './util.js';

/**
 * The app's methods.
 * 
 * @see https://vuejs.org/api/options-state.html#methods
 */
export default {
	/**
	 * Fill the game's grid with numbers and perform
	 * the necessary corrections, so that the resulting grid 
	 * conforms to the Sudoku's rules for correctness - all 
	 * of the digits from 1 to 9 inclusive have to appear 
	 * exactly once in all of the grid's rows, columns and 
	 * subgrids.
	 */
	fillGrid() {
		// 1. Fill the grid with numbers
		this.fillRows();       // 1.1 Fill all rows with numbers
		this.dedupSubgrids();  // 1.2 Remove duplicate numbers from the game's subgrids
		this.dedupCols();      // 1.3 Remove duplicate numbers from the game's columns
		this.snapshotGrid();   // 1.4 Store a snapshot of the filled out grid into the DOM
		                       // (aides E2E testing).
		// 2. Make holes in the grid for the player to fill 
		const holeSize = perc(
			this.menus.settings.difficulty
			    .options[this.menus.settings.difficulty.active]
			    .missingPerRow, 
			this.grid[0].length, Math.floor
		);
		this.punctureGrid(holeSize);
		this.validateGrid();
	},
	/**
	 * Create a snapshot of a correctly filled grid and 
	 * store it in the DOM as a <script type="application/json"> 
	 * element.
	 */
	snapshotGrid() {
		const gridClone = _.map(this.grid, row => 
			_.map(row, col => col)
		);
		const json = document.createElement('SCRIPT');
		json.setAttribute('type', 'application/json');
		json.setAttribute('id', 'complete');
		json.textContent = JSON.stringify(gridClone);
		document.body.appendChild(json);
	},
	/**
	 * Make 'holes' in the grid so that some numbers appear
	 * missing to the player.
	 * 
	 * @param {number} holeSize The desired number of
	 * cells to hide on each grid row. E.g. 3 will hide
	 * 3 random cells on each grid row.
	 */
	punctureGrid(holeSize) {
		_.each(this.grid, (row, rowIndex) => {
			const indices_ = indices(row);
			for (let i = 0; i < holeSize; i++) {
				const colIndex = _.sample(indices_);
				this.grid[rowIndex][colIndex] = null;
				_.pull(indices_, colIndex);
			}
		});
		this.syncGrid();
	},
	/**
	 * Fill the game's grid's rows with numbers.
	 */
	fillRows() {
		_.each(this.grid, (_, index) => this.fillRow(index));
		this.syncGrid();
	},
	/**
	 * Fill a single grid row with numbers.
	 * 
	 * @param {number} row The index of the row to fill.
	 */
	fillRow(row) {
		const numbers_ = this.numbers.slice(0);
		_.each(this.grid[row], (__, col) => {
			const number = _.sample(numbers_);
			_.pull(numbers_, number);
			this.grid[row][col] = number;
		});
	},
	/**
	 * Synchronize the game's grid with the subgrid structure, 
	 * effectively refreshing the game's UI.
	 */
	syncGrid() {
		_.each(this.subgrids, ({ cells }) => {
			_.each(cells, cell => {
				cell.value = this.grid[cell.row][cell.col]; 
			});
		});
	},
	/**
	 * Put a number in a certain subgrid's cell.
	 * 
	 * @param {number} row The subgrid cell's row.
	 * @param {number} col The subgrid cell's column.
	 * @param {number} number The number to put in the cell.
	 */
	setSubgridCell(row, col, number) {
		const subgrid = _.find(this.subgrids, ({ grid }) => 
			_.includes(grid.rows, row) && _.includes(grid.cols, col));
		const cell = _.find(subgrid.cells, ({ row: row_, col: col_ }) => 
			row_ === row && col_ === col);
		cell.value = number;
	},
	/**
	 * Remove the duplicated numbers from all of the game's subgrids.
	 */
	dedupSubgrids() {
		_.each(this.subgrids, (_, subgridIndex) => {
			for (;;) {
				const duplicates = this.dedupSubgrid(subgridIndex);
				if (duplicates.length === 0) {
					break;
				}
			}
		});
		this.syncGrid();
	},
	/**
	 * Remove the duplicated numbers from a certain subgrid.
	 * 
	 * @param {number} index The index (0-based) of the subgrid 
	 * to work on.
	 */
	dedupSubgrid(index) {
		const { missing, duplicates } = this.getSubgridState(index),
			    nextSubgrids          = this.getNextHSubgrids(index);
	    _.each(duplicates, data => {
	    	_.each(data, ({ row: dupRow, col: dupCol, value: duplicate }) => {
	    		const isDuped = _.find(duplicates, data => 
					    			_.find(data, ({ value }) => value === duplicate)
				    			) !== undefined;
	    		if (isDuped) {
					_.each(nextSubgrids, ({ index: subgridIndex, colStart }) => {
							const hNumbers = this.getSubgridHNumbers(dupRow, colStart);
							const missingNumber = _.find(hNumbers, ({ value }) => 
												  missing.includes(value) && 
												  this.isDuplicated(value, subgridIndex));
							if (missingNumber !== undefined) {
								const { row:   missRow, 
								        col:   missCol, 
								        value: missValue } = missingNumber;
								this.swapCells({ row: dupRow,  col: dupCol  }, 
										       { row: missRow, col: missCol });
								_.pull(missing, missValue);
								return false;
							}
					});
				}
	    	});
	    });
		return duplicates;
	},
	/**
	 * Remove the duplicated numbers from the game's columns.
	 */
	dedupCols() {
		_.each(this.grid[0], (_, index) => this.dedupCol(index));
		this.syncGrid();
	},
	/**
	 * Remove the duplicated numbers from a certain grid column.
	 * 
	 * @param {number} index The index (0-based) of the grid column 
	 * to work on.
	 */
	dedupCol(index) {
		const processedRows = [];
		for (;;) {
			const { missing, duplicates } = this.getColState(index);
			let numSwaps = 0;
			if (missing.length === 0) {
				break;
			}
			_.forEach(missing, missingNumber => {
				// 1. Get the column of subgrids that the column under spans across
				const subgrids = _.filter(this.subgrids, ({ grid }) => _.includes(grid.cols, index));
				// 2. In the column of subgrids find the numbers missing from the single 
				//    column under correction. If a missing number is found in a subgrid, 
				//    it's swapped with a number on the same row in the column under 
				//    correction, which avoids invalidating grid rows!
				_.forEach(subgrids, subgrid => {
					const swap = _.find(subgrid.cells, ({ col, value }) => 
			     				 col > index && value === missingNumber);
					if (swap !== undefined) {
						if (!_.includes(processedRows, swap.row)) {
							const swapee = _.find(subgrid.cells, ({ row, col }) => 
									       row === swap.row && col === index);
							this.swapCells({ row: swap.row,   col: swap.col   }, 
									       { row: swapee.row, col: swapee.col });
							numSwaps++;
							processedRows.push(swap.row);
							return false;
						}
					}
				});
			});
			// If no swaps have been made on this run 
			// (due to trying to processed already processed row(s)),
			// reset the 'row tracker', allowing further swaps.
			if (numSwaps === 0) {
				processedRows.splice(0, processedRows.length);
			}
		}
	},
	/**
	 * Return the current state of a certain subgrid, described by
	 * the numbers it contains, the numbers that are duplicated
	 * one or more times in it, and the numbers that are missing 
	 * from it.
	 * 
	 * @param {number} index The index (0-based) of the subgrid
	 * to get the current state of.
	 * @return {object} An object representing the current state
	 * of the subgrid with the provided index. E.g.:
	 * @example
	 * getSubgridState(1)
	 * 
	 * // returns a value of the sort:
	 *  
	 *  {
	 *     numbers:    [
	 * 	                  { row: r0, col: c0, value: [Number] },
	 * 	                  { row: r1, col: c1, value: [Number] },
	 * 	                  { row: r2, col: c2, value: [Number] },
	 * 	                  ...
	 *                 ],
	 *     missing:    [ [Number], [Number], [Number], ... ],
	 *     duplicates: [
	 * 					  0: Array [ // A number appearing three times
	 * 		                 { row: [Number], col: [Number], value: [Number] },
	 * 		                 { row: [Number], col: [Number], value: [Number] },
	 * 		                 { row: [Number], col: [Number], value: [Number] },
	 * 					  ],
	 * 					  1: Array [  // A number appearing two times
	 * 			             { row: [Number], col: [Number], value: [Number] },
	 * 		                 { row: [Number], col: [Number], value: [Number] },
	 * 	                  ],
	 *                    ...
	 * 				 ]
	 *  }
	 */
	getSubgridState(index) {
		const numbers    = _.find(this.subgrids, ({ index: index_ }) => 
				           index_ === index).cells;
		const missing    = _.difference(this.numbers, _.map(numbers, 'value')),
			  duplicates = _.filter(_.values(_.groupBy(numbers, 'value')), 
				                             instance => instance.length > 1);
		return { numbers, missing, duplicates };
	},
	/**
	 * Return the current state of a certain grid column, described 
	 * by the numbers it contains, the numbers that are duplicated
	 * one or more times in it, and the numbers that are missing 
	 * from it.
	 * 
	 * @param {number} index The index (0-based) of the grid column
	 * to get the current state of.
	 * @return {object} An object representing the current state
	 * of the subgrid with the provided index.
	 * @example
	 * getColState(1)
	 * 
	 * // returns a value of the sort:
	 * {
	 *    numbers:    [
	 * 	                  { row: r0, col: c0, value: [Number] },
	 * 	                  { row: r1, col: c1, value: [Number] },
	 * 	                  { row: r2, col: c2, value: [Number] },
	 * 	                  ...
	 *                ],
	 *    missing:    [ [Number], [Number], [Number], ... ],
	 *    duplicates: [
	 * 					  0: Array [ // A number appearing three times
	 * 		                 { row: [Number], col: [Number], value: [Number] },
	 * 		                 { row: [Number], col: [Number], value: [Number] },
	 * 		                 { row: [Number], col: [Number], value: [Number] },
	 * 					  ],
	 * 					  1: Array [  // A number appearing two times
	 * 			             { row: [Number], col: [Number], value: [Number] },
	 * 		                 { row: [Number], col: [Number], value: [Number] },
	 * 	                  ],
	 *                   ...
	 * 			      ]
	 * }
	 */
	getColState(index) {
		const numbers = _.map(this.grid, row => 
			            _.find(row, (col, colIndex) => colIndex === index));
		const missing = _.difference(this.numbers, numbers),
			  duplicates = _.filter(_.values(_.groupBy(numbers, 'value')), 
		                            instance => instance.length > 1);
		return { numbers, missing, duplicates };
	},
	/**
	 * Return N subgrids on the horizontal axis neighboring the subgrid 
	 * at the provided index (0-based). Ex. the subgrid at index 0
	 * (top left of the main grid) will have the subgrids
	 * at indices 1 and 2 (sitting to the right of it up to the grid's right 
	 * edge) as its neighbors; The subgrid at index 4 
	 * (at the very center of the grid) will have the subgrid at index 5 
	 * (at the middle right of the grid) as its neighbor etc.
	 * 
	 * @param {number} index The index (0-based) of the subgrid to 
	 * get the next horizontal neighbors of.
	 * @return {object[]} An array of objects representing the neighboring 
	 * subgrids of the one at the provided index.
	 * 
	 * @example
	 * getNextHSubgrids(2)
	 * 
	 *  returns a value of the sort:
	 *  [
	 * 	   { 
	 * 	       index:    [Number],  // The index of this neighbor (0-based)
	 *           rowStart: [Number],  // This neighbor's starting row (0-based)
	 * 	       colStart: [Number]   // This neighbor's starting column (0-based)
	 * 	   },
	 *     ...
	 *  ]
	 */
	getNextHSubgrids(index) {
		const subgrid = _.find(this.subgrids, ({ index: index_ }) => index_ === index);
		const { rows: initialRows, cols: initialCols } = subgrid.grid;
			return _.map(_.filter(this.subgrids, ({ grid }) => 
				_.isEqual(grid.rows, initialRows) && grid.cols > initialCols
	        ), ({ index, bounds }) => ({ index, ...bounds }));
	},
	/**
	 * Determine whether a number is duplicated in a certain subgrid.
	 * 
	 * @param {number} number The number to assess.
	 * @param {number} subgridIndex The index of the subgrid to look into.
	 * @return {boolean} True if the provided number is duplicated
	 * at least once in the subgrid at the provided index, false otherwise.
	 */
	isDuplicated(number, subgridIndex) {
		const { duplicates } = this.getSubgridState(subgridIndex);
		return _.find(duplicates, data => _.find(data, ({ value }) => 
			   value === number)) !== undefined;
	},
	/**
	 * Return the numbers sitting on the same row in a certain subgrid.
	 * 
	 * @param {number} row The subgrid row to get the numbers of. 
	 * @param {number} col The subgrid column to start the search from.
	 * @return {number[]} An array of the numbers sitting on the specified
	 * row in a subgrid.
	 */
	getSubgridHNumbers(row, col) {
		const subgrid = _.find(this.subgrids, ({ grid }) => 
						_.includes(grid.rows, row) && 
						_.includes(grid.cols, col));
		return _.filter(subgrid.cells, ({ row: row_, col: col_ }) => row_ === row);
	},
	/**
	 * Swaps two grid cells.
	 * 
	 * @param {object} cell1 A grid cell.
	 * @param {object} cell2 Another grid cell.
	 */
	swapCells(cell1, cell2) {
		const temp = this.grid[cell2.row][cell2.col];
		this.grid[cell2.row][cell2.col] = this.grid[cell1.row][cell1.col];
		this.grid[cell1.row][cell1.col] = temp;
		this.syncGrid();
	},
	/**
	 * Return the numbers contained in a certain subgrid.
	 * 
	 * @param {number} index The index of the subgrid to return the contents of.
	 * @return {object[]} An object representing the numbers contained in the
	 * subgrid at the provided index.
	 * @example
	 * getSubgridSiblings(1)
	 * 
	 *  return a value of the sort:
	 *  [
	 * 	   { row: [Number], col: [Number], value: [Number] },
	 * 	   { row: [Number], col: [Number], value: [Number] },
	 * 	   { row: [Number], col: [Number], value: [Number] },
	 *       ...
	 *  ]
	 */
	getSubgridSiblings(index) {
		return _.find(this.subgrids, ({ index: index_ }) => index_ === index).cells;
	},
	/**
	 * Check the validity of all subgrids and update the app's state
	 * to reflect the result.
	 * 
	 * A subgrid is considered valid if it complies with the rule
	 * of Sudoku stating that a subgrid must contain exactly one instance
	 * of all the digits from 1 to 9 inclusive. 
	 * 
	 * @return {boolean} True if all of the game's subgrids are valid, false
	 * otherwise.
	 */
	validateSubgrids() {
		// 1. Check to see if a number is duplicated in any of the game's subgrids,
		//    recording the results along the way.
		_.each(this.subgrids, ({ cells }, subgridIndex) => {
			const valid = _.difference(this.numbers, _.map(cells, 'value')).length === 0;
			this.validationResults.subgrids.results[subgridIndex] = valid;
		});
		// 2. Set the overall validity status of the game's subgrids.
		this.validationResults.subgrids.valid = 
			_.every(_.values(this.validationResults.subgrids.results), 
			valid => valid === true);
		return this.validationResults.subgrids.valid;
	},
	/**
	 * Check the validity of all grid rows and update the app's state
	 * to reflect the result.
	 * 
	 * A grid row is considered valid if it complies with the rule
	 * of Sudoku stating that a grid row must contain exactly one instance
	 * of all the digits from 1 to 9 inclusive. 
	 * 
	 * @return {boolean} True if all of the game's rows valid, false
	 * otherwise.
	 */
	validateRows() {
		// 1. Check to see if a number is duplicated a any of the game's grid's
		//    rows, recording the results along the way.
		_.each(this.grid, (row, rowIndex) => {
			const valid = _.difference(this.numbers, row).length === 0;
			this.validationResults.rows.results[rowIndex] = valid;
		});
		// 2. Set the overall validity status of the game's grid's rows.
		this.validationResults.rows.valid = 
			_.every(_.values(this.validationResults.rows.results), 
			valid => valid === true);
		return this.validationResults.rows.valid;
	},
	/**
	 * Check the validity of all grid columns and update the app's state
	 * to reflect the result.
	 * 
	 * A grid column is considered valid if it complies with the rule
	 * of Sudoku stating that a grid column must contain exactly one instance
	 * of all the digits from 1 to 9 inclusive. 
	 * 
	 * @return {boolean} True if all of the game's columns are valid, false
	 * otherwise.
	 */
	validateCols() {
		// 1. Check to see if a number is duplicated a any of the game's grid's 
		//    columns, recording the results along the way.
		for (let colIndex = 0; colIndex < this.grid[0].length; colIndex++) {
			const gridCol = [];
			_.each(this.grid, row => 
				gridCol.push(_.find(row, (__, index) => index === colIndex))
			);
			const valid = _.difference(this.numbers, gridCol).length === 0;
			this.validationResults.cols.results[colIndex] = valid;
		}
		// 2. Set the overall validity status of the game's grid's columns.
		this.validationResults.cols.valid = 
			_.every(_.values(this.validationResults.cols.results), 
			valid => valid === true);
		return this.validationResults.cols.valid;
	},
	/**
	 * Verify the validity of the game's grid.
	 * 
	 * @return {boolean} True if the entire grid (all
	 * of its rows, columns and subgrids) complies
	 * with the rules of Sudoku, false otherwise.
	 * 
	 * The rules of Sudok state that every subgrid, row and column
	 * of the grid must contain exactly one instance of the digits
	 * from 1 to 9 inclusive.
	 */
	validateGrid() {
		const subgridsValid = this.validateSubgrids(),
			  rowsValid     = this.validateRows(),
			  colsValid     = this.validateCols();
	  	return _.every([subgridsValid, rowsValid, colsValid]);
	},
	/**
	 * Determine whether the game's grid contians an empty cell.
	 * 
	 * @return {boolean} True if the game's grid contains at least
	 * one empty cell, false otherwise.
	 */
	hasEmptyCells() {
		let empty = 0;
		_.each(this.grid, row => _.each(row, col => { 
			if (col === null) { 
				empty++; 
			} 
		}));
		return empty > 0;
	},
	/**
	 * Highlight a grid cell.
	 * 
	 * @param {Cell} cell The cell to highlight.
	 */
	highlightCell(cell) {
		_.each(this.subgrids, ({ cells }) => {
			const cell_ = _.find(cells, ({ row: row_, col: col_ }) => 
				row_ === cell.row && col_ === cell.col
			);
			if (cell_) {
				this.activeCell = cell_;
			}
		});
	},
	/**
	 * Remove the highlight from all grid cells.
	 */
	unhighlightCells() {
		this.activeCell = { row: null, col: null };
	},
	/**
	 * Determine whether a grid cell is currently highlighted.
	 * 
	 * @return {boolean} True if a grid cell is currently
	 * highlighted, false otherwise.
	 */
	isCellActive() {
		return this.activeCell.row !== null  && 
			   this.activeCell.col !== null;
	},
	/**
	 * Set a cell's value.
	 * 
	 * @param {Cell} cell The cell to set.
	 * @param {number} val The value to set the cell to.
	 */
	setCell(cell, val) {
		this.grid[cell.row][cell.col] = val;
		this.syncGrid();
	},
	/**
	 * Ask the user for confirmation on changing the game's
	 * difficulty. If they answer with 'Yes', the game's
	 * difficulty is changed; If they answer with 'No' 
	 * the game retains its current difficulty setting.
	 */
	askChangeDifficulty() {
		this.prompts.difficultyChange = true;
	},
	/**
	 * Open/close the Settings menu. If an explicit visibility
	 * status is not provided, the menu's visibility
	 * will simply be toggled, e.g. if the menu is currently 
	 * closed (!visible), it will be changed to open 
	 * (visible). Otherwise the menu's visibility status will
	 * be set to the provided one.
	 * 
	 * @param {boolean} visible True to explicitly open the 
	 * menu, false to explicitly hide it.
	 */
	toggleSettings(visible) {
		this.closeMenus();
		this.menus.settings.visible = visible;
		this.menus.anyVisible = this.isAnyMenuVisible();
	},
	/**
	 * Open/close the Help menu. If an explicit visibility
	 * status is not provided, the menu's visibility
	 * will simply be toggled, e.g. if the menu is currently 
	 * closed (!visible), it will be changed to open 
	 * (visible). Otherwise the menu's visibility status will
	 * be set to the provided one.
	 * 
	 * @param {boolean} visible True to explicitly open the 
	 * menu, false to explicitly hide it.
	 */
	toggleHelp(visible) {
		this.closeMenus();
		this.menus.help.visible = visible;
		this.menus.anyVisible = this.isAnyMenuVisible();
	},
	/**
	 * Determine whether a menu is open.
	 * 
	 * @return {boolean} True if at least one menu is open, 
	 * false otherwise.
	 */
	isAnyMenuVisible() {
		const menuStatuses = _.map(this.menus, (menu, name) =>
			name !== 'anyVisible' ? menu.visible : undefined
		);
		_.pull(menuStatuses, undefined);
		return _.some(menuStatuses, open => open === true);
	},
	/**
	 * Close all menus.
	 */
	closeMenus() {
		_.each(this.menus, (menu, name) => {
			if (name !== 'anyVisible') {
				menu.visible = false;
			}
		});
	},
	/**
	 * Prompt the player for confirmation on starting
	 * a new game.
	 */
	startNewGame() {
		this.prompts.newGame = true;
	},
	/**
	 * Play a sound presented by an <audio> DOM element. 
	 */
	playSound(sound) {
		document.querySelector(`audio${sound}`).play();
	}
}