const modQuestionQueue = require('../questionQueue/ModQuestionQueue');

describe('ModQuestionQueue', () => {
    let queueInstance;
    let socket;
    let playerId1, playerId2, playerId3;
    let questionData1, questionData2, questionData3;
//GIVEN a modQuestionQueue and its necessary parameters
    beforeEach(() => {
        queueInstance = new modQuestionQueue();
        socket = {
            room: 'room1', //in one room there are multiple clients with a socketId
            socketId1: 'socket1',
            socketId2: 'socket2',
            socketId3: 'socket3',
        };
        playerId1 = socket.socketId1;
        playerId2 = socket.socketId2;
        playerId3 = socket.socketId3;
        questionData1 = { playerId: playerId1, text: 'question1' };
        questionData2 = { playerId: playerId1, text: 'question2' };
        questionData3 = { playerId: playerId2, text: 'question3' };
    });
    //WHEN the modQuestionQueue is filled with playerquestions/answers
    test('should add multiple playeranswers to the queue', () => {
        queueInstance.addQuestionToQueue(socket, playerId1, questionData1);
        queueInstance.addQuestionToQueue(socket, playerId1, questionData2);
        queueInstance.addQuestionToQueue(socket, playerId2, questionData3);
    //THEN the queue should contain the playeranswers
        expect(queueInstance.getQuestionQueueLength(socket, playerId1)).toBe(2);
        expect(queueInstance.getQuestionQueueLength(socket, playerId2)).toBe(1);
        expect(queueInstance.getQuestionQueueLength(socket, playerId3)).toBe(0);
    });
    //WHEN the modQuestionQueue is filled with playerquestions/answers
    test('should get all playeranswers from the queue by player', () => {

        queueInstance.addQuestionToQueue(socket, playerId1, questionData1);
        queueInstance.addQuestionToQueue(socket, playerId1, questionData2);
        queueInstance.addQuestionToQueue(socket, playerId2, questionData3);
    //THEN retrieve the playeranswers from the queue
        const retrievedQuestion1 = queueInstance.getQuestionFromQueue(socket, playerId1);
        expect(retrievedQuestion1).toEqual(questionData1);
        queueInstance.removeQuestionFromQueue(socket, playerId1);//zonder deze regel zou de test falen

        const retrievedQuestion2 = queueInstance.getQuestionFromQueue(socket, playerId1);
        expect(retrievedQuestion2).toEqual(questionData2);

        expect(queueInstance.getQuestionFromQueue(socket, playerId2)).toEqual(questionData3);
        expect(queueInstance.getQuestionFromQueue(socket, playerId3)).toBeNull();
    });
});