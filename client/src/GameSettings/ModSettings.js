import { socket } from "../client.js";
import React, { Component } from 'react';
import EventEmitter from "events";

class ModSettings extends EventEmitter {

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

    getState() {
      return this.state;
    }

    setPlayerCount(playerCount) {
      let value = parseInt(playerCount, 10);
      if (!isNaN(value) && value >= 2 && value <= 6) {
        this.state.playerCount = playerCount;
        this.emit("update", this.state);
      }
    }
  
    setRoundsCount(roundsCount) {
      let value = parseInt(roundsCount, 10);
      if (!isNaN(value) && value >= 3 && value <= 30) {
        this.state.roundsCount = roundsCount;
        this.emit("update", this.state);
      }
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

export default new ModSettings();
