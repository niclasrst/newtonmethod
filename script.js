// main board
const board = JXG.JSXGraph.initBoard('box', { boundingbox: [-10, 10, 10, -10], axis: false, grid: true });

// x & y axis
let ax = board.create('axis', [[0, 0], [1, 0]], { strokeColor: 'black' });
let ay = board.create('axis', [[0, 0], [0, 1]], { strokeColor: 'black' });

// function graph g
let g = board.create('functiongraph', [(x) => { return graph(x); }], { strokeWidth: 2, strokeColor: 'blue', dash: 0 });

// x_0 'glider' (point) on x axis
const start = 3;
let x = board.create('glider', [start, 0, ax], { name: 'x_{0}', strokeColor: 'grey', fillColor: 'white' });

drawFunc(document.getElementById('function').value);
newtonMethod(x, steps, board);
board.addHook(xvals);

// write approximated x values to table
function xvals() {
    for (i = 0; i < steps; i++) { document.getElementById('xv' + i).innerHTML = (board.select('x_{' + i + '}').X()).toFixed(14); }
}

// newton method
function newtonMethod(p, loops, board) {
    if (loops > 0) {
        // f(x_n) points (fixed on graph)
        let f = board.create('glider', [() => { return p.X(); }, () => { return graph(p.X()) }, g], { name: '', strokeColor: 'red', fillColor: 'red', size: 2 });
        // connection between x_n and f(x_n)
        let l = board.create('line', [p, f], { strokeWidth: 0.5, dash: 1, straightFirst: false, straightLast: false, strokeColor: 'black' });
        // tangent at f(x_n)
        let t = board.create('tangent', [f], { strokeWidth: 0.5, strokeColor: '#0080c0', dash: 0 });
        // x_0, x_1, x_2, ... x_n (on x Axis)
        let x = board.create('intersection', [ax, t, 0], { name: 'x_{' + (steps - loops + 1) + '}', strokeColor: 'black', fillColor: 'grey', size: 2 });
        
        // recursion call
        newtonMethod(x, --loops, board);
    }
}

// plot the graph g on the board
function drawFunc(x) {
    // get term from input
    eval("term = function(x) { return " + x + ";}");				
    
    // calculate graph and draw it
    graph = (x) => { return term(x); };
    g.Y = (x) => { return term(x); };
    
    // update graph and board
    g.updateCurve();
    board.update();
}
