let maze = document.querySelector(".maze");
let ctx = maze.getContext("2d");

let current;

class Maze { //Maze class
    constructor(size, rows, cols) { //Basic constructor
        this.size = size;
        this.rows = rows;
        this.cols = cols;
        this.grid = [];
        this.stack = [];
    }

    setup() {
        for (let r = 0; r < this.rows; r++) { //Nested loop to create grid
            let row = [];
            for (let c = 0; c < this.cols; c++) {
                let cell = new Cell(r, c, this.grid, this.size);
                row.push(cell);
            }
            this.grid.push(row);
        }
        current = this.grid[0][0];
    }


    draw() {
        maze.width = this.size;
        maze.height = this.size;
        maze.style.background = "black";
        current.visited = true;

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                let grid = this.grid;
                grid[r][c].show(this.size, this.cols, this.rows);
            }
        }

    }
}

class Cell { //Cell class
    constructor(rowNum, colNum, parentGrid, parentSize) {
        this.rowNum = rowNum;
        this.colNum = colNum;
        this.parentGrid = parentGrid;
        this.parentSize = parentSize;
        this.visited = false;
        this.walls = { //Cell borders object
            topWall: true,
            bottomWall: true,
            leftWall: true,
            rightWall: true,
        };
    }

    //Generating cell walls
    drawTopWall(x, y, size, cols, rows) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + size / cols, y);
        ctx.stroke();
    }

    drawBottomWall(x, y, size, cols, rows) {
        ctx.beginPath();
        ctx.moveTo(x, y + size / rows);
        ctx.lineTo(x + size / cols, y + size / rows);
        ctx.stroke();
    }

    drawLeftWall(x, y, size, cols, rows) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + size / rows);
        ctx.stroke();
    }

    drawRightWall(x, y, size, cols, rows) {
        ctx.beginPath();
        ctx.moveTo(x + size / cols, y);
        ctx.lineTo(x + size / cols, y + size / rows);
        ctx.stroke();
    }

    //Drawing cell walls
    show(size, rows, cols) {
        let x = (this.colNum * size) / cols;
        let y = (this.rowNum * size) / rows;

        ctx.strokeStyle = "white";
        ctx.fillStyle = "black";
        ctx.lineWidth = 2;

        if (this.walls.topWall) this.drawTopWall(x, y, size, rows, cols);
        if (this.walls.bottomWall) this.drawBottomWall(x, y, size, rows, cols);
        if (this.walls.leftWall) this.drawLeftWall(x, y, size, rows, cols);
        if (this.walls.rightWall) this.drawRightWall(x, y, size, rows, cols);
        if (this.visited) {
            ctx.fillRect(x + 1, y + 1, size / cols - 2, size / rows - 2);
        }
    }
}


let newMaze = new Maze(500, 10, 10);
newMaze.setup();
newMaze.draw();