import "/styles.css";
import "./HostPreview.css";
import { NavigateFunction, useNavigate } from "react-router-dom";
import useLocalStorageWrite from "../../../helpers/useLocalStorageWrite";
import { useEffect } from "react";

const HostPreview = () => {
  //Variables
  const navigator: NavigateFunction = useNavigate();

  const [navigate, setNavigate] = useLocalStorageWrite<string>("navigate", "");

  //Hooks
  useEffect(() => {
    localStorage.clear();
  }, []);

  useEffect(() => {
    if (navigate) {
      navigator(`/host${navigate}`);
    }
  }, [navigate]);

  //Button Functions
  const startGame = () => {
    setNavigate("/game");
  };

  return (
    <>
      <div className="host-preview">
        <button onClick={startGame}>Starte das Spiel</button>
      </div>
    </>
  );
};

export default HostPreview;
