import "../../../styles.css";
import "./Finals.css";
import React, { useEffect } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import ShotsCard from "../../components/ShotsCard/ShotsCard";
import AnswerCard from "../../components/AnswerCard/AnswerCard";
import PointsCard from "../../components/PointsCard/PointsCard";
import AnswerVisibility from "../../types/Enum_AnswerVisibility";
import ShotType from "../../types/Enum_ShotType";
import useLocalStorageRead from "../../helpers/useLocalStorageRead";
import Interface_Answer from "../../types/Interface_Answer";

function Finals() {
  //Variables
  const finalsColor = useLocalStorageRead<[number, number, number]>(
    "finalsColor",
    [255, 255, 255]
  );

  const answersFinals = useLocalStorageRead<Interface_Answer[][]>(
    "answersFinals",
    [[{ answerText: "", answerValue: 0 }]]
  );
  const answersFinalsNumGiven = useLocalStorageRead<number[]>(
    "answersFinalsNumGiven",
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
  );
  const visibilityAnswersFinals = useLocalStorageRead<AnswerVisibility[]>(
    "visibilityAnswersFinals",
    [AnswerVisibility.false]
  );

  const pointsFinals = useLocalStorageRead<number>("pointsFinals", 0);

  const navigate = useLocalStorageRead<string>("navigate", "");
  const navigator: NavigateFunction = useNavigate();

  //Functions
  const fixAnswer = (
    answerNumGiven: number,
    answers: Interface_Answer[]
  ): Interface_Answer => {
    return answerNumGiven === -1
      ? { answerText: "", answerValue: 0 }
      : answerNumGiven === 10
      ? { answerText: "Nein, nein, nein!", answerValue: 0 }
      : answers[answerNumGiven];
  };

  //Hooks
  useEffect(() => {
    navigator(navigate);
  }, [navigate]);

  useEffect(() => {
    localStorage.removeItem("navigate");
  }, []);

  return (
    <>
      <div
        className="finals"
        style={{
          background: `radial-gradient(circle 130vh at 50% 20%, rgba(${finalsColor}, 0.8), transparent)`,
        }}
      >
        <div className="finals-elements">
          <div className="finals-element finals-points">
            <PointsCard points={pointsFinals} />
          </div>

          <div className="finals-element finals-answers">
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

          <div className="finals-element finals-shots-total">
            <ShotsCard
              num={Math.ceil(pointsFinals / 15)}
              type={ShotType.total}
            />
          </div>
          <div className="finals-element finals-shots-person">
            <ShotsCard
              num={Math.floor(Math.ceil(pointsFinals / 15) / 3)}
              type={ShotType.person}
            />
          </div>
          <div className="finals-element finals-shots-rest">
            <ShotsCard
              num={Math.ceil(pointsFinals / 15) % 3}
              type={ShotType.rest}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Finals;
