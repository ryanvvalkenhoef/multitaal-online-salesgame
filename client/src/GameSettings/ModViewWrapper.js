import React, { useState, useEffect } from "react";
import { createContext, useContext } from "react";
import { modViewHandler } from "./ModViewHandler";

export const ModViewContext = createContext();

export const ModViewWrapper = ({ children }) => {

  const [state, setState] = useState({
    selectedPoints: null,
    question: "",
    color: "",
    popupColor: "",
    userColor: "",
    answer: "",
    showPopup: false,
    currentQuestionId: null,
  });

  // Initialize ModViewHandler with the setState of the component
  useEffect(() => {
    modViewHandler.init(setState);
  }, []);

 // Set initial question ID when question prop changes
  useEffect(() => {
    if (question?.questionId) {
      setCurrentQuestionId(question.questionId);
    }
  }, [state.question]);
  useEffect(() => {
    // when language changes, emit an event to get the translated question
    if (showPopup && popupColor && currentQuestionId) {
      socket.emit("request_translated_question", {
        color: popupColor,
        language: i18n.language,
        questionId: currentQuestionId
      });
    }
  }, [i18n.language, state.showPopup, state.popupColor, state.currentQuestionId]);
  // add socket listener for receiving translated question
  useEffect(() => {
    const handleTranslatedQuestion = (data) => {
      if (data.questionText) {
        modViewHandler.setQuestion(data.questionText);
      }
      if (data.answer) {
        modViewHandler.setAnswer(data.answer);
      }
      if (data.questionId) {
        modViewHandler.setCurrentQuestionId(data.questionId);
      }
    };
    socket.on("receive_translated_question", handleTranslatedQuestion);
    return () => {
      socket.off("receive_translated_question", handleTranslatedQuestion);
    };
  }, []);
  // Set initial translated text when component mounts or question/answer changes
  useEffect(() => {
    modViewHandler.setQuestion(state.question?.questionText || state.question || "");
    modViewHandler.setAnswer(state.answer || "");
  }, [state.question, state.answer]);

  // Functions needed to update the state
  const handleUpdatePoints = (points) => {
    modViewHandler.handleUpdatePoints(points);
  };

  const reviewQuestion = (questionData) => {
    modViewHandler.reviewQuestion(questionData);
  };

  const resetAll = () => {
    modViewHandler.resetAll();
  };

  const handleSubmitPoints = () => {
    modViewHandler.handleSubmitPoints();
  };

  const onImageClick = (playerId) => {
    modViewHandler.onImageClick(playerId);
  };

  const { selectedPoints, showPopup, answer, color, question } = state;

  // Passing through the state and functions to children through context
  return (
    <ModViewContext.Provider
      value={{
        reviewQuestion,
        showPopup: state.showPopup,
        translatedAnswer: state.answer,
        color: state.color,
        translatedQuestion: state.question,
        selectedPoints: state.selectedPoints,
        modViewHandler,
        handleSubmitPoints,
        handleUpdatePoints,
        onImageClick,
        resetAll,
      }}
    >
      {children}
    </ModViewContext.Provider>
  );
};