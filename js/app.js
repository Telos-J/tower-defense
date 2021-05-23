import { game } from './game.js';
import { Virus } from './virus.js';
import { Reptile } from './reptile.js';
import { assets } from './assets.js'
import { map } from './map.js'
import { Vector2 } from './vector.js';

document.querySelector('.egg').addEventListener('click', (e) => {
    const reptile = new Reptile()
    game.pushRepile(reptile)
})

function dispatchVirus() {
    const x = map.path[0].col * map.tileSize
    const y = map.path[0].row * map.tileSize

    const virus = new Virus(assets.frameSets.virusRedIdle, new Vector2(x, y))
    game.pushVirus(virus)
}

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && game.state === 'build' && map.path.length > 1) {
        window.dispatchEvent(new Event('stuck'));
        game.state = 'start'
    }
})

window.addEventListener('stuck', () => {
    dispatchVirus()
    window.setInterval(() => {
        if (document.hasFocus()) dispatchVirus()
    }, 1000)
})


game.init()
