import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {rusheeList} from "./rushees"

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rushees: [],
      rushee_1: "",
      rushee_2: "",
      action: "",
      strikes: [],
      locked: [],
      gradient: ["#ED5565", "#ED5A66", "#EE6068", "#EF666A", "#EF6C6C", 
                "#F0726D", "#F1786F", "#F27E71", "#F28473", "#F38A74", 
                "#F49076", "#F49678", "#F59C7A", "#F6A27B", "#F7A87D", 
                "#F7AE7F", "#F8B481", "#F9BA82", "#F9C084", "#FAC686", 
                "#FBCC88", "#FCD289", "#FCD88B", "#FDDE8D", "#FEE48F", 
                "#FFEA91", "#F5E791", "#EBE591", "#E2E391", "#D8E091", 
                "#CFDE91", "#C5DC91", "#BCD991", "#B2D792", "#A9D592", 
                "#9FD392", "#96D092", "#8CCE92", "#82CC92", "#79C992", 
                "#6FC792", "#66C593", "#5CC393", "#53C093", "#49BE93", 
                "#40BC93", "#36B993", "#2DB793", "#23B593", "#1AB394"]
    }
  }

  drop = () => {
    var newState = this.state;
    var indexOfRusheeToDrop = -1;
    var droppingTo = this.state.rushee_2 - 1;
    var locked = this.state.locked;

    for(var i = 0; i < newState.rushees.length; i++){
      if(newState.rushees[i].vm2.calc_rank === parseInt(this.state.rushee_1)){
          indexOfRusheeToDrop = i;
          break;
      }
    }
    if(newState.rushees[indexOfRusheeToDrop].vm2.locked === true){
      alert("Whoops, you can't drop someone who's already locked!");
      return;
    }
    if(newState.rushees[droppingTo].vm2.locked === true){
      alert("Whoops, looks like that spot is taken!");
      return;
    }
    var rusheeToDrop = newState.rushees[indexOfRusheeToDrop];

    //take rushee that is about to drop out of the rushees array
    newState.rushees.splice(indexOfRusheeToDrop, 1);
    //add rushee back into the array in the correct spot
    newState.rushees.splice(droppingTo, 0, rusheeToDrop);

    //range of move
    var lower = indexOfRusheeToDrop;
    var upper = droppingTo;

    console.log(newState.rushees);
    for(i = locked.length - 1; i >= 0; i--){
      if(locked[i].lock_index > lower && locked[i].lock_index < upper){

        //remove locked rushee from the array
        newState.rushees.splice(locked[i].lock_index - 1, 1);

        newState.rushees.splice(locked[i].lock_index, 0, locked[i].rushee);
      }
    }

    var addToLockedDueToDrop = {
      id: rusheeToDrop.id,
      lock_index: droppingTo,
      rushee: rusheeToDrop
    }

    locked.push(addToLockedDueToDrop);

    function compare(a, b){
        let comparison = 0;
        const a_index = a.lock_index;
        const b_index = b.lock_index;
        if (a_index > b_index) {
          comparison = 1;
        } else if (b_index > a_index) {
          comparison = -1;
        }
      
        return comparison;
    }

    locked.sort(compare);
    newState.rushees[droppingTo].vm2.locked = true;

    this.setState({
      locked: locked,
      rushees: newState.rushees
    })
  }

  swap = () => {
    var newState = this.state;

    var indexofRusheeToSwap_one = -1;
    var indexofRusheeToSwap_two = -1;

    for(var i = 0; i < newState.rushees.length; i++){
      if(newState.rushees[i].vm2.calc_rank === parseInt(this.state.rushee_1)){
        indexofRusheeToSwap_one = i;
      }
      else if(newState.rushees[i].vm2.calc_rank === parseInt(this.state.rushee_2)){
        indexofRusheeToSwap_two = i;
      }
    }

    if(newState.rushees[indexofRusheeToSwap_one].vm2.locked === true || newState.rushees[indexofRusheeToSwap_two].vm2.locked === true){
      alert("Whoops, looks like one of the rushees you're trying to swap is locked!");
      return;
    }

    var temp = newState.rushees[indexofRusheeToSwap_one];
    newState.rushees[indexofRusheeToSwap_one] = newState.rushees[indexofRusheeToSwap_two];
    newState.rushees[indexofRusheeToSwap_two] = temp;
    this.setState({
      rushees: newState.rushees
    });
  }

  jump = () => {
    var newState = this.state;
    var indexOfRusheeToJump = -1;
    var curr_order = this.state.rushees;
    var jumpingTo = this.state.rushee_2 - 1;
    var locked = this.state.locked;

    for(var i = 0; i < curr_order.length; i++){
        if(curr_order[i].vm2.calc_rank === parseInt(this.state.rushee_1)){
            indexOfRusheeToJump = i;
            break;
        }
    }

    if(newState.rushees[indexOfRusheeToJump].vm2.locked === true){
      alert("Whoops, looks like the rushee you're trying to jump is locked!");
      return;
    }
    if(newState.rushees[jumpingTo].vm2.locked === true){
      alert("Whoops, looks like that spot is taken!");
      return;
    }

    var rusheeToJump = curr_order[indexOfRusheeToJump];

    //remove rushee that is jumping from the rushees array
    newState.rushees.splice(indexOfRusheeToJump, 1);

    //add rushee back in the correct spot
    newState.rushees.splice(jumpingTo, 0, rusheeToJump);

    var lower = jumpingTo;
    var upper = indexOfRusheeToJump;
    for(i = 0; i < locked.length; i++){
      if(locked[i].lock_index > lower && locked[i].lock_index < upper){
        newState.rushees.splice(locked[i].lock_index + 1, 1);
        newState.rushees.splice(locked[i].lock_index, 0, locked[i].rushee);
      }
    }

    this.setState({
      rushees: newState.rushees
    })
  }

  strike = (e, id) => {
    console.log(id);
    var strikes = this.state.strikes;
    var curr_order = this.state.rushees;
    for(var i = 0; i < curr_order.length; i++){
      if(curr_order[i].id === id){
        //if the selected rushee has not already been given a strike
        if(!strikes.includes(id)){
          strikes.push(id);
        }

        //otherwise, remove selected rushee from strikes and call handleLock
        else{
          var index = strikes.findIndex(function(strike_id){
            return strike_id === id;
          });

          strikes.splice(index, 1);
          this.handleLock(id);
        }
      }
    }
    this.setState({
      strikes: strikes
    })
  }

  handleLock = (id) => {
    var curr_order = this.state.rushees;
    var lock_index = -1;
    for(var i = 0; i < curr_order.length; i++){
        if(curr_order[i].id === id){
            lock_index = i;
            break;
        }
    }
    var locked = this.state.locked;
    var locked_rushee = {
        id: id,
        lock_index: lock_index,
        rushee: curr_order[lock_index]
    }
    locked.push(locked_rushee);

    function compare(a, b){
        let comparison = 0;
        const a_index = a.lock_index;
        const b_index = b.lock_index;
        if (a_index > b_index) {
          comparison = 1;
        } else if (b_index > a_index) {
          comparison = -1;
        }
      
        return comparison;
    }

    locked.sort(compare);
    curr_order[lock_index].vm2.locked = true;
    this.setState({
      rushees: curr_order,
      locked: locked
    })
  }

  save = () => {
    var locked = this.state.locked;
    var curr_order = this.state.rushees;
    var strikes = this.state.strikes;
    var locked_rushees = [];
    var rushee_order = [];
    var striked_rushees = [];
    for(var i = 0; i < locked.length; i++){
      locked_rushees.push(locked[i].id);
    }
    for(i = 0; i < curr_order.length; i++){
      rushee_order.push(curr_order[i].id)
    }
    for(i = 0; i < strikes.length; i++){
      striked_rushees.push(strikes[i])
    }

    var body = {
      locked_rushees: locked_rushees,
      rushee_order: rushee_order,
      striked_rushees: striked_rushees
    }
    //console.log(JSON.stringify(body));
    
    fetch(window.apiHost + '/vm/update', {
      method: 'post',
      body: JSON.stringify(body),
      origin: window.apiHost,
      contentType: "application/json",
      credentials: 'include'
    }).then(function(response) {
      return response.json();
    }).then(function(data) {
      console.log('Success posting locks!', data);
    });
  }

  handleSubmit = () => {
    switch(this.state.action){
      case "swap": {
        this.swap();
        break;
      }
      case "drop": {
        this.drop();
        break;
      }
      case "jump": {
        this.jump();
        break;
      }
      default: {
        break;
      }
    }
    
    this.setState({
      rushee_1: "",
      rushee_2: "",
      action: ""
    })
  }

  handleRusheeOneChange = (event) => {
    this.setState({
      rushee_1: event.target.value
    });
  }

  handleRusheeTwoChange = (event) => {
    this.setState({
      rushee_2: event.target.value
    });
  }

  handleActionChange = (event) => {
    this.setState({
      action: event.target.value
    });
  }

  percentRank = (array, n) => {
    var L = 0;
    var S = 0;
    var N = array.length

    for (var i = 0; i < array.length; i++) {
        if (array[i] < n) {
            L += 1
        } else if (array[i] === n) {
            S += 1
        } else {

        }
    }

    var pct = (L + (0.5 * S)) / N

    return pct
}

  setColor = (rank, scoreType) => {
    //console.log(rank);
    //console.log(scoreType);
    var scoreArray = [];
    
    switch(scoreType) {
      case "rr": {
        scoreArray = this.state.rr_array;
        break;
      }
      case "ii": {
        scoreArray = this.state.ii_array;
        break;
      }
      case "gi": {
        scoreArray = this.state.gi_array;
        break;
      }
      case "bhs": {
        scoreArray = this.state.bhs_array;
        break;
      }
      case "tot": {
        scoreArray = this.state.tot_array;
        break;
      }
      default: {
        break;
      }
    }
    //console.log(scoreArray);

    const percentile = this.percentRank(scoreArray, rank);
    const gradient_index = Math.round(percentile * (this.state.gradient.length -1))


    const style = {
      backgroundColor: this.state.gradient[gradient_index]
    }

    return style;
  }

  setLockStyle = (id) => {
    for(var i = 0; i < this.state.locked.length; i++){
      if(this.state.locked[i].id === id){
        return "true";
      }
    }
    for(var i = 0; i < this.state.strikes.length; i++){
      if(this.state.strikes[i] === id){
        return "strike";
      }
    }
      return "false";
  }

  setRank = (vm2) => {
    if("curr_rank" in vm2){
      return vm2.curr_rank;
    }
    else{
      return vm2.calc_rank;
    }
  }

  loadSide = (arr, side) => {
      const table = arr.map(user => 
        <div className={"vm2-row " + side} id={this.setLockStyle(user.id)} key={user.vm2.calc_rank}>
            <div className="vm-rank" id="r-rank">{/*this.setRank(user.vm2)*/ user.vm2.calc_rank}</div>
            <div className="vm-name" id="name">{user.name}</div>
            <div className="vm-rr" id="rr" style={this.setColor(user.vm2.rr, "rr")}>{user.vm2.rr}</div>
            <div className="vm-ii" id="ii" style={this.setColor(user.vm2.ii, "ii")}>{user.vm2.ii}</div>
            <div className="vm-gi" id="gi" style={this.setColor(user.vm2.gi, "gi")}>{user.vm2.gi}</div>
            <div className="vm-bhs" id="bhs" style={this.setColor(user.vm2.bhs, "bhs")}>{user.vm2.bhs}</div>
            <div className="vm-tot" id="tot" style={this.setColor(user.vm2.total, "tot")}>{user.vm2.total}</div>
            <div className="buttons">
              <button onClick={(e) => {this.strike(e, user.id)}} className="strike-button">S</button>
              &nbsp;&nbsp;
              <button onClick={(e) => {this.handleLock(user.id)}} className="lock-button">L</button>
            </div>
        </div>)
      return table;
  }

  loadOriginalRankColumn = (start, end) => {
    //definitely a better way to do this... but will figure out later
    var indices = [];
    for(start; start < end; start++){
        indices.push(start + 1);
    }
    const table = indices.map(element => <div className={"vm2-row og-rank"} key={element}>{element}</div>);
    return table;
  }

  componentWillMount() {

    if(this.state.rushees.length === 0){

      /*
      fetch(window.apiHost + '/vm/scores', {
        method: 'GET',
        origin: window.apiHost,
        credentials: 'include'  
      })
      .then((response) => {
        var jsonresponse = response.json()
        console.log(jsonresponse);
        return jsonresponse;
      })
      .then(myJson => {
        console.log(myJson);
      */



        var rushees = rusheeList;

        function compare(a, b){
          let comparison = 0;
          var a_index = a.vm2.calc_rank;
          var b_index = b.vm2.calc_rank;

          if(a.vm2.hasOwnProperty('curr_rank')){
            a_index = a.vm2.curr_rank;
          }
          if(b.vm2.hasOwnProperty('curr_rank')){
            b_index = b.vm2.curr_rank;
          }

          if (a_index > b_index) {
            comparison = 1;
          } else if (b_index > a_index) {
            comparison = -1;
          }
        
          return comparison;
        }
  
        rushees.sort(compare);
        console.log(rushees);

        /*
        var original_order = myJson.rushees;
        function compare_calc_rank(a, b){
          let comparison = 0;
          const a_index = a.vm2.calc_rank;
          const b_index = b.vm2.calc_rank;
          if (a_index > b_index) {
            comparison = 1;
          } else if (b_index > a_index) {
            comparison = -1;
          }
        
          return comparison;
        }

        original_order.sort(compare_calc_rank);*/


        console.log("rushees", rushees);
        const rr_array = rushees.map(rushee => { return rushee.vm2.rr })
        const ii_array = rushees.map(rushee => { return rushee.vm2.ii })
        const gi_array = rushees.map(rushee => { return rushee.vm2.gi })
        const bhs_array = rushees.map(rushee => { return rushee.vm2.bhs })
        const tot_array = rushees.map(rushee => { return rushee.vm2.total })
        
        var locked = [];
        //need to set locked array IMPORTANT
        for(var i = 0; i < rushees.length; i++){
          if(rushees[i].vm2.locked === true){
            var lockedRushee = {
              id: rushees[i].id,
              lock_index: rushees[i].vm2.curr_rank - 1,
              rushee: rushees[i]
            }
            locked.push(lockedRushee);
          }
        }

        var strikes = [];

        for(i = 0; i < rushees.length; i++){
          if(rushees[i].vm2.strike === true){
            strikes.push(rushees[i].id);
          }
        }

        this.setState({
          rushees: rushees,
          locked: [],
          strikes: strikes,
          rr_array: rr_array,
          ii_array: ii_array,
          gi_array: gi_array,
          bhs_array: bhs_array,
          tot_array: tot_array
        });
        console.log(rushees)
    }

  }

  formatAdmin = () => {
    if(this.state.action === "jump" || this.state.action === "drop"){
      return "to position: ";
    }
    else{
      return "Rushee Two:";
    }
  }

  render() {
    console.log(window.apiHost);
    if(this.state.rushees.length === 0){
      return false;
    } 
    else{
      return (
        <div>
          <div id="info-left">
              <div className="og-title">
                <div className="og-rank">OR</div>
              </div>
              <div className="labels">
                <div className='vm-rank' id='r-rank'>Rank</div>
                <div className='vm-name' id='name'>Name</div>
                <div className='vm-rr' id='rr'>RR</div>
                <div className='vm-ii' id='ii'>II</div>
                <div className='vm-gi' id='gi'>GI</div>
                <div className='vm-bhs' id='bhs'>BHS</div>
                <div className='vm-tot' id='total'>TOT</div>
                <div className='vm-vote' id='vote'>ACT</div>
              </div>
          </div>
          <div id="divider"></div>
          <div id="info-right">
              <div className="og-title">
                <div className="og-rank">OR</div>
              </div>
              <div className="labels">
                <div className='vm-rank' id='r-rank'>Rank</div>
                <div className='vm-name' id='name'>Name</div>
                <div className='vm-rr' id='rr'>RR</div>
                <div className='vm-ii' id='ii'>II</div>
                <div className='vm-gi' id='gi'>GI</div>
                <div className='vm-bhs' id='bhs'>BHS</div>
                <div className='vm-tot' id='total'>TOT</div>
                <div className='vm-vote' id='vote'>ACT</div>
              </div>
          </div>
  
          <div className="left-wrapper">
          <div id="original-rank-left" className="og-rank">{this.loadOriginalRankColumn(0, 30)}</div>
            <div id="left-defaults" className="container">{this.loadSide(this.state.rushees.slice(0,30), "left")}</div>
          </div>
            <div className="right-wrapper">
              <div id="original-rank-right"  className="og-rank">{this.loadOriginalRankColumn(30, this.state.rushees.length)}</div>
              <div id="right-defaults" className="container">{this.loadSide(this.state.rushees.slice(30), "right")}</div>
          </div>
          <div className="admin-panel">
            <label>
              Action: &nbsp;
              <select value={this.state.action} onChange={this.handleActionChange}>
                <option value="choose">Choose an Action...</option>
                <option value="swap">Swap</option>
                <option value="jump">Jump</option>
                <option value="drop">Drop</option>
                <option value="set">Set Pledge Class</option>
                <option value="lock">Lock Pledge Class</option>
              </select>
              &nbsp;
              Rushee One:
              &nbsp;
              <input type="text" value={this.state.rushee_1} onChange={this.handleRusheeOneChange} />
              &nbsp;
              {this.formatAdmin()}
              &nbsp;
              <input type="text" value={this.state.rushee_2} onChange={this.handleRusheeTwoChange} />
              &nbsp;
            </label>
            <button className="submit" onClick={() => this.handleSubmit()}>Pass motion</button>
            &nbsp;
            <button className="save" onClick={() => this.save()}>Save</button>
          </div>
        </div>
      )
    }
    
  }
}
  
  // ========================================
  
  ReactDOM.render(
    <Table />,
    document.getElementById('root')
  );
  