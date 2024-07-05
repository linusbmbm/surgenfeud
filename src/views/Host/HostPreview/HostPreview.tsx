import { NavigateFunction, useNavigate } from "react-router-dom";
import useLocalStorageWrite from "../../helpers/useLocalStorageWrite";
import "./HostPreview.css";
import { useEffect } from "react";

const HostPreview = () => {
  const [navigate, setNavigate] = useLocalStorageWrite<string>("navigate", "");
  const navigator: NavigateFunction = useNavigate();

  useEffect(() => {
    localStorage.clear;
  }, []);

  useEffect(() => {
    if (navigate) {
      navigator(`/host${navigate}`);
    }
  }, [navigate]);

  const startGame = () => {
    setNavigate("/game");
  };

  return (
    <>
      <div className="host-preview">
        <input type="button" value="Start das Spiel" onClick={startGame} />
      </div>
    </>
  );
};

export default HostPreview;
