import { socket } from "../client.js";

class ModViewHandler {
    static instance = null;

    constructor(props) {
        if (!ModViewHandler.instance) {
            this.state = {
                selectedPoints: null,
                question: "",
                color: "",
                userColor: "",
                answer: "",
                showPopup: false,
                currentQuestionId: null,
              };
              this.playerCount = 0;
              this.currentQuestion = null;
            ModViewHandler.instance = this;
        }
        return ModViewHandler.instance;
    }

    init(setState) {
        this.setState = setState;
    }

    setSelectedPoints = (points) => {
        this.setState(prevState => ({ ...prevState, selectedPoints: points }));
        this.state.selectedPoints = points;
    };
    
    setQuestion = (question) => {
        this.setState(prevState => ({ ...prevState, question }));
        this.state.question = question;
    };
    
    setColor = (color) => {
        this.setState(prevState => ({ ...prevState, color }));
        this.state.color = color;
    };

    setUserColor = (userColor) => {
        this.setState(prevState => ({ ...prevState, userColor }));
        this.state.userColor = userColor;
    }

    setAnswer = (answer) => {
        this.setState(prevState => ({ ...prevState, answer }));
        this.state.answer = answer;
    }

    setShowPopup = (showPopup) => {
        this.setState(prevState => ({ ...prevState, showPopup }));
        this.state.showPopup = showPopup;
    }

    setCurrentQuestionId = (currentQuestionId) => {
        this.setState(prevState => ({ ...prevState, currentQuestionId }));
        this.state.currentQuestionId = currentQuestionId;
    }

    setPlayerCount(count) {
        this.playerCount = count;
    }

    setCurrentQuestion(question) {
        this.currentQuestion = question;
    }

    getCurrentQuestion() {
        return this.currentQuestion;
    }

    getPlayerCount() {
        return this.playerCount;
    }

    // Dynamic reset for all keys in this.state
    resetAll = () => {
        if (this.setState) {
        // Iterate over all keys in this.state and set them to null
        this.setState(prevState => {
            const resetState = {};
            for (let key in prevState) {
            if (prevState.hasOwnProperty(key)) {
                resetState[key] = null;
            }
            }
            return { ...prevState, ...resetState };
        });
        } else { console.error("GameHandler is niet geïnitialiseerd!"); }
    }

    getState() {
        return this.state;
    }

    // -- ModView logic
    handleUpdatePoints = (points) => {
        this.setSelectedPoints(points);
    };
    
    reviewQuestion = (questionData) => {
        console.log("questionData", questionData);
        if (!questionData || !questionData.questionText) {
          console.error("Invalid question data:", questionData);
          return;
        }
        this.setQuestion(questionData.questionText);
        this.setColor(questionData.questionColor);
        this.setUserColor(questionData.playerColor);
        this.setAnswer(questionData.answer);
        this.setCurrentQuestion(questionData);
    };
    
    submitPoints = () => {
        this.setShowPopup(false);
        socket.emit("points_submitted_question_reviewed", {
          totalPoints: this.state.selectedPoints,
          color: this.userColor,
          playerId: this.getCurrentQuestion().playerId,
          hasBeenReviewed: true,
        });
        this.setSelectedPoints([]);
    };
    
    handleSubmitPoints = () => {
        this.submitPoints();
    };
    
    onImageClick = (playerId) => {
        socket.emit("get_player_answer_on_click", playerId);
        this.setShowPopup(true);
    };

  }
  
  // Export singleton
  export const modViewHandler = new ModViewHandler();