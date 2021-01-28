import { gameObjects } from './app.js'

function clone(selector) {
    const object = document.querySelector(selector)
    const doc = object.getSVGDocument();
    const original = doc.querySelector('svg');
    const clone = original.cloneNode(true);
    object.remove()

    return clone
}

class Reptile {
    constructor() {
        this.set = false;
    }

    static setup() {
        Reptile.base = clone('.scp682-base')
        Reptile.base.classList.add('scp-682')
        Reptile.attack = clone('.scp682-attack')
    }

    create() {
        this.DOM = Reptile.base.cloneNode(true);
        this.paths = Array.from(this.DOM.querySelectorAll('path'));
        document.body.appendChild(this.DOM);
    }
    
    animate() {
        const reptileBox = this.DOM.getBoundingClientRect()
        const base = Reptile.base.querySelectorAll('path')
        const attack = Reptile.attack.querySelectorAll('path')
        const attackTimeline = gsap.timeline({ 
            repeat: -1,
            onRepeat: function() {
                for (let virus of gameObjects.viruses) {
                    const virusBox = virus.virusDOM.getBoundingClientRect()
                    const dist = Math.hypot(virusBox.top - reptileBox.top, virusBox.left - reptileBox.left)
                    if (dist < 30) virus.kill()
                }
            }
        })

        this.paths.map((item, i) => {
            attackTimeline
            .fromTo(item, 
                {
                    morphSVG: {
                        shape: attack[i],
                    }
                },
                {
                    duration: 0.5,
                    morphSVG: {
                        shape: base[i],
                    }
                }, 0)
            .to(item,
                {
                    morphSVG: {
                        shape: attack[i],
                    }
                }, 0.5);
        });
    }
    
    startMove(e) {
        this.move(e)
        window.addEventListener('mousemove', (e) => {
            if (!this.set) this.move(e);
        })
        this.DOM.addEventListener('click', () => { 
            this.set = true ;
            this.animate();
        })
    }
    
    move(e) {
        gsap.set(this.DOM, {
            x: e.clientX - this.DOM.getBoundingClientRect().width / 2,
            y: e.clientY - this.DOM.getBoundingClientRect().height / 2
        })
    }
}

export { Reptile }