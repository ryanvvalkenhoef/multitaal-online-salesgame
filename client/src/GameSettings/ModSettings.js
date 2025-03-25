import { socket } from "../client.js";
import React, { Component } from 'react';

class ModSettings extends Component {

  static instance = null;

    constructor(props) {
      super(props);
        if (!ModSettings.instance) {
            this.state = {
                playerCount: 2,
                roundsCount: 3, 
              };
            ModSettings.instance = this;
        }
        return ModSettings.instance;
    }

    init(setState) {
        this.setState = setState;
    }

    setPlayerCount = (playerCount) => {
      this.setState(prevState => ({ ...prevState, playerCount: playerCount }));
      this.state.playerCount = playerCount;
    }

    setRoundsCount = (roundsCount) => {
      this.setState(prevState => ({ ...prevState, roundsCount: roundsCount }));
      this.state.roundsCount = roundsCount;
    }

    createRoom = () => {
      const playerCount = this.state.playerCount;
      const roundsCount = this.state.roundsCount;
      socket.emit("create_room", {
        playerCount: playerCount,
        roundsCount: roundsCount });
    };

    decrementPlayerCount = () => {
      if (this.state.playerCount > 2) {
        this.setPlayerCount(this.state.playerCount - 1);
      }
    };

    incrementPlayerCount = () => {
      if (this.state.playerCount < 6) {
        this.setPlayerCount(this.state.playerCount + 1);
      }
    };

    decrementRoundsCount = () => {
      if (this.state.roundsCount > 3) {
        this.setRoundsCount(this.state.roundsCount - 1);
      }
    };

    incrementRoundsCount = () => {
      if (this.state.roundsCount < 30) {
        this.setRoundsCount(this.state.roundsCount + 1);
      }
    };
    
}

export default ModSettings;
