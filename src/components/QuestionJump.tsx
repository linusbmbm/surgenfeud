import React, { useEffect, useState } from "react";

interface Props {
  defaultValue?: number;
  onSubmit: (pageNum: number) => void;
  visibility: boolean;
}

const QuestionJump = ({ defaultValue = 0, onSubmit, visibility }: Props) => {
  const [pageNum, setPageNum] = useState<number>(defaultValue);

  useEffect(() => setPageNum(defaultValue), [defaultValue]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageNum(Number(event.target.value));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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
