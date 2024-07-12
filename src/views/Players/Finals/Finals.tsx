import "/styles.css";
import "./Finals.css";
import { useEffect } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import ShotsCard from "../../../components/ShotsCard/ShotsCard";
import AnswerCard from "../../../components/AnswerCard/AnswerCard";
import PointsCard from "../../../components/PointsCard/PointsCard";
import AnswerVisibility from "../../../types/Enum_AnswerVisibility";
import ShotType from "../../../types/Enum_ShotType";
import useLocalStorageRead from "../../../helpers/useLocalStorageRead";
import AnswerEntry from "../../../types/AnswerEntry.interface";

function Finals() {
  //Variables
  const navigator: NavigateFunction = useNavigate();

  const navigate = useLocalStorageRead<string>("navigate", "");
  const finalsColor = useLocalStorageRead<[number, number, number]>(
    "finalsColor",
    [255, 255, 255]
  );
  const pointsFinals = useLocalStorageRead<number>("pointsFinals", 0);
  const visibilityAnswersFinals = useLocalStorageRead<AnswerVisibility[]>(
    "visibilityAnswersFinals",
    [AnswerVisibility.number]
  );
  const answersFinalsNumGiven = useLocalStorageRead<number[]>(
    "answersFinalsNumGiven",
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
  );
  const answersFinals = useLocalStorageRead<AnswerEntry[][]>("answersFinals", [
    [{ text: "", value: 0 }],
  ]);

  const calcShotsTotal: number = Math.ceil(pointsFinals / 15);
  const calcShotsPerson: number = Math.floor(calcShotsTotal / 3);
  const calcShotsRest: number = calcShotsTotal % 3;

  //Hooks
  useEffect(() => {
    localStorage.removeItem("navigate");
  }, []);

  useEffect(() => {
    navigator(navigate);
  }, [navigate]);

  //Functions
  const fixAnswer = (
    answerNumGiven: number,
    answers: AnswerEntry[]
  ): AnswerEntry => {
    return answerNumGiven === -1
      ? { text: "", value: 0 }
      : answerNumGiven === -2
      ? { text: "Nein, nein, nein!", value: 0 }
      : answers[answerNumGiven];
  };

  return (
    <>
      <div
        className="finals"
        style={{
          background: `radial-gradient(circle 130vh at 50% 20%, rgba(${finalsColor}, 0.8), transparent)`,
        }}
      >
        <div className="finals-elements">
          <div className="finals-element points">
            <PointsCard points={pointsFinals} />
          </div>

          <div className="finals-element answers">
            {answersFinals.map((round, index) => (
              <>
                <AnswerCard
                  key={`1.${index}`}
                  answer={fixAnswer(answersFinalsNumGiven[index], round)}
                  visibility={visibilityAnswersFinals[index]}
                />
                <AnswerCard
                  key={`2.${index}`}
                  answer={fixAnswer(answersFinalsNumGiven[index + 5], round)}
                  visibility={visibilityAnswersFinals[index + 5]}
                />
              </>
            ))}
          </div>

          <div className="finals-element shots-total">
            <ShotsCard num={calcShotsTotal} type={ShotType.total} />
          </div>
          <div className="finals-element shots-person">
            <ShotsCard num={calcShotsPerson} type={ShotType.person} />
          </div>
          <div className="finals-element shots-rest">
            <ShotsCard num={calcShotsRest} type={ShotType.rest} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Finals;
