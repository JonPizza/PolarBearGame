const buildingContainer = new PIXI.Container();
const bearContainer = new PIXI.Container();
const cloudContainer = new PIXI.Container();
const combatContainer = new PIXI.Container();

const bearTexture = PIXI.Texture.from('http://127.0.0.1/assets/images/player.png');
const bearFrontTexture = PIXI.Texture.from('http://127.0.0.1/assets/images/playerfront.png');
const bearBackTexture = PIXI.Texture.from('http://127.0.0.1/assets/images/playerback.png');

const treeTexture = PIXI.Texture.from('http://127.0.0.1/assets/images/tree.png');
const rockTexture = PIXI.Texture.from('http://127.0.0.1/assets/images/rock.png');

const bannerTexture = PIXI.Texture.from('http://127.0.0.1/assets/images/banner.png');
let banner = new PIXI.Sprite(bannerTexture);

const penguinTexture = PIXI.Texture.from('http://127.0.0.1/assets/images/penguin.png');
let penguin = new PIXI.Sprite(penguinTexture);

const birdTexture = PIXI.Texture.from('http://127.0.0.1/assets/images/bird.png');

const bear = new PIXI.Sprite(bearTexture);
const bird = new PIXI.Sprite(birdTexture);

let floor = PIXI.Sprite.from(PIXI.Texture.WHITE);
floor.width = app.screen.width;
floor.height = 80;
floor.y = app.screen.height - 80;
floor.tint = 0x11CC55;
app.stage.addChild(floor);

for (i = 0; i < 10; i++) {
    let cloud = PIXI.Sprite.from(PIXI.Texture.WHITE);

    cloud.width = app.screen.width / 6 * (Math.random() + 1);
    cloud.height = 70 * (Math.random() + 1);
    cloud.y = app.screen.height / 6 * (Math.random());
    cloud.x = (app.screen.width / 10) * i;

    cloud.tint = 0xFFFFFF;

    cloudContainer.addChild(cloud);
}

let t1 = new PIXI.Sprite(treeTexture);
let t2 = new PIXI.Sprite(rockTexture);
let t3 = new PIXI.Sprite(treeTexture);

t1.x = 10;
t1.y = 280;

t2.x = 50;
t2.y = 250;

t3.x = app.stage.width - 512;
t3.y = 300;

combatContainer.addChild(t3);
combatContainer.addChild(t2);
combatContainer.addChild(t1);

combatContainer.visible = false;

app.stage.addChild(buildingContainer);
app.stage.addChild(cloudContainer);

bearContainer.addChild(bear);
bear.anchor.set(0.5);

bird.anchor.set(0.5);
app.stage.addChild(bird);

app.stage.addChild(banner);
banner.x = app.screen.width / 2 - 356;

bird.y = 200;

bearContainer.x = app.screen.width / 2;

bear.scale.y = 0.5;
bear.scale.x = 0.5;

buildingContainer.x = 0;

// INFO TEXT

let text = new PIXI.Text('', {fontFamily : 'Arial', fontSize: 24, fill : 0x000000, align : 'center'});

text.x = 10;
text.y = 10;

let rectangle2 = PIXI.Sprite.from(PIXI.Texture.WHITE);
rectangle2.height = text.height + 6;
rectangle2.tint = 0xCF1155;

rectangle2.x = 7;
rectangle2.y = 7;

rectangle2.visible = false;
text.visible = false;

let speechBubble = PIXI.Sprite.from(PIXI.Texture.WHITE);
let dialog = new PIXI.Text('', {fontFamily : 'Arial', fontSize: 24, fill : 0x000000, align : 'center'});

dialog.x = app.screen.width / 4 + 40;
dialog.y = app.screen.height - 560;

speechBubble.tint = 0xAACCFF;

speechBubble.visible = false;
dialog.visible = false;

app.stage.addChild(rectangle2);
app.stage.addChild(text);

let combatBackground = PIXI.Sprite.from(PIXI.Texture.WHITE);
combatBackground.tint = settings[playerLocation].fcolor;
combatBackground.width = app.screen.width;
combatBackground.height = app.screen.height;
combatBackground.visible = false;

app.stage.addChild(combatBackground);
app.stage.addChild(combatContainer);
app.stage.addChild(bearContainer);
app.stage.addChild(speechBubble);
app.stage.addChild(dialog);

function showInfo(info, ms) {
    text.text = info;
    rectangle2.width = text.width + 6;
    text.visible = true;
    rectangle2.visible = true;

    setTimeout(() => {
        text.visible = false;
        rectangle2.visible = false;
    }, ms);
}

// util

function getBearY() {
    return app.screen.height - bearContainer.height / 2 + Math.abs(bearContainer.scale.x) * 350 - 370;
}

function loadScene(location) {
    playerLocation = location;
    buildingContainer.removeChildren(); // KILL THE CHILDs :^))))))))))))))))))))))

    if (location.includes('outside')) {
        bird.visible = true;
        cloudContainer.visible = true;
    } else if (location.includes('inside')) {
        bird.visible = false;
        cloudContainer.visible = false;
    }

    floor.tint = settings[location].fcolor;
    app.renderer.backgroundColor = settings[location].bgcolor;

    for (i = 0; i < settings[playerLocation].structures.length; i++) {
        loadStructure(settings[playerLocation].structures[i]);
    }

    bearContainer.scale.y = 1;
    bearContainer.scale.x = 1;
}

function loadStructure(structure) {
    let texture = PIXI.Texture.from('http://127.0.0.1/assets/images/' + structure.name + '.png');
    let sprite = new PIXI.Sprite(texture);
    sprite.x = structure.x;
    sprite.anchor.set(1);
    sprite.y = app.screen.height - 80;

    if (structure.type == 'npc') {
        sprite.scale.x = 0.5;
        sprite.scale.y = 0.5;
        sprite.anchor.x = 1.5;
    }

    buildingContainer.addChild(sprite);
}

function showDialog(dialogs, y) {
    speechBubble.visible = true;
    dialog.visible = true;
    setMovable(false);

    for (i = 0; i < dialogs.length; i++) {
        setTimeout((i) => {
            dialog.text = dialogs[i];

            speechBubble.width = dialog.width + 40;
            speechBubble.height = dialog.height + 40;
            speechBubble.x = app.screen.width / 2 - (dialog.width / 2);

            if (y == undefined) {
                speechBubble.y = app.screen.height - 376 - dialog.height;
            } else {
                speechBubble.y = y;
            }

            dialog.x = speechBubble.x + 20;
            dialog.y = speechBubble.y + 20;
        }, 6000 * i, i);
    }

    setTimeout(() => {
        speechBubble.visible = false;
        dialog.visible = false;
        setMovable(true);
    }, 6000 * i)
}

function setItemInHand(item) {
    if (itemInHand == '' || dmgs[item] > dmgs[itemInHand]) {
        let texture = PIXI.Texture.from('http://127.0.0.1/assets/images/' + item + '.png');
        if (!itemInHand) {
            itemInHandSprite = new PIXI.Sprite(texture);
            bearContainer.addChild(itemInHandSprite);
        } else {
            itemInHandSprite.texture = texture;
        }
        itemInHand = item;
    } else {
        showInfo('You did not receive the item because your current item does more damage!', 7000);
    }
}

function doCombat(numPenguins, penguinType) {
    for (let i = 0; i < numPenguins; i++) {
        let penguin = new PIXI.Sprite(PIXI.Texture.from('http://127.0.0.1/assets/images/' + penguinType + '.png'));
        penguin.x = bearContainer.x - 100 + (numPenguins * 25) * (Math.random() - 0.5);
        penguin.y += Math.random() * 30;
        penguin.scale.x = 0.5;
        penguin.scale.y = 0.5;
        penguin.type = "penguin"
        app.stage.addChild(penguin);
    }

    combatBackground.visible = true;
    combatContainer.visible = true;
    setMovable(false);
    bear.texture = bearTexture;
    itemInHandSprite.visible = true;

    showDialog([
        'your goin down punk!',
        'take that!',
        'give up now!',
    ], 300);

    if (itemInHand == '') {
        dmg = 1 + Math.random() * 3;
    } else {
        dmg = dmgs[itemInHand];
    }

    dmg = Math.floor(dmg);

    setTimeout(() => {
        insult = prompt('Insult the penguins back!', 'yo mamma...');
        if (insult.includes("daddy")) {
            dmg *= 5;
        }

        if (dmg >= numPenguins) {
            showDialog([insult, 'boom, roasted!', 
                        'You hit the penguins for ' + dmg + ' damage!',
                        'The penguins are intimidated and flee!'])
        } else {
            showDialog([insult, 'boom, roasted!', 
                        'You hit the penguins for ' + dmg + ' damage!',
                        'You get overwhelmed and flee!'])
        }

        setTimeout(() => {
            combatBackground.visible = false;
            setMovable(true);
            combatContainer.visible = false;
            let penguins = [];
            for (let i = 0; i < app.stage.children.length; i++) {
                if (app.stage.children[i].type == "penguin") {
                    penguins = penguins.concat([i]);
                } 
            }

            for (let i = penguins.length; i > -1; i--) {
                app.stage.removeChild(app.stage.children[penguins[i]]);
            }
        }, 6000 * 4);
    }, 6000 * 3, dmg);
}

