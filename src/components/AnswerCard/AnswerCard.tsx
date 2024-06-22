import "./AnswerCard.css";
import Type_Answer from "../../types/Type_Answer";
import Type_Visibility from "../../types/Type_Visibility";

declare module "react" {
  interface CSSProperties {
    "--inLeftNr"?: number;
  }
}

interface Props {
  answer: Type_Answer;
  visibility: Type_Visibility;
}

const AnswerCard = ({ answer, visibility }: Props) => {
  if (visibility === "false" || answer.every((element) => element === "")) {
    return <div className="answer" />;
  }

  if (visibility === "number") {
    return (
      <div className="answer-number">
        <span>{answer[0]}</span>
      </div>
    );
  }

  if (visibility === "hidden") {
    return (
      <div className="answer">
        <div className="answer-text">
          <span>???</span>
        </div>
        <div className="answer-value">
          <span>?</span>
        </div>
      </div>
    );
  }

  return (
    <div className="answer">
      <div className="answer-text">
        <span>{answer[1]}</span>
      </div>
      <div className="answer-value">
        <span>{answer[2]}</span>
      </div>
    </div>
  );
};

export default AnswerCard;
