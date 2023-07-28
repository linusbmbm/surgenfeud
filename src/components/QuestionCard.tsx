interface Props {
  questionText: string;
  visibility: boolean;
}

const QuestionCard = ({ questionText, visibility }: Props) => {
  if (!visibility) {
    return "";
  }

  return (
    <div className="questionCard animate--fadeIn">
      <span>{questionText}</span>
    </div>
  );
};

export default QuestionCard;
