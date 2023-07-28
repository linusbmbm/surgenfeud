import Type_Answer from "../types/Type_Answer.ts";
import Type_Visibility from "../types/Type_Visibility.ts";

declare module "react" {
  interface CSSProperties {
    "--inLeftNr"?: number;
  }
}

interface Props {
  answer: Type_Answer;
  classPrefix?: string;
  visibility: Type_Visibility;
}

const AnswerCard = ({ answer, classPrefix = "", visibility }: Props) => {
  const answerCardGridClass = `${classPrefix}answerCardGrid`;
  const answerCardGridElementClass = `answerCard ${classPrefix}answerCardGridElement`;

  if (visibility === "false") {
    return <div className="answerCard" />;
  }

  if (visibility === "number") {
    return (
      <div className="answerCard animate--number">
        <span style={{ "--inLeftNr": Number(answer[0]) }}>{answer[0]}</span>
      </div>
    );
  }

  if (visibility === "hidden") {
    return (
      <div className={answerCardGridClass}>
        <div className={answerCardGridElementClass}>???</div>
        <div className={answerCardGridElementClass}>?</div>
      </div>
    );
  }

  return (
    <div className={answerCardGridClass}>
      <div className={answerCardGridElementClass + " animate--fadeIn"}>
        <span>{answer[1]}</span>
      </div>
      <div className={answerCardGridElementClass + " animate--fadeIn"}>
        <span>{answer[2]}</span>
      </div>
    </div>
  );
};

export default AnswerCard;
