import { game } from './game.js';
import { Virus } from './virus.js';
import { Reptile } from './reptile.js';
import { assets } from './assets.js'

document.querySelector('.egg').addEventListener('click', (e) => {
    const reptile = new Reptile()
    game.pushRepile(reptile)
})

window.setTimeout(() => {
    const virus = new Virus(assets.frameSets.virusRedIdle)
    game.pushVirus(virus)
}, 1000);


game.init()
