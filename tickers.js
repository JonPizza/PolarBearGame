
app.ticker.add((delta) => {
    if (walking || wiggle) {
        if (bearContainer.rotation > 0.03) {
            rotDirection = '-';
        } else if (bearContainer.rotation < -0.03) {
            rotDirection = '+';
        }

        if (rotDirection == '-') {
            bearContainer.rotation -= delta / 250;
        } else if (rotDirection == '+') {
            bearContainer.rotation += delta / 250;
        }
    }

    if (flipping) {
        walking = false;
        wiggle = false;
        setMovable(false);

        bearContainer.rotation -= delta / 8;

        if (bearContainer.rotation < -6.3) {
            setMovable(true);
            flipping = false;
            bearContainer.rotation = 0;
        }
    }

    if (walking 
        && !(xLoc > settings[playerLocation].maxX && bearContainer.scale.x > 0)
        && !(xLoc < settings[playerLocation].minX && bearContainer.scale.x < 0)) {

        if (bearContainer.scale.x < 0) {
            xLoc -= speed;
            cloudContainer.x += speed;
            buildingContainer.x += speed;
        } else {
            xLoc += speed;
            cloudContainer.x -= speed;
            buildingContainer.x -= speed;
        }

        if (cloudContainer.x < app.screen.width * -1.7) {
            cloudContainer.x = app.screen.width;
        } else if (cloudContainer.x > app.screen.width * 1.4) {
            cloudContainer.x = -1.66 * app.screen.width;
        }
    }

    for (i = 0; i < settings[playerLocation].structures.length; i++) {
        if (settings[playerLocation].structures[i].info && xLoc > settings[playerLocation].structures[i].x - 512 && xLoc < settings[playerLocation].structures[i].x) {
            showInfo(settings[playerLocation].structures[i].info, 5);
        }
    }

    if (jump) {
        if (bearContainer.y < app.screen.height * 0.6) {
            jumpDir = 'down';
        }

        if (jumpDir == 'up') {
            bearContainer.y -= (bearContainer.y / 2 - 100) / 27
        } else if (jumpDir == 'down') {
            bearContainer.y += (bearContainer.y / 2 - 100) / 27
            if (bearContainer.y > getBearY()) {
                jumpDir = 'up';
                jump = false;
            }
        }
    } else {
        bearContainer.y = getBearY();
    }
});

app.ticker.add(() => {
    if (Math.random() > 0.999) {
        birdMoving = true;
    }

    if (birdMoving) {
        bird.x -= 4;
        if (walking) {
            if (bearContainer.scale.x < 0) {
                bird.x += speed / 2;
            } else {
                bird.x -= speed / 2;
            }
        }

        bird.y += Math.sin(Math.floor(new Date().getTime() / 500));
        bird.rotation -= Math.sin(Math.floor(new Date().getTime() / 500)) / 400;

        if (bird.x < -200) {
            birdMoving = false;
        }
    } else {
        bird.x = app.screen.width + 200;
        bird.y = 100;
        bird.rotation = -0.3;
    }
});