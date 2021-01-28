import { colorSets, pathSets, Virus } from './virus.js';
import { Reptile } from './reptile.js';

gsap.registerPlugin(MotionPathPlugin, MorphSVGPlugin);

const gameObjects = {
    viruses: [],
    reptiles: []
}

window.addEventListener('load', Reptile.setup)

document.querySelector('.egg').addEventListener('click', (e) => {
    const reptile = new Reptile()
    reptile.create()
    reptile.startMove(e)
})

window.setInterval(() => {
    const keys = Object.keys(colorSets);
    const colorSet = colorSets[keys[keys.length * Math.random() << 0]];
    const virus = new Virus(colorSet, pathSets.default)
    virus.create()
    virus.move()
    virus.animate(pathSets.wiggle)
    gameObjects.viruses.push(virus)
}, 5000);

export { gameObjects }