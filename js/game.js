import { Vector2 } from './vector.js';
import { display } from './display.js';
import { assets } from './assets.js';
import { map } from './map.js';

class Game {
    constructor() {
        this._gameObjects = [];
        this._viruses = [];
        this._reptiles = [];
        this.mousePos = new Vector2();
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
        await assets.loadAssets();
        await display.init();
        await map.init()

        this.addMouseMove()
        this.start()
    }

    addMouseMove() {
        display.canvas.addEventListener('mousemove', (event) => {
            this.mousePos = display.convertToBufferCoord(
                new Vector2(event.clientX, event.clientY)
            )
        })
    }

    clear() {
        display.buffer.clearRect(0, 0, display.buffer.canvas.width, display.buffer.canvas.height);
        display.ctx.clearRect(0, 0, display.canvas.width, display.canvas.height);
    }

    drawGrid() {
        display.buffer.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        const cols = display.buffer.canvas.width / map.tileSize;
        const rows = display.buffer.canvas.height / map.tileSize;
        for (let i = 0; i <= cols; i++) {
            display.buffer.beginPath();
            display.buffer.moveTo(i * map.tileSize, 0);
            display.buffer.lineTo(i * map.tileSize, display.buffer.canvas.height);
            display.buffer.stroke();
        }
        for (let i = 0; i <= rows; i++) {
            display.buffer.beginPath();
            display.buffer.moveTo(0, i * map.tileSize);
            display.buffer.lineTo(display.buffer.canvas.width, i * map.tileSize);
            display.buffer.stroke();
        }
    }


    update() {
        for (const virus of this.viruses) {
            virus.animate();
        }
    }

    render() {
        this.clear()
        map.draw()
        map.previewMouse()
        // this.drawGrid()
        for (const virus of this.viruses) {
            virus.draw(display.buffer);
        }
        display.ctx.drawImage(
            display.buffer.canvas,
            0,
            0,
            display.buffer.canvas.width,
            display.buffer.canvas.height,
            0,
            0,
            display.canvas.width,
            display.canvas.height
        )
    }

    start() {
        this.update()
        this.render()
        requestAnimationFrame(() => this.start())
    }
}

export const game = new Game(display, assets)
