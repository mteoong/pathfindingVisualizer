import React, { Component } from 'react';
import './toolbar.css';
import customDropdown from "./style";
import Board from "./Board";

class Toolbar extends Component {
    constructor(props) {
      super(props);
      this.child = React.createRef();
    }
  
    componentDidMount() {
        customDropdown();
    }

    pathfinder = () => {
        let selected = document.querySelector(".custom-options.pathfinder > .selected");
        let selectedText = selected.textContent;
        switch(selectedText){
            case "Dijkstra's":
                this.child.current.dijkstra();
                break;
            default:
              return;
        }
    }
    
    mazeGenerator = () => {

    }

    render() {
        return(
          <div className="body-wrapper">
            <div className="toolbar-wrapper">
                <div className="choose-pathfinder toolbar-section">
                  <h2 className="toolbar-h2"> Pathfinding Algorithm </h2>
                  <div className="custom-select-wrapper">
                    <div className="custom-select">
                      <div className="custom-select__trigger"><span className="selected">Select</span>
                      </div>
                      <div className="custom-options pathfinder">
                        <span className="custom-option selected" data-value="Dijkstra's">Dijkstra's</span>
                        <span className="custom-option" data-value="A*">A*</span>
                        <span className="custom-option" data-value="Breadth First Search">Breadth First Search</span>
                        <span className="custom-option" data-value="Depth First Search">Depth First Search</span>
                      </div>
                    </div>
                  </div>
                  <div className="run" onClick={this.pathfinder}> Run! </div>
                </div>
                <div className="choose-pathfinder toolbar-section">
                  <h2 className="toolbar-h2"> Maze Generating Algorithm </h2>
                  <div className="custom-select-wrapper">
                    <div className="custom-select">
                          <div className="custom-select__trigger"><span className="selected">Select</span>
                          </div>
                          <div className="custom-options mazeGenerator">
                              <span className="custom-option selected" data-value="Random">Random</span>
                              <span className="custom-option" data-value="Recursive Division Horizontal">Recursive Division</span>
                              <span className="custom-option" data-value="Prim's">Prim's</span>
                          </div>
                      </div>
                  </div>
                  <div className="run" onClick={this.mazeGenerator}> Run! </div>
                </div>
                <div>
                  <h2 className="toolbar-h2"> Select Marking Tool </h2>
                  <form className="marking-tool">
                    <input type="radio" id="build" name="marker" value="build" defaultChecked={true}/>
                    <label htmlFor="build"> Build Walls </label>
                    <input type="radio" id="erase" name="marker" value="erase"/>
                    <label htmlFor="erase"> Erase Walls </label>
                  </form>
                </div>
                <div>
                  <h2 className="toolbar-h2"> Clear </h2>
                      <div className="clear"> Clear Walls </div>
                </div>
              </div>
            <Board ref={this.child} />
          </div>
        )
    }
}

export default Toolbar;