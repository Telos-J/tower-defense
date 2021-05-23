import { Vector2 } from './vector.js';


class Display {
    constructor() {
        this.canvas = document.querySelector("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.buffer = document.createElement("canvas").getContext("2d");
        this.buffer.canvas.width = 1600;
        this.buffer.canvas.height = 880;
    }

    async init() {
        this.resize();
        window.addEventListener("resize", () => this.resize());
        console.log('Display initialized');
    }

    resize() {
        const scale = window.devicePixelRatio;
        this.canvas.width = this.canvas.clientWidth * scale;
        this.canvas.height = this.canvas.clientHeight * scale;
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


// export function convertToWindowCoord(vector) {
//     return new Vector2(
//         (vector.x / buffer.canvas.width) *
//         (canvas.width / window.devicePixelRatio) +
//         canvas.offsetLeft,
//         (vector.y / buffer.canvas.height) *
//         (canvas.height / window.devicePixelRatio) +
//         canvas.offsetTop
//     );
// };
