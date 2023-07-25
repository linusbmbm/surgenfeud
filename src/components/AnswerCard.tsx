import Type_Answer from "../types/Type_Answer.ts";
import Type_Visibility from "../types/Type_Visibility.ts";

interface Props {
  answer: Type_Answer;
  classPrefix?: string;
  visibility: Type_Visibility;
}

const AnswerCard = ({ answer, classPrefix = "", visibility }: Props) => {
  const answerCardClass = `${classPrefix}answerCard`;
  const answerCardGridClass = `${classPrefix}answerCardGrid`;

  if (visibility === "false") {
    return <div className={answerCardClass} />;
  }

  if (visibility === "number") {
    return <div className={answerCardClass}>{answer[0]}</div>;
  }

  return (
    <div className={answerCardGridClass}>
      <div className={answerCardClass}>{answer[1]}</div>
      <div className={answerCardClass}>{answer[2]}</div>
    </div>
  );
};

export default AnswerCard;
