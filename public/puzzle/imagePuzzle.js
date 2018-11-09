let cSuns = [];
let nc = false;

let begin = () => {
    document.ondragstart = _ => false;

    let button = document.getElementById('proceedButton');
    let introDiv = document.getElementById('c-body');

    button.onclick = () => {
        introDiv.classList.add('hidden');
        init();
    };
};

let setTile = () => {
    let pallette = ['#2CBAA0', '#C13E6E', '#ED233C', '#D84B4B', '#C97C08'];
    let tiles = document.getElementsByClassName('photo');
    i = 0;
    for (tile of tiles) {
        tile.style.background = pallette[i++ % pallette.length];
    }
};

let init = () => {
    setTile();
    let gallery = document.getElementById('gallery');
    let lightboxActive = false;

    function showLightbox(e) {
        gallery.classList.toggle('lightbox');
    }

    // set sun
    let suns = document.getElementsByClassName('sun');
    i = 0;
    for (sun of suns) {
        sun.setAttribute('sunId', 'sun' + i);
        i++;
    }

    document.addEventListener('click', handleClick);
};

let handleClick = e => {
    let suns = document.getElementsByClassName('sun');
    let note = document.getElementById('note');

    let cpl = document.getElementById('cpl');
    let cpr = document.getElementById('cpr');

    let noteRect = note.getBoundingClientRect();

    let notePos = {
        x1: noteRect.x,
        x2: noteRect.x + noteRect.width,
        y1: noteRect.y,
        y2: noteRect.y + noteRect.height,
    };

    let inNote = false;

    if (
        e.clientX > notePos.x1 &&
        e.clientX < notePos.x2 &&
        e.clientY > notePos.y1 &&
        e.clientY < notePos.y2
    )
        inNote = true;

    if (inNote) {
        note.classList.toggle('shrink');
        note.style.zIndex = 1;
        nc = true;
        return;
    } else if (cpl.contains(e.target) || cpr.contains(e.target))
        handleCurtain(e);
    else if (nc) {
        let out = true;
        for (sun of suns) {
            if (sun.contains(e.target)) {
                let sunId = sun.getAttribute('sunId');
                if (cSuns.indexOf(sunId) == -1) {
                    cSuns.push(sunId);
                }
                out = false;
            }
        }

        if (out) {
            cSuns = [];
            handleCurtain(e, true);
        }
        if (cSuns.length === suns.length) displaySuccessMessage();
    } else handleCurtain(e, true);
    note.classList.add('shrink');
    note.style.zIndex = -1;
};

let handleCurtain = (e, close = false) => {
    let cpl = document.getElementById('cpl');
    let cpr = document.getElementById('cpr');

    let target = e.target;

    if (close) {
        addClass(cpl, 'moveToLeft', true);
        addClass(cpr, 'moveToRight', true);
        addClass(cpl, 'moveTocenter');
        addClass(cpr, 'moveTocenter');
    } else if (
        !target.classList.contains('moveToLeft') &&
        !target.classList.contains('moveToRight')
    ) {
        addClass(cpl, 'moveToLeft');
        addClass(cpr, 'moveToRight');
        addClass(cpl, 'moveTocenter', true);
        addClass(cpr, 'moveTocenter', true);
    }
};

let displaySuccessMessage = () => {
    let introDiv = document.getElementById('c-body');
    let successCode =
        '<h2 class="c-scroll__heading">Amazing!!!</h2><br><p class="c-scroll__paragraph">Many tried... Yet they all failed... But let\'s continue our journey in search of the treasure through another reality!!!</p> ' +
        '<h2 class="c-scroll__heading">The daVinci Code</h2><p class="c-scroll__paragraph" style="font-family:\'baseFont\';">Congrats on level 1 completion... Our volunteers will contact you with more details soon...<br>Regards from Team daVinci Code</p><br> <form action = "/puzzle" method = "POST"><input type="button" name="newID" placeholder="Button"><button>Continue</button></form>';
    introDiv.getElementsByClassName(
        'c-scroll__text'
    )[0].innerHTML = successCode;

    introDiv.classList.remove('hidden');
    console.log('Clicked');
    // redirect to next page
};

let addClass = (target, className, remove = false) => {
    if (remove) {
        target.classList.remove(className);
        return;
    }
    target.classList.add(className);
};

document.addEventListener('DOMContentLoaded', begin);
