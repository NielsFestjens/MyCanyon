import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <h1>My Canyon</h1>
        
        <Route exact path="/" component={Home} />
        <Route path="/trips" component={Trips} />
      </Router>
    </div>
  );
}

function Home() {
  return (
    <div>
      <h2>Home</h2>
      <h1>Canyon trips</h1>
      You do not have any active trips. <Link to="/trips/new">Plan a new trip</Link>
    </div>
  );
}

class Trips extends React.Component {
  state: {
    trips: Trip[],
    url: string
  }
  constructor(props: any){
    super(props);
    this.state = {
      trips: [],
      url: props.match.url
    }
  }
  render() {
    return (
      <div>
        <h2>Trips</h2>
          <Route path={`${this.state.url}/new`} render={props => (<NewTrip {...props} createTrip={this.createTrip}/>)} />
      </div>
    );
  }
}

class Trip {
  name?: string;
}

class NewTrip extends React.Component {
  state: Trip;

  constructor(props : any) {
    super(props);
    this.state = { 
      name: ''
    }
  }
  
  createTrip() {
    const trip = new Trip();
    trip.name = this.state.name;
  }

  render() {
    return (
      <div>
        <h2>New trip</h2>
        Name <input value={this.state.name}/><br />
        <button onClick={this.props.createTrip(this.state.name)}>Create</button>
      </div>
    );
  }
}

export default App;
