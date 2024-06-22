import "./QuestionCard.css";

interface Props {
  questionText: string;
  visibility: boolean;
}

const QuestionCard = ({ questionText, visibility }: Props) => {
  if (!visibility) {
    return <></>;
  }

  return (
    <div className="questionCard">
      <span>{questionText}</span>
    </div>
  );
};

export default QuestionCard;
