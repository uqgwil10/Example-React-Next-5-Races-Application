import React, {
  Component
} from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import myData from './data.json';




class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeRace: null,
      active: null,
      time: {},
      seconds: 5
    };
    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
    this.activeRace = this.activeRace.bind(this);

    //Getting the data in the right formatt
    this.filteredData = [];
    var sortedData = [];
    myData.forEach(function(meeting, index) {
      meeting.races.forEach(function(race, index) {
        let tempRace = race;
        let fullDate = new Date(tempRace.closeTime);
        tempRace.location = meeting.location;
        tempRace.meetingType = meeting.meetingType;
        tempRace.meetingNumber = meeting.meeting;
        tempRace.fullDate = (fullDate.getDate() + "/" + (fullDate.getMonth() + 1) + "/" + fullDate.getFullYear() + "  " + fullDate.getHours() + ":" + fullDate.getMinutes());
        sortedData.push(tempRace)
      })
    });
    sortedData.sort(function(a, b) {
      return new Date(a.closeTime) - new Date(b.closeTime);
    });
    this.sortedData = sortedData;
    this.currentPosition = 0;

    for (;
      (this.currentPosition < this.sortedData.length) && (this.filteredData.length !== 5); this.currentPosition++) {

      if ((new Date(this.sortedData[this.currentPosition].closeTime).getTime() - new Date().getTime()) > 0) {

        this.filteredData.push(this.sortedData[this.currentPosition])
      }
    }

    this.startTimer();
  }

  startTimer() {
    if (this.timer === 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  activeRace(race) {

    this.state.activeRace = race;

  }

  countDown() {
    // Remove one second, set state so a re-render happens.
    let removeIndex = [];
    this.filteredData.forEach(function(race, index) {

      var newCloseTime = race.closeTime - 1;
      race.closeTime = newCloseTime;
      if ((new Date(race.closeTime).getTime() - new Date().getTime()) < 0) {
        removeIndex.push(index);
      }
    });
    if (removeIndex.length > 0) {
      this.filteredData.shift(removeIndex[0]);
      //Adds new race to the currently viewing list.
      for (;
        (this.currentPosition < this.sortedData.length) && (this.filteredData.length !== 5); this.currentPosition++) {
        if ((new Date(this.sortedData[this.currentPosition].closeTime).getTime() - new Date().getTime()) > 0) {

          this.filteredData.push(this.sortedData[this.currentPosition])
        }
      }
    }
    // Updates the view
    this.forceUpdate();
  }
  render() {
      var activeRace = this.activeRace;
      var races = this.filteredData.map(function(race, index) {
        return ( <
          tr key = {
            index
          }
          onClick = {
            (e) => activeRace(index, e)
          } >
          <td>{race.raceNumber}</td><td>{race.meetingNumber}</td><td>{race.fullDate}</td><td>{race.location}</td><td>{race.meetingType}</td><td>{
            Math.floor(((new Date(race.closeTime).getTime() - new Date().getTime()) / 1000 / 3600))}Hrs {Math.floor(((new Date(race.closeTime).getTime() - new Date().getTime()) / 1000 / 60)) % 60}mins{Math.floor(((new Date(race.closeTime).getTime() - new Date().getTime()) / 1000)) % 60}seconds</td></tr>
        );
      });



      const active = this.state.activeRace;
      var currentRace = this.filteredData[this.state.activeRace] || ["competitiors": []];
      var currentRaceCompetitors = currentRace.competitors || [];
      var currentCompetitors = currentRaceCompetitors.map(function(competitor, index) {

        return ( <
          div className = "col-md-4 col-sm-6" >
          <
          div className = "card" >
          <
          div className = "card-body" >
          <
          h4 className = "card-title" > {
            competitor.name
          } < /h4> <
          p className = "card-text" > Position number: {
            competitor.positionNumber
          } < /p> < /
          div > <
          /div> < /
          div >
        );
      });

      var content = function() {
        if (active == null) {
          return ( < div > < h1 className = "title" > Next 5 races < /h1>< table className = "table"
              styles = {
                {
                  width: '100%'
                }
              } >
              <tbody><tr><th>Race number</th><th>Meeting number</th><th>Date</th><th>Location</th><th>Meeting type</th><th>Count down</th></tr>{races}</tbody></table>  </div > );
      }
      else {
        return ( < div >

          <
          div className = "container" >
          <
          div className = "row" >
          <
          h2 className = "title" > Race details < /h2> <
          div className = "col-sm-1" >
          <
          button className = "btn btn-primary"
          onClick = {
            (e) => activeRace(null, e)
          } > Back < /button> <
          /div>

          <
          div className = "col-sm-6" >

          <
          div className = "raceDetails" >
          <
          div className = "col-sm-6" >
          <
          p className = "red" > Race number < /p> < /
          div > <
          div className = "col-sm-6" >
          <
          p > {
            currentRace.raceNumber
          } < /p> < /
          div >

          <
          div className = "col-sm-6" >
          <
          p className = "red" > Location < /p> < /
          div > <
          div className = "col-sm-6" >
          <
          p > {
            currentRace.location
          } < /p> < /
          div >

          <
          div className = "col-sm-6" >
          <
          p className = "red" > Meeting Type < /p> < /
          div > <
          div className = "col-sm-6" >
          <
          p > {
            currentRace.meetingType
          } < /p> < /
          div >

          <
          div className = "col-sm-6" >
          <
          p className = "red" > Date < /p> < /
          div > <
          div className = "col-sm-6" >
          <
          p > {
            currentRace.fullDate
          } < /p> < /
          div >

          <
          div className = "col-sm-6" >
          <
          p className = "red" > Close of betting < /p> < /
          div > <
          div className = "col-sm-6" >
          <
          p > {
            Math.floor(((new Date(currentRace.closeTime).getTime() - new Date().getTime()) / 1000 / 3600))
          }
          Hrs {
            Math.floor(((new Date(currentRace.closeTime).getTime() - new Date().getTime()) / 1000 / 60)) % 60
          }
          mins {
            Math.floor(((new Date(currentRace.closeTime).getTime() - new Date().getTime()) / 1000)) % 60
          }
          seconds <
          /p> </div >
          <
          /div> <
          /div> <
          div className = "col-sm-12" >
          <
          div className = "raceCompetitors" >
          <
          h2 className = "title" > Competitors < /h2>

          {
            currentCompetitors
          } <
          /div> < /
          div >

          <
          /div> < /
          div >
          <
          /div>);
        }
      }
      return ( <
        div className = "App" > {
          content()
        } <
        /div>);
      }






    } <
    div id = "View" > < /div>
  export default App;
