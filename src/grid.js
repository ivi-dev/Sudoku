/**
 * A class representing a grid of cells.
 */
class Grid {
	/**
	 * Storage for the grid.
	 */
	#store = [];

	/**
	 * This grid's subgrids.
	 */
	#subgrids = [];

	/**
	 * Construct a new grid with a certain number of
	 * rows and columns, consisting of the provided
	 * subgrids.
	 * 
	 * @param {number} numRows The desired number of rows.
	 * @param {Subgrid} subgrids The subgrids that make up the grid.
	 */
	constructor(numRows, ...subgrids) {
		this.#subgrids = Grid.#indexSubgrids(...subgrids);
		this.#makeGrid(numRows, ...this.#subgrids);
	}

	/**
	 * Index the provided subgrids.
	 * 
	 * @param {Subgrid} subgrids One or more subgrids.
	 * @return {Subgrid[]} An array of indexed subgrids.
	 */
	static #indexSubgrids(...subgrids) {
		return _.map(subgrids, (subgrid, index) => { 
			subgrid.index = index; 
			return subgrid; 
		});
	}

	/**
	 * Assemble the grid.
	 * 
	 * @param {number} numRows The desired number of rows.
	 * @param {Subgrid} subgrids The subgrids that make up the grid.
	 */
	#makeGrid(numRows, ...subgrids) {
		for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
			const row = [],
			subgrids_ = _.filter(subgrids, ({ grid }) => 
				_.includes(grid.rows, rowIndex)
			);
			_.each(subgrids_, ({ cells }) => {
				_.each(
					_.filter(cells, ({ row }) => row === rowIndex), 
					({ value }) => row.push(value)
				);
			});
			this.#store.push(row);
		}
	}

	/**
	 * Return this grid's subgrids.
	 * 
	 * @return {Subgrid[]} This grid's subgrids.
	 */
	get subgrids() {
		return this.#subgrids;
	}

	/**
	 * Return this grid's flat structure.
	 * 
	 * @return {*[][]} This gird's flat structure represented
	 * as a two-dimensional array.
	 */
	get flat() {
		return this.#store;
	}
}

/**
 * A class representing a portion of a larger grid of cells.
*/
class Subgrid {
	/**
	 * Construct a new subgrid.
	 * 
	 * @param {GridAxesSpec} axesSpec This subgird's axes spec.
	 * @param {Bounds} bounds This subgrid's bounds.
	 * @param {Cell[]} cells This subgrid's cells.
	 */
	constructor(axesSpec, bounds, ...cells) {
		this.grid = axesSpec;
		this.bounds = bounds;
		this.cells = cells;
	}
}

/**
 * A class representing grid axes (rows and columns) that
 * a grid-inner element (like a subgrid) spans across. E.g.,
 * a 9x9 grid is made out of 9 3x3 subgrids. The
 * third subgrid (top right one, counting from left ot right, 
 * top to bottom) would then span across the main grid's 
 * 1st, 2nd and 3rd row and 7th, 8th and 9th columns.
 */
class GridAxesSpec {
	/**
	 * Construct a new spec object with the provided
	 * parameters.
	 * 
	 * @param {number[]} rows The grid rows that the subgrid
	 * spans across.
	 * @param {number[]} cols The grid columns that the subgrid
	 * spans across.
	 */
	constructor(rows, cols) {
		this.rows = rows;
		this.cols = cols;
	}
}

/**
 * A class representing the bounds of a subgrid expressed 
 * as the grid row and column that its top left edge is 
 * located at in the containing grid. 
 */
class SubgridBounds {
	/**
	 * Construct a new bounds instance with the provided
	 * row and column coordinates.
	 * 
	 * @param {number} row The subgrid's top left edge's row.
	 * @param {number} col The subgrid's top left edge's column.
	 */
	constructor(row, col) {
		this.rowStart = row;
		this.colStart = col;
	}
}

/**
 * A class representing a single cell of a theoretical 
 * 2-dimensional grid of cells.
 */
class Cell {
	/**
	 * Construct a new cell.
	 * 
	 * @param {number} row This cell's grid row.
	 * @param {number} col This cell's grid column.
	 * @param {*} [val=null] val This cell's contained 
	 * value, defaults to null (empty).
	 */
	constructor(row, col, val = null) {
		this.row = row;
		this.col = col;
		this.value = val;
	}
}

/**
 * The game's grid's subgrids.
 */
const subgrid1 = new Subgrid(
	new GridAxesSpec([ 0, 1, 2 ], [ 0, 1, 2 ]), 
	new SubgridBounds(0, 0),
	new Cell(0, 0), new Cell(0, 1), new Cell(0, 2),
	new Cell(1, 0), new Cell(1, 1), new Cell(1, 2),
	new Cell(2, 0), new Cell(2, 1), new Cell(2, 2)
),
subgrid2 = new Subgrid(
	new GridAxesSpec([ 0, 1, 2 ], [ 3, 4, 5 ]), 
	new SubgridBounds(0, 3),
	new Cell(0, 3), new Cell(0, 4), new Cell(0, 5),
	new Cell(1, 3), new Cell(1, 4), new Cell(1, 5),
	new Cell(2, 3), new Cell(2, 4), new Cell(2, 5)
),
subgrid3 = new Subgrid(
	new GridAxesSpec([ 0, 1, 2 ], [ 6, 7, 8 ]), 
	new SubgridBounds(0, 6),
	new Cell(0, 6), new Cell(0, 7), new Cell(0, 8),
	new Cell(1, 6), new Cell(1, 7), new Cell(1, 8),
	new Cell(2, 6), new Cell(2, 7), new Cell(2, 8)
),
subgrid4 = new Subgrid(
	new GridAxesSpec([ 3, 4, 5 ], [ 0, 1, 2 ]), 
	new SubgridBounds(3, 0),
	new Cell(3, 0), new Cell(3, 1), new Cell(3, 2),
	new Cell(4, 0), new Cell(4, 1), new Cell(4, 2),
	new Cell(5, 0), new Cell(5, 1), new Cell(5, 2)
),
subgrid5 = new Subgrid(
	new GridAxesSpec([ 3, 4, 5 ], [ 3, 4, 5 ]), 
	new SubgridBounds(3, 3),
	new Cell(3, 3), new Cell(3, 4), new Cell(3, 5),
	new Cell(4, 3), new Cell(4, 4), new Cell(4, 5),
	new Cell(5, 3), new Cell(5, 4), new Cell(5, 5)
),
subgrid6 = new Subgrid(
	new GridAxesSpec([ 3, 4, 5 ], [ 6, 7, 8 ]), 
	new SubgridBounds(3, 6),
	new Cell(3, 6), new Cell(3, 7), new Cell(3, 8),
	new Cell(4, 6), new Cell(4, 7), new Cell(4, 8),
	new Cell(5, 6), new Cell(5, 7), new Cell(5, 8)
),
subgrid7 = new Subgrid(
	new GridAxesSpec([ 6, 7, 8 ], [ 0, 1, 2 ]), 
	new SubgridBounds(6, 0),
	new Cell(6, 0), new Cell(6, 1), new Cell(6, 2),
	new Cell(7, 0), new Cell(7, 1), new Cell(7, 2),
	new Cell(8, 0), new Cell(8, 1), new Cell(8, 2)
),
subgrid8 = new Subgrid(
	new GridAxesSpec([ 6, 7, 8 ], [ 3, 4, 5 ]), 
	new SubgridBounds(6, 3),
	new Cell(6, 3), new Cell(6, 4), new Cell(6, 5),
	new Cell(7, 3), new Cell(7, 4), new Cell(7, 5),
	new Cell(8, 3), new Cell(8, 4), new Cell(8, 5)
),
subgrid9 = new Subgrid(
	new GridAxesSpec([ 6, 7, 8 ], [ 6, 7, 8 ]), 
	new SubgridBounds(6, 6),
	new Cell(6, 6), new Cell(6, 7), new Cell(6, 8),
	new Cell(7, 6), new Cell(7, 7), new Cell(7, 8),
	new Cell(8, 6), new Cell(8, 7), new Cell(8, 8)
);

/**
 * The game's grid.
 */
const grid = new Grid(
	9,  // Num rows
	subgrid1, subgrid2, subgrid3, 
	subgrid4, subgrid5, subgrid6, 
	subgrid7, subgrid8, subgrid9
);

export { grid };