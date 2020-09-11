let maze = document.querySelector(".maze");
let ctx = maze.getContext("2d");

let current;

class Maze {
    constructor(size, rows, cols) {
        this.size = size;
        this.rows = rows;
        this.cols = cols;
        this.grid = [];
        this.stack = [];
    }

    setup() {
        for (let r = 0; r < this.rows; r++) {
            let row = [];
            for (let c = 0; c < this.cols; c++) {
                let cell = new Cell(r, c, this.grid, this.size);
                row.push(cell);
            }
            this.grid.push(row);
        }
        current = this.grid[0][0];
    }
}

class Cell {
    constructor(rowNum, colNum, parentGrid, parentSize) {
        this.rowNum = rowNum;
        this.colNum = colNum;
        this.parentGrid = parentGrid;
        this.parentSize = parentSize;
        this.visited = false;
        this.walls = {
            topWall: true,
            bottomWall: true,
            leftWall: true,
            rightWall: true,
        };
    }
}


let newMaze = new Maze(500, 10, 10);
newMaze.setup();