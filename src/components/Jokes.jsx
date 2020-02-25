import React, { Component } from "react";

import axios from "axios";

import "../styles/Jokes.css";

class Jokes extends Component {
  static defaultProps = {
    numJokesToGet: 10
  };

  constructor(props) {
    super(props);
    this.state = {
      jokes: []
    };
  }

  async componentDidMount() {
    let jokes = [];
    while (jokes.length < this.props.numJokesToGet) {
      let res = await axios.get("https://icanhazdadjoke.com/", {
        headers: { Accept: "application/json" }
      });

      jokes.push({ joke: res.data.joke, votes: 0 });
    }

    console.log(jokes);
    this.setState({ jokes: jokes });
  }

  render() {
    return (
      <div className="jokes">
        <div className="jokes-sidebar">
          <h1 className="jokes-title">
            <span>Dad</span> Jokes
          </h1>
          <img
            src="https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg"
            alt=""
          />
          <button className="jokes-getMore-btn">New Jokes</button>
        </div>

        <div className="jokes-joke">
          {this.state.jokes.map(joke => (
            <div>
              {joke.joke} - {joke.votes}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Jokes;
