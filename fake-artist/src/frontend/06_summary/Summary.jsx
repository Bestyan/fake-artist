import React, { PureComponent } from "react";
import * as communication from "../communication";
import * as GameConfig from "../../shared/GameConfig";
import * as Components from "../components/Components";
import * as Constants from "../../Constants";
import PropTypes from "prop-types";

class Summary extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      isFetched: false,
      data: {
        players: [],
        topic: null,
        term: null,
        picture: null,
        voteResults: [],
        isFakeDetected: false,
        guess: null,
        isGuessCorrect: false
      }
    };
  }

  render() {

    if (this.state.isFetched) {

      return (
        <div>
          <h1>Summary</h1>

          <h2>The Players</h2>
          {this.renderPlayers()}

          <h2>The Term and Topic</h2>
          {this.renderTermAndTopic()}

          <h2>The Masterpiece</h2>
          <Components.CanvasImg src={this.props.picture} alt="masterpiece" />

          <h2>The Fake</h2>
          {this.renderFake()}

          <h2>The Vote Results</h2>
          {this.renderVoteResults()}

          <h2>The Evaluation</h2>
          {this.renderEvaluation()}

          <h2>The Guess</h2>
          {this.renderGuess()}

          <h2>Final Verdict</h2>
          {this.renderVerdict()}

          <hr />
          <p>The next round becomes available in 10 seconds. Refresh the page to join.</p>

        </div>
      );

    } else {

      return (
        <div>
          fetching summary...
        </div>
      );

    }
  }

  renderPlayers = () => {
    const players = this.state.data.players.map(player => {
      return (
        <Components.PlayerListItem
          key={player.id}
          playerColor={player.color}
          fontColor={Components.getFontColorForBackground(player.color)}
        >
          Name: {player.name} <br />
          Role: {player.role}
        </Components.PlayerListItem>
      );
    });

    return (
      <ul>
        {players}
      </ul>
    );
  };

  renderTermAndTopic = () => {
    const { topic, term } = this.state.data;
    return (
      <p>
        The topic was <strong>{topic}</strong>.
        <br />
        The term was <strong>{term}</strong>.
      </p>
    )
  }

  renderFake = () => {
    let fake = null;

    const { players } = this.state.data;
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      if (player.role === "fake") {
        fake = player;
        break;
      }
    }

    return (
      <p>
        <Components.PlayerName playerColor={fake.color}>{fake.name}</Components.PlayerName> was the Fake.
      </p>
    );
  }

  renderVoteResults = () => {
    const { voteResults } = this.state.data;
    const resultItems = voteResults.map(result => {
      return (
        <Components.ResultListItem
          playerColor={result.player.color}
          fontColor={Components.getFontColorForBackground(result.player.color)}
        >
          {result.player.name} : {result.votes}
        </Components.ResultListItem>
      )
    });

    return (
      <ul>
        {resultItems}
      </ul>
    );
  }

  renderEvaluation = () => {
    let text = "";
    if (this.state.data.isFakeDetected) {
      text = "The Fake was detected."
    } else {
      text = "The Fake remained undetected."
    }

    return (
      <p>{text}</p>
    );
  }

  renderGuess = () => {
    const { data } = this.state;
    if (!data.isFakeDetected) {
      return (
        <p>The Fake was not detected and therefore didn't need to guess.</p>
      );
    }

    return (
      <p>The Fake guessed <strong>{data.guess}</strong>, which is {data.isGuessCorrect ? "" : "not"} correct.</p>
    );
  }

  renderVerdict = () => {
    const { data } = this.state;

    let role = null;
    let win = false;
    switch (this.props.player.role) {
      case "artist":
        role = "Artist";
        win = data.isFakeDetected && !data.isGuessCorrect;

        break;

      case "fake":
        role = "Fake";
        win = !data.isFakeDetected || data.isGuessCorrect;
        break;

      case "question-master":
        role = "Question Master";
        win = data.isFakeDetected && !data.isGuessCorrect;
        break;

      default:
        return <p>Unknown role in Summary.renderVerdict</p>;
    }

    let winReason = null;
    let lossReason = null;
    switch (this.props.player.role) {
      case "artist":
      case "question-master":
        if (win) {
          winReason = "You win because the Fake was detected and not able to guess the term.";
        } else {
          if (!data.isFakeDetected) {
            lossReason = "You lose because the Fake was not detected.";
          } else if (data.isGuessCorrect) {
            lossReason = "You lose because the Fake was able to guess the term.";
          }
        }
        break;

      case "fake":
        if (win) {

          if (!data.isFakeDetected) {
            winReason = "You win because you were sneaky enough to not be detected.";
          } else if (data.isGuessCorrect) {
            winReason = "You win because even though you were detected, you were able to guess the term.";
          }
        } else {
          lossReason = "You lose because you were detected and not able to guess the term.";
        }
        break;
      default:
    }


    return (
      <p>Your role was <strong>{role}</strong>.<br />
        {win ? winReason : lossReason}</p>
    );
  }

  componentDidMount() {
    this.fetchSummary();
  }

  fetchSummary = () => {
    communication.fetchSummary(
      json => {

        this.setState({
          isFetched: true,
          data: {
            players: json[Constants.GET_SUMMARY_PLAYERS],
            topic: json[Constants.GET_SUMMARY_TOPIC],
            term: json[Constants.GET_SUMMARY_TERM],
            picture: json[Constants.GET_SUMMARY_PICTURE],
            voteResults: json[Constants.GET_SUMMARY_VOTE_RESULTS],
            isFakeDetected: json[Constants.GET_SUMMARY_IS_FAKE_DETECTED],
            guess: json[Constants.GET_SUMMARY_GUESS],
            isGuessCorrect: json[Constants.GET_SUMMARY_IS_GUESS_CORRECT]
          }
        });

      },
      error => {
        console.log(error);
        // retry
        setTimeout(this.fetchSummary, GameConfig.RETRY_TIMEOUT_MS);
      }
    )
  };

}

Summary.propTypes = {
  player: PropTypes.object.isRequired,
  picture: PropTypes.string.isRequired
}

export default Summary;
