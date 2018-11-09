let gameArea = {
    maxRight: 0,
    maxLeft: null,
}

let bgRate = 1;
let fgRate = 2;

var fgTimer = null;
var bgTimer = null;
var flagTimer = null;
var textTimer = null;

const bgRateBk = 1;
const fgRateBk = 2;

let init = _ => {
    // start motion
    setTimeout(startMotion, 2000);

    // start bg score
    startAudio();

    // start text roll
    setTimeout(textRoll, 2000);
    document.ondragstart = _ => false;
}

let startMotion = () => {
    let bgLeft = 0;
    let container = document.getElementById("container");
    let bg = document.getElementById("bg");
    let flag = document.getElementById("flag");
    let fg = document.getElementById("fg");

    // start object motion
    moveObj(bg, bgRate, "bg");
    moveObj(flag, fgRate, "flag", 1800);
    moveObj(fg, fgRate, "fg");
}

let startAudio = (src = 0) => {
    let playList = [
        "aud/bgscore.mp3"
    ], i = 0;
    
    let play = (src) => {
        let audio = new Audio(src);
        audio.load();
        audio.play();

        audio.addEventListener("ended", () => {
            if (i < playList.length) {
                play(playList[i]);
            }
        });
    }

    play(playList[i]);
}

let textRollEnd = () => {
    document.addEventListener("click", handleClick);
    let textContainer = document.getElementById("textContainer");
    textContainer.style.animation = "";
    clearTimeout(textTimer);
    setTimeout( _ => {
        stopScroll();
        gameArea.maxLeft = parseInt(document.getElementById("bg").style.left);

        let button = document.createElement("button");
        button.innerText = "Proceed To da Vinci Code";
        button.addEventListener("click", () => {
            showCryptex();
        });
        textContainer.appendChild(button);

        let div1 = document.createElement("div");
        div1.id = "lArrow";
        div1.className = "arrowDiv";
        div1.style.left = "0px";
        div1.style.top = "0px";
        div1.addEventListener("click", handleManualScroll);
        textContainer.appendChild(div1);

        let div2 = document.createElement("div");
        div2.id = "rArrow";
        div2.className = "arrowDiv";
        div2.style.right = "0px";
        div2.style.top = "0px";
        textContainer.appendChild(div2);
        div2.addEventListener("click", handleManualScroll);

    }, 2000);
}

let handleManualScroll = (e) => {
    let direction,
        bgLeft = parseInt(document.getElementById("bg").style.left),
        fgLeft = parseInt(document.getElementById("fg").style.left);
    if (e.target.id == "lArrow") {
        if(gameArea.maxRight > fgLeft) direction = -1;
        else direction = 0;
    } else if (e.target.id == "rArrow") {
        if(gameArea.maxLeft < bgLeft) direction = 1;
        else direction = 0;
    }

    bgRate = 2 * bgRateBk * direction;
    fgRate = 2 * fgRateBk * direction;
    startMotion();
    setTimeout(stopScroll, 500);
}

let stopScroll = () => {
    clearTimeout(bgTimer);
    clearTimeout(fgTimer);
    clearTimeout(flagTimer);
}

let textRoll = () => {
    let text = [
        ["Long ago..."],
        ["In a faraway land, amidst an arid desert..."],
        ["In a snowy night...", snowStorm.start],
        ["The winds whispered a legend to the travellers..."],
        ["\"Listen to the whispers... Follow the trail... \""],
        ["\"You may find what you seek, Perhaps even more...\""],
        ["Many tried..."],
        ["Yet they all failed..."],
        ["What is this treasure?"],
        ["How to get it?"],
        ["Do you have what it takes to find the treasure?"],
        ["DYUKSHA Presents"],
        ["The da Vinci Code"],
        ["", textRollEnd],
    ], i = 0;
    let textContainer = document.getElementById("textContainer");
    let fadeCycle = 8;

    textContainer.style.animation = `textFade ${fadeCycle}s infinite`;

    let placeText = () => {
        textContainer.innerText = text[i][0];
        if (text[i][1]) {
            if (typeof(text[i][1]) == "object") textContainer.style["font-family"] = text[i][1].fontFamily; 
            else text[i][1]();
        };
        if(++i < text.length) textTimer = setTimeout(placeText, fadeCycle*1000);
    } 

    placeText();
}

let handleClick = (e) => {
    let clueContainer = document.getElementById("clueContainer");
    let banner = clueContainer.getElementsByClassName("banner");
    if (e.target !== banner && clueContainer.style.visibility === "visible")
        clueContainer.style.visibility  = "hidden";
        let flagCloth = document.getElementById("flagCloth"),
        flagRect = flagCloth.getBoundingClientRect(),
        clickX = e.clientX,
        clickY = e.clientY,
        flagX1 = flagRect.x,
        flagX2 = flagX1 + flagRect.width,
        flagY1 = flagRect.y,
        flagY2 = flagY1 + flagRect.height,
        onflag = clickX > flagX1 && clickX < flagX2 && clickY > flagY1 && clickY < flagY2;
    if (onflag) {
        clueContainer.style.visibility = "visible";
    }
}
 
let moveObj = (obj, rate, target, ingameCharacter = false) => {
    let objPos = parseInt(obj.style.left);
    let initialPosition = ingameCharacter ? ingameCharacter + "px" : "-1px";
    obj.style.left = objPos ? `${objPos - rate}px` : initialPosition;

    let timer = setTimeout( _ => {
        moveObj(obj, rate, target);
    }, 20);

    if(target == "fg") fgTimer = timer;
    else if(target == "bg") bgTimer = timer;
    else if(target == "flag") flagTimer = timer;
}

let begin = () => {
    let button = document.getElementById("proceedButton");
    let introDiv = document.getElementById("c-body");

    button.onclick = () => {
        introDiv.classList.add("hidden");
        init();
    }
}

let showCryptex = () => {
    let cryptex = document.getElementById("cryptex_container");
    let body = document.getElementsByTagName("body")[0];
    let html = document.getElementsByTagName("html")[0];
    body.style.overflowY = "";
    body.style.overflowX = "hidden"; 
    html.style.overflowX = "hidden"; 
    cryptex.classList.remove("hidden");
    document.getElementById("goBackButton").onclick = () => {
        cryptex.classList.add("hidden");
        body.style.overflowY = "hidden"; 
        body.style.overflowX = ""; 
    }
}

if( document.readyState === 'complete' ) {
    begin();
} else {
    document.addEventListener('DOMContentLoaded', begin);
}