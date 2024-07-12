import "/styles.css";
import "./Game.css";
import { NavigateFunction, useNavigate } from "react-router-dom";
import Wrong from "../../../components/Wrong/Wrong";
import PointsCard from "../../../components/PointsCard/PointsCard";
import QuestionCard from "../../../components/QuestionCard/QuestionCard";
import AnswerCard from "../../../components/AnswerCard/AnswerCard";
import PointsFillCard from "../../../components/PointsFillCard/PointsFillCard";
import AnswerVisibility from "../../../types/Enum_AnswerVisibility";
import useLocalStorageRead from "../../../helpers/useLocalStorageRead";
import { useEffect } from "react";
import AnswerEntry from "../../../types/AnswerEntry.interface";

declare module "react" {
  interface CSSProperties {
    "--team-color-alpha"?: number;
    "--teamLeft-color-red"?: number;
    "--teamLeft-color-green"?: number;
    "--teamLeft-color-blue"?: number;
    "--teamRight-color-red"?: number;
    "--teamRight-color-green"?: number;
    "--teamRight-color-blue"?: number;
  }
}

const Game = () => {
  //Variables
  const navigator: NavigateFunction = useNavigate();

  const navigate = useLocalStorageRead<string>("navigate", "");
  const teamLeftColor = useLocalStorageRead<[number, number, number]>(
    "teamLeftColor",
    [255, 255, 255]
  );
  const pointsTeamLeft = useLocalStorageRead<number>("pointsTeamLeft", 0);
  const pointsNow = useLocalStorageRead<number>("pointsNow", 0);
  const teamRightColor = useLocalStorageRead<[number, number, number]>(
    "teamRightColor",
    [255, 255, 255]
  );
  const pointsTeamRight = useLocalStorageRead<number>("pointsTeamRight", 0);
  const visibilityQuestion = useLocalStorageRead<boolean>(
    "visibilityQuestion",
    false
  );
  const question = useLocalStorageRead<string>("question", "");
  const visibilityAnswers = useLocalStorageRead<AnswerVisibility[]>(
    "visibilityAnswers",
    Array.from({ length: 10 }, () => AnswerVisibility.false)
  );
  const answers = useLocalStorageRead<AnswerEntry[]>("answers", [
    { text: "", value: 0 },
  ]);
  const visibilityWrong = useLocalStorageRead<boolean>(
    "visibilityWrong",
    false
  );
  const wrongNum = useLocalStorageRead<number>("wrongNum", 0);

  //Hooks
  useEffect(() => {
    localStorage.removeItem("navigate");
  }, []);

  useEffect(() => {
    navigator(navigate);
  }, [navigate]);

  return (
    <>
      <div className="game">
        <div className="wrongs">
          {Array.from({ length: wrongNum }).map((_, mapIndex) => (
            <Wrong key={mapIndex} visibility={visibilityWrong} />
          ))}
        </div>

        <div
          className="game-elements"
          style={{
            "--team-color-alpha":
              teamLeftColor.every((color) => color === 255) &&
              teamRightColor.every((color) => color === 255)
                ? 0.1
                : 0.3,
            "--teamLeft-color-red": teamLeftColor[0],
            "--teamLeft-color-green": teamLeftColor[1],
            "--teamLeft-color-blue": teamLeftColor[2],
            "--teamRight-color-red": teamRightColor[0],
            "--teamRight-color-green": teamRightColor[1],
            "--teamRight-color-blue": teamRightColor[2],
          }}
        >
          <div className="pointsTeamLeft">
            <PointsFillCard points={pointsTeamLeft} color={teamLeftColor} />
          </div>

          <div className="pointsNow">
            <PointsCard points={pointsNow} />
          </div>

          <div className="pointsTeamRight">
            <PointsFillCard points={pointsTeamRight} color={teamRightColor} />
          </div>

          <div className="question">
            <QuestionCard
              questionText={question}
              visibility={visibilityQuestion}
            />
          </div>

          <div className="answers">
            {answers.map((answer, index) => {
              return (
                <AnswerCard
                  key={index}
                  index={index + 1}
                  answer={answer}
                  visibility={visibilityAnswers[index]}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Game;
