import { display } from './display.js';
import { assets } from './assets.js';

class Game {
    constructor(display, assets) {
        this.display = display;
        this.assets = assets;
        this._gameObjects = [];
        this._viruses = [];
        this._reptiles = [];
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
        this.start()
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

    update() {
        for (const virus of this.viruses) {
            virus.animate();
        }
    }

    render() {
        this.drawBackground()
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