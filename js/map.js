import { display } from './display.js';
import { assets } from './assets.js';
import { game } from './game.js';


class Tile {
    constructor() {
        this.rotation = 0;
    }
}

class Map {
    constructor() {
        this.tileSize = 50;
        this.maxCols = Math.floor(display.buffer.canvas.width / this.tileSize);
        this.maxRows = Math.floor(display.buffer.canvas.height / this.tileSize);
        this.grid = [...Array(this.maxRows)].map(e => [...Array(this.maxCols)].map(e => new Tile()));
        this.path = [];
    }

    async init() {
        for (const row in this.grid) {
            for (const col in this.grid[row]) {
                const item = this.grid[row][col]

                if (parseInt(row) === 0 && parseInt(col) === 0) {
                    item.frame = assets.frameSets.tile.frames[2]
                    item.rotation = 0;
                }
                else if (parseInt(row) === 0 && parseInt(col) === this.grid[row].length - 1) {
                    item.frame = assets.frameSets.tile.frames[2];
                    item.rotation = Math.PI / 2;
                }
                else if (parseInt(row) === this.grid.length - 1 && parseInt(col) === this.grid[row].length - 1) {
                    item.frame = assets.frameSets.tile.frames[2];
                    item.rotation = Math.PI;
                }
                else if (parseInt(row) === this.grid.length - 1 && parseInt(col) === 0) {
                    item.frame = assets.frameSets.tile.frames[2];
                    item.rotation = 3 * Math.PI / 2;
                }
                else if (parseInt(row) === 0) {
                    item.frame = assets.frameSets.tile.frames[1];
                    item.rotation = 0;
                }
                else if (parseInt(row) === this.grid.length - 1) {
                    item.frame = assets.frameSets.tile.frames[1]
                    item.rotation = Math.PI;
                }
                else if (parseInt(col) === 0) {
                    item.frame = assets.frameSets.tile.frames[1]
                    item.rotation = 3 * Math.PI / 2;
                }
                else if (parseInt(col) === this.grid[row].length - 1) {
                    item.frame = assets.frameSets.tile.frames[1]
                    item.rotation = Math.PI / 2;
                }
                else item.frame = assets.frameSets.tile.frames[0];

                item.row = row;
                item.col = col;
            }
        }
    }

    isStuck(leader) {
        const row = parseInt(leader?.row)
        const col = parseInt(leader?.col)

        return (
            this.leader &&
            !this.canDraw(row - 1, col) &&
            !this.canDraw(row + 1, col) &&
            !this.canDraw(row, col - 1) &&
            !this.canDraw(row, col + 1)
        )
    }

    colorLeader(color) {
        display.buffer.fillStyle = color

        if (this.leader) {
            display.buffer.fillRect(
                this.leader.col * this.tileSize,
                this.leader.row * this.tileSize,
                this.tileSize,
                this.tileSize
            )
        }
    }

    render() {
        const grid = _.cloneDeep(this.grid)
        const path = [...this.path]
        const leader = this.leader
        if (this.isStuck(leader)) {
            window.dispatchEvent(new Event('stuck'));
            game.state = 'start'
        }
        this.preview()
        this.draw()
        this.colorLeader('yellow')
        if (!game.overwrite) {
            this.grid = grid
            this.leader = leader
            this.path = path
        }
    }

    render2() {
        this.draw()
        this.colorLeader('red')
    }

    draw() {
        for (const row in this.grid)
            for (const col in this.grid[row])
                this.drawTile(parseInt(row), parseInt(col))
    }

    drawTile(row, col) {
        const tile = this.grid[row][col]

        if (tile.frame) {
            display.buffer.save();
            display.buffer.translate((col + 0.5) * this.tileSize, (row + 0.5) * this.tileSize);
            display.buffer.rotate(tile.rotation)
            display.buffer.drawImage(
                tile.frame.img,
                tile.frame.x,
                tile.frame.y,
                tile.frame.width,
                tile.frame.height,
                -this.tileSize / 2,
                -this.tileSize / 2,
                this.tileSize,
                this.tileSize
            )
            display.buffer.restore()
        } else {
            display.buffer.clearRect(
                col * this.tileSize,
                row * this.tileSize,
                this.tileSize,
                this.tileSize
            )
        }
    }

    updateTile(row, col, frame, rotation) {
        if (!this.grid[row] || !this.grid[row][col]) return
        this.grid[row][col].frame = frame;
        this.grid[row][col].rotation = rotation;
    }

    isEmpty(row, col) {
        return !this.grid[row] ||
            !this.grid[row][col] ||
            !this.grid[row][col].frame ? true : false
    }

    isLeader(row, col) {
        return row.toString() === this.leader?.row && col.toString() === this.leader?.col
    }

    canDraw(row, col) {
        if (!this.grid[row]?.[col]?.frame) return false
        else if (
            !this.leader &&
            row > 0 &&
            row < this.grid.length - 1 &&
            col > 0 &&
            col < this.grid[0].length - 1
        ) return false
        else if (
            this.leader &&
            !this.isLeader(row - 1, col) &&
            !this.isLeader(row + 1, col) &&
            !this.isLeader(row, col - 1) &&
            !this.isLeader(row, col + 1)
        ) return false
        else if (
            this.isLeader(row, col + 1) && this.grid[row + 1]?.[col - 1]?.frame?.img.src !== assets.frameSets.tile.frames[0]?.img.src ||
            this.isLeader(row, col + 1) && this.grid[row - 1]?.[col - 1]?.frame?.img.src !== assets.frameSets.tile.frames[0]?.img.src ||
            this.isLeader(row, col - 1) && this.grid[row + 1]?.[col + 1]?.frame?.img.src !== assets.frameSets.tile.frames[0]?.img.src ||
            this.isLeader(row, col - 1) && this.grid[row - 1]?.[col + 1]?.frame?.img.src !== assets.frameSets.tile.frames[0]?.img.src ||
            this.isLeader(row + 1, col) && this.grid[row - 1]?.[col + 1]?.frame?.img.src !== assets.frameSets.tile.frames[0]?.img.src ||
            this.isLeader(row + 1, col) && this.grid[row - 1]?.[col - 1]?.frame?.img.src !== assets.frameSets.tile.frames[0]?.img.src ||
            this.isLeader(row - 1, col) && this.grid[row + 1]?.[col + 1]?.frame?.img.src !== assets.frameSets.tile.frames[0]?.img.src ||
            this.isLeader(row - 1, col) && this.grid[row + 1]?.[col - 1]?.frame?.img.src !== assets.frameSets.tile.frames[0]?.img.src
        ) return false
        else {
            let count = 0
            if (!this.grid[row - 1]?.[col]?.frame || !this.grid[row - 2]?.[col]?.frame) count++
            if (!this.grid[row + 1]?.[col]?.frame || !this.grid[row + 2]?.[col]?.frame) count++
            if (!this.grid[row]?.[col - 1]?.frame || !this.grid[row]?.[col - 2]?.frame) count++
            if (!this.grid[row]?.[col + 1]?.frame || !this.grid[row]?.[col + 2]?.frame) count++

            if (count > 1) return false
            else return true
        }
    }

    preview() {
        if (!game.mousePos.magnitude()) return

        const col = Math.floor(game.mousePos.x / this.tileSize);
        const row = Math.floor(game.mousePos.y / this.tileSize);

        const fill = assets.frameSets.tile.frames[0];
        const side = assets.frameSets.tile.frames[1];
        const corner = assets.frameSets.tile.frames[2];
        const smallCorner = assets.frameSets.tile.frames[3];

        if (!this.canDraw(row, col)) return

        // White block for middle
        this.updateTile(row, col, undefined, 0)
        this.leader = this.grid[row]?.[col]
        this.path.push(this.leader)

        // sides
        if (!this.isEmpty(row + 1, col))
            this.updateTile(row + 1, col, side, 0)
        if (!this.isEmpty(row, col - 1))
            this.updateTile(row, col - 1, side, Math.PI / 2)
        if (!this.isEmpty(row - 1, col))
            this.updateTile(row - 1, col, side, Math.PI)
        if (!this.isEmpty(row, col + 1))
            this.updateTile(row, col + 1, side, 3 * Math.PI / 2)

        // small corners
        if (!this.isEmpty(row, col + 1) && !this.isEmpty(row - 1, col))
            this.updateTile(row - 1, col + 1, smallCorner, 0)
        if (!this.isEmpty(row, col + 1) && !this.isEmpty(row + 1, col))
            this.updateTile(row + 1, col + 1, smallCorner, Math.PI / 2)
        if (!this.isEmpty(row, col - 1) && !this.isEmpty(row + 1, col))
            this.updateTile(row + 1, col - 1, smallCorner, Math.PI)
        if (!this.isEmpty(row, col - 1) && !this.isEmpty(row - 1, col))
            this.updateTile(row - 1, col - 1, smallCorner, 3 * Math.PI / 2)

        // TODO: Big corners for L paving
        if (this.isEmpty(row - 1, col - 1) && this.isEmpty(row - 1, col))
            this.updateTile(row, col - 1, corner, Math.PI / 2)
        if (this.isEmpty(row + 1, col + 1) && this.isEmpty(row, col + 1))
            this.updateTile(row + 1, col, corner, Math.PI / 2)
        if (this.isEmpty(row - 1, col + 1) && this.isEmpty(row, col + 1))
            this.updateTile(row - 1, col, corner, Math.PI)
        if (this.isEmpty(row + 1, col - 1) && this.isEmpty(row + 1, col))
            this.updateTile(row, col - 1, corner, Math.PI)
        if (this.isEmpty(row - 1, col + 1) && this.isEmpty(row - 1, col))
            this.updateTile(row, col + 1, corner, 0)
        if (this.isEmpty(row + 1, col - 1) && this.isEmpty(row, col - 1))
            this.updateTile(row + 1, col, corner, 0)
        if (this.isEmpty(row - 1, col - 1) && this.isEmpty(row, col - 1))
            this.updateTile(row - 1, col, corner, 3 * Math.PI / 2)
        if (this.isEmpty(row + 1, col + 1) && this.isEmpty(row + 1, col))
            this.updateTile(row, col + 1, corner, 3 * Math.PI / 2)
    }
}

export const map = new Map()
