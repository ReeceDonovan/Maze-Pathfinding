//<Maze Gen variables>
let maze = document.querySelector(".maze");
let ctx = maze.getContext("2d");
let current;
let finalGrid;
//</Maze Gen variables>

//<Pathfinding variables>
let start;
let end;
let openSet = [];
let closedSet = [];
let generated = false;
//</Pathfinding variables>


//Helper functions
function removeFromArray(openSet, curLow) {
    for (let i = openSet.length - 1; i >= 0; i--) {
        if (openSet[i] == curLow) {
            openSet.splice(i, 1);
        }
    }
}

function heuristic(a, b) {
    let d = Math.sqrt((a.i - b.i) ** 2 + (a.j - b.j) ** 2);
    return d;
}




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

        let next = current.checkVisitNeighbours();
        current.neighbours = current.checkAllNeighbours();
        if (next) {
            next.visited = true;

            this.stack.push(current);

            current.highlight(this.cols);

            current.removeWalls(current, next);

            current = next;
        } else if (this.stack.length > 0) {
            let cell = this.stack.pop();
            current = cell;
            current.highlight(this.cols);
        }

        if (this.stack.length == 0) {
            finalGrid = current.parentGrid;
            start = current;
            end = finalGrid[this.cols - 1][this.rows - 1];
            openSet.push(start);


            for (let i = 0; i < openSet.length; i++) {
                let x = openSet[i].colNum * this.size / this.cols + 1;
                let y = openSet[i].rowNum * this.size / this.cols + 1;

                ctx.fillStyle = "green";
                ctx.fillRect(x, y, this.size / this.cols - 3, this.size / this.cols - 3);
            }
            for (let i = 0; i < closedSet.length; i++) {
                let x = closedSet[i].colNum * this.size / this.cols + 1;
                let y = closedSet[i].rowNum * this.size / this.cols + 1;

                ctx.fillStyle = "red";
                ctx.fillRect(x, y, this.size / this.cols - 3, this.size / this.cols - 3);

            }
            if (openSet.length > 0) {

                let lowestIndex = 0;
                for (let i = 0; i < openSet.length; i++) {
                    if (openSet[i].f < openSet[lowestIndex].f) {
                        lowestIndex = i;
                    }
                }

                let curLow = openSet[lowestIndex];

                if (openSet[lowestIndex] === end) {
                    console.log("Finished");
                    generated = false;
                }

                removeFromArray(openSet, curLow);
                closedSet.push(curLow);

                let neighbours = curLow.neighbours;
                for (let i = 0; i < neighbours.length; i++) {
                    let neighbour = neighbours[i];
                    neighbour.g = curLow.g + 1;

                    if (!closedSet.includes(neighbour)) {
                        let tempG = curLow.g + 1;

                        if (openSet.includes(neighbour)) {
                            if (tempG < neighbour.g) {
                                neighbour.g = tempG;
                            }
                        } else {
                            neighbour.g = tempG;
                            openSet.push(neighbour);
                        }

                        neighbour.h = heuristic(neighbour, end);
                        neighbour.f = neighbour.g + neighbour.h;
                    }
                }
            } else {
                //No solution
            }
        }
        window.requestAnimationFrame(() => {
            this.draw();
        })
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
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.neighbours = [];
    }

    checkAllNeighbours() {
        let grid = this.parentGrid;
        let row = this.rowNum;
        let col = this.colNum;
        let neighbours = [];

        let top = row !== 0 ? grid[row - 1][col] : undefined;
        let bottom = row !== grid.length - 1 ? grid[row + 1][col] : undefined;
        let left = col !== 0 ? grid[row][col - 1] : undefined;
        let right = col !== grid.length - 1 ? grid[row][col + 1] : undefined;

        if (top) neighbours.push(top);
        if (bottom) neighbours.push(bottom);
        if (left) neighbours.push(left);
        if (right) neighbours.push(right);


        return neighbours

    }

    checkVisitNeighbours() {
        let grid = this.parentGrid;
        let row = this.rowNum;
        let col = this.colNum;
        let neighbours = [];

        let top = row !== 0 ? grid[row - 1][col] : undefined;
        let bottom = row !== grid.length - 1 ? grid[row + 1][col] : undefined;
        let left = col !== 0 ? grid[row][col - 1] : undefined;
        let right = col !== grid.length - 1 ? grid[row][col + 1] : undefined;

        if (top && !top.visited) neighbours.push(top);
        if (bottom && !bottom.visited) neighbours.push(bottom);
        if (left && !left.visited) neighbours.push(left);
        if (right && !right.visited) neighbours.push(right);


        if (neighbours.length !== 0) {
            let random = Math.floor(Math.random() * neighbours.length);
            return neighbours[random];
        } else {
            return undefined;
        }


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

    highlight(cols) {
        let x = this.colNum * this.parentSize / cols + 1;
        let y = this.rowNum * this.parentSize / cols + 1;

        ctx.fillStyle = "purple";
        ctx.fillRect(x, y, this.parentSize / cols - 3, this.parentSize / cols - 3);
    }

    pathStartHighlight(cols) {
        let x = this.colNum * this.parentSize / cols + 1;
        let y = this.rowNum * this.parentSize / cols + 1;

        ctx.fillStyle = "blue";
        ctx.fillRect(x, y, this.parentSize / cols - 3, this.parentSize / cols - 3);
    }



    removeWalls(cell1, cell2) {
        let x = (cell1.colNum - cell2.colNum);

        if (x == 1) {
            cell1.walls.leftWall = false;
            cell2.walls.rightWall = false;
        } else if (x == -1) {
            cell1.walls.rightWall = false;
            cell2.walls.leftWall = false;
        }

        let y = cell1.rowNum - cell2.rowNum;

        if (y == 1) {
            cell1.walls.topWall = false;
            cell2.walls.bottomWall = false;
        } else if (y == -1) {
            cell1.walls.bottomWall = false;
            cell2.walls.topWall = false;
        }

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



let newMaze = new Maze(800, 15, 15);
newMaze.setup();
newMaze.draw();