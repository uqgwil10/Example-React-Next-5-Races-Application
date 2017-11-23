
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
        time: {},
        seconds: 5
      };
      //This controls the amount of races to display
      this.numberOfRacesToDisplay = 5;
      this.filteredData =[];
      let sortedData = [];
      this.timer = 0;
      this.startTimer = this.startTimer.bind(this);
      this.countDown = this.countDown.bind(this);
      this.activeRace = this.activeRace.bind(this);

      //Getting the data into the right format
      myData.forEach(function(meeting, index) {
        meeting.races.forEach(function(race, index) {
          let tempRace = race;

          let fullDate = new Date(tempRace.closeTime);
          tempRace.meetingType = meeting.meetingType;
          tempRace.location = meeting.location;
          tempRace.meetingNumber = meeting.meeting;
          tempRace.fullDate = (fullDate.getDate() + "/" + (fullDate.getMonth() + 1) + "/" + fullDate.getFullYear() + "  " + fullDate.getHours() + ":" + fullDate.getMinutes());
          sortedData.push(tempRace)
        })
      })
      this.sortedData = sortedData;
      // Sorting the data based on time.
      this.sortedData.sort(function(a, b) {
        return new Date(a.closeTime) - new Date(b.closeTime);
      });

      this.makeFilteredList()
      this.countDown();
      this.startTimer();
    }





    //This remakes the list of displayed races
    makeFilteredList(){
      this.filteredData =[];
      for(var i=0;(i < this.sortedData.length && this.filteredData.length !== this.numberOfRacesToDisplay);i++){
        if ((new Date(this.sortedData[i].closeTime).getTime() - new Date().getTime()) > 0) {
          this.filteredData.push(this.sortedData[i])
        }

        if(this.filteredData.length == this.numberOfRacesToDisplay){
          break;
        }
      }
    }




  //This start a timer to update the view when needed.
  startTimer() {
    if (this.timer === 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  //This sets a race to the active race for the RaceDetailsView.
  activeRace(race) {
    if(race){
      this.setState({
        activeRace: race.listTableValues
      });
    }else {
      this.setState({
        activeRace: null
      });
    }
  }


  // Remove one second, set state so a re-render happens.
  countDown() {

    this.filteredData.forEach(function(race, index,array) {
      race.countDown = (Math.floor(((new Date(race.closeTime).getTime() - new Date().getTime()) / 1000 / 3600)))+" Hrs "+(Math.floor(((new Date(race.closeTime).getTime() - new Date().getTime()) / 1000 / 60)) % 60)+" mins " + (Math.floor(((new Date(race.closeTime).getTime() - new Date().getTime()) / 1000)) % 60)+" seconds ";
      if ((new Date(race.closeTime).getTime() - new Date().getTime()) < 0) {
        array.shift(index);
        //this.makeFilteredList();
      };
    });


    if (this.filteredData.length < this.numberOfRacesToDisplay) {
      //Adds new race to the currently viewing list.
      this.makeFilteredList();
      this.countDown();
    }
    // Updates the view

    this.forceUpdate();
  }


  render() {



    if (this.state.activeRace == null) {
      return (<NextFiveView races={this.filteredData} setActiveRace={this.activeRace}/>);
    }else{
      return (<RaceDetailsView race={this.state.activeRace} setActiveRace={this.activeRace}/>);
    }
  }
}


  //This is the default main view of races
class NextFiveView extends Component {
  render() {
      const setActiveRace = this.props.setActiveRace

      var races = this.props.races;

      var tableKeys = ["Race number","Meeting number","Date","Location","Meeting type","Count down"];

      var tableRows = races.map(function(race, index) {
        return(<TableValueRow values={race} setActiveRace={setActiveRace}/>);
      });


  return(
    <div>
      <Header title="Next 5 races"/>
      <table className = "table"styles = {{width: '100%'}} >
        <tbody>
          <TableHeaders headers={tableKeys}/>
          {tableRows}
          </tbody>
          </table>
          </div>
    );
  }
}

  //This is the view that show extra details about one race.
class RaceDetailsView extends Component {
    render() {
      const setActiveRace = this.props.setActiveRace
      const race = this.props.race;
      var raceDetailsValues = [{"label":"Race number","value":race.raceNumber},{"label":"MeetingNumber","value":race.meetingNumber},{"label":"Location","value":race.location},{"label":"Meeting Type","value":race.meetingType},{"label":"Date","value":race.fullDate},{"label":"Close of betting","value":race.countDown}];
      const competitors = race.competitors;
      var RaceDetails = raceDetailsValues.map(function(detail, index) {
        return(<RaceDetail value={detail.value} label={detail.label}/>);
      });


      return(
      <div>
        <Header title="Race details"/>
        <div className = "container" >
          <div className = "row" >
            <div className = "col-sm-1" >
              <BackButton setActiveRace={setActiveRace}/>
            </div>
            <div className = "col-sm-6" >
              {RaceDetails}
            </div>
            <div className = "col-sm-12" >
              <RaceCompetitors competitors={competitors}/>
            </div>
          </div>
        </div>
      </div>);
  }
}


  //This sets the header at the top of the page
class Header extends Component {
     render() {
       const title = this.props.title;
       return(<h1 className = "title" > {title} < /h1>);
     }
}


//This creates header value at the top of a table.
class TableHeaders extends Component {
  render() {
    const listTableHeaders = this.props.headers;
    var tableHeaders = listTableHeaders.map(function(header, index) {
      return (<th>{header}</th>);
    });

    return(<tr>{tableHeaders}</tr>);
  }
}


//This creates header value at the top of a table.
class TableValueRow extends Component {

  activeRace(race) {
    App.state.activeRace = race;
  }

  render() {

    const setActiveRace = this.props.setActiveRace
    const listTableValues = this.props.values;
    return(
      <tr onClick = {(e) => setActiveRace({listTableValues}, e)}>
        <td>{listTableValues.raceNumber}</td><td>{listTableValues.meetingNumber}</td><td>{listTableValues.fullDate}</td><td>{listTableValues.location}</td><td>{listTableValues.meetingType}</td><td>{listTableValues.countDown}</td>
      </tr>);
  }
}


//This label and value rows to show data.
class RaceDetail extends Component {
  render() {
    const label = this.props.label;
    const value = this.props.value;
    return(
      <div>
        <div className = "col-sm-6" >
          <p className = "red" >{label}</p>
        </div>
        <div className = "col-sm-6" >
          <p>{value}</p>
        </div>
      </div>
      );
  }
}


//This creates the competitor section.
class RaceCompetitors extends Component {
  render() {

    const competitors = this.props.competitors;
    var competitorCards = competitors.map(function(competitor, index) {
      return (<CompetitorCard name={competitor.name} positionNumber={competitor.positionNumber}/>);
    });

    return(
      <div>
        <div className = "col-sm-12" >
        <h2 className="title">Competitors</h2>
        </div>
        {competitorCards}
      </div>);
  }
}


//This creates a competitor card section.
class CompetitorCard extends Component {
  render() {
    const name = this.props.name;
    const positionNumber = this.props.positionNumber;

    return(<div className = "col-md-4 col-sm-6" >
        <div className = "card" >
          <div className = "card-body" >
            <h4 className = "card-title" > {name}
            </h4>
            <p className = "card-text" > Position number: {positionNumber} < /p>
          </div>
        </div>
      </div>);
  }
}


//This creates a back button.
class BackButton extends Component {
  activeRace(race) {
    App.state.activeRace = race;
  }


  render() {
    const setActiveRace = this.props.setActiveRace
    return(<button className = "btn btn-primary"onClick = {(e) => setActiveRace(null, e)}>Back</button>);
  }
}


<
    div id = "View" > < /div>
  export default App;
