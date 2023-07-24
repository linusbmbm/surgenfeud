import "./index.css";
import AnswerCard from "./components/AnswerCard.tsx";
import datajson from "./data/data.json";
import { useCallback, useEffect, useState } from "react";
import { Round } from "./interfaces/Round.ts";
import QuestionCard from "./components/QuestionCard.tsx";
import PointsCard from "./components/PointsCard.tsx";
import Wrong from "./components/Wrong.tsx";
import PointsTeamCard from "./components/PointsTeamCard.tsx";
import QuestionJump from "./components/QuestionJump.tsx";

function App() {
  const team1Name: string = "Team 1";

  const team2Name: string = "Team 2";

  const [visibilityQuestionJump, setVisibilityQuestionJump] =
    useState<boolean>(false);

  const [changeRoundNum, setChangeRoundNum] = useState<boolean>(false);

  const [roundNum, setRoundNum] = useState<number>(0);

  const [visibilityQuestion, setVisibilityQuestion] = useState<boolean>(false);

  const [pointsNow, setPointsNow] = useState<number>(0);

  const [visibilityWrong, setVisibilityWrong] = useState<boolean>(false);

  const [wrongNum, setWrongNum] = useState<number>(-1);

  const [changePointsTeam1, setChangePointsTeam] = useState<boolean>(false);

  const [changePointsTeam2, setAddPointsTeam2] = useState<boolean>(false);

  const [pointsTeam1, setPointsTeam1] = useState<number>(0);

  const [pointsTeam2, setPointsTeam2] = useState<number>(0);

  const [roundEnd, setRoundEnd] = useState<boolean>(false);

  const [visibility1, setVisibility1] = useState<"false" | "number" | "true">(
    "false"
  );

  const [visibility2, setVisibility2] = useState<"false" | "number" | "true">(
    "false"
  );

  const [visibility3, setVisibility3] = useState<"false" | "number" | "true">(
    "false"
  );

  const [visibility4, setVisibility4] = useState<"false" | "number" | "true">(
    "false"
  );

  const [visibility5, setVisibility5] = useState<"false" | "number" | "true">(
    "false"
  );

  const [visibility6, setVisibility6] = useState<"false" | "number" | "true">(
    "false"
  );

  const [visibility7, setVisibility7] = useState<"false" | "number" | "true">(
    "false"
  );

  const [visibility8, setVisibility8] = useState<"false" | "number" | "true">(
    "false"
  );

  const [visibility9, setVisibility9] = useState<"false" | "number" | "true">(
    "false"
  );

  const [visibility10, setVisibility10] = useState<"false" | "number" | "true">(
    "false"
  );

  const quiz: Round[] = datajson;
  const roundNow: Round = quiz[roundNum];

  useEffect(() => {
    document.addEventListener("keydown", detectKeyDown);
    return () => {
      document.removeEventListener("keydown", detectKeyDown);
    };
  }, []);

  const detectKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "1") {
      setVisibility1("true");

      setPointsNow((prevPoints) => prevPoints + Number(roundNow.answers[0][2]));
    } else if (e.key === "2") {
      setVisibility2("true");

      setPointsNow((prevPoints) => prevPoints + Number(roundNow.answers[1][2]));
    } else if (e.key === "3") {
      setVisibility3("true");

      setPointsNow((prevPoints) => prevPoints + Number(roundNow.answers[2][2]));
    } else if (e.key === "4") {
      setVisibility4("true");

      setPointsNow((prevPoints) => prevPoints + Number(roundNow.answers[3][2]));
    } else if (e.key === "5") {
      setVisibility5("true");

      setPointsNow((prevPoints) => prevPoints + Number(roundNow.answers[4][2]));
    } else if (e.key === "6") {
      setVisibility6("true");

      setPointsNow((prevPoints) => prevPoints + Number(roundNow.answers[5][2]));
    } else if (e.key === "7") {
      setVisibility7("true");

      setPointsNow((prevPoints) => prevPoints + Number(roundNow.answers[6][2]));
    } else if (e.key === "8") {
      setVisibility8("true");

      setPointsNow((prevPoints) => prevPoints + Number(roundNow.answers[7][2]));
    } else if (e.key === "9") {
      setVisibility9("true");

      setPointsNow((prevPoints) => prevPoints + Number(roundNow.answers[8][2]));
    } else if (e.key === "0") {
      setVisibility10("true");

      setPointsNow((prevPoints) => prevPoints + Number(roundNow.answers[9][2]));
    } else if (e.key === "a") {
      setVisibility1("number");
      setVisibility2("number");
      setVisibility3("number");
      setVisibility4("number");
      setVisibility5("number");
      setVisibility6("number");
      setVisibility7("number");
      setVisibility8("number");
      setVisibility9("number");
      setVisibility10("number");
    } else if (e.key === "q") {
      setVisibilityQuestion(true);
    } else if (e.key === "x") {
      setVisibilityWrong(true);
    } else if (e.key === "y") {
      setVisibilityWrong(false);
    } else if (e.key === "ArrowLeft") {
      setChangePointsTeam(true);
    } else if (e.key === "ArrowRight") {
      setAddPointsTeam2(true);
    } else if (e.key === "Enter") {
      setChangeRoundNum(true);
    } else if (e.key === "o") {
      setVisibilityQuestionJump(true);
    } else if (e.key === "p") {
      setVisibilityQuestionJump(false);
    } else if (e.key === "-") {
      setPointsNow(0);
    }
  }, []);

  useEffect(() => {
    setWrongNum((prevWrongNum) => prevWrongNum + 0.5);
  }, [visibilityWrong]);

  if (changePointsTeam1 || changePointsTeam2) {
    if (changePointsTeam1) {
      setPointsTeam1((prevPoints) => prevPoints + pointsNow);
      setChangePointsTeam(false);
    } else if (changePointsTeam2) {
      setPointsTeam2((prevPoints) => prevPoints + pointsNow);
      setAddPointsTeam2(false);
    }
    setPointsNow(0);
    setRoundEnd(true);
  }

  const setQuestionNum = (questionNum: number) => {
    setRoundNum(questionNum - 1);
    setChangeRoundNum(true);
  };

  if (changeRoundNum) {
    setRoundNum((prevRoundNum) => prevRoundNum + 1);
    setPointsNow(0);
    setVisibility1("false");
    setVisibility2("false");
    setVisibility3("false");
    setVisibility4("false");
    setVisibility5("false");
    setVisibility6("false");
    setVisibility7("false");
    setVisibility8("false");
    setVisibility9("false");
    setVisibility10("false");
    setVisibilityQuestion(false);
    setWrongNum(0);
    setRoundEnd(false);
    setChangeRoundNum(false);
  }

  const wrongNumArray: number[] = Array.from(
    { length: Math.ceil(wrongNum) },
    (_, index) => index
  );

  return (
    <>
      <div className="wrongGrid">
        {wrongNumArray.map((i) => (
          <Wrong key={i} visibility={visibilityWrong} />
        ))}
      </div>

      <div className="questionJump">
        <QuestionJump
          defaultValue={roundNum}
          onSubmit={setQuestionNum}
          visibility={visibilityQuestionJump}
        />
      </div>

      <div className="points">
        <PointsTeamCard points={pointsTeam1} teamName={team1Name} />
        <PointsCard points={roundEnd ? 0 : pointsNow} />
        <PointsTeamCard points={pointsTeam2} teamName={team2Name} />
      </div>

      <div className="questionNow">
        <QuestionCard
          questionNumber={roundNum}
          questionText={roundNow.question}
          visibility={visibilityQuestion}
        />
      </div>

      <div className="answerGrid">
        <AnswerCard
          key={1}
          answer={
            roundNow.answers[0] === undefined
              ? ["", "", ""]
              : roundNow.answers[0]
          }
          visibility={visibility1}
        />
        <AnswerCard
          key={2}
          answer={
            roundNow.answers[1] === undefined
              ? ["", "", ""]
              : roundNow.answers[1]
          }
          visibility={visibility2}
        />
        <AnswerCard
          key={3}
          answer={
            roundNow.answers[2] === undefined
              ? ["", "", ""]
              : roundNow.answers[2]
          }
          visibility={visibility3}
        />
        <AnswerCard
          key={4}
          answer={
            roundNow.answers[3] === undefined
              ? ["", "", ""]
              : roundNow.answers[3]
          }
          visibility={visibility4}
        />
        <AnswerCard
          key={5}
          answer={
            roundNow.answers[4] === undefined
              ? ["", "", ""]
              : roundNow.answers[4]
          }
          visibility={visibility5}
        />
        <AnswerCard
          key={6}
          answer={
            roundNow.answers[5] === undefined
              ? ["", "", ""]
              : roundNow.answers[5]
          }
          visibility={visibility6}
        />
        <AnswerCard
          key={7}
          answer={
            roundNow.answers[6] === undefined
              ? ["", "", ""]
              : roundNow.answers[6]
          }
          visibility={visibility7}
        />
        <AnswerCard
          key={8}
          answer={
            roundNow.answers[7] === undefined
              ? ["", "", ""]
              : roundNow.answers[7]
          }
          visibility={visibility8}
        />
        <AnswerCard
          key={9}
          answer={
            roundNow.answers[8] === undefined
              ? ["", "", ""]
              : roundNow.answers[8]
          }
          visibility={visibility9}
        />
        <AnswerCard
          key={10}
          answer={
            roundNow.answers[9] === undefined
              ? ["", "", ""]
              : roundNow.answers[9]
          }
          visibility={visibility10}
        />
      </div>
    </>
  );
}

export default App;
