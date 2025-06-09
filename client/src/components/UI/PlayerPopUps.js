import React, { useEffect, useState } from "react";
import "./PopUpStyle.css";
import { useTranslation } from "react-i18next";
import { socket } from "../../client";

const PlayerPopUps = ({
  isPopUpEnabled,
  isWaitingScreenEnabled,
  question,
  textBoxContent,
  handleTextBoxChange,
  handleSubmitAnswer,
  popupColor,
  setPopupColor,
}) => {
  const { t, i18n } = useTranslation("global");
  const [translatedQuestion, setTranslatedQuestion] = useState(question);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);

  useEffect(() => {
    const handleTranslatedQuestion = (data) => {
      if (data && data.questionText) {
        setTranslatedQuestion(data.questionText);
        if (data.questionId) {
          setCurrentQuestionId(data.questionId);
        }
      }
    };
    socket.on('receive_translated_question', handleTranslatedQuestion);
    socket.on('receive_question', (data) => {
      if (data.questionId) {
        setCurrentQuestionId(data.questionId);
      }
    });
    return () => {
      socket.off('receive_translated_question', handleTranslatedQuestion);
      socket.off('receive_question');
    };
  }, []);
  useEffect(() => {
    // When language changes, emit an event to get the translated question
    if (isPopUpEnabled && popupColor && currentQuestionId) {
      try {
        socket.emit("request_translated_question", {
          color: popupColor,
          language: i18n.language,
          questionId: currentQuestionId
        });
      } catch (error) {
        console.error("Error requesting translated question: ", error);
      }
    }
  }, [i18n.language, isPopUpEnabled, popupColor, currentQuestionId]);

  useEffect(() => {
    //prevents copying/pasting
    const disableActions = (e) => e.preventDefault();

    document.addEventListener("copy", disableActions);
    document.addEventListener("paste", disableActions);
    document.addEventListener("cut", disableActions);
    document.addEventListener("contextmenu", disableActions);

    return () => {
      document.removeEventListener("copy", disableActions);
      document.removeEventListener("paste", disableActions);
      document.removeEventListener("cut", disableActions);
      document.removeEventListener("contextmenu", disableActions);
    };
  }, []);
  return (
    <>
      {isPopUpEnabled && (
        <div className="questionBoxPopup">
          <div className={`questionColorBox ${popupColor}`}>
            <div className="rowpopup">
              <img
                className={`${popupColor === "red"
                  ? "popupsafeline"
                  : popupColor === "yellow"
                    ? "popuplunar"
                    : popupColor === "blue"
                      ? "popupdomino"
                      : popupColor === "purple"
                        ? "popupklaphatten"
                        : popupColor === "green"
                          ? "popupworld"
                          : popupColor === "orange"
                            ? "popupjysk"
                            : popupColor === "black1"
                              ? "chance"
                              : popupColor === "black2"
                                ? "sales"
                                : popupColor === "black3"
                                  ? "megatrends"
                                  : ""
                  }`}
                alt=""
              />
              <div className="strategyName">
                {popupColor === "yellow"
                  ? "Lunar"
                  : popupColor === "green"
                    ? "Top of the World"
                    : popupColor === "blue"
                      ? "Domino House"
                      : popupColor === "purple"
                        ? "Klaphatten"
                        : popupColor === "red"
                          ? "Safeline"
                          : popupColor === "orange"
                            ? "Jysk Telepartner"
                            : popupColor === "black1"
                              ? "Chance"
                              : popupColor === "black2"
                                ? "Sales"
                                : popupColor === "black3"
                                  ? "Megatrends"
                                  : "strategy"}{" "}
              </div>
            </div>
            <div className="questionLabel">
              {" "}
              <br /> {t("PopUps.question")}{" "}
            </div>
            <div className="questionWhiteBox">{translatedQuestion}</div>
          </div>
          <div className="answerPopup">
            <div className="answerText"> {t("PopUps.playerAnswer")} </div>
            <textarea
              className={"answerInput"}
              value={textBoxContent}
              placeholder={t("PopUps.playerHolder")}
              onChange={handleTextBoxChange}
              onPaste={(e) => e.preventDefault()}
            />
            <button className={"submitButton"} onClick={handleSubmitAnswer}>
              {t("PopUps.submitAns")}
            </button>
          </div>
        </div>
      )}
      {isWaitingScreenEnabled && (
        <div className="waitingScreenPopup">
          <div className="waitingScreenText"> {t("PopUps.wait")} </div>
        </div>
      )}
    </>
  );
};

export default PlayerPopUps;
