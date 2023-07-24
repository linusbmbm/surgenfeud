import { useState } from "react";

interface Props {
  defaultValue?: number;
  onSubmit: any;
  visibility: boolean;
}

const QuestionJump = ({ defaultValue = 0, onSubmit, visibility }: Props) => {
  const [pageNum, setPageNum] = useState<number>(defaultValue);

  const handleChange = (event: any) => {
    setPageNum(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    onSubmit(pageNum);
  };

  if (!visibility) {
    return null;
  }

  return (
    <div className="questionJump">
      <form onSubmit={handleSubmit}>
        <input type="number" value={pageNum} onChange={handleChange} min={0} />
        <button type="submit">Dulle</button>
      </form>
    </div>
  );
};

export default QuestionJump;
