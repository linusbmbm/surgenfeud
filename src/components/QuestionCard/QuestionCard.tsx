import "./QuestionCard.css";

interface Props {
  questionText: string;
  visibility: boolean;
}

const QuestionCard = ({ questionText, visibility }: Props) => {
  if (!visibility) {
    return <div className="question-card" />;
  }

  return (
    <div className="question-card">
      <span className="question-text">{questionText}</span>
    </div>
  );
};

export default QuestionCard;
