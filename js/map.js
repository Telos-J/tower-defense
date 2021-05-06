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

    draw() {
        for (const row in this.grid) {
            for (const col in this.grid[row]) {
                const tile = this.grid[row][col]
                this.drawTile(tile, parseInt(row), parseInt(col))
            }
        }
    }

    drawTile(tile, row, col) {
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
    }

    previewMouse() {
        if (!game.mousePos.magnitude()) return

        const col = Math.floor(game.mousePos.x / this.tileSize);
        const row = Math.floor(game.mousePos.y / this.tileSize);

        display.buffer.clearRect(
            col * this.tileSize,
            row * this.tileSize,
            this.tileSize,
            this.tileSize
        )

        this.grid[0][0].frame = assets.frameSets.tile.frames[1];
        this.grid[0][1].frame = assets.frameSets.tile.frames[1];
        this.grid[0][2].frame = assets.frameSets.tile.frames[1];
        this.grid[0][3].frame = assets.frameSets.tile.frames[1];
        this.grid[0][0].rotation = 0;
        this.grid[0][1].rotation = Math.PI / 2;
        this.grid[0][2].rotation = Math.PI;
        this.grid[0][3].rotation = 3 * Math.PI / 2;
        this.drawTile(this.grid[0][0], row + 1, col);
        this.drawTile(this.grid[0][1], row, col - 1);
        this.drawTile(this.grid[0][2], row - 1, col);
        this.drawTile(this.grid[0][3], row, col + 1);
    }
}

export const map = new Map()
