import React, { Component } from "react";
import uuid from "uuid/v4";

import Joke from "./Joke";

import axios from "axios";

import "../styles/Jokes.css";

class Jokes extends Component {
  static defaultProps = {
    numJokesToGet: 10
  };

  constructor(props) {
    super(props);
    this.state = {
      jokes: JSON.parse(localStorage.getItem("jokes") || "[]"),
      loading: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    if (this.state.jokes.length === 0) {
      this.getJokes();
    }
  }
  async getJokes() {
    let jokes = [];
    while (jokes.length < this.props.numJokesToGet) {
      let res = await axios.get("https://icanhazdadjoke.com/", {
        headers: { Accept: "application/json" }
      });

      jokes.push({ id: uuid(), text: res.data.joke, votes: 0 });
    }

    this.setState(
      st => ({
        loading: false,
        jokes: [...st.jokes, ...jokes]
      }),
      () => localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
    );
  }

  handleVote(id, delta) {
    this.setState(
      st => ({
        jokes: st.jokes.map(joke =>
          joke.id === id ? { ...joke, votes: joke.votes + delta } : joke
        )
      }),
      () => localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
    );
  }

  handleClick() {
    this.setState({ loading: true }, this.getJokes);
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="jokes-spiner">
          <i className="far fa-8x fa-laugh fa-spin"></i>
          <h1 className="jokes-title">Loading...</h1>
        </div>
      );
    }

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
          <button onClick={this.handleClick} className="jokes-getMore-btn">
            New Jokes
          </button>
        </div>

        <div className="jokes-joke">
          {this.state.jokes.map(joke => (
            <Joke
              key={joke.id}
              text={joke.text}
              votes={joke.votes}
              upvote={() => this.handleVote(joke.id, 1)}
              downvote={() => this.handleVote(joke.id, -1)}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Jokes;
