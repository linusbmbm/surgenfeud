import "../../../../styles.css";
import "./Preview.css";
import { useNavigate } from "react-router-dom";
import LogoImage from "../../../images/Logo.png";
import PearImage from "../../../images/Pear.png";
import { useEffect } from "react";
import useLocalStorageRead from "../../../helpers/useLocalStorageRead";

const Preview = () => {
  const navigate = useLocalStorageRead<string>("navigate", "");
  const navigator = useNavigate();
  const firstWord: string[] = ["S", "U", "R", "G", "E", "N"];
  const secondWord: string[] = ["F", "E", "U", "D"];

  //Hooks
  useEffect(() => {
    navigator(navigate);
  }, [navigate]);

  return (
    <div className="preview">
      <div className="game-name">
        <div className="game-name-text">
          <div className="game-name-text-first-word">
            {firstWord.map((letter, index) => {
              return (
                <div
                  key={index}
                  className={`game-name-text-first-word-letter${index}`}
                >
                  {letter}
                </div>
              );
            })}
          </div>
          <div className="game-name-text-second-word">
            {secondWord.map((letter, index) => {
              return (
                <div
                  key={index}
                  className={`game-name-text-second-word-letter${index}`}
                >
                  {letter}
                </div>
              );
            })}
          </div>
        </div>
        <div className="game-name-icon">
          <img src={LogoImage} height="150px" />
        </div>
      </div>
      <div className="host-presents">präsentiert von eurem Moderator:</div>
      <div className="host-name">
        Will Birney <img src={PearImage} height="70px" />
      </div>
    </div>
  );
};

export default Preview;
