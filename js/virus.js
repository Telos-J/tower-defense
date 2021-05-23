import { map } from './map.js';

class Virus {
    constructor(frameSet, position) {
        this.frameIndex = 0;
        this.frameSet = frameSet;
        this.frameHold = 2;
        this.frameHoldIndex = this.frameHold;
        this.size = map.tileSize;
        this.position = position;
        this.pathIndex = 0;
        this.speed = 2;
        this.state = 'alive'
    }

    animate() {
        this.frameHoldIndex--;
        if (this.frameHoldIndex <= 0) {
            this.frameIndex++;
            this.frameHoldIndex = this.frameHold;
        }
        if (this.frameIndex > this.frameSet.frames.length - 1) this.frameIndex = 0;
    }

    draw(context) {
        const frame = this.frameSet.frames[this.frameIndex];
        context.drawImage(
            frame.img,
            frame.x,
            frame.y,
            frame.width,
            frame.height,
            this.position.x,
            this.position.y,
            this.size,
            this.size
        )
    }

    move() {
        const tile = map.path[this.pathIndex + 1]
        if (!tile) return this.state = 'end'

        if (this.position.x < tile.col * map.tileSize) this.position.x += this.speed
        else if (this.position.x > tile.col * map.tileSize) this.position.x -= this.speed
        else if (this.position.y < tile.row * map.tileSize) this.position.y += this.speed
        else if (this.position.y > tile.row * map.tileSize) this.position.y -= this.speed
        else this.pathIndex++
    }
}

export { Virus }
