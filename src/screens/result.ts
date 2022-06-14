import { app, createElement } from "../globals";

export function createResultScreen() {
    const mainContainer = createMainContainer();
    const container = createResultContainer();
    if (window.application.pairCount === 0) {
        addResultImg("win");
        createResultTitle("Вы выиграли!");
    } else {
        addResultImg("lose");
        createResultTitle("Вы проиграли");
    }
    createTimeBlock();
    createAgainButton();

    function createMainContainer() {
        if (app !== null) {
            const resultContainer = createElement("div", "result__container");
            const firstChild = app.firstElementChild;
            app.insertBefore(resultContainer, firstChild);
            return resultContainer;
        }
    }

    function createResultContainer() {
        const resultContainer = createElement("div", "result", mainContainer);
        return resultContainer;
    }

    function addResultImg(result:string) {
        const imageResult = createElement("img", "result__img", container);
        imageResult.src = `/static/image/${result}.png`;
        imageResult.alt = `${result}-picture`;
        return imageResult;
    }

    function createResultTitle(resultMessage:string) {
        const resultTitle = createElement(
            "h2",
            "result__header",
            container,
            resultMessage
        );
        return resultTitle;
    }

    function createTimeBlock() {
        const timeBlock = createElement("div", "result__time-block", container);

        createElement(
            "h3",
            "result__time-block_header",
            timeBlock,
            "Затраченное время"
        );
        createElement(
            "h1",
            "result__time-block_value",
            timeBlock,
            `${window.application.timer}`
        );

        return timeBlock;
    }

    function createAgainButton() {
        const againButton = createElement(
            "button",
            "button",
            container,
            "Играть снова"
        );

        againButton.addEventListener("click", function () {
            window.application.pairCount = undefined;
            window.application.openCard = undefined;
            window.application.renderScreen("difficulty");
        });

        return againButton;
    }
}