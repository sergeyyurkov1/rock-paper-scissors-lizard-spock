const checks = Object.freeze({
  BEATS: 1,
  NOT_BEATS: 0,
});

export class Hand {
  static checkBeats(choice) {
    if (this.beats.includes(choice.toString())) return checks.BEATS;
    return checks.NOT_BEATS;
  }
}

class Rock extends Hand {
  static beats = ["scissors", "lizard"];

  static toString() {
    return "rock";
  }
}

class Paper extends Hand {
  static beats = ["rock", "spock"];

  static toString() {
    return "paper";
  }
}

class Scissors extends Hand {
  static beats = ["lizard", "paper"];

  static toString() {
    return "scissors";
  }
}

class Lizard extends Hand {
  static beats = ["paper", "spock"];

  static toString() {
    return "lizard";
  }
}

class Spock extends Hand {
  static beats = ["scissors", "rock"];

  static toString() {
    return "spock";
  }
}

export const stringClassMap = {
  [Rock.toString()]: Rock,
  [Paper.toString()]: Paper,
  [Scissors.toString()]: Scissors,
  [Lizard.toString()]: Lizard,
  [Spock.toString()]: Spock,
};

export function chooseRandomHand() {
  let handList = Object.keys(stringClassMap);
  return handList[Math.floor(Math.random() * handList.length)];
}

export default class RPSLS {
  constructor(choices) {
    this.choices = choices;
    this.scores = {};
  }

  get winners() {
    return this.getWinners();
  }

  play() {
    let scores = {};

    for (let [thisPlayer, choice] of Object.entries(this.choices)) {
      scores[thisPlayer] = checks.NOT_BEATS;

      const players = Object.keys(this.choices).filter(
        (player) => player !== thisPlayer
      );

      for (let player of players) {
        scores[thisPlayer] += choice.checkBeats(this.choices[player]);
      }
    }

    this.scores = scores;
  }

  getWinners() {
    try {
      if (Object.keys(this.scores).length === 0) {
        throw new Error("No game played!");
      }
    } catch (error) {
      console.error(error);
    } finally {
      return Object.keys(this.scores).filter(
        (player) =>
          this.scores[player] === Math.max(...Object.values(this.scores))
      );
    }
  }
}
