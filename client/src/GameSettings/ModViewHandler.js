class ModViewHandler {
    static instance = null;

    constructor(props) {
        super(props);
        if (!ModViewHandler.instance) {
            this.state = {
                selectedPoints: null,
                question: "",
                color: "",
                userColor: "",
                answer: "",
                showPopup: false,
              };
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
        setSelectedPoints(points);
    };
    
    reviewQuestion = (questionData) => {
        console.log("questionData", questionData);
        if (!questionData || !questionData.questionText) {
          console.error("Invalid question data:", questionData);
          return;
        }
        setQuestion(questionData.questionText);
        setColor(questionData.questionColor);
        setUserColor(questionData.playerColor);
        setAnswer(questionData.answer);
        currentQuestionRef.current = questionData;
    };
    
    submitPoints = () => {
        setShowPopup(false);
        socket.emit("points_submitted_question_reviewed", {
          totalPoints: selectedPoints,
          color: userColor,
          playerId: currentQuestionRef.current.playerId,
          hasBeenReviewed: true,
        });
        setSelectedPoints([]);
    };
    
    handleSubmitPoints = () => {
        submitPoints();
    };
    
    onImageClick = (playerId) => {
        socket.emit("get_player_answer_on_click", playerId);
        setShowPopup(true);
    };

  }
  
  // Export singleton
  export const modViewHandler = new ModViewHandler();