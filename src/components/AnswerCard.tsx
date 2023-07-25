import Type_Answer from "../types/Type_Answer.ts";
import Type_Visibility from "../types/Type_Visibility.ts";

interface Props {
  answer: Type_Answer;
  classPrefix?: string;
  visibility: Type_Visibility;
}

const AnswerCard = ({ answer, classPrefix = "", visibility }: Props) => {
  const answerCardGridClass = `${classPrefix}answerCardGrid`;
  const answerCardGridElementClass = `${classPrefix}answerCardGridElement`;

  if (visibility === "false") {
    return <div className="answerCard" />;
  }

  if (visibility === "number") {
    return <div className="answerCard">{answer[0]}</div>;
  }

  return (
    <div className={answerCardGridClass}>
      <div className={answerCardGridElementClass}>{answer[1]}</div>
      <div className={answerCardGridElementClass}>{answer[2]}</div>
    </div>
  );
};

export default AnswerCard;
