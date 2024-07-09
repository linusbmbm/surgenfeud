import AnswerEntry from "./AnswerEntry.interface";

interface QuestionEntry {
  question: string;
  answers: AnswerEntry[];
}

export default QuestionEntry;
