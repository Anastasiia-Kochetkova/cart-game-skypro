import { app, createElement, imgPath } from "../globals";
import { cardsData } from "../card-collection";

export function createGameScreen() {
    const head = createHeadContainer();
    createTimer(head);
    createResetButton(head);

    const cardsField = createCardsField();
    fillWithCards(cardsField);

    setTimeout(flipTheCard, 5000);

    function createResetButton(container: HTMLElement): void {
        const resetButton = createElement(
            "button",
            "button",
            container,
            "Начать заново"
        );

        resetButton.addEventListener("click", function () {
            window.application.pairCount = undefined;
            window.application.openCard = undefined;
            window.application.renderScreen("game");
        });
    }

    function createHeadContainer() {
        const head = createElement("div", "head", app);
        return head;
    }

    function fillWithCards(container: HTMLElement): void {
        let allCards = [];
        for (let indexCard = 0; indexCard < cardsData.length; indexCard++) {
            allCards.push(cardsData[indexCard].name);
        }

        let pairCount = 0;
        if (window.application.difficulty === "1") {
            pairCount = 3;
        } else if (window.application.difficulty === "2") {
            pairCount = 6;
        } else if (window.application.difficulty === "3") {
            pairCount = 9;
        }

        window.application.pairCount = pairCount;

        let pairCards = [];
        for (let i = 0; i < pairCount; i++) {
            let randomIndex = Math.floor(Math.random() * allCards.length);
            let randomElement = allCards[randomIndex];

            allCards.splice(randomIndex, 1);

            pairCards.push(randomElement);
            pairCards.push(randomElement);
        }

        shuffle(pairCards);

        pairCards.forEach((element) => {
            addCardImg(container, element);
        });
    }

    function createCardsField() {
        const containerForField = createElement(
            "div",
            "container-for-field",
            app
        );

        const cardsField = createElement(
            "div",
            "cards-field",
            containerForField
        );
        return cardsField;
    }

    function createTimer(container: HTMLElement): void {
        let classList;

        const timer = createElement("div", "timer", container);

        const timerBlockMin = createElement("div", "timer__block", timer);

        classList = ["time__title", "time__title-min"];
        createElement("h2", classList, timerBlockMin, "min");

        classList = ["time", "minutes"];
        createElement("div", classList, timerBlockMin, "00");

        createElement("div", "time", timer, ".");

        const timerBlockSec = createElement("div", "timer__block", timer);
        classList = ["time__title", "time__title-sec"];
        createElement("h2", classList, timerBlockSec, "sec");

        classList = ["time", "seconds"];
        createElement("div", classList, timerBlockSec, "00");
    }

    function addCardImg(container: HTMLElement, name: string) {
        const card = createElement("div", "card", container);

        const imageCard = createElement("img", "image-card", card);
        imageCard.id = name;
        imageCard.alt = "card";
        imageCard.src = getImgByName(name);
    }

    function getImgByName(name: string) {
        let imageSrc;
        cardsData.forEach((element) => {
            if (element.name === name) {
                imageSrc = `${imgPath}${element.image}`;
            }
        });
        return imageSrc;
    }

    function shuffle(array: string[]) {
        let currentIndex = array.length,
            randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex !== 0) {
            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex],
                array[currentIndex],
            ];
        }
        return array;
    }

    function flipTheCard() {
        const currentCards = document.querySelectorAll(".image-card");
        currentCards.forEach((element:any) => {
            element.src = `${imgPath}back.png`;
        });
        subscribeCardsOnClick();
        startTimer();
    }

    function subscribeCardsOnClick() {
        const cards = document.querySelectorAll(".image-card");
        cards.forEach((element) => {
            element.addEventListener("click", cardOnClick);
        });
    }

    function cardOnClick(event: any) {
        const chosenCard = event.target;
        if (!window.application.openCard) {
            chosenCard.src = `${imgPath}${chosenCard.id}.jpg`;
            chosenCard.removeEventListener("click", cardOnClick);
            window.application.openCard = chosenCard;
        } else {
            chosenCard.src = `${imgPath}${chosenCard.id}.jpg`;
            chosenCard.removeEventListener("click", cardOnClick);
            if (window.application.openCard.id === chosenCard.id) {
                window.application.pairCount--;
                if (window.application.pairCount === 0) {
                    saveTimer();
                    setTimeout(showWinScreen, 500);
                }
                window.application.openCard = undefined;
            } else {
                saveTimer();
                setTimeout(showLoseScreen, 500);
            }
        }
    }

    function saveTimer() {
        const secondElement = document.querySelector(".seconds");
        const minuteElement = document.querySelector(".minutes");
        if (secondElement !== null && minuteElement !== null) {
            const resultTime = `${minuteElement.textContent}.${secondElement.textContent}`;
            window.application.timer = resultTime;
        }
        clearInterval(window.application.timerId);
    }

    function showLoseScreen() {
        window.application.renderScreen("result", false);
    }

    function showWinScreen() {
        window.application.renderScreen("result", false);
    }

    function startTimer() {
        const secondElement = document.querySelector(".seconds");
        const minuteElement = document.querySelector(".minutes");

        let interval;
        let seconds = 0,
            minutes = 0;

        interval = setInterval(timerTick, 1000);
        window.application.timerId = interval;

        function timerTick() {
            if (secondElement === null || minuteElement === null) {
                return
            }
            seconds++;
            if (seconds <= 9) {
                secondElement.textContent = "0" + seconds;
            }
            if (seconds > 9) {
                secondElement.textContent = String(seconds);
                if (seconds === 60) {
                    secondElement.textContent = "00";
                }
            }
            if (seconds > 59) {
                minutes++;
                seconds = 0;
                if (minutes < 9) {
                    minuteElement.textContent = "0" + minutes;
                }
                if (minutes > 9) {
                    minuteElement.textContent = String(minutes);
                }
            }
        }
    }
}