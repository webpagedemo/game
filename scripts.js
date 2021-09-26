class Player {
    constructor(name) {
        this.name = name;
    }
    getName() {
        return this.name;
    }
}

class Canvas {
    #fields;
    #board;
    #boardPosition  = {top: 100, left: 100};
    #boardContext;
    #fieldWidth;
    #fieldHeight;
    #borderFields   = 0;
    #fieldsInLine   = 0;
    #fieldsInColumn = 0;

    constructor(id) {
        this.#board             = document.getElementById(id);
        this.#borderFields      = 1;
        this.#fieldsInLine      = 3;
        this.#fieldsInColumn    = 3;
    }

    setContext() {
        if(!this.#board.getContext)
        {
            console.error("Bad context element");
            return;
        }

        this.#boardContext = this.#board.getContext('2d');
    }

    getBoard() {
        return this.#board;
    }

    drawBoard() {
        
        this.setContext();
        this.calculateFieldWidth();
        this.calculateFieldHeight();
        this.recalculateFieldSize()
        this.configureContext(); 

        // first vertical line
        let lineY1 = {
            topStart:   this.#boardPosition.top,
            topEnd:     this.#boardPosition.top  + ( this.#fieldHeight * this.#fieldsInLine ) + ( this.#borderFields * 2 ),
            leftStart:  this.#boardPosition.left + this.#fieldWidth + 1,
            leftEnd:    this.#boardPosition.left + this.#fieldWidth + 1
        }

        this.drawLine(lineY1);

        // second vertical line
        let lineY2 = {
            topStart:   this.#boardPosition.top,
            topEnd:     this.#boardPosition.top  + ( this.#fieldHeight * this.#fieldsInLine ) + ( this.#borderFields * 2 ),
            leftStart:  this.#boardPosition.left + ( this.#fieldWidth * 2 ) + 2,
            leftEnd:    this.#boardPosition.left + ( this.#fieldWidth * 2 ) + 2
        }

        this.drawLine(lineY2);
        
        // first horizontal line
        let lineX1 = {
            topStart:   this.#boardPosition.top + this.#fieldHeight + 1,
            topEnd:     this.#boardPosition.top + this.#fieldHeight + 1,
            leftStart:  this.#boardPosition.left,
            leftEnd:    this.#boardPosition.left + ( this.#fieldWidth * this.#fieldsInColumn ) + 2
        }

        this.drawLine(lineX1);

        // second horizontal line
        let lineX2 = {
            topStart:   this.#boardPosition.top + ( this.#fieldHeight * 2 ) + 2,
            topEnd:     this.#boardPosition.top + ( this.#fieldHeight * 2 ) + 2,
            leftStart:  this.#boardPosition.left,
            leftEnd:    this.#boardPosition.left + ( this.#fieldWidth * this.#fieldsInColumn ) + 2
        }

        this.drawLine(lineX2);
    }

    drawLine(params) {
        this.#boardContext.beginPath();
        this.#boardContext.moveTo(params.leftStart, params.topStart);
        this.#boardContext.lineTo(params.leftEnd, params.topEnd);
        this.#boardContext.stroke();
    }

    calculateFieldWidth() {
        let boardWidth      =  Math.floor(this.#board.width / 2);
        this.#fieldWidth    = Math.floor((boardWidth - this.#borderFields) / this.#fieldsInLine);
    }

    calculateFieldHeight() {
        let boardHeight     =  Math.floor(this.#board.height / 2);
        this.#fieldHeight   = Math.floor((boardHeight - this.#borderFields) / this.#fieldsInLine);
    }

    recalculateFieldSize() {
        if(this.#fieldHeight == this.#fieldWidth)
            return;

        if(this.#fieldHeight > this.#fieldWidth) {
            this.#fieldHeight = this.#fieldWidth;
        } else {
            this.#fieldWidth = this.#fieldHeight;
        }
    }

    getDrawRange() {
        return {
            topStart: this.#boardPosition.top,
            topEnd: this.#boardPosition.top  + ( this.#fieldHeight * this.#fieldsInLine ) + 2,
            leftStart: this.#boardPosition.left,
            leftEnd: this.#boardPosition.left + ( this.#fieldWidth * this.#fieldsInColumn ) + 2
        }
    }

    configureContext() {
        this.#boardContext.strokeStyle  = 'red';
        this.#boardContext.lineWidth    = 1;
    }

    drowCircle() {
        let circleR = Math.floor(( this.#fieldWidth * 0.6 ) / 2);
        this.#boardContext.beginPath();
        this.#boardContext.arc(100, 75, circleR, 0, 2 * Math.PI);
        this.#boardContext.stroke();
    }

    drowCross() {
        
    }

    makeMatrix(gameFieldsQuantity) {
        this.fields = Array.from(Array(gameFieldsQuantity).keys())
    }

    drowCurrentPlayerName() {

    }
}

class Game {
    
    #players = [];
    #currentPlayer;
    #canvas;

    constructor(canvas) {
        this.#canvas = canvas;
    }

    setEvents() {
        this.#canvas.getBoard().addEventListener('click', (e) => {
            // get positon from click place
            let rect        = e.target.getBoundingClientRect();
            let drawRange   = this.#canvas.getDrawRange();

            if(e.clientY >= rect.y + drawRange.topStart && 
                e.clientY <= rect.y + drawRange.topEnd &&
                e.clientX >= rect.x + drawRange.leftStart &&
                e.clientX <= rect.x + drawRange.leftEnd) {

                    console.log('X:');
                    console.log(e.clientX - rect.x + drawRange.leftStart);
                    console.log('Y:');
                    console.log(e.clientX - rect.y + drawRange.topStart);
                    console.log('jestem na mapie i obliczam na którym polu jestem ');
                    console.log('potem dodaje ');

            }

        });
    }

    drawFirstPlayer(max, min) {
        this.#currentPlayer = Math.floor(Math.random() * (max - min + 1 ) + 1);
    }

    addPlayer(player) {
        this.#players.push(player);
    }

    start() {
        this.#canvas.drawBoard();
        this.drawFirstPlayer();
        this.#canvas.drowCurrentPlayerName();
        this.setEvents();
        
    }

}

window.onload = function() {
    const player1   = new Player('zosia');
    const player2   = new Player('tosia');
    const canvas    = new Canvas('game');

    const game = new Game(canvas);
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.start();
}