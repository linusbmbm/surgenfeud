import "./index.css";
import React, { useEffect, useState } from "react";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import datajson from "./data/data.json";
import Interface_Round from "./types/Interface_Round.ts";
import Type_Answer from "./types/Type_Answer.ts";
import keypressHook from "./hooks/keypressHook.ts";
import QuestionJump from "./components/QuestionJump.tsx";
import PointsTextCard from "./components/PointsTextCard.tsx";
import AnswerCard from "./components/AnswerCard.tsx";
import PointsCard from "./components/PointsCard.tsx";

function Finals() {
  //Variables
  const navigate: NavigateFunction = useNavigate();
  const roundFirst = Number(useParams().id);

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

  const [pointsTotal, setPointsTotal] = useState<number>(0);

  //Functions
  const fixAnswer = (
    selectedAnswer: number,
    possibleAnswers: Type_Answer[]
  ) => {
    return selectedAnswer === -1
      ? ["", "", ""]
      : selectedAnswer === 10
      ? ["", "Nein, nein, nein!", 0]
      : possibleAnswers[selectedAnswer];
  };

  const changeRound = (changeToRoundNum: number) => {
    navigate(`/finals/${changeToRoundNum}`);
    setVisibilityQuestionJump(false);
  };

  //Hooks
  useEffect(() => {
    setAnswersFinals((prevAnswersFinals) => {
      const updatedAnswersFinals: Type_Answer[][] = [...prevAnswersFinals];
      Array.from({ length: 5 }).map((_, index) => {
        updatedAnswersFinals[index] = quiz[roundFirst + index]["answers"];
      });
      return updatedAnswersFinals;
    });
  }, [roundFirst]);

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
  }, [answerNums]);

  keypressHook(() => {
    if (!visibilityQuestionJump) {
      setVisibilityQuestionJump(true);
    }
  }, "j");

  Object.keys(indexKeyMap).map((mapIndex) => {
    const index: keyof typeof indexKeyMap = Number(
      mapIndex
    ) as keyof typeof indexKeyMap;

    keypressHook(() => {
      if (!visibilityQuestionJump) {
        setAnswerNums((prevAnswerNums) => {
          const updatedAnswerNums: number[] = [...prevAnswerNums];
          const indexFirstMinusOneValue: number = answerNums.findIndex(
            (answerNum) => answerNum === -1
          );
          updatedAnswerNums[indexFirstMinusOneValue] = index;
          return updatedAnswerNums;
        });
      }
    }, indexKeyMap[index]);
  });

  keypressHook(() => {
    if (!visibilityQuestionJump) {
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
    }
  }, "-");

  keypressHook(() => {
    if (!visibilityQuestionJump) {
      navigate(`/${roundFirst + 5}`);
    }
  }, "f");

  return (
    <>
      <span>{roundFirst}</span>

      <QuestionJump
        defaultValue={roundFirst}
        onSubmit={changeRound}
        visibility={visibilityQuestionJump}
      />

      <div className="wrapper">
        <div className="finalsAnswerGrid">
          {answersFinals.map((round, index) => (
            <React.Fragment key={index}>
              <AnswerCard
                key={`1.${index}`}
                answer={fixAnswer(answerNums[index], round)}
                classPrefix="finals"
                visibility={"true"}
              />
              <AnswerCard
                key={`2.${index}`}
                answer={fixAnswer(answerNums[index + 5], round)}
                classPrefix="finals"
                visibility={"true"}
              />
            </React.Fragment>
          ))}
        </div>

        <div className="finalsPoints">
          <PointsCard points={pointsTotal} />
        </div>

        <div className="finalsPinnchenGrid">
          <PointsTextCard
            points={Math.ceil(pointsTotal / 15)}
            text={"Pinnchen Gesamt"}
          />

          <PointsTextCard
            points={Math.floor(pointsTotal / 15 / 4)}
            text={"Pinnchen pro Person"}
          />

          <PointsTextCard
            points={Math.ceil((pointsTotal / 15) % 4)}
            text={"übrige Pinnchen"}
          />
        </div>
      </div>
    </>
  );
}

export default Finals;
