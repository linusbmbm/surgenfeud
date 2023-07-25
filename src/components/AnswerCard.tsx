interface Props {
  answer: (number | string)[];
  classPrefix?: string;
  visibility: "false" | "number" | "true";
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
