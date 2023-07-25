interface Props {
  questionNumber: number;
  questionText: string;
  visibility: boolean;
}

const QuestionCard = ({ questionNumber, questionText, visibility }: Props) => {
  if (!visibility) {
    return "";
  }

  return (
    <div className="questionCard">
      Frage {questionNumber}:<br />
      {questionText}
    </div>
  );
};

export default QuestionCard;
