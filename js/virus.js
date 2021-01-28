import { gameObjects } from './app.js'

class ColorSet {
    constructor(tentacles_back, tentacles_mid, body, tentacles_front, speck_big, speck_small, speck_mid) {
        this.tentacles_back = tentacles_back;
        this.tentacles_mid = tentacles_mid;
        this.body = body;
        this.tentacles_front = tentacles_front;
        this.speck_big = speck_big;
        this.speck_small = speck_small;
        this.speck_mid = speck_mid;
    }
}

class PathSet {
    constructor(tentacles_back, tentacles_mid, body, tentacles_front, speck_big, speck_small, speck_mid) {
        this.tentacles_back = tentacles_back;
        this.tentacles_mid = tentacles_mid;
        this.body = body;
        this.tentacles_front = tentacles_front;
        this.speck_big = speck_big;
        this.speck_small = speck_small;
        this.speck_mid = speck_mid;
        this.paths = [tentacles_back, tentacles_mid, body, tentacles_front, speck_big, speck_small, speck_mid];
    }
}

class Virus {
    constructor(colorSet, pathSet) {
        this.colorSet = colorSet;
        this.defaultPathSet = pathSet;
    }

    create() {
        const virus = document.createElementNS("http://www.w3.org/2000/svg", "svg")
        const tentacles_back = document.createElementNS("http://www.w3.org/2000/svg", "path")
        const tentacles_mid = document.createElementNS("http://www.w3.org/2000/svg", "path")
        const body = document.createElementNS("http://www.w3.org/2000/svg", "path")
        const tentacles_front = document.createElementNS("http://www.w3.org/2000/svg", "path")
        const speck_big = document.createElementNS("http://www.w3.org/2000/svg", "path")
        const speck_small = document.createElementNS("http://www.w3.org/2000/svg", "path")
        const speck_mid = document.createElementNS("http://www.w3.org/2000/svg", "path")

        virus.setAttribute("class", "virus");
        virus.setAttribute("viewBox", "0 0 121 129");
        virus.style.display = "block";
        tentacles_back.setAttribute("d", this.defaultPathSet.tentacles_back);
        tentacles_mid.setAttribute("d", this.defaultPathSet.tentacles_mid);
        body.setAttribute("d", this.defaultPathSet.body);
        tentacles_front.setAttribute("d", this.defaultPathSet.tentacles_front);
        speck_big.setAttribute("d", this.defaultPathSet.speck_big);
        speck_small.setAttribute("d", this.defaultPathSet.speck_small);
        speck_mid.setAttribute("d", this.defaultPathSet.speck_mid);

        tentacles_back.setAttribute("fill", this.colorSet.tentacles_back);
        tentacles_mid.setAttribute("fill", this.colorSet.tentacles_mid);
        body.setAttribute("fill", this.colorSet.body);
        tentacles_front.setAttribute("fill", this.colorSet.tentacles_front);
        speck_big.setAttribute("fill", this.colorSet.speck_big);
        speck_small.setAttribute("fill", this.colorSet.speck_small);
        speck_mid.setAttribute("fill", this.colorSet.speck_mid);
        
        this.virusDOM = virus;
        this.paths = [tentacles_back, tentacles_mid, body, tentacles_front, speck_big, speck_small, speck_mid];

        document.body.appendChild(virus);
        
        for (let path of this.paths) virus.appendChild(path)
    }
    
    move() {
        const self = this;
        this.motionPathTimeline = gsap.timeline();
        this.motionPathTimeline.to(this.virusDOM, {
            duration: 100,
            ease: 'linear',
            motionPath: {
                path: '#josh-path path',
                align: '#josh-path path',
                alignOrigin: [0.5, 0.5],
            },
            onComplete: function() {
                self.kill()
            }
        });
    }
    
    animate(pathSet) {
        this.paths.map((path, i) => {
            gsap.to(path, {
                repeat: -1,
                yoyo: true,
                morphSVG: pathSet.paths[i],
            });
        });
    }
    
    kill() {
        for (let path of this.paths) gsap.killTweensOf(path)
        gsap.killTweensOf(this.virusDOM)
        this.virusDOM.remove()
        gameObjects.viruses = gameObjects.viruses.filter((virus) => virus !== this)
    }
}

const blueColorSet = new ColorSet("#46B9C9", "#2E6F7D", "#236EA4", "#4A9FC3", "#A5D6E1", "#F1F8E9", "#A5D6E1");
const greenColorSet = new ColorSet("#0BB112", "#2E7D32", "#4CAF50", "#8BC34A", "#C5E1A5", "#F1F8E9", "#DCEDC8");
const redColorSet = new ColorSet("#87303F", "#E02754", "#E02754", "#D8435E", "#A92D34", "#F1F8E9", "#A92D34");
const yellowColorSet = new ColorSet("#FFC100", "#FFEBAC", "#FFCE34", "#F8F043", "#FFD656", "#F1F8E9", "#FFD656");
const orangeColorSet = new ColorSet("#DC6400", "#FF8A00", "#FF5C00", "#FF4D00", "#FF9900", "#F1F8E9", "#FFA800");


const defaultPathSet = new PathSet(
    "M100.573 52.5547C98.0856 52.5547 96.1603 53.6622 95.331 55.8549C92.8573 59.4389 85.3301 55.9108 82.0244 54.2525C81.4764 52.8751 46.7641 43.5146 46.7641 43.7955C42.3621 46.2695 39.6074 36.6773 39.8775 33.0934V32.826C40.1554 31.997 40.1554 31.1677 40.1554 30.3387C40.1554 25.9394 36.5745 22.3555 31.8915 22.3555C27.4782 22.3555 23.6272 25.9367 23.6272 30.3387C23.6272 33.9224 26.1009 36.6773 28.8558 38.0546C33.5498 39.9827 38.4971 47.3686 37.9491 51.2305C39.8775 54.5334 35.4754 71.6099 35.7452 72.9872C33.2688 75.4748 28.3079 77.8569 26.3823 77.0388C25.556 75.9285 23.9086 75.3805 22.2503 75.3805C17.8373 75.3805 13.9863 78.9614 13.9863 83.3635C13.9863 87.7767 17.5673 91.3604 22.2503 91.3604C25.0049 91.3604 27.2088 90.2504 28.8562 88.0547C31.3435 84.4737 35.4754 78.2268 39.0591 78.2268C39.6074 79.0448 83.95 61.6986 83.95 61.4203C84.231 59.762 93.1244 62.4717 98.9149 63.8491H100.573C103.876 63.8491 106.631 61.0944 106.631 57.7942C106.631 54.4776 103.876 52.552 100.571 52.552L100.573 52.5547Z",
    "M83.4015 88.5542C80.0958 88.5542 78.4405 80.9839 78.4405 79.8739C78.7212 79.3256 75.9666 46.5502 75.9666 46.5502C76.2476 45.4399 81.4734 40.5637 83.4015 40.5637H83.9498C88.3628 40.5637 92.2141 36.9824 92.2141 32.5804C92.2141 28.1674 88.6329 24.5835 83.9498 24.5835C79.5505 24.5835 75.6856 28.1674 75.6856 32.5804C75.6856 33.407 75.6856 34.2251 75.9666 35.0543C75.9666 35.0543 72.931 42.6852 69.3582 42.1369C69.3582 42.1369 38.2299 52.8748 36.8525 53.1558C32.9876 60.0427 25.5065 57.2905 22.4709 55.0812C21.6443 53.9848 19.9969 53.1558 18.0716 53.1558C14.7325 53.1796 12.0301 55.8771 12 59.2161C12.281 62.2491 15.0356 65.0037 18.3413 65.0037C19.4516 65.0037 20.8289 64.7227 21.647 64.1774C26.6056 61.698 33.2713 62.5164 34.3704 66.9293V67.2103C34.6459 68.0257 40.9818 80.7029 41.8111 81.7992C45.943 89.5152 39.5987 94.5449 39.5987 94.5449C36.8441 94.5449 34.3704 97.0186 34.3704 100.054C34.3704 103.357 37.125 106.112 40.4307 106.112C43.7307 106.112 46.4856 103.357 46.4856 100.051C47.3146 93.7156 46.7585 87.5898 52.8298 87.3088C53.6454 87.5898 68.5289 86.4935 69.6253 86.2125C74.0385 87.0388 74.8563 90.4935 74.8563 96.5484C74.8563 100.95 78.4375 104.537 83.1205 104.537C87.5308 104.537 91.3845 100.95 91.3845 96.5484C91.6628 92.1409 88.0788 88.5542 83.3988 88.5542H83.4015Z",
    "M84.2304 64.1748C84.2304 77.863 73.1262 88.9672 59.4379 88.9672C45.7497 88.9672 34.6455 77.863 34.6455 64.1748C34.6455 50.4865 45.7497 39.3823 59.4379 39.3823C73.1262 39.3823 84.2304 50.4865 84.2304 64.1748Z",
    "M65.7739 87.59C66.6059 85.9317 63.57 85.3861 61.0963 85.3861C58.6087 85.3861 56.135 86.7634 56.6833 88.4163C63.289 98.3279 60 98.745 56.9643 100.684C54.4904 101.781 52.8321 104.816 52.8321 107.571C52.8321 111.97 56.4133 115.554 61.0963 115.554C65.7793 115.554 69.3605 111.973 69.3605 107.571C69.6415 99.855 63.0192 90.0636 65.7739 87.59ZM99.4716 75.4611C97.8269 75.4611 96.1686 75.7421 95.0723 76.5711C90.111 78.4967 86.7041 71.6098 83.4011 69.4032C81.7568 68.3069 79.8202 71.0618 79.2691 71.8908C78.7208 72.7174 77.8918 76.5711 81.1975 76.5711C86.7068 74.6427 92.5877 87.5872 92.5877 87.5872C93.695 90.3419 96.7197 91.9893 100.034 91.9893C104.433 91.9893 108.298 88.4193 108.298 84.006C107.468 79.0475 103.885 75.4611 99.4716 75.4611ZM49.2476 24.6772C54.4899 35.4151 57.2314 39.1015 54.2097 40.209C51.7221 42.1371 55.854 44.611 58.8897 44.0655C61.9117 43.5144 64.6663 42.1371 62.741 39.3825C58.0607 31.1182 61.0958 26.0545 61.0958 26.0545C63.0242 24.9582 64.4015 22.4733 64.4015 19.9942C64.4015 15.5867 60.8285 12 56.1373 12C51.4543 12 47.873 15.5839 47.873 19.9969C47.873 21.0933 48.1513 22.4706 48.6996 23.5781C48.6996 24.3962 48.6996 24.3962 49.2506 24.6772H49.2476Z",
    "M55.025 64.175C50.6257 64.175 46.7607 60.5938 46.7607 56.1917C46.7607 51.7788 50.3447 48.1948 55.025 48.1948C59.7189 48.1948 63.2889 51.7788 63.2889 56.1917C63.2889 60.591 59.7189 64.175 55.025 64.175Z",
    "M50.8927 76.2901C48.4191 76.2901 46.7607 74.6455 46.7607 72.1581C46.7607 69.6842 48.4191 68.0259 50.8927 68.0259C53.3803 68.0259 55.025 69.6842 55.025 72.1581C55.025 74.6455 53.3803 76.2901 50.8927 76.2901Z",
    "M65.4988 80.7026C62.1931 80.7026 59.4385 77.948 59.4385 74.6423C59.4385 71.3421 62.1931 68.5874 65.4988 68.5874C68.7991 68.5874 71.5537 71.3421 71.5537 74.645C71.5537 77.948 68.7991 80.7026 65.4961 80.7026H65.4988Z"
)
const wigglePathSet = new PathSet(
    "M97.7126 47.6431C95.225 47.6431 93.2997 48.7507 92.4704 50.9433C89.9967 54.5273 84.7572 55.3563 81.4515 53.698C80.9035 52.3207 46.1912 42.9601 46.1912 43.2411C41.7892 45.715 37.6572 37.9991 37.9273 34.4151V34.1478C38.2052 33.3188 38.2052 32.4895 38.2052 31.6605C38.2052 27.2612 34.6243 23.6772 29.9413 23.6772C25.528 23.6772 21.677 27.2585 21.677 31.6605C21.677 35.2442 24.1507 37.9991 26.9056 39.3764C31.5996 41.3045 37.9243 46.8141 37.3762 50.676C39.3046 53.979 34.9026 71.0555 35.1723 72.4328C32.6959 74.9204 27.7347 74.3612 25.809 73.5431C24.9827 72.4328 23.3354 71.8848 21.677 71.8848C17.2641 71.8848 13.4131 75.4657 13.4131 79.8677C13.4131 84.281 16.994 87.8647 21.677 87.8647C24.4317 87.8647 26.6356 86.7547 28.283 84.559C30.7703 80.978 34.9026 77.6723 38.4862 77.6723C39.0345 78.4904 83.3771 61.1441 83.3771 60.8659C83.6581 59.2076 90.2638 57.5602 96.0543 58.9375H97.7126C101.016 58.9375 103.77 56.1829 103.77 52.8826C103.77 49.566 101.016 47.6404 97.7099 47.6404L97.7126 47.6431Z",
    "M79.5263 88.1316C76.2206 88.1316 77.868 80.4293 77.868 79.3193C78.1487 78.771 75.394 45.9956 75.394 45.9956C75.675 44.8853 76.2206 43.508 78.1487 43.508H78.697C83.11 43.508 86.9612 39.9268 86.9612 35.5247C86.9612 31.1118 83.38 27.5278 78.697 27.5278C74.2977 27.5278 70.4328 31.1118 70.4328 35.5247C70.4328 36.3513 70.4328 37.1694 70.7138 37.9987C70.7138 37.9987 72.3584 42.1307 68.7857 41.5824C68.7857 41.5824 37.6574 52.3203 36.28 52.6012C32.4151 59.4882 22.5065 55.9069 19.4709 53.6976C18.6443 52.6012 16.9969 51.7722 15.0716 51.7722C11.7325 51.796 9.03007 54.4935 9 57.8326C9.28099 60.8655 12.0356 63.6201 15.3413 63.6201C16.4516 63.6201 17.8289 63.3391 18.647 62.7938C23.6056 60.3144 32.6988 61.9618 33.7979 66.3748V66.6558C34.0734 67.4711 40.4093 80.1483 41.2386 81.2447C45.3706 88.9606 35.167 91.9965 35.167 91.9965C32.4124 91.9965 29.9387 94.4702 29.9387 97.5058C29.9387 100.809 32.6934 103.563 35.9991 103.563C39.299 103.563 42.0539 100.809 42.0539 97.5031C42.883 91.1672 46.1859 87.0352 52.2572 86.7542C53.0728 87.0352 67.9564 85.9389 69.0527 85.6579C73.466 86.4842 70.9811 90.0709 70.9811 96.1258C70.9811 100.528 74.5623 104.114 79.2453 104.114C83.6555 104.114 87.5093 100.528 87.5093 96.1258C87.7875 91.7183 84.2036 88.1316 79.5236 88.1316H79.5263Z",
    "M83.6581 63.6206C83.6581 77.3088 72.5539 88.413 58.8657 88.413C45.1774 88.413 34.0732 77.3088 34.0732 63.6206C34.0732 49.9323 45.1774 38.8281 58.8657 38.8281C72.5539 38.8281 83.6581 49.9323 83.6581 63.6206Z",
    "M65.2016 87.0356C66.0336 85.3773 62.9977 84.8317 60.524 84.8317C58.0364 84.8317 55.5628 86.209 56.1111 87.8619C62.7167 97.7735 57.7694 99.1508 54.7337 101.09C52.2598 102.186 50.6015 105.222 50.6015 107.977C50.6015 112.376 54.1827 115.96 58.8657 115.96C63.5488 115.96 67.13 112.379 67.13 107.977C67.411 100.261 62.4469 89.5093 65.2016 87.0356ZM99.9054 71.6037C98.2607 71.6037 96.6024 71.8847 95.5061 72.7138C90.5448 74.6394 86.1318 71.0554 82.8289 68.8488C81.1845 67.7525 79.2479 70.5074 78.6969 71.3364C78.1486 72.163 77.3196 76.0167 80.6253 76.0167C86.1346 74.0883 93.0215 83.7299 93.0215 83.7299C94.1287 86.4846 97.1534 88.1319 100.467 88.1319C104.867 88.1319 108.732 84.5619 108.732 80.1487C107.902 75.1901 104.318 71.6037 99.9054 71.6037ZM51.6978 23.6772C56.9401 34.4151 56.6591 38.5471 53.6374 39.6546C51.1498 41.5827 55.2818 44.0567 58.3174 43.5111C61.3394 42.96 64.0941 41.5827 62.1687 38.8281C57.4884 30.5638 63.546 25.0545 63.546 25.0545C65.4744 23.9582 66.8517 21.4733 66.8517 18.9942C66.8517 14.5867 63.2787 11 58.5875 11C53.9045 11 50.3232 14.5839 50.3232 18.9969C50.3232 20.0933 50.6015 21.4706 51.1498 22.5781C51.1498 23.3962 51.1498 23.3962 51.7008 23.6772H51.6978Z",
    "M54.4527 63.6208C50.0534 63.6208 46.1885 60.0396 46.1885 55.6375C46.1885 51.2246 49.7724 47.6406 54.4527 47.6406C59.1466 47.6406 62.7167 51.2246 62.7167 55.6375C62.7167 60.0368 59.1466 63.6208 54.4527 63.6208Z",
    "M50.3205 75.7359C47.8468 75.7359 46.1885 74.0913 46.1885 71.6039C46.1885 69.13 47.8468 67.4717 50.3205 67.4717C52.8081 67.4717 54.4527 69.13 54.4527 71.6039C54.4527 74.0913 52.8081 75.7359 50.3205 75.7359Z",
    "M64.9266 80.1484C61.6209 80.1484 58.8662 77.3938 58.8662 74.0881C58.8662 70.7879 61.6209 68.0332 64.9266 68.0332C68.2268 68.0332 70.9814 70.7879 70.9814 74.0908C70.9814 77.3938 68.2268 80.1484 64.9238 80.1484H64.9266Z"
)

const colorSets = {
    blue: blueColorSet,
    green: greenColorSet,
    red: redColorSet,
    yellow: yellowColorSet,
    orange: orangeColorSet
}

const pathSets = {
    default: defaultPathSet,
    wiggle: wigglePathSet
}


export { colorSets, pathSets, Virus }