import "../../../styles.css";
import "./Finals.css";
import React, { useEffect, useState } from "react";
import {
  NavigateFunction,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import datajson from "../../data/data.json";
import Interface_Round from "../../types/Interface_Round";
import Type_Answer from "../../types/Type_Answer";
import KeypressHook from "../../hooks/KeypressHook";
import QuestionJump from "../../components/QuestionJump/QuestionJump";
import ShotsCard from "../../components/ShotsCard/ShotsCard";
import AnswerCard from "../../components/AnswerCard/AnswerCard";
import PointsCard from "../../components/PointsCard/PointsCard";
import Type_Visibility from "../../types/Type_Visibility";

function Finals() {
  //Variables
  const navigate: NavigateFunction = useNavigate();
  const { id } = useParams();
  const roundNum: number = id ? Number(id) : 0;

  const location = useLocation();
  const finalsColor: number[] = location.state.winnerColor
    ? location.state.winnerColor
    : [255, 255, 255];

  const quiz: Interface_Round[] = datajson;

  const indexKeyMap = {
    0: "1",
    1: "2",
    2: "3",
    3: "4",
    4: "5",
    5: "6",
    6: "7",
    7: "8",
    8: "9",
    9: "0",
    10: "x",
  };
  const [answersFinals, setAnswersFinals] = useState<Type_Answer[][]>([[[""]]]);
  const [answerNums, setAnswerNums] = useState<number[]>([
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  ]);
  const [visibilityQuestionJump, setVisibilityQuestionJump] =
    useState<boolean>(false);
  const [visibilityAnswersLeft, setVisibilityAnswersLeft] =
    useState<Type_Visibility>("true");

  const [pointsTotal, setPointsTotal] = useState<number>(0);

  //Functions
  const fixAnswer = (
    selectedAnswer: number,
    possibleAnswers: Type_Answer[]
  ): Type_Answer => {
    return selectedAnswer === -1
      ? ["", "", ""]
      : selectedAnswer === 10
      ? ["", "Nein, nein, nein!", "0"]
      : possibleAnswers[selectedAnswer];
  };

  const changeRound = (changeToRoundNum: number): void => {
    navigate(`/finals/${changeToRoundNum}`);
    setVisibilityQuestionJump(false);
  };

  //Hooks
  useEffect(() => {
    setAnswersFinals(() => {
      const updatedAnswersFinals: Type_Answer[][] = [[[""]]];
      for (let index = 0; index < 5; index++) {
        updatedAnswersFinals[index] = quiz[roundNum + index]["answers"];
      }
      return updatedAnswersFinals;
    });
  }, [quiz, roundNum]);

  useEffect(() => {
    setPointsTotal(() => {
      let updatedPointsTotal: number = 0;
      answersFinals.map((answerRound, index) => {
        updatedPointsTotal +=
          answerNums[index] >= 0 && answerNums[index] <= 9
            ? Number(answerRound[answerNums[index]][2])
            : 0;
      });
      answersFinals.map((answerRound, index) => {
        const doubleIndex: number = index + answersFinals.length;
        updatedPointsTotal +=
          answerNums[doubleIndex] >= 0 && answerNums[doubleIndex] <= 9
            ? Number(answerRound[answerNums[doubleIndex]][2])
            : 0;
      });
      return updatedPointsTotal;
    });
  }, [answersFinals, answerNums]);

  KeypressHook(() => {
    setVisibilityQuestionJump(!visibilityQuestionJump);
  }, "j");

  Object.keys(indexKeyMap).map((mapIndex) => {
    const index: keyof typeof indexKeyMap = Number(
      mapIndex
    ) as keyof typeof indexKeyMap;

    KeypressHook(() => {
      if (!visibilityQuestionJump) {
        setAnswerNums((prevAnswerNums) => {
          const updatedAnswerNums: number[] = [...prevAnswerNums];
          const indexFirstMinusOneValue: number = answerNums.findIndex(
            (answerNum) => answerNum === -1
          );
          if (indexFirstMinusOneValue !== -1) {
            if (
              answersFinals[
                indexFirstMinusOneValue < 5
                  ? indexFirstMinusOneValue
                  : indexFirstMinusOneValue - 5
              ][index] !== undefined ||
              index === 10
            ) {
              updatedAnswerNums[indexFirstMinusOneValue]
                ? (updatedAnswerNums[indexFirstMinusOneValue] = index)
                : null;
            }
          }
          return updatedAnswerNums;
        });
      }
    }, indexKeyMap[index]);
  });

  KeypressHook(() => {
    setAnswerNums((prevAnswerNums) => {
      const updatedAnswerNums: number[] = [...prevAnswerNums];
      let indexLastNonMinusOneValue: number = 0;
      answerNums.map((answerNum, index) => {
        if (answerNum !== -1) {
          indexLastNonMinusOneValue = index;
        }
      });
      updatedAnswerNums[indexLastNonMinusOneValue] = -1;
      return updatedAnswerNums;
    });
  }, "-");

  KeypressHook(() => {
    if (visibilityAnswersLeft === "true") {
      setVisibilityAnswersLeft("hidden");
    } else {
      setVisibilityAnswersLeft("true");
    }
  }, "y");

  KeypressHook(() => {
    navigate(`/game/${roundNum + 5}`);
  }, "f");

  return (
    <>
      <div
        className="finals"
        style={{
          background: `radial-gradient(circle 130vh at 50% 20%, rgba(${finalsColor}, 0.8), transparent)`,
        }}
      >
        <QuestionJump
          defaultValue={roundNum}
          onSubmit={changeRound}
          visibility={visibilityQuestionJump}
        />

        <div className="finals-elements">
          <div className="finals-element finals-points">
            <PointsCard points={pointsTotal} />
          </div>

          <div className="finals-element finals-answers">
            {answersFinals.map((round, index) => (
              <React.Fragment key={index}>
                <AnswerCard
                  key={`1.${index}`}
                  answer={fixAnswer(answerNums[index], round)}
                  visibility={visibilityAnswersLeft}
                />
                <AnswerCard
                  key={`2.${index}`}
                  answer={fixAnswer(answerNums[index + 5], round)}
                  visibility={"true"}
                />
              </React.Fragment>
            ))}
          </div>

          <div className="finals-element finals-shots-total">
            <ShotsCard num={Math.ceil(pointsTotal / 15)} type="total" />
          </div>
          <div className="finals-element finals-shots-person">
            <ShotsCard
              num={Math.floor(Math.ceil(pointsTotal / 15) / 3)}
              type="person"
            />
          </div>
          <div className="finals-element finals-shots-rest">
            <ShotsCard num={Math.ceil(pointsTotal / 15) % 3} type="rest" />
          </div>
        </div>
      </div>
    </>
  );
}

export default Finals;
