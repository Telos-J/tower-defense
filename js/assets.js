class Assets {
    constructor() {
        this.frameSets = {};
    }

    addFrameSets(...frameSets) {
        for (let frameSet of frameSets) {
            this.frameSets[frameSet[0]] = frameSet[1];
        }
    }

    loadFrameSets() {
        const frameSets = [];
        for (let frameSet in this.frameSets) {
            frameSets.push(this.frameSets[frameSet].loadFrameSet());
        }

        return Promise.all(frameSets)
    }

    loadAssets() {
        const assets = [];
        assets.push(this.loadFrameSets());

        return Promise.all(assets)
    }
}

export const assets = new Assets();

class Frame {
    constructor(img, x, y, width, height) {
        this.img = img;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

class FrameSet {
    constructor(prefix, numFrames) {
        this.frames = [];
        this.numFrames = numFrames;
        this.prefix = prefix;
    }

    loadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.addEventListener('load', () => resolve(img));
            img.addEventListener('error', (err) => reject(err));
            img.src = url;
        });
    }

    loadFrameSet() {
        const imgs = [];
        const self = this;
        for (let i = 0; i < this.numFrames; i++) {
            const url = this.prefix + (i < 10 ? "0" : "") + i + '.png';
            imgs.push(this.loadImage(url))
        }

        const frameSet = Promise.all(imgs)
        frameSet.then(imgs => {
            for (let img of imgs) {
                const frame = new Frame(img, 0, 0, img.width, img.height)
                self.frames.push(frame)
            }
            console.log("Frameset loaded")
        })

        return frameSet
    }
}

assets.addFrameSets(
    ["virusBlueIdle", new FrameSet('img/virus/blue/virus', 24)],
    ["virusRedIdle", new FrameSet('img/virus/red/virus', 24)],
    ["tile", new FrameSet('img/tileset/tile', 4)],
)
