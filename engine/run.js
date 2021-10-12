import {Canvas} from './Canvas.js';
import {Player} from './Player.js';
import {Game} from './Game.js';

window.onload = function() {
    const player1   = new Player('zosia');
    const player2   = new Player('tosia');
    const canvas    = new Canvas('game');

    const game = new Game(canvas);
    game.addPlayer(player1);
    game.addPlayer(player2);
    console.log(game);
    game.start();
}