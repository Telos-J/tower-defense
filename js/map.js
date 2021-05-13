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
        this.tileSize = 80;
        this.maxCols = Math.floor(display.buffer.canvas.width / this.tileSize);
        this.maxRows = Math.floor(display.buffer.canvas.height / this.tileSize);
        this.grid = [...Array(this.maxRows)].map(e => [...Array(this.maxCols)].map(e => new Tile()));
    }

    async init() {
        for (const row in this.grid) {
            for (const col in this.grid[row]) {
                const item = this.grid[row][col]
                item.frame = assets.frameSets.tile.frames[0];
            }
        }
    }

    render() {
        const grid = _.cloneDeep(this.grid)
        this.preview()
        this.draw()
        if (!game.overwrite) this.grid = grid
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

    preview() {
        if (!game.mousePos.magnitude()) return

        const col = Math.floor(game.mousePos.x / this.tileSize);
        const row = Math.floor(game.mousePos.y / this.tileSize);

        const fill = assets.frameSets.tile.frames[0];
        const side = assets.frameSets.tile.frames[1];
        const corner = assets.frameSets.tile.frames[2];
        const smallCorner = assets.frameSets.tile.frames[3];

        // White block for middle
        this.updateTile(row, col, undefined, 0)

        if (!this.isEmpty(row + 1, col))
            this.updateTile(row + 1, col, side, 0)
        if (!this.isEmpty(row, col - 1))
            this.updateTile(row, col - 1, side, Math.PI / 2)
        if (!this.isEmpty(row - 1, col))
            this.updateTile(row - 1, col, side, Math.PI)
        if (!this.isEmpty(row, col + 1))
            this.updateTile(row, col + 1, side, 3 * Math.PI / 2)

        if (!this.isEmpty(row, col + 1) && !this.isEmpty(row - 1, col))
            this.updateTile(row - 1, col + 1, smallCorner, 0)
        if (!this.isEmpty(row, col + 1) && !this.isEmpty(row + 1, col))
            this.updateTile(row + 1, col + 1, smallCorner, Math.PI / 2)
        if (!this.isEmpty(row, col - 1) && !this.isEmpty(row + 1, col))
            this.updateTile(row + 1, col - 1, smallCorner, Math.PI)
        if (!this.isEmpty(row, col - 1) && !this.isEmpty(row - 1, col))
            this.updateTile(row - 1, col - 1, smallCorner, 3 * Math.PI / 2)
    }
}

export const map = new Map()
