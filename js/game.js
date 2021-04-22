import { display } from './display.js';
import { assets } from './assets.js';
import { Vector2 } from './vector.js';

class Game {
    constructor(display, assets) {
        this.display = display;
        this.assets = assets;
        this._gameObjects = [];
        this._viruses = [];
        this._reptiles = [];
        this.mousePos = new Vector2();
        this.tileSize = 80;
    }

    get viruses() {
        return this._viruses
    }

    get reptiles() {
        return this._reptiles
    }

    pushVirus(virus) {
        this._viruses.push(virus)
        this._gameObjects.push(virus)
    }

    pushReptile(reptile) {
        this._reptiles.push(reptile);
        this._gameObjects.push(reptile);
    }

    async init() {
        await this.assets.loadAssets();
        await this.display.init();

        this.addMouseMove()
        this.start()
    }

    addMouseMove() {
        this.display.canvas.addEventListener('mousemove', (event) => {
            this.mousePos = this.display.convertToBufferCoord(
                new Vector2(event.clientX, event.clientY)
            )
        })
    }

    drawBackground() {
        this.display.buffer.fillStyle = 'white';
        this.display.buffer.fillRect(
            0,
            0,
            this.display.buffer.canvas.width,
            this.display.buffer.canvas.height
        );
    }

    drawGrid() {
        this.display.buffer.strokeStyle = 'black';
        const cols = this.display.canvas.width / this.tileSize;
        const rows = this.display.canvas.height / this.tileSize;
        for (let i = 0; i < cols; i++) {
            this.display.buffer.beginPath();
            this.display.buffer.moveTo(i * this.tileSize, 0);
            this.display.buffer.lineTo(i * this.tileSize, this.display.buffer.canvas.height);
            this.display.buffer.stroke();
        }
        for (let i = 0; i < rows; i++) {
            this.display.buffer.beginPath();
            this.display.buffer.moveTo(0, i * this.tileSize);
            this.display.buffer.lineTo(this.display.canvas.width, i * this.tileSize);
            this.display.buffer.stroke();
        }

        if (this.mousePos.magnitude()) {
            const row = Math.floor(this.mousePos.x / this.tileSize);
            const col = Math.floor(this.mousePos.y / this.tileSize);
            this.display.buffer.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.display.buffer.fillRect(row * this.tileSize, col * this.tileSize, this.tileSize, this.tileSize)
        }
    }

    update() {
        for (const virus of this.viruses) {
            virus.animate();
        }
    }

    render() {
        this.drawBackground()
        this.drawGrid()
        for (const virus of this.viruses) {
            virus.draw(this.display.buffer);
        }
        this.display.ctx.drawImage(
            this.display.buffer.canvas,
            0,
            0,
            this.display.buffer.canvas.width,
            this.display.buffer.canvas.height,
            0,
            0,
            this.display.canvas.width,
            this.display.canvas.height
        )
    }

    start() {
        this.update()
        this.render()
        requestAnimationFrame(() => this.start())
    }
}

export const game = new Game(display, assets)
