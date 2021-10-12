export class Canvas {
    #fields;
    #board;
    #boardPosition  = {top: 100, left: 100};
    #boardContext;
    #fieldWidth;
    #fieldHeight;
    #borderFields   = 0;
    #fieldsInLine   = 0;
    #fieldsInColumn = 0;
    #fieldMarkerProportion = 0.6;

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

    getFieldsInLine() {
        return this.#fieldsInLine;
    }

    getFieldsInColumn() {
        return this.#fieldsInLine;
    }

    getBorderFields() {
        return this.#borderFields;
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
        this.configureContext();
        
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

    drowCircle(fieldPosition) {
        let circleR = Math.floor(( this.#fieldWidth * this.#fieldMarkerProportion ) / 2);
        this.#boardContext.beginPath();

        this.#boardContext.arc(fieldPosition.startX, fieldPosition.startY, circleR, 0, 2 * Math.PI);
        this.#boardContext.stroke();
    }

    drowCross(fieldPosition) {
        const crossWidth    = Math.floor( this.#fieldWidth * this.#fieldMarkerProportion );
        const crossHeight   = Math.floor( this.#fieldHeight * this.#fieldMarkerProportion );
        const marginLeft    = Math.floor( ( this.#fieldWidth * ( 1 - this.#fieldMarkerProportion) ) / 2 );
        const marginTop     = Math.floor( ( this.#fieldHeight * ( 1 - this.#fieldMarkerProportion) ) / 2 ) ;

        const startX = fieldPosition.startX;
        const startY = fieldPosition.startY;
        
        const line1 = {
            leftStart: startX + marginLeft,
            topStart: startY + marginTop,
            leftEnd: startX + marginLeft + crossWidth,
            topEnd: startY + marginTop + crossHeight
        };

        const line2 = {
            leftStart: startX + marginLeft,
            topStart: startY + marginTop + crossHeight,
            leftEnd: startX + marginLeft + crossWidth,
            topEnd: startY + marginTop
        };

        this.drawLine(line1);
        this.drawLine(line2);
    }

    makeMatrix(gameFieldsQuantity) {
        this.fields = Array.from(Array(gameFieldsQuantity).keys())
    }

    drowText(textToFill) {
        this.#boardContext.font = "20px Georgia";
        const textContainerMargin       = 20;
        const textContainerTop          = this.#board.height - textContainerMargin;
        const textContainerWidth        = this.#board.width - ( textContainerMargin * 2 );
        const centerContainerPosition   = this.#board.width / 2 ;
        
        // center context to start position
        this.#boardContext.textAlign = "center";
        this.#boardContext.fillText(textToFill, centerContainerPosition, textContainerTop, textContainerWidth);
    }
}