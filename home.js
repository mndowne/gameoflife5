var screenSize = document.getElementById('screenSize');
var style = window.getComputedStyle(screenSize);
var width1 = style.getPropertyValue('width');
var width = Number(width1.substring(0, width1.length - 2));
var xAxis = 50;
var yAxis = 50;

if (width > 1200){
    xAxis = 30;
    yAxis = 83;
}
else if (width > 610){
    xAxis = 30;
    yAxis = 50;
}
else if (width > 400){
    xAxis = 25;
    yAxis = 33;
}
else {
    xAxis = 20;
    yAxis = 25;
}


class Menu extends React.Component {
    constructor(props) {
        super(props);

    }


    render(){
        return(
                <div id="menu">
                <div id="start" onClick={this.props.start}>Start</div>
                <div id="clear" onClick={this.props.clear}>Clear</div>
                <div id="step" onClick={this.props.step}>Step</div>
                <div id="generation">Generation {this.props.generation}</div>
                <div id="stop" onClick={this.props.stop}>Stop</div>
                <div id="fast" onClick={this.props.fast}>Fast</div>
                <div id="medium" onClick={this.props.medium}>Medium</div>
                <div id="slow" onClick={this.props.slow}>Slow</div>
                <div id="randomBoard" onClick={this.props.randomBoard}>Random Board</div>
                </div>
              );
    }
}





class Square extends React.Component{
    constructor(props) {
        super(props);
        this.state = {live: false, squareDisplay: {backgroundColor: 'black'}};

        this.toggleLive = this.toggleLive.bind(this);
    }


    toggleLive(){
        if (this.state.live == true){
            this.setState({live : false, squareDisplay: {backgroundColor: 'black'}});
            this.props.changeLife(this.props.colum, this.props.row, 0);
        }
        else{
            this.setState({live : true, squareDisplay: {backgroundColor: 'red'}});
            this.props.changeLife(this.props.colum, this.props.row, 1);
        }
    }


    componentWillReceiveProps(nextProps){
        if (nextProps.liveOrDead === 0 ){
            this.setState({live : false, squareDisplay: {backgroundColor: 'black'}});
        }
        else
            this.setState({live : true, squareDisplay: {backgroundColor: 'red'}});

    }


    render() {
        return <div className="square" onClick={this.toggleLive} style={this.state.squareDisplay}></div>;
    }
}





class Board extends React.Component {
    constructor(props) {
        super(props);

        this.board;
        this.liveOrDead;
        this.emptyBoard;

        this.running = this.running.bind(this);
        this.changeLife = this.changeLife.bind(this);
        this.resetNeighbors = this.resetNeighbors.bind(this);
        this.randomBoard = this.randomBoard.bind(this);
    }



    makeBoard(){
        var colum = [];
        var row = [];
        var livecolum = [];
        var liverow = [];

        for (var i = 0; i < this.props.xAxis; i++){
            row = [];
            liverow = [];

            for (var j = 0; j < this.props.yAxis; j++){
                row.push(<Square row={j} colum={i} liveOrDead={0} changeLife={this.changeLife}/>);
                liverow.push(0);   // 0 is for dead,     1 is for live
            }
            colum.push(row);
            livecolum.push(liverow);
        }

        this.board = colum;
        this.liveOrDead = livecolum;
    }


    randomBoard(){
        var colum = [];
        var row = [];
        var livecolum = [];
        var liverow = [];
        var randomState = 0;

        for (var i = 0; i < this.props.xAxis; i++){
            row = [];
            liverow = [];

            for (var j = 0; j < this.props.yAxis; j++){
                randomState = Math.round(Math.random());
                row.push(<Square row={j} colum={i} liveOrDead={randomState} changeLife={this.changeLife}/>);
                liverow.push(randomState);   // 0 is for dead,     1 is for live
            }
            colum.push(row);
            livecolum.push(liverow);
        }

        this.board = colum;
        this.liveOrDead = livecolum;
    }


    changeLife(colum, row, value){
        this.board[colum][row] = <Square row={row} colum={colum} liveOrDead={value} changeLife={this.changeLife}/>;
        this.liveOrDead[colum][row] = value;
    }


    resetNeighbors(){
        var nColum = this.emptyBoard;
        return nColum;
    }

    setNeighbors(){
        var nRow = [];
        var nColum = [];
        for (var i = 0; i < this.props.xAxis; i++){
            nRow = [];
            for (var j = 0; j < this.props.yAxis; j++){
                nRow.push(0);
            }
            nColum.push(nRow);
        }
        this.emptyBoard = nColum;
    }


    running(oldBoard){

        var prevBoard = oldBoard;
        var currBoard = oldBoard;
        var liveNeighbors = this.resetNeighbors();
        for (var i = 0; i < this.props.xAxis; i++){
            var topColum = (i + 1) % this.props.xAxis;
            var bottomColum = (i - 1) % this.props.xAxis;
            if(bottomColum == -1){
                bottomColum = this.props.xAxis -1;
            }
            for (var j = 0; j < this.props.yAxis; j++){
                var topRow = (j + 1) % this.props.yAxis;
                var bottomRow = (j - 1) % this.props.yAxis;
                if (bottomRow == -1){
                    bottomRow = this.props.yAxis -1;
                }
                liveNeighbors[i][j] = prevBoard[topColum][j] + prevBoard[topColum][topRow] + prevBoard[topColum][bottomRow] + 
                    prevBoard[i][topRow] + prevBoard[i][bottomRow] +
                    prevBoard[bottomColum][topRow] + prevBoard[bottomColum][bottomRow] + prevBoard[bottomColum][j];
            }
        }
        for (var ii = 0; ii < this.props.xAxis; ii++){
            for (var jj = 0; jj < this.props.yAxis; jj++){
                if (prevBoard[ii][jj] == 1 && liveNeighbors[ii][jj] <= 1){
                    currBoard[ii][jj] = 0;
                }
                else if (prevBoard[ii][jj] == 1 && liveNeighbors[ii][jj] > 3.5){

                    currBoard[ii][jj] = 0;
                }
                else if (prevBoard[ii][jj] == 0 && liveNeighbors[ii][jj] == 3){
                    currBoard[ii][jj] =  1;
                }
            }
        }
        for (var g = 0; g < this.props.xAxis; g++){
            for (var c = 0; c < this.props.yAxis; c++){
                this.board[g][c] = <Square row={c} colum={g} liveOrDead={currBoard[g][c]} changeLife={this.changeLife}/>;
            }
        }
        this.liveOrDead = currBoard;
    }


    componentWillReceiveProps(nextProps){
        if(this.props.generation != nextProps.generation){
            this.running(this.liveOrDead);
        }

        if (this.props.randomBoard != nextProps.randomBoard && this.props.randomBoard != 0){
            this.randomBoard();
        }
    }


    render(){

        if (this.props.randomBoard > 0 && this.props.generation == 0){
            this.setNeighbors();
            this.randomBoard();
        }
        else if (this.props.generation == 0){
            this.setNeighbors();
            this.makeBoard();
        }
        return(
                <div id="board">
                {this.board}
                </div>
              );
    }
}





class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {generation : 0, speed: 100}

        this.start = this.start.bind(this);
        this.step = this.step.bind(this);
        this.clear = this.clear.bind(this);
        this.slow = this.slow.bind(this);
        this.medium = this.medium.bind(this);
        this.fast = this.fast.bind(this);
        this.stop = this.stop.bind(this);
        this.randomBoard = this.randomBoard.bind(this);

        this.interval = null;
        this.rb = 1;
        this.freshStart = 0;
    }


    fast(){
        clearInterval(this.interval);
        document.getElementById('fast').style.backgroundColor= "rgb(230,250,85)";
        document.getElementById('medium').style.backgroundColor= "rgb(160,160,60)";
        document.getElementById('slow').style.backgroundColor= "rgb(160,160,60)";
        this.setState({speed : 100});
    }


    medium(){
        document.getElementById('medium').style.backgroundColor= "rgb(230,250,85)";
        document.getElementById('fast').style.backgroundColor= "rgb(160,160,60)";
        document.getElementById('slow').style.backgroundColor= "rgb(160,160,60)";
        clearInterval(this.interval);
        this.setState({speed : 300});
    }


    slow(){
        document.getElementById('slow').style.backgroundColor= "rgb(230,250,85)";
        document.getElementById('fast').style.backgroundColor= "rgb(160,160,60)";
        document.getElementById('medium').style.backgroundColor= "rgb(160,160,60)";
        clearInterval(this.interval);
        this.setState({speed : 550});
    }


    start(){
        clearInterval(this.interval);
        this.interval = setInterval(() => {this.step()}, this.state.speed);
    }


    stop(){
        clearInterval(this.interval);
    }


    step(){
        this.setState((prevState, props) => ({generation : prevState.generation + 1}));
    }


    clear(){
        this.rb = 0;
        this.setState({generation: 0});
    }


    randomBoard(){
        this.setState({generation: 0});
        this.rb = this.rb + 1;
    }


    render(){
        if (this.freshStart == 0){
            this.start();
            this.freshStart = 1;
        }
        return (
                <div id="house">
                <Menu step={this.step} 
                start={this.start} 
                generation={this.state.generation} 
                clear={this.clear}
                fast={this.fast}
                medium={this.medium}
                slow={this.slow}
                stop={this.stop}
                randomBoard={this.randomBoard}
                />
                <Board generation={this.state.generation} randomBoard={this.rb} xAxis={this.props.xAxis} yAxis={this.props.yAxis}/>
                </div>
               );
    }
}


const apptag = document.getElementById('app');
ReactDOM.render(<App xAxis={xAxis} yAxis={yAxis} /> , apptag)
