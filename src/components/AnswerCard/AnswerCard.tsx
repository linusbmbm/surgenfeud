import "./AnswerCard.css";
import Type_Answer from "../../types/Type_Answer";
import { useState, useEffect } from "react";
import AnswerVisibility from "../../types/Enum_AnswerVisibility";

declare module "react" {
  interface CSSProperties {
    "--animation-delay"?: number;
  }
}

interface Props {
  answer: Type_Answer;
  visibility: AnswerVisibility;
}

const AnswerCard = ({ answer, visibility }: Props) => {
  const [answerText, setAnswerText] = useState(answer[1]);
  const [answerValue, setAnswerValue] = useState(answer[2]);
  const [animationCorrectOrIncorrect, setAnimationCorrectOrIncorrect] =
    useState(false);
  const [animationHide, setAnimationHide] = useState(false);

  useEffect(() => {
    if (visibility === AnswerVisibility.true) {
      setAnswerText(answer[1]);
      setAnswerValue(answer[2]);
      setAnimationCorrectOrIncorrect(true);
      setTimeout(() => setAnimationCorrectOrIncorrect(false), 700);
    } else if (visibility === AnswerVisibility.hidden) {
      setAnimationHide(true);
      setTimeout(() => setAnimationHide(false), 700);
      setTimeout(() => setAnswerText("???"), 500);
      setTimeout(() => setAnswerValue("?"), 500);
    }
  }, [answer, visibility]);

  if (
    visibility === AnswerVisibility.false ||
    answer.every((element) => element === "")
  ) {
    return <div className="answer" />;
  }

  if (visibility === AnswerVisibility.number) {
    return (
      <div className="answer-number">
        <span style={{ "--animation-delay": Number(answer[0]) }}>
          {answer[0]}
        </span>
      </div>
    );
  }

  if (visibility === AnswerVisibility.hidden) {
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

  if (visibility === AnswerVisibility.true) {
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
