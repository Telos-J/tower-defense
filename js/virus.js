class Virus {
    constructor(frameSet) {
        this.frameIndex = 0;
        this.frameSet = frameSet;
        this.frameHold = 2;
        this.frameHoldIndex = this.frameHold;
        this.size = 80;
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
            0, 
            0, 
            this.size, 
            this.size
        )
    }

    move() {
    }
    
    kill() {
    }
}

export { Virus }