import "./AnswerCard.css";
import { useState, useEffect, useRef } from "react";
import AnswerVisibility from "../../types/Enum_AnswerVisibility";
import Interface_Answer from "../../types/Interface_Answer";

declare module "react" {
  interface CSSProperties {
    "--animation-delay"?: number;
  }
}

interface Props {
  index?: number;
  answer: Interface_Answer;
  visibility: AnswerVisibility;
}

const AnswerCard = ({ index, answer, visibility }: Props) => {
  const [answerText, setAnswerText] = useState<string>(answer.answerText);
  const [answerValue, setAnswerValue] = useState<string>(
    answer.answerValue.toString()
  );
  const [animationCorrectOrIncorrect, setAnimationCorrectOrIncorrect] =
    useState<boolean>(false);
  const [animationHide, setAnimationHide] = useState<boolean>(false);
  const prevVisibility = useRef<AnswerVisibility>();

  useEffect(() => {
    if (
      visibility === AnswerVisibility.true &&
      prevVisibility.current != AnswerVisibility.true
    ) {
      setAnswerText(answer.answerText);
      setAnswerValue(answer.answerValue.toString());
      setAnimationCorrectOrIncorrect(true);
      setTimeout(() => setAnimationCorrectOrIncorrect(false), 700);
    } else if (
      visibility === AnswerVisibility.hidden &&
      prevVisibility.current != AnswerVisibility.hidden
    ) {
      setAnimationHide(true);
      setTimeout(() => setAnimationHide(false), 700);
      setTimeout(() => setAnswerText("???"), 500);
      setTimeout(() => setAnswerValue("?"), 500);
    }

    prevVisibility.current = visibility;
  }, [answer, visibility]);

  if (visibility === AnswerVisibility.false) {
    return <div className="answer"></div>;
  }

  if (visibility === AnswerVisibility.number) {
    return (
      <div className="answer-number">
        <span style={{ "--animation-delay": index }}>{index}</span>
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
