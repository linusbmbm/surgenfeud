interface Props {
  answer: (number | string)[];
  visibility: "false" | "number" | "true";
}

const AnswerCard = ({ answer, visibility }: Props) => {
  return (
    <div className="answerCard">
      {visibility === "false"
        ? ""
        : visibility === "number"
        ? answer[0]
        : answer[1] + " " + answer[2]}
    </div>
  );
};

export default AnswerCard;
