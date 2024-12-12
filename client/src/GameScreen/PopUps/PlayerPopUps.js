import React,{useEffect} from 'react';
import '../PopUpStyle.css'
import {useTranslation} from "react-i18next";

const PlayerPopUps = ({ isPopUpEnabled, isWaitingScreenEnabled, question, textBoxContent, handleTextBoxChange, handleSubmitAnswer, get_player_strategy, setGetPlayerStrategy }) => {
    const { t, i18n } = useTranslation('global');

    useEffect(() => { //prevents copying/pasting
        const disableActions = (e) => e.preventDefault(); 
        
    
        document.addEventListener('copy', disableActions);
        document.addEventListener('paste', disableActions);
        document.addEventListener('cut', disableActions);
        document.addEventListener('contextmenu', disableActions);  
    
        return () => {
          document.removeEventListener('copy', disableActions);
          document.removeEventListener('paste', disableActions);
          document.removeEventListener('cut', disableActions);
          document.removeEventListener('contextmenu', disableActions);
        };
      }, []);
    return (
        <>
            {isPopUpEnabled && (
                <div className='questionBoxPopup'>
                    <div className={`questionColorBox ${get_player_strategy}`}>
                        <div className='rowpopup'>
                            <img className={`${
                                get_player_strategy === 'red' ? 'popupsafeline' :
                                    get_player_strategy === 'yellow' ? 'popuplunar' :
                                        get_player_strategy === 'blue' ? 'popupdomino' :
                                            get_player_strategy === 'purple' ? 'popupklaphatten' :
                                                get_player_strategy === 'green' ? 'popupworld' :
                                                    get_player_strategy === 'orange' ? 'popupjysk' :
                                                        get_player_strategy === 'black1' ? 'chance' :
                                                            get_player_strategy === 'black2' ? 'sales' :
                                                                get_player_strategy === 'black3' ? 'megatrends' : ''}`}
                                 alt="" />
                            <div className='strategyName'>
                                {get_player_strategy === 'yellow' ? 'Lunar':
                                    get_player_strategy === 'green' ? 'Top of the World' :
                                        get_player_strategy === 'blue' ? 'Domino House' :
                                            get_player_strategy === 'purple' ? 'Klaphatten' :
                                                get_player_strategy === 'red' ? 'Safeline' :
                                                    get_player_strategy === 'orange' ? 'Jysk Telepartner' :
                                                            get_player_strategy === 'black1' ? 'Chance':
                                                                get_player_strategy === 'black2' ? 'Sales' :
                                                                    get_player_strategy === 'black3' ? 'Megatrends' :
                                                        'strategy'} </div>
                        </div>
                        <div className='questionLabel'> <br/> {t("PopUps.question")} </div>
                        <div className="questionWhiteBox">{question}</div>

                    </div>
                    <div className="answerPopup">
                        <div className='answerText'> {t("PopUps.playerAnswer")} </div>
                        <textarea className={'answerInput'} value={textBoxContent} placeholder={t("PopUps.playerHolder")} onChange={handleTextBoxChange} onPaste={(e) => e.preventDefault()}/>
                        <button className={'submitButton'} onClick={handleSubmitAnswer}>{t("PopUps.submitAns")}</button>
                    </div>
                </div>
            )}
            {isWaitingScreenEnabled && (
                <div className='waitingScreenPopup'>
                    <div className='waitingScreenText'> {t("PopUps.wait")} </div>
                </div>
            )}
        </>
    );
};

export default PlayerPopUps;