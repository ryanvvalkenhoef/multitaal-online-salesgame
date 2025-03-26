import React, { useState, useEffect } from "react";
import { createContext, useContext } from "react";
import { modViewHandler } from "./ModViewHandler";
import { ModView } from "../components/UI/ModView";

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
  });

  // Initialize ModViewHandler with the setState of the component
  useEffect(() => {
    modViewHandler.init(setState);
  }, []);

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
        answer: state.answer,
        color: state.color,
        question: state.question,
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