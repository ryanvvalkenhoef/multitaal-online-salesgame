import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomeScreen } from "./components/HomeScreen";
import { ModSettings } from "./GameSettings/ModSettings";
import { Game } from "./components/Game";
import { JoinGame } from "./components/JoinGame";
import { GamePin } from "./comopnents/UI/GamePin";
import { ModView } from "./components/UI/ModView";
import musicOn from "./Assets/musicOn.png";
import musicOff from "./Assets/musicOff.png";
import { ResultScreen } from "./components/ResultScreen";
import { LoadGame } from "./LoadGame/LoadGame";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<HomeScreen />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/configuration" element={<ModSettings />} />
          <Route path="/game" element={<Game />} />
          <Route path="/joingame" element={<JoinGame />} />
          <Route path="/loadgame" element={<LoadGame />} />{" "}
          {/* New route for LoadGame */}
          <Route path="/gamepin" element={<GamePin />} />
          <Route path="/modview" element={<ModView />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
