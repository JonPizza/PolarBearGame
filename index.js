const app = new PIXI.Application({
    width: window.innerWidth, height: window.innerHeight, backgroundColor: 0x1099bb, resolution: window.devicePixelRatio || 1,
});

document.body.appendChild(app.view);

let playerLocation = 'inside_hell';
let rotDirection = '+';
let wiggle = false;
let walking = false;
let jump = false;
let flipping = false;
let jumpDir = 'up';
let birdMoving = false;
let speed = 50;
let xLoc = app.screen.width / 2;
let can_move = true;
let rand = 0;
let itemInHand = '';
let itemInHandSprite = {};
let insult;
let dmg;

let dmgs = {
    pan: 10,
    rod: 12,
    lavashark: 30,
}

function setMovable(b) {
    can_move = b
    walking = false;
    wiggle = false;
}

document.onkeypress = function(e) {
    if (!can_move) {
        return;
    }

    if (e.key == ' ' && !jump) {
        jump = true;
        jumpDir = 'up';
    } else if (e.key == 't') {
        for (s = 0; s < settings[playerLocation].structures.length; s++) {
            if (settings[playerLocation].structures[s].type == 'npc' && xLoc > settings[playerLocation].structures[s].x - 512 && xLoc < settings[playerLocation].structures[s].x) {
                if (!settings[playerLocation].structures[s].requiresItem || settings[playerLocation].structures[s].requiresItem == itemInHand) {
                    showDialog(settings[playerLocation].structures[s].dialog);
                    if (settings[playerLocation].structures[s].givesItem != undefined) {
                        setTimeout((s) => (setItemInHand(settings[playerLocation].structures[s].givesItem)), settings[playerLocation].structures[s].dialog.length * 6000, s);
                    }
                } else {
                    showDialog(['You don\'t have the required item']);
                }
            }
        }
    } else if (e.key == 'f') {
        flipping = true;
        rotDirection = '+';
    }
}

document.onkeydown = function(e) {
    if (!can_move) {
        return;
    }

    if (e.key == 'a') {
        bear.texture = bearTexture;
        itemInHandSprite.visible = true;
        walking = true;
        if (bearContainer.scale.x > 0)
            bearContainer.scale.x *= -1;
    } else if (e.key == 'd') {
        bear.texture = bearTexture;
        itemInHandSprite.visible = true;
        walking = true;
        bearContainer.scale.x = Math.abs(bearContainer.scale.x);
    } else if (e.key == 'w') {
        bear.texture = bearBackTexture;        
        itemInHandSprite.visible = false;
        wiggle = true;
        if (Math.abs(bearContainer.scale.x) > 0.9 && !jump) {
            bearContainer.scale.y *= 0.9975;
            bearContainer.scale.x *= 0.9975;
            bearContainer.y = getBearY();
        }

        if (Math.abs(bearContainer.scale.x) < 0.95) {
            for (i = 0; i < settings[playerLocation].structures.length; i++) {
                if (settings[playerLocation].structures[i].type == 'door' && xLoc > settings[playerLocation].structures[i].x - 512 && xLoc < settings[playerLocation].structures[i].x) {
                    buildingContainer.x = -1 * settings[playerLocation].structures[i].toX;
                    xLoc = settings[playerLocation].structures[i].toX + (app.screen.width / 2);
                    loadScene(settings[playerLocation].structures[i].to);
                } else if (settings[playerLocation].structures[i].type == 'enemy' && xLoc > settings[playerLocation].structures[i].x - 512 && xLoc < settings[playerLocation].structures[i].x) {
                    let np = settings[playerLocation].structures[i].numPenguins;
                    let success = settings[playerLocation].structures[i].success;
                    let pt = settings[playerLocation].structures[i].penguinType;
                    doCombat(np, pt);
                    if (dmg >= np) {
                        buildingContainer.x = -1 * success[1];
                        xLoc = success[1] + (app.screen.width / 2);
                        loadScene(success[0]);
                    }
                }
            }
        }
    } else if (e.key == 's') {
        bear.texture = bearFrontTexture;
        itemInHandSprite.visible = true;
        wiggle = true;
        if (Math.abs(bearContainer.scale.x) < 1.1 && !jump) {
            bearContainer.scale.y *= 1.0025;
            bearContainer.scale.x *= 1.0025;
            bearContainer.y = getBearY();
        }
    }
}

document.onkeyup = function(e) {
    if (!can_move) {
        return;
    }

    if (e.key == 'a' || e.key == 'd') {
        walking = false;
    } else if (e.key == 's' || e.key == 'w') {
        wiggle = false;
    }
}

function getCook(cookiename) {
    var cookiestring = RegExp(cookiename+"=[^;]+").exec(document.cookie);
    return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./,"") : "");
}

function setCookie(c, v) {
    document.cookie += c + "=" + v + ";"
}

function load() {
    if (document.cookie != "") {
        playerLocation = getCook('playerLocation');
        itemInHand = getCook('itemInHand');
        setItemInHand(itemInHand);
        loadScene(playerLocation);
    }
}