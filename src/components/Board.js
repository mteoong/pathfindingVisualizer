import React, { Component } from 'react';
import './board.css';
import Pixel from './Pixel';
import dijkstraAlgorithm from '../algorithms/dijkstra';
import aStar from '../algorithms/aStar';
import bfs from '../algorithms/bfs';
import dfs from '../algorithms/dfs';

class Board extends Component {
    constructor(props){
        super(props);
        this.state={
            grid:[],
            mouseClicked:false,
            selected:"",
            start_node:null,
            end_node:null,
            visited:0,
            shortestPath:0,
            number_of_nodes:0,
        }
        this.animating = false;
        this.instantAnimation = false;
        this.pathfindAlgorithm = () => {};
    }

    componentDidMount(){
        this.makeGrid();
        window.addEventListener("resize",(e)=>{
            this.makeGrid();
        })
    }

    makeGrid = () => {
        if (this.animating) {
            return;
        }
        const gridWrapper = document.querySelector('#root');
        let row_size = Math.floor((gridWrapper.offsetHeight - 223)/27);
        let col_size = Math.min(60, Math.floor((gridWrapper.offsetWidth - 60)/27));
        let arr=[]
        for(let i = 0; i < row_size; i++){
            let row = [];
            for(let j = 0; j < col_size; j++){
                row.push({
                    value: 1,
                    row: i,
                    col: j,
                    isVisited: false,
                    isShortestPath: false,
                    isWall: false,
                    isStart: false,
                    isEnd: false,
                    instant: false,
                });
            }
            arr.push(row);
        }
        let start_x = Math.floor((row_size - 1) / 2);
        let start_y = Math.floor(col_size/ 3);
        let end_x = Math.floor((row_size - 1) / 2);
        let end_y = Math.floor(col_size * 2 / 3);
        arr[start_x][start_y].isStart = true;
        arr[end_x][end_y].isEnd = true;

        this.setState({
            grid: arr,
            start_node: [start_x, start_y],
            end_node: [end_x, end_y],
            number_of_nodes: arr.length * arr[0].length,
            visited: 0,
            shortestPath: 0,
        })
    }

    handleMouseDown = (row, col) => {
        if (this.animating) {
            return;
        }
        let arr = this.state.grid;
        if (arr[row][col].isStart) {
            this.setState({
                selected: "start"
            });
        } else if (arr[row][col].isEnd) {
            this.setState({
                selected: "end"
            });
        } else {
            if (document.querySelector("input[value='build']").checked) {
                if(!arr[row][col].isWall && !arr[row][col].isStart && !arr[row][col].isEnd) {
                    arr[row][col].isWall = true;
                }
            } else {
                if(arr[row][col].isWall){
                    arr[row][col].isWall = false;
                }
            }
        }

        this.setState({
            grid: arr,
            mouseClicked: true
        }, () => {
            if (this.instantAnimation) {
                this.instantPathfinder();
            }
        })
    }

    handleMouseEnter = (row,col) => {
        if (this.animating) {
            return;
        }
        if (this.state.mouseClicked) {
            let arr = this.state.grid;
            if (this.state.selected === "start") {
                arr[row][col].isStart = true;
                this.setState({
                    start_node: [row, col]
                })
            }
            else if (this.state.selected === "end") {
                arr[row][col].isEnd = true;
                this.setState({
                    end_node: [row, col]
                })
            }
            else if (document.querySelector("input[value='build']").checked) {
                if(!arr[row][col].isWall && !arr[row][col].isStart && !arr[row][col].isEnd) {
                    arr[row][col].isWall = true;
                }
            } 
            else {
                if(arr[row][col].isWall){
                    arr[row][col].isWall = false;
                }
            }
            this.setState({
                grid: arr,
                mouseClicked: true
            }, () => {
                if (this.instantAnimation) {
                    this.instantPathfinder();
                }
            })
        }
    }

    handleMouseLeave = (row, col) => {
        if (this.animating) {
            return;
        }
        let arr = this.state.grid;
        if (this.state.selected !== "") {
            arr[row][col].isStart = false;
            arr[row][col].isEnd = false;
            this.setState({
                grid: arr
            })
        }
    }

    handleMouseUp = () => {
        if (this.animating) {
            return;
        }
        this.setState({
            mouseClicked: false,
            selected:""
        })
    }

    clearPathfinder = () => {
        let arr = this.state.grid;
        for (let i = 0; i < arr.length; i++){
            for(let j = 0; j < arr[0].length; j++){
                let element = document.getElementById(`node-${i}-${j}`);
                element.classList.remove("node_path");
                element.classList.remove("node_visited");
                element.classList.remove("instant");
            }
        }
    }

    choosePathfinder = (pathfinder, speed) => {
        switch(pathfinder) {
            case "Dijkstra's":
                this.pathfindAlgorithm = dijkstraAlgorithm;
                break;
            case "A*":
                this.pathfindAlgorithm = aStar;
                break;
            case "bfs":
                this.pathfindAlgorithm = bfs;
                break;
            case "dfs":
                this.pathfindAlgorithm = dfs;
                break;
            default:
                break;
        }
        this.applyPathfinder(this.pathfindAlgorithm, speed);
    }

    applyPathfinder = (pathfindingFunction, speed) => {
        console.log('hi');
        this.instantAnimation = false;
        this.animating = true;
        let arr = this.state.grid;
        this.clearPathfinder();
        let pathSpeed = speed;
        let visitSpeed = Math.floor(speed/5);

        let {visited_nodes, shortestPath} = pathfindingFunction(this.state.grid, this.state.start_node, this.state.end_node);
        
        const animate = async () => {
            const animatePath = () => {
                for (let j = 0; j < shortestPath.length; j++) {
                    setTimeout(() => {
                      const node = shortestPath[j];
                      arr[node.row][node.col].isShortestPath = true;
                      document.getElementById(`node-${node.row}-${node.col}`).classList.add('node_path');
                    }, pathSpeed * j);
                }
            }

            for (let i = 0; i <= visited_nodes.length; i++) {
                if (i === visited_nodes.length) {
                    setTimeout(() => {
                        animatePath();
                      }, visitSpeed * i);
                    return;
                }
                
                setTimeout(() => {
                    const node = visited_nodes[i];
                    arr[node.row][node.col].isVisited = true;
                    document.getElementById(`node-${node.row}-${node.col}`).classList.add('node_visited');
                }, visitSpeed * i);
            }
            
            this.setState({
                grid:arr,
                visited:visited_nodes.length,
                shortestPath:shortestPath.length
            })
        }   
        animate().then(()=> {
            setTimeout(() => {
                this.animating = false;
                this.instantAnimation = true;
            }, visited_nodes.length * visitSpeed + shortestPath.length * pathSpeed + 500);
        });
    }

    instantPathfinder = () => {
        if (this.animating) {
            return;
        }
        let arr = this.state.grid;
        this.clearPathfinder();

        let {visited_nodes, shortestPath} = this.pathfindAlgorithm(this.state.grid, this.state.start_node, this.state.end_node);
        console.log(visited_nodes);

        for (let i = 0; i < visited_nodes.length; i++) {            
            let node = visited_nodes[i];
            arr[node.row][node.col].isVisited = true;
            arr[node.row][node.col].instant = true;
            document.getElementById(`node-${node.row}-${node.col}`).classList.add('node_visited', 'instant');
        }   

        for (let j = 0; j < shortestPath.length; j++) {
            let node = shortestPath[j];
            arr[node.row][node.col].isShortestPath = true;
            arr[node.row][node.col].instant = true;
            document.getElementById(`node-${node.row}-${node.col}`).classList.add('node_path', 'instant');
        }

        this.setState({
            grid:arr,
            visited:visited_nodes.length,
            shortestPath:shortestPath.length
        })
    }

    render() {
        let tr_style = {display:"table-row"}
        return(
            <div className="board-wrapper">
              <table cellSpacing="0">
                {
                  this.state.grid.map((row,index)=>{
                    return(
                      <tr style={tr_style}>
                        {
                          row.map((element,i)=>{
                            return(
                              <Pixel 
                                value={element}
                                isWall={element.isWall}
                                isStart={element.isStart}
                                isEnd={element.isEnd}
                                isVisited={element.isVisited}
                                isShortestPath={element.isShortestPath}
                                instant={element.instant}
                                key={i}
                                row={index}
                                col={i}
                                onMouseDown={(row,col)=>this.handleMouseDown(row,col)}
                                onMouseEnter={(row,col)=>this.handleMouseEnter(row,col)}
                                onMouseUp={()=>this.handleMouseUp()}
                                onMouseLeave={(row,col)=>this.handleMouseLeave(row,col)}
                              />
                            )
                          })
                        }
                      </tr>
                    )
                  })
                }
              </table>
            </div>
        )
    }
}

export default Board;