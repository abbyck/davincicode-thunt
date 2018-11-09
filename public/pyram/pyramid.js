let code = 'ULULURUULLUURRURU';
let input = '';
let i = 0;
let gameMatrix = [];
let presentFocus = {};

let init = () => {
    startAudio();
    setUpGameDiv();
    loadCamels();
    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('click', handleClick);

    document.ondragstart = _ => false;
};

let releaseCamel = (camel, initialLeft, frameRate) => {
    let container = document.getElementById('container');

    camel.className = 'camel';
    camel.style.left = `${initialLeft}px`;

    container.appendChild(camel);
    moveCamel(camel, frameRate);
};

let moveCamel = (camel, frameRate) => {
    let containerWidth = parseInt(
        document.getElementById('container').getBoundingClientRect().width
    );

    let left = parseInt(camel.style.left);
    camel.style.left = left < containerWidth ? `${left + 1}px` : '-100px';

    setTimeout(() => {
        moveCamel(camel, frameRate);
    }, frameRate);
};

let loadCamels = () => {
    let camel1 = new Image();
    let camel2 = new Image();

    camel1.onload = () => {
        camel1.id = 'camel1';
        camel1.style.bottom = '-2px';
        releaseCamel(camel1, -100, 40);
    };

    camel2.onload = () => {
        camel2.id = 'camel2';
        releaseCamel(camel2, -200, 60);
    };

    camel1.src = '/pyram/img/camel1.gif';
    camel2.src = '/pyram/img/camel2.gif';
};

let setUpGameDiv = () => {
    let gameDiv = document.getElementById('gameDiv'),
        clueDiv = document.getElementById('clueDiv');
    let parentHeight = parseInt(getComputedStyle(gameDiv.parentElement).height),
        childDim = Math.ceil(0.8 * parentHeight);
    clueDiv.style.width = childDim + 'px';
    gameDiv.style.height = childDim + 'px';
    gameDiv.style.width = childDim + 'px';
    let smallSquare = childDim / 10;

    for (let i = 0; i < 10; i++) {
        let stripDiv = document.createElement('div');
        stripDiv.style.height = smallSquare + 'px';
        stripDiv.style.width = '100%';
        stripDiv.style.background = '#fff';
        stripDiv.className = 'stripDiv';
        gameDiv.appendChild(stripDiv);
        let br = document.createElement('br');
        gameDiv.appendChild(br);
    }

    let stripDivs = document.getElementsByClassName('stripDiv');
    for (stripDiv of stripDivs) {
        for (let i = 0; i < 10; i++) {
            let smallDiv = document.createElement('div');
            smallDiv.className = 'smallDiv';
            smallDiv.style.height = smallSquare + 'px';
            smallDiv.style.width = smallSquare + 'px';
            smallDiv.style.background = '#000';
            stripDiv.appendChild(smallDiv);
        }
    }

    for (let i = 0; i < 10; i++) {
        stripDiv = document.getElementsByClassName('stripDiv')[i];
        gameMatrix[i] = [];
        for (let j = 0; j < 10; j++) {
            let smallDiv = stripDiv.getElementsByClassName('smallDiv')[j];
            gameMatrix[i].push(smallDiv);
        }
    }

    setGameFocus();
};

let setGameFocus = (i = 9, j = 9) => {
    presentFocus = {
        i: i,
        j: j,
    };
    gameMatrix[i][j].style.background = '#0f0';
};

let removeGameFocus = (i, j) => {
    gameMatrix[i][j].style.background = '#000 ';
};

let handleClick = e => {
    let puzzleDiv = document.getElementById('puzzle');
    let cube = document.getElementById('cube');

    if (e.target === puzzleDiv) {
        puzzleDiv.style.visibility = 'hidden';
    } else if (cube.contains(e.target)) {
        puzzleDiv.style.visibility = 'visible';
    }
};

let handleKeyPress = e => {
    checkRoute(e.which);
};

let startAudio = (src = 0) => {
    let playList = ['/pyram/aud/bg.mp3'],
        i = 0;

    let play = src => {
        let audio = new Audio(src);
        audio.load();
        audio.play();

        audio.addEventListener('ended', () => {
            if (i < playList.length) {
                play(playList[i]);
            }
        });
    };

    play(playList[i]);
};

let checkRoute = keyCode => {
    let key;
    switch (keyCode) {
        case 37:
            key = 'L';
            break;
        case 38:
            key = 'U';
            break;
        case 39:
            key = 'R';
            break;
        case 40:
            key = 'D';
            break;
        default:
            key = 'I';
    }

    if (key === 'I') {
        removeGameFocus(presentFocus.i, presentFocus.j);
        i = 0;
        input = '';
    } else {
        if (i < code.length) {
            if (key === code[i++]) {
                input += key;
                let r = presentFocus.i,
                    c = presentFocus.j;
                // console.log(presentFocus)
                switch (key) {
                    case 'L':
                        c--;
                        break;
                    case 'R':
                        c++;
                        break;
                    case 'U':
                        r--;
                        break;
                    case 'D':
                        r++;
                        break;
                }
                removeGameFocus(presentFocus.i, presentFocus.j);
                setGameFocus(r, c);
                // console.log("present focus ", presentFocus)
            } else {
                i = 0;
                input = '';
            }
            if (input === code) {
                document.removeEventListener('keydown', handleKeyPress);
                displaySuccessMessage();
            }
        }
    }
    if (input === '') {
        removeGameFocus(presentFocus.i, presentFocus.j);
        setGameFocus(9, 9);
    }
};

let displaySuccessMessage = () => {
    let introDiv = document.getElementById('c-body');
    let successCode =
        '<h2 class="c-scroll__heading">WoW!!!</h2><p class="c-scroll__paragraph">You\'re getting nearer...</p> <br> <form action = "/pyramid" method = "POST"><button>Proceed</button></form>';
    introDiv.getElementsByClassName(
        'c-scroll__text'
    )[0].innerHTML = successCode;

    introDiv.classList.remove('hidden');

    // redirect to next page
};

let begin = () => {
    let button = document.getElementById('proceedButton');
    let introDiv = document.getElementById('c-body');

    button.onclick = () => {
        introDiv.classList.add('hidden');
        init();
    };
};

document.addEventListener('DOMContentLoaded', begin);
