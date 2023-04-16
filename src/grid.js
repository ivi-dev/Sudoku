/**
 * A module defining the game's number grid-related
 * utilities.
 * 
 * @module
 */


/**
 * A class representing a grid of cells.
 */
class Grid {
	/**
	 * A storage for this grid's rows.
	 */
	#store = [];

	/**
	 * A storage for this grid's subgrids.
	 */
	#subgrids = [];

	/**
	 * Construct a new grid with a certain number of
	 * rows and columns, consisting of the provided
	 * subgrids.
	 * 
	 * @param {number} numRows The desired number of rows.
	 * @param {Subgrid} subgrids The subgrids that make up the grid.
	 * 
	 * @see {@link Subgrid}
	 */
	constructor(numRows, ...subgrids) {
		this.#subgrids = this.indexSubgrids(...subgrids);
		this.makeGrid(numRows, ...this.#subgrids);
	}

	/**
	 * Assign sequential numerical indices to the provided subgrids
	 * starting from 0.
	 * 
	 * @private
	 * @param {Subgrid} subgrids One or more subgrids.
	 * @return {Subgrid[]} An array of the provided subgrids
	 * with sequential indices assigned to them.
	 */
	indexSubgrids(...subgrids) {
		return _.map(subgrids, (subgrid, index) => { 
			subgrid.index = index; 
			return subgrid; 
		});
	}

	/**
	 * Assemble the grid out of the provied subgrids.
	 * The assembled grid is placed in Grid#store.
	 * 
	 * @private
	 * @param {number} numRows The desired number of rows.
	 * @param {Subgrid} subgrids The subgrids that should make 
	 * up the grid.
	 */
	makeGrid(numRows, ...subgrids) {
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
	 * @method
	 * @return {Subgrid[]} This grid's subgrids.
	 * @see Subgrid
	 */
	get subgrids() {
		return this.#subgrids;
	}

	/**
	 * Return this grid's flat structure.
	 * 
	 * @method
	 * @return {object[][]} This gird's flat structure represented
	 * as a two-dimensional array, in which the grid's rows occupy 
	 * the first dimension and the rows' columns - the socond one.
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
	 * @prop {SubgridPlacementSpec} grid This subgrid's 
	 * placement specification.
	 * @see SubgridPlacementSpec
	 */
	grid;

	/**
	 * @prop {Bounds} bounds This subgrid's bounds.
	 * @see Bounds
	 */
	bounds;

	/**
	 * @prop {Cell[]} cells This subgrid's cells.
	 * @see Cell
	 */
	cells;

	/**
	 * Construct a new subgrid.
	 * 
	 * @param {SubgridPlacementSpec} placementSpec This subgrid's 
	 * axes specification.
	 * @param {Bounds} bounds This subgrid's bounds.
	 * @param {Cell} cells This subgrid's cells.
	 * 
	 * @see SubgridPlacementSpec
	 * @see Bounds
	 * @see Cell
	 */
	constructor(placementSpec, bounds, ...cells) {
		this.grid = placementSpec;
		this.bounds = bounds;
		this.cells = cells;
	}
}

/**
 * A class representing a subgird's placement specification
 * in terms the axes (rows and columns) that it spans across. 
 * E.g., a 9x9 grid is made out of 9 3x3 subgrids. The
 * third subgrid (top right one, counting from left ot right, 
 * top to bottom) would then span across the main grid's 
 * 1st, 2nd and 3rd row and 7th, 8th and 9th columns.
 */
class SubgridPlacementSpec {
	/**
	 * @prop {number[]} rows The containing grid's rows 
	 * that a subgrid spans across.
	 * @see Grid
	 * @see Subgrid
	 */
	rows;

	/**
	 * @prop {number[]} rows The containing grid's columns 
	 * that a subgrid spans across.
	 * @see Grid
	 * @see Subgrid
	 */
	cols;

	/**
	 * Construct a new spec object with the provided
	 * parameters.
	 * 
	 * @param {number[]} rows The grid rows that a subgrid
	 * spans across.
	 * @param {number[]} cols The grid columns that a subgrid
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
 * located at in the containing grid. E.g., a 9x9 grid is 
 * made out of 9 3x3 subgrids. The second subgrid (top center)
 * would then have a bounds of 0:3, meaning its top left edge
 * is sitting on the first row and the 4th column of its 
 * containing grid.
 */
class SubgridBounds {
	/**
	 * @prop {number} rowStart The index of the containing 
	 * grid's column that marks the horizontal position of 
	 * the top-eft edge of a subgrid inside of its 
	 * containing grid.
	 * @see Grid
	 * @see Subgrid
	 */
	rowStart;

	/**
	 * @prop {number} colStart The index of the containing 
	 * grid's column that marks the vertical position of 
	 * the top-eft edge of a subgrid inside of its 
	 * containing grid.
	 * @see Grid
	 * @see Subgrid
	 */
	colStart;

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
 * A class representing a grid's cell.
 */
class Cell {
	/**
	 * @prop {number} row The index (0-based) of the 
	 * subgrid's row that this cell is on.
	 * @see Subgrid
	 */
	row;

	/**
	 * @prop {number} col The index (0-based) of the 
	 * subgrid's column that this cell is on.
	 * @see Subgrid
	 */
	col;

	/**
	 * @prop {*} value The value displayed inside of this 
	 * cell.
	 */
	value;

	/**
	 * Construct a new grid cell.
	 * 
	 * @param {number} row This cell's grid row.
	 * @param {number} col This cell's grid column.
	 * @param {*} [val=null] This cell's contained 
	 * value, defaults to null (empty).
	 */
	constructor(row, col, val = null) {
		this.row = row;
		this.col = col;
		this.value = val;
	}
}

/**
 * The game's grid's 1st subgrid.
 */
const subgrid1 = new Subgrid(
	new SubgridPlacementSpec([ 0, 1, 2 ], [ 0, 1, 2 ]), 
	new SubgridBounds(0, 0),
	new Cell(0, 0), new Cell(0, 1), new Cell(0, 2),
	new Cell(1, 0), new Cell(1, 1), new Cell(1, 2),
	new Cell(2, 0), new Cell(2, 1), new Cell(2, 2)
),
/**
 * The game's grid's 2nd subgrid.
 */
subgrid2 = new Subgrid(
	new SubgridPlacementSpec([ 0, 1, 2 ], [ 3, 4, 5 ]), 
	new SubgridBounds(0, 3),
	new Cell(0, 3), new Cell(0, 4), new Cell(0, 5),
	new Cell(1, 3), new Cell(1, 4), new Cell(1, 5),
	new Cell(2, 3), new Cell(2, 4), new Cell(2, 5)
),
/**
 * The game's grid's 3rd subgrid.
 */
subgrid3 = new Subgrid(
	new SubgridPlacementSpec([ 0, 1, 2 ], [ 6, 7, 8 ]), 
	new SubgridBounds(0, 6),
	new Cell(0, 6), new Cell(0, 7), new Cell(0, 8),
	new Cell(1, 6), new Cell(1, 7), new Cell(1, 8),
	new Cell(2, 6), new Cell(2, 7), new Cell(2, 8)
),
/**
 * The game's grid's 4th subgrid.
 */
subgrid4 = new Subgrid(
	new SubgridPlacementSpec([ 3, 4, 5 ], [ 0, 1, 2 ]), 
	new SubgridBounds(3, 0),
	new Cell(3, 0), new Cell(3, 1), new Cell(3, 2),
	new Cell(4, 0), new Cell(4, 1), new Cell(4, 2),
	new Cell(5, 0), new Cell(5, 1), new Cell(5, 2)
),
/**
 * The game's grid's 5th subgrid.
 */
subgrid5 = new Subgrid(
	new SubgridPlacementSpec([ 3, 4, 5 ], [ 3, 4, 5 ]), 
	new SubgridBounds(3, 3),
	new Cell(3, 3), new Cell(3, 4), new Cell(3, 5),
	new Cell(4, 3), new Cell(4, 4), new Cell(4, 5),
	new Cell(5, 3), new Cell(5, 4), new Cell(5, 5)
),
/**
 * The game's grid's 6th subgrid.
 */
subgrid6 = new Subgrid(
	new SubgridPlacementSpec([ 3, 4, 5 ], [ 6, 7, 8 ]), 
	new SubgridBounds(3, 6),
	new Cell(3, 6), new Cell(3, 7), new Cell(3, 8),
	new Cell(4, 6), new Cell(4, 7), new Cell(4, 8),
	new Cell(5, 6), new Cell(5, 7), new Cell(5, 8)
),
/**
 * The game's grid's 7th subgrid.
 */
subgrid7 = new Subgrid(
	new SubgridPlacementSpec([ 6, 7, 8 ], [ 0, 1, 2 ]), 
	new SubgridBounds(6, 0),
	new Cell(6, 0), new Cell(6, 1), new Cell(6, 2),
	new Cell(7, 0), new Cell(7, 1), new Cell(7, 2),
	new Cell(8, 0), new Cell(8, 1), new Cell(8, 2)
),
/**
 * The game's grid's 8th subgrid.
 */
subgrid8 = new Subgrid(
	new SubgridPlacementSpec([ 6, 7, 8 ], [ 3, 4, 5 ]), 
	new SubgridBounds(6, 3),
	new Cell(6, 3), new Cell(6, 4), new Cell(6, 5),
	new Cell(7, 3), new Cell(7, 4), new Cell(7, 5),
	new Cell(8, 3), new Cell(8, 4), new Cell(8, 5)
),
/**
 * The game's grid's 9th subgrid.
 */
subgrid9 = new Subgrid(
	new SubgridPlacementSpec([ 6, 7, 8 ], [ 6, 7, 8 ]), 
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