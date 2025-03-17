import React from "react";
import "./PopUpStyle.css";
import { useTranslation } from "react-i18next";

const ModPopUps = ({
  setShowPopup,
  showPopup,
  question,
  submittedAnswer,
  selectedPoints,
  handleSubmitPoints,
  handleUpdatePoints,
  answer,
  popupColor,
}) => {
  const { t, i18n } = useTranslation("global");

  return (
    <>
      {showPopup && (
        <div className="scorePopup">
          <div className={`questionColorBox ${popupColor}`}>
            <div className="rowpopup">
              <img
                className={`${
                  popupColor === "red"
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
              <div className="strategyName2">
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
                                  : "strategy"}
              </div>
            </div>
            <div className="questionLabel2"> {t("PopUps.question")}</div>
            <div className="questionWhiteBox2"> {question} </div>
            <div className="answerLabel"> {t("PopUps.modAnswer")} </div>
            <div className="questionWhiteBox3"> {submittedAnswer} </div>
          </div>
          <div className="assignScoreBox">
            <button className="closeButton" onClick={() => setShowPopup(false)}>
              ✖
            </button>
            <div className="correctAnswerText"> {t("PopUps.correct")} </div>
            <div className="correctAnswerBox">{answer}</div>
            <div className="assignScoreText"> {t("PopUps.assign")} </div>
            <div className="scoreButtons">
              <button
                className={selectedPoints === 0 ? "selected points" : "points"}
                onClick={() => handleUpdatePoints(0)}
              >
                {" "}
                0
              </button>
              <button
                className={selectedPoints === 5 ? "selected points" : "points"}
                onClick={() => handleUpdatePoints(5)}
              >
                {" "}
                5
              </button>
              <button
                className={selectedPoints === 10 ? "selected points" : "points"}
                onClick={() => handleUpdatePoints(10)}
              >
                {" "}
                10
              </button>
              <button
                className={selectedPoints === 15 ? "selected points" : "points"}
                onClick={() => handleUpdatePoints(15)}
              >
                {" "}
                15
              </button>
              <button
                className={selectedPoints === 20 ? "selected points" : "points"}
                onClick={() => handleUpdatePoints(20)}
              >
                {" "}
                20
              </button>
              <button
                className={selectedPoints === 25 ? "selected points" : "points"}
                onClick={() => handleUpdatePoints(25)}
              >
                {" "}
                25
              </button>
              <button
                className={selectedPoints === 30 ? "selected points" : "points"}
                onClick={() => handleUpdatePoints(30)}
              >
                {" "}
                30
              </button>
            </div>
            {/*<button className='submitScoreButton' onClick={() => { handleSubmitPoints(); }}>Submit</button>*/}
            <button
              className="submitScoreButton"
              onClick={() => {
                if (selectedPoints !== null) {
                  handleSubmitPoints();
                } else {
                  alert(t("PopUps.alert"));
                }
              }}
            >
              {t("PopUps.submit")}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
export default ModeratorPopUps;
