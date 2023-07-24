import { useEffect, useState } from "react";
import "./index.css";
import { Round } from "./interfaces/Round";
import datajson from "./data/data.json";
import AnswerCard from "./components/AnswerCard";

function Finals() {
  const [visibilityQuestionJump, setVisibilityQuestionJump] =
    useState<boolean>(false);

  const [changeRoundNum, setChangeRoundNum] = useState<boolean>(false);

  const [roundNumStart, setRoundNum] = useState<number>(0);

  const [answerNums, setAnswerNums] = useState<number[]>([
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  ]);

  const [onePressed, setOnePressed] = useState<boolean>(false);

  const [changeAnswerNumTo, setChangeAnswerNumTo] = useState<number>(-1);

  const quiz: Round[] = datajson;
  const answersNow: (number | string)[][][] = [
    quiz[roundNumStart]["answers"],
    quiz[roundNumStart + 1]["answers"],
    quiz[roundNumStart + 2]["answers"],
    quiz[roundNumStart + 3]["answers"],
    quiz[roundNumStart + 4]["answers"],
  ];

  useEffect(() => {
    document.addEventListener("keydown", detectKeyDown);
  }, []);

  const detectKeyDown = (e: KeyboardEvent) => {
    // const numbers = {
    //   "1": 0,
    //   "2": 1,
    //   "3": 2,
    //   "4": 3,
    //   "5": 4,
    //   "6": 5,
    //   "7": 6,
    //   "8": 7,
    //   "9": 8,
    //   "0": 9,
    // };

    // if (e.key in numbers) {
    //   const keyPress = e.key as keyof typeof numbers;
    //   setChangeAnswerNumTo(numbers[keyPress]);
    // }
    if (e.key === "1") {
      setOnePressed(true);
    }
  };

  useEffect(() => {
    if (onePressed) {
      setAnswerNums((prevAnswerNums) => {
        const empty: number = prevAnswerNums.findIndex(
          (element) => element < 0
        );
        prevAnswerNums[empty] = 1;
        return prevAnswerNums;
      });
      setOnePressed(false);
    }
  }, [onePressed]);

  console.log(answerNums);

  // if (changeAnswerNumTo >= 0) {
  //   setAnswerNums((prevAnswerNums) => {
  //     const empty: number = prevAnswerNums.findIndex((element) => element < 0);
  //     prevAnswerNums[empty] = changeAnswerNumTo;
  //     return prevAnswerNums;
  //   });
  //   setChangeAnswerNumTo(-1);
  // }

  return (
    <>
      <div className="finalGrid">
        {answersNow.map((round, index) => (
          <AnswerCard
            key={index}
            answer={
              answerNums[index] === -1 ? ["", "", ""] : round[answerNums[index]]
            }
            visibility={"true"}
          />
        ))}
      </div>
    </>
  );
}

export default Finals;
