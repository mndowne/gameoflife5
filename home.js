class Menu extends React.Component {
    constructor(props) {
        super(props);

    }

    render(){
        return(
                <div id="menu">
                <div id="start" onClick={this.props.start}>Start</div>
                <div id="clear" onClick={this.props.clear}>Clear</div>
                <div id="generation">Generation {this.props.generation}</div>
                </div>
              );
    }
}





class Square extends React.Component{
    constructor(props) {
        super(props);
        this.state = {live: false, squareDisplay: {backgroundColor: 'black'}};

        this.toggleLive = this.toggleLive.bind(this);
        //this.liveToggle = this.liveToggle.bind(this);
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

        this.state = {xAxis : 50, yAxis: 50, rowStyle: {height: "12px"}};

        this.board;
        this.liveOrDead;
        this.running = this.running.bind(this);
        this.changeLife = this.changeLife.bind(this);
        this.resetNeighbors = this.resetNeighbors.bind(this);
    }


    makeBoard(){
        var colum = [];
        var row = [];
        var livecolum = [];
        var liverow = [];

        for (var i = 0; i < this.state.xAxis; i++){
            row = [];
            liverow = [];

            for (var j = 0; j < this.state.yAxis; j++){
                row.push(<Square row={j} colum={i} liveOrDead={0} changeLife={this.changeLife}/>);
                liverow.push(0);   // 0 is for dead,     1 is for live
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
        var nRow = [];
        var nColum = [];
        for (var i = 0; i < this.state.xAxis; i++){
            nRow = [];
            for (var j = 0; j < this.state.yAxis; j++){
                nRow.push(0);
            }
            nColum.push(nRow);
        }
        return nColum;
    }

    running(oldBoard){

        var prevBoard = oldBoard;
        var currBoard = oldBoard;
        var liveNeighbors = this.resetNeighbors();
        for (var i = 0; i < this.state.xAxis; i++){
            var topColum = (i + 1) % this.state.xAxis;
            var bottomColum = (i - 1) % this.state.xAxis;
            if(bottomColum == -1){
                bottomColum = 49;
            }
            for (var j = 0; j < this.state.yAxis; j++){
                var topRow = (j + 1) % this.state.yAxis;
                var bottomRow = (j - 1) % this.state.yAxis;
                if (bottomRow == -1){
                    bottomRow = 49;
                }
                liveNeighbors[i][j] = prevBoard[topColum][j] + prevBoard[topColum][topRow] + prevBoard[topColum][bottomRow] + 
                    prevBoard[i][topRow] + prevBoard[i][bottomRow] +
                    prevBoard[bottomColum][topRow] + prevBoard[bottomColum][bottomRow] + prevBoard[bottomColum][j];
            }
        }
        ////////
        ////////
        for (var ii = 0; ii < this.state.xAxis; ii++){
            for (var jj = 0; jj < this.state.yAxis; jj++){
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
        for (var g = 0; g < this.state.xAxis; g++){
            for (var c = 0; c < this.state.yAxis; c++){
                this.board[g][c] = <Square row={c} colum={g} liveOrDead={currBoard[g][c]} changeLife={this.changeLife}/>;
            }
        }
        this.liveOrDead = currBoard;
        console.log('bye')
    }

    componentWillReceiveProps(nextProps){
        if(this.props.generation != nextProps.generation){
            this.running(this.liveOrDead);
        }
    }

    render(){
        if (this.props.generation == 0){
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
        this.state = {generation : 0}

        this.start = this.start.bind(this);
        this.clear = this.clear.bind(this);
    }

    start(){
        this.setState((prevState, props) => ({generation : prevState.generation + 1}));
    }

    clear(){
        this.setState({generation: 0});
    }

    render(){
        return (
                <div id="house">
                <Menu start={this.start} generation={this.state.generation} clear={this.clear}/>
                <Board generation={this.state.generation}/>
                </div>
               );
    }
}

const apptag = document.getElementById('app');
ReactDOM.render(<App /> , apptag)
