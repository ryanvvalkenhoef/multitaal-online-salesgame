import React, { useState, useEffect } from "react";
import { createContext, useContext } from "react";
import { modViewHandler } from "./ModViewHandler";
import { ModView } from "../components/UI/ModView";

const ModViewContext = createContext();

const ModViewWrapper = ({ children }) => {

  const [state, setState] = useState({
    selectedPoints: null,
    question: "",
    color: "",
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

  return (
    <div>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          // Pass through functions to the children
          handleSubmitPoints,
          onImageClick,
          handleUpdatePoints,
          reviewQuestion,
          resetAll,
        })
      )}
    </div>
  );
};

export default { ModViewWrapper, ModViewContext };