class Display {
    constructor() {
        this.canvas = document.querySelector("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.buffer = document.createElement("canvas").getContext("2d");
    }

    init() {
        return new Promise(resolve => {
            this.buffer.canvas.width = 1600;
            this.buffer.canvas.height = 900;
            this.resize()
            window.addEventListener("resize", () => this.resize());
            resolve('Display initialized')
            console.log('Display initialized')
        })
    }

    resize() {
        let width = window.innerWidth * 0.8;
        let height = window.innerHeight * 0.8;
        const width_height_ratio = 9 / 16;

        if (height / width > width_height_ratio)
            height = width * width_height_ratio;
        else width = height / width_height_ratio;

        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';

        const scale = window.devicePixelRatio;
        this.canvas.width = width * scale;
        this.canvas.height = height * scale;
    }
}

export const display = new Display()

function convertToBufferCoord (vector) {
    return new Vector2(
        ((vector.x - canvas.offsetLeft) /
            (canvas.width / window.devicePixelRatio)) *
            buffer.canvas.width,
        ((vector.y - canvas.offsetTop) /
            (canvas.height / window.devicePixelRatio)) *
            buffer.canvas.height
    );
};

function convertToWindowCoord (vector) {
    return new Vector2(
        (vector.x / buffer.canvas.width) *
            (canvas.width / window.devicePixelRatio) +
            canvas.offsetLeft,
        (vector.y / buffer.canvas.height) *
            (canvas.height / window.devicePixelRatio) +
            canvas.offsetTop
    );
};