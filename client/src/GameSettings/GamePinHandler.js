class GamePinHandler {
    
    constructor() {}

      handleGame = () => {
        if (playerCount === playerNeeded) {
          socket.emit("start_turn", "data");
          navigate("/modview");
          sessionStorage.setItem("socketId", socket.id);
          sessionStorage.setItem("room", gamepin);
        } else {
          setErrorCode(`Not all players have joined`);
        }
      };
    
      handleHome = () => {
        navigate("/home");
        socket.emit("delete_mod", "data");
      };
    
      handleBack = () => {
        navigate("/configuration");
        socket.emit("delete_mod", "data");
      };
    
      handlePlayerCountChange = (event) => {
        setPlayerCount(parseInt(event.target.value));
      };
    
      copygamepin = (event) => {
        event.target.select();
        document.execCommand("copy");
        // alert('copied gamepin');
      };

}