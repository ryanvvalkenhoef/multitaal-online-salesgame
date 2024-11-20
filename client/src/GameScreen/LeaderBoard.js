import React, { useEffect } from 'react';
import './LeaderBoardStyle.css';
import { useTranslation } from "react-i18next";

const LeaderBoard = ({ sortedUserData, playerName }) => {
    const {t, i18n} = useTranslation('global');

    useEffect(() => {
        const numPlayers = sortedUserData.length;
        const heightScoreboard = 95 * numPlayers;
        // Set the height of the leaderboard container
        const leaderboardContainer = document.querySelector('.leaderBoard');
        if (leaderboardContainer) {
            leaderboardContainer.style.height = `${heightScoreboard}px`;
        }
    }, [sortedUserData]);

    return (
        <div className='leaderBoard'>
            <h2>{t("Game.leaderboard")}</h2>
            <div className="leaderboardGrid">
                <div className="headerRow">
                    <span></span>
                    <span className="pointsLabel">{t("Game.currentPoints")}</span>
                    <span className="pointsLabel">{t("Game.previousPoints")}</span>
                </div>
                {sortedUserData.map(data => (
                    <div className="leaderboardItem" key={data.id}>
                        <span className="playerName">
                            <img
                                className={`playerImage ${data.name === playerName ? 'flicker' : ''} ${
                                    data.strategy === 'Safeline' ? 'piecesafeline' :
                                        data.strategy === 'Lunar' ? 'piecelunar' :
                                            data.strategy === 'Domino House' ? 'piecedomino' :
                                                data.strategy === 'Klaphatten' ? 'pieceklaphatten' :
                                                    data.strategy === 'Top of the World' ? 'pieceworld' :
                                                        data.strategy === 'Jysk Telepartner' ? 'piecejysk' : ''}`}
                                alt=""
                            />
                            {data.name}
                        </span>
                        <span
                            className={`pointsLeaderboard ${
                                data.strategy === 'Safeline' ? 'piecered' :
                                    data.strategy === 'Lunar' ? 'pieceyellow' :
                                        data.strategy === 'Domino House' ? 'pieceblue' :
                                            data.strategy === 'Klaphatten' ? 'piecepurple' :
                                                data.strategy === 'Top of the World' ? 'piecegreen' :
                                                    data.strategy === 'Jysk Telepartner' ? 'pieceorange' : ''}`}
                        >
                            {data.totalPoints}
                        </span>
                        <span
                            className={`pointsLeaderboard ${
                                data.strategy === 'Safeline' ? 'piecered' :
                                    data.strategy === 'Lunar' ? 'pieceyellow' :
                                        data.strategy === 'Domino House' ? 'pieceblue' :
                                            data.strategy === 'Klaphatten' ? 'piecepurple' :
                                                data.strategy === 'Top of the World' ? 'piecegreen' :
                                                    data.strategy === 'Jysk Telepartner' ? 'pieceorange' : ''}`}
                        >
                            {data.previousPoints}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default LeaderBoard;