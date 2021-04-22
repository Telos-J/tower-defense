import { Vector2 } from './vector.js';

class Display {
    constructor() {
        this.canvas = document.querySelector("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.buffer = document.createElement("canvas").getContext("2d");
    }

    init() {
        return new Promise(resolve => {
            this.buffer.canvas.width = 1600;
            this.buffer.canvas.height = 880;
            this.resize()
            window.addEventListener("resize", () => this.resize());
            resolve('Display initialized')
            console.log('Display initialized')
        })
    }

    resize() {
        let width = window.innerWidth * 0.8;
        let height = window.innerHeight * 0.8;
        const width_height_ratio = 8.8 / 16;

        if (height / width > width_height_ratio)
            height = width * width_height_ratio;
        else width = height / width_height_ratio;

        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';

        const scale = window.devicePixelRatio;
        this.canvas.width = width * scale;
        this.canvas.height = height * scale;
    }

    convertToBufferCoord(vector) {
        const rect = this.canvas.getBoundingClientRect();
        return new Vector2(
            ((vector.x - rect.x) /
                (this.canvas.width / window.devicePixelRatio)) *
            this.buffer.canvas.width,
            ((vector.y - rect.y) /
                (this.canvas.height / window.devicePixelRatio)) *
            this.buffer.canvas.height)
    }
}

export const display = new Display()


export function convertToWindowCoord(vector) {
    return new Vector2(
        (vector.x / buffer.canvas.width) *
        (canvas.width / window.devicePixelRatio) +
        canvas.offsetLeft,
        (vector.y / buffer.canvas.height) *
        (canvas.height / window.devicePixelRatio) +
        canvas.offsetTop
    );
};
