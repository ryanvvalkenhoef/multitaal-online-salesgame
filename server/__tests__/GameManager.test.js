const GameManager = require('../GameManager');
//this test uses test data for the used method parameters and mocks for external methods
describe('GameManager', () => {
    let gameManager;
    let mockSocketManager;
    let mockModQuestionQueue;
    let mockUserLogger;
    let mockModLogger;
    let mockSocket;
    let playerId;
    let questionData;
//GIVEN
    beforeEach(() => {
        mockSocketManager = {
            emitToMod: jest.fn(),
            emitBackToClient: jest.fn()
        };
        mockModQuestionQueue = {
            getQuestionQueueLength: jest.fn(),
            getQuestionFromQueue: jest.fn()
        };
        mockUserLogger = {
            setHasBeenReviewed: jest.fn()
        };
        mockModLogger = {
            setIsReviewingQuestion: jest.fn()
        };
        mockSocket = { id: 'socket1' };

        gameManager = new GameManager(mockUserLogger, mockModLogger, mockSocketManager, {}, mockModQuestionQueue);

        playerId = 'player1';
        questionData = { question: 'Some question' };
    });
//WHEN
    test('sendAnswerToModerator should call emitToMod with correct arguments', () => {
        gameManager.sendAnswerToModerator(mockSocket, questionData);
//THEN
        expect(mockSocketManager.emitToMod).toHaveBeenCalledWith(mockSocket, 'receive_player_answer', questionData);
    });
//WHEN
    test('checkIfQueueNotEmptyAndSendAnswer should handle non-empty queue', () => {
        mockModQuestionQueue.getQuestionQueueLength.mockReturnValue(1);
        mockModQuestionQueue.getQuestionFromQueue.mockReturnValue(questionData);

        gameManager.checkIfQueueNotEmptyAndSendAnswer(mockSocket, playerId);
//THEN
        expect(mockModQuestionQueue.getQuestionQueueLength).toHaveBeenCalledWith(mockSocket, playerId);
        expect(mockModQuestionQueue.getQuestionFromQueue).toHaveBeenCalledWith(mockSocket, playerId);
        expect(mockSocketManager.emitToMod).toHaveBeenCalledWith(mockSocket, 'receive_player_answer', questionData);
        expect(mockModLogger.setIsReviewingQuestion).toHaveBeenCalledWith(true);
    });
//WHEN
    test('checkIfQueueNotEmptyAndSendAnswer should handle empty queue', () => {
        mockModQuestionQueue.getQuestionQueueLength.mockReturnValue(0);

        gameManager.checkIfQueueNotEmptyAndSendAnswer(mockSocket, playerId);
//THEN
        expect(mockModQuestionQueue.getQuestionQueueLength).toHaveBeenCalledWith(mockSocket, playerId);
        expect(mockUserLogger.setHasBeenReviewed).toHaveBeenCalledWith(playerId, true);
        expect(mockSocketManager.emitBackToClient).toHaveBeenCalledWith(mockSocket, 'player_has_been_reviewed', { playerId, hasBeenReviewed: true });
    });
});