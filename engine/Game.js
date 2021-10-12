export class Game {
    
    #players = [];
    #currentPlayer;
    #canvas;
    #figurePlayer = [];
    #figureList = ['cross', 'circle'];
    
    playersnumber = 2;


    constructor(canvas) {
        this.#canvas = canvas;
    }

    setEvents() {
        this.#canvas.getBoard().addEventListener('click', (e) => {
            // get positon from click place
            let rect                    = e.target.getBoundingClientRect();
            let drawRange               = this.#canvas.getDrawRange();
            let fieldsStartStopPosition = this.calculateFieldsStartStopPosition();

            if(e.clientY >= rect.y + drawRange.topStart && 
                e.clientY <= rect.y + drawRange.topEnd &&
                e.clientX >= rect.x + drawRange.leftStart &&
                e.clientX <= rect.x + drawRange.leftEnd) {
                    // I'm inside board
                    let positionXOnGamePlane = e.clientX - rect.x - drawRange.leftStart;
                    let positionYOnGamePlane = e.clientY - rect.y - drawRange.topStart;
                    
                    fieldsStartStopPosition.forEach((item) => {
                        if(
                            item.startX < positionXOnGamePlane && 
                            item.endX >= positionXOnGamePlane &&
                            item.startY < positionYOnGamePlane &&
                            item.endY >= positionYOnGamePlane
                        ) {
                          // ustawiam figure w polu pole
                          
                            this.drawPlayerFigure({
                                startX: drawRange.leftStart + item.startX, 
                                startY: drawRange.topStart + item.startY
                            });
                        }
                        
                    });
                    /*
                    console.log('X:');
                    console.log(positionXOnGamePlane);
                    console.log('Y:');
                    console.log(positionYOnGamePlane);
                    */
                    /*
                    console.log('X:');
                    console.log(e.clientX - rect.x + drawRange.leftStart);
                    console.log('Y:');
                    console.log(e.clientY - rect.y + drawRange.topStart);
                    console.log('jestem na mapie i obliczam na którym polu jestem ');
                    console.log('potem dodaje ');
                    */
            }

        });
    }

    drawPlayerFigure(fieldPosition) {
        
        if(this.#figurePlayer[this.#currentPlayer] == 'cross') {
            this.#canvas.drowCross(fieldPosition);
        }

        if(this.#figurePlayer[this.#currentPlayer] == 'circle') {
            this.#canvas.drowCircle(fieldPosition);
        }
    }
    
    drawFirstPlayer() {
        this.#currentPlayer = Math.floor(Math.random() * this.playersnumber);
    }

    setFigurePlayer() {
        
        for(let i = 0; i < this.playersnumber; i++) {
            
            if(this.#currentPlayer == i) {
                this.#figurePlayer[i] = this.#figureList[0];
                continue;
            }

            this.#figurePlayer[i] = this.#figureList[1];
        }
    }

    calculateFieldsStartStopPosition() {
        let matrix            = [];

        const fieldsInColums  = this.#canvas.getFieldsInColumn();
        const fieldsInRows    = this.#canvas.getFieldsInLine();
        const drawRange       = this.#canvas.getDrawRange();
        const borderWidth     = this.#canvas.getBorderFields();
        

        ////////////
        // size
        //////////
        const gamePlateWidth  = drawRange.topEnd - drawRange.topStart;
        const gamePlateHeight = drawRange.leftEnd - drawRange.leftStart;

        ////////////////////////
        // total fields count
        //////////////////////
        const totalFieldsCount = fieldsInColums * fieldsInRows;

        ////////////
        // border
        //////////
        const totalRowBorderWidth     = borderWidth * ( fieldsInRows - 1 );
        const totalColumnBorderWidth  = borderWidth * ( fieldsInColums - 1 );

        //////////////
        // calculate
        ////////////
        let calculateFieldWidth     = ( gamePlateWidth - totalRowBorderWidth ) / fieldsInRows;
        let calculateFieldHeight    = ( gamePlateHeight - totalColumnBorderWidth ) / fieldsInColums;

        calculateFieldWidth = Math.floor(calculateFieldWidth);
        calculateFieldHeight = Math.floor(calculateFieldHeight);
        
        //////////////////
        // fillin matrix
        ////////////////
        let multiplerX = 0;
        let multiplerY = 0;

        for(let i = 1; i <= totalFieldsCount; i++) {
            let startX      = ( calculateFieldWidth * multiplerX ) + ( borderWidth *  multiplerX );
            let startY      = ( calculateFieldHeight * multiplerY ) + ( borderWidth *  multiplerY );
            let endX        = startX + calculateFieldWidth;
            let endY        = startY + calculateFieldHeight;
            
            matrix.push({
                startX: startX,
                startY: startY,
                endX: endX,
                endY: endY
            });

            multiplerX++;

            if( i % fieldsInRows == 0) {
                multiplerX = 0;
                multiplerY++;
            }
        }

        return matrix;
    }

    addPlayer(player) {
        this.#players.push(player);
    }

    start() {


        this.#canvas.drawBoard();
        this.drawFirstPlayer();
        this.setFigurePlayer();
        let playerName = this.#players[this.#currentPlayer].name;
        this.#canvas.drowText(playerName);
        this.setEvents();
    }

}