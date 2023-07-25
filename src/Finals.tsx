import { useEffect, useState } from "react";
import "./index.css";
import { Round } from "./interfaces/Round";
import datajson from "./data/data.json";
import AnswerCard from "./components/AnswerCard";
import keypressHook from "./hooks/keypressHook";
import React from "react";
import QuestionJump from "./components/QuestionJump";
import PointsTeamCard from "./components/PointsTeamCard";
import { useNavigate, useParams } from "react-router-dom";

function Finals() {
  const navigate = useNavigate();

  const quiz: Round[] = datajson;

  const [visibilityQuestionJump, setVisibilityQuestionJump] =
    useState<boolean>(false);

  const [roundFirst, setRoundFirst] = useState<number>(Number(useParams().id));

  const [answerNums, setAnswerNums] = useState<number[]>([
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  ]);

  const [answersFinals, setAnswersFinals] = useState<(number | string)[][][]>([
    [[""]],
  ]);

  const [points, setPoints] = useState<number>(0);

  keypressHook(() => {
    if (!visibilityQuestionJump) {
      setVisibilityQuestionJump(true);
    } else {
      setVisibilityQuestionJump(false);
    }
  }, "j");

  useEffect(() => {
    setPoints(() => {
      let updatedPoints: number = 0;
      answersFinals.map((answerRound, index) => {
        updatedPoints +=
          answerNums[index] >= 0 && answerNums[index] <= 9
            ? Number(answerRound[answerNums[index]][2])
            : 0;
      });
      answersFinals.map((answerRound, index) => {
        const doubleIndex: number = index + answersFinals.length;
        updatedPoints +=
          answerNums[doubleIndex] >= 0 && answerNums[doubleIndex] <= 9
            ? Number(answerRound[answerNums[doubleIndex]][2])
            : 0;
      });
      return updatedPoints;
    });
  }, [answerNums]);

  useEffect(() => {
    setAnswersFinals((prevAnswersFinals) => {
      const updatedAnswersFinals = [...prevAnswersFinals];
      Array.from({ length: 5 }).map((_, index) => {
        updatedAnswersFinals[index] = quiz[roundFirst + index]["answers"];
      });
      return updatedAnswersFinals;
    });
  }, [roundFirst]);

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

  Object.keys(indexKeyMap).map((mapIndex) => {
    const index = Number(mapIndex) as keyof typeof indexKeyMap;

    keypressHook(() => {
      setAnswerNums((prevAnswerNums) => {
        const updatedAnswerNums = [...prevAnswerNums];
        const indexFirstMinusOneValue = answerNums.findIndex(
          (answerNum) => answerNum === -1
        );
        updatedAnswerNums[indexFirstMinusOneValue] = index;
        return updatedAnswerNums;
      });
    }, indexKeyMap[index]);
  });

  keypressHook(() => {
    setAnswerNums((prevAnswerNums) => {
      const updatedAnswerNums = [...prevAnswerNums];
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

  //functions
  const setQuestionNum = (questionNum: number) => {
    setRoundFirst(questionNum);
  };

  const fixAnswer = (
    selectedAnswer: number,
    possibleAnswers: (number | string)[][]
  ) => {
    return selectedAnswer === -1
      ? ["", "", ""]
      : selectedAnswer === 10
      ? ["", "DULLE BLEIBT KNÜLLE", 0]
      : possibleAnswers[selectedAnswer];
  };

  keypressHook(() => {
    navigate(`/${roundFirst + 5}`);
  }, "f");

  return (
    <>
      <QuestionJump
        defaultValue={roundFirst}
        onSubmit={setQuestionNum}
        visibility={visibilityQuestionJump}
      />

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
        <PointsTeamCard points={points} teamName={"TOTAL"} />
      </div>

      <div className="finalsPinnchenGrid">
        <PointsTeamCard points={Math.ceil(points / 15)} teamName={"Pinnchen"} />

        <PointsTeamCard
          points={Math.floor(points / 15 / 4)}
          teamName={"Pinnchen pro Person"}
        />

        <PointsTeamCard
          points={Math.ceil((points / 15) % 4)}
          teamName={"Pinnchen Rest"}
        />
      </div>
    </>
  );
}

export default Finals;
