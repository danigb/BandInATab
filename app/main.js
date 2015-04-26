'use strict';

var React = require('react');
var Router = require('react-router');

var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

function vocabURL(file) {
  return 'https://rawgit.com/danigb/impro-visor-js/master/build/vocab/' + file + '.json';
}

var files = ['My.voc.chords', 'My.voc.scales'];
function loadData() {
  Promise.all(files.map(function(file) {
    return get(vocabURL(file));
  })).then(function(result) {
    var chords = JSON.parse(result[0]);
    console.log("Render", chords);
    render(chords);
  });
}
loadData();

class App extends React.Component {
  constructor(props) { super(props); }
  render() {
    return (
      <div>
        <header><h1>Band in a tab</h1></header>
        <RouteHandler {...this.props} />
      </div>
    );
  }
}

class Chords extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    var chordNames = this.props.chords.map(function(chord) {
      return (
        <li key={chord.name}>
          <Link to="chord" params={chord}>{chord.name}</Link>
        </li>);
    });
    return (
      <div>
        <h2>Chords</h2>
        {chordNames}
      </div>
    );
  }
}

class Chord extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log("CTX", this.context);
    return (
      <div>{this.context.router.getCurrentParams().name}</div>
    );
  }
}
Chord.contextTypes = {
  router: React.PropTypes.func.isRequired
};

var routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="chord" path="/chord/:name" handler={Chord} />
    <DefaultRoute handler={Chords}/>
  </Route>
);

function render(chords) {
  // Router.HistoryLocation,
  Router.run(routes, function (Handler) {
    React.render(<Handler chords={chords} />, document.body);
  });
}
render([{ name: 'UNO'}, { name: 'DOS' }]);


function get(url) {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.open('GET', url);

    req.onload = function() {
      if (req.status == 200) {
        resolve(req.response);
      } else {
        reject(Error(req.statusText));
      }
    };
    req.onerror = function() { reject(Error("Network Error")); };
    req.send();
  });
}
