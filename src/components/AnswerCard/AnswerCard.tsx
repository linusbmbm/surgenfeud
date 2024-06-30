import "./AnswerCard.css";
import Type_Answer from "../../types/Type_Answer";
import Type_Visibility from "../../types/Type_Visibility";
import { useState, useEffect } from "react";

declare module "react" {
  interface CSSProperties {
    "--animation-delay"?: number;
  }
}

interface Props {
  answer: Type_Answer;
  visibility: Type_Visibility;
}

const AnswerCard = ({ answer, visibility }: Props) => {
  const [answerText, setAnswerText] = useState(answer[1]);
  const [answerValue, setAnswerValue] = useState(answer[2]);
  const [animationCorrectOrIncorrect, setAnimationCorrectOrIncorrect] =
    useState(false);
  const [animationHide, setAnimationHide] = useState(false);

  useEffect(() => {
    if (visibility === "true") {
      setAnswerText(answer[1]);
      setAnswerValue(answer[2]);
      setAnimationCorrectOrIncorrect(true);
      setTimeout(() => setAnimationCorrectOrIncorrect(false), 700);
    } else if (visibility === "hidden") {
      setAnimationHide(true);
      setTimeout(() => setAnimationHide(false), 700);
      setTimeout(() => setAnswerText("???"), 500);
      setTimeout(() => setAnswerValue("?"), 500);
    }
  }, [answer, visibility]);

  if (visibility === "false" || answer.every((element) => element === "")) {
    return <div className="answer" />;
  }

  if (visibility === "number") {
    return (
      <div className="answer-number">
        <span style={{ "--animation-delay": Number(answer[0]) }}>
          {answer[0]}
        </span>
      </div>
    );
  }

  if (visibility === "hidden") {
    return (
      <div className="answer">
        <div className={`answer-text ${animationHide ? "animationHide" : ""}`}>
          <span>{answerText}</span>
        </div>
        <div className={`answer-value ${animationHide ? "animationHide" : ""}`}>
          <span>{answerValue}</span>
        </div>
      </div>
    );
  }

  if (visibility === "true") {
    return (
      <div
        className={`answer ${
          animationCorrectOrIncorrect
            ? Number(answerValue) > 0
              ? "animationCorrect"
              : "animationInCorrect"
            : ""
        }`}
      >
        <div className="answer-text">
          <span>{answerText}</span>
        </div>
        <div className="answer-value">
          <span>{answerValue}</span>
        </div>
      </div>
    );
  }
};

export default AnswerCard;
