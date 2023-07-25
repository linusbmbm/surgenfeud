import "./index.css";
import { useState } from "react";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import datajson from "./data/data.json";
import Interface_Round from "./types/Interface_Round.ts";
import Type_Visibility from "./types/Type_Visibility.ts";
import Type_Answer from "./types/Type_Answer.ts";
import keypressHook from "./hooks/keypressHook.ts";
import QuestionJump from "./components/QuestionJump.tsx";
import Wrong from "./components/Wrong.tsx";
import PointsTeamCard from "./components/PointsTextCard.tsx";
import PointsCard from "./components/PointsCard.tsx";
import QuestionCard from "./components/QuestionCard.tsx";
import AnswerCard from "./components/AnswerCard.tsx";

const App = () => {
  //Variables
  const navigate: NavigateFunction = useNavigate();
  const roundNum: number = Number(useParams().id) ? Number(useParams().id) : 0;

  const team1Name: string = "Team 1";
  const team2Name: string = "Team 2";
  const numAnswers: number = 10;

  const quiz: Interface_Round[] = datajson;
  const roundNow: Interface_Round = quiz[roundNum];

  const [wrongNum, setWrongNum] = useState<number>(0);
  const [pointsTeam1, setPointsTeam1] = useState<number>(0);
  const [pointsTeam2, setPointsTeam2] = useState<number>(0);
  const [pointsNow, setPointsNow] = useState<number>(0);

  const indexKeyMap = {
    0: "1",
    1: "2",
    2: "3",
    3: "4",
    4: "5",
    5: "6",
    6: "7",
    7: "8",
    8: "9",
    9: "0",
  };
  const answers: Type_Answer[] = [
    ...roundNow.answers,
    ...Array(numAnswers - roundNow.answers.length).fill(["", "", ""]),
  ];

  const [visibilityQuestionJump, setVisibilityQuestionJump] =
    useState<boolean>(false);
  const [visibilityWrong, setVisibilityWrong] = useState<boolean>(false);
  const [visibilityQuestion, setVisibilityQuestion] = useState<boolean>(false);
  const [visibilityAnswers, setVisibilityAnswers] = useState<Type_Visibility[]>(
    [
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
    ]
  );

  const [roundEnd, setRoundEnd] = useState<boolean>(false);

  //Functions
  const nextRound = () => {
    setVisibilityAnswers((prevVisibilityAnswers) => {
      const updatedVisibilityAnswers: Type_Visibility[] = [
        ...prevVisibilityAnswers,
      ];
      updatedVisibilityAnswers.map((_, mapIndex) => {
        updatedVisibilityAnswers[mapIndex] = "false";
      });
      return updatedVisibilityAnswers;
    });
    setVisibilityQuestion(false);
    setWrongNum(0);
    setPointsNow(0);
    setRoundEnd(false);
  };

  const changeRound = (changeToRoundNum: number) => {
    nextRound();
    navigate(`/${changeToRoundNum}`);
  };

  //Hooks
  keypressHook(() => {
    if (!visibilityQuestionJump) {
      setVisibilityQuestionJump(true);
    } else {
      setVisibilityQuestionJump(false);
    }
  }, "j");

  keypressHook(() => {
    if (!visibilityWrong) {
      setWrongNum((prevWrongNum) => prevWrongNum + 1);
      setVisibilityWrong(true);
    } else {
      setVisibilityWrong(false);
    }
  }, "x");

  keypressHook(() => {
    setWrongNum(0);
    setVisibilityWrong(false);
  }, "y");

  keypressHook(() => {
    if (!roundEnd) {
      setVisibilityAnswers((prevVisibilityAnswers) => {
        const updatedVisibilityAnswers: Type_Visibility[] = [
          ...prevVisibilityAnswers,
        ];
        updatedVisibilityAnswers.map((_, mapIndex) => {
          updatedVisibilityAnswers[mapIndex] = "number";
        });
        return updatedVisibilityAnswers;
      });
    }
  }, "a");

  keypressHook(() => {
    setVisibilityQuestion(true);
  }, "q");

  Object.keys(indexKeyMap).map((mapIndex) => {
    const index: keyof typeof indexKeyMap = Number(
      mapIndex
    ) as keyof typeof indexKeyMap;

    keypressHook(() => {
      if (roundNow.answers[index] !== undefined) {
        if (!roundEnd && visibilityAnswers[index] !== "true") {
          setPointsNow(
            (prevPoints) => prevPoints + Number(roundNow.answers[index][2])
          );
        }
        setVisibilityAnswers((prevVisibilityAnswers) => {
          const updatedVisibilityAnswers: Type_Visibility[] = [
            ...prevVisibilityAnswers,
          ];
          updatedVisibilityAnswers[index] = "true";
          return updatedVisibilityAnswers;
        });
      }
    }, indexKeyMap[index]);
  });

  keypressHook(() => {
    setPointsNow(0);
  }, "-");

  keypressHook(() => {
    setPointsTeam1((prevPoints) => prevPoints + pointsNow);
    setPointsNow(0);
    setRoundEnd(true);
  }, "ArrowLeft");

  keypressHook(() => {
    setPointsTeam2((prevPoints) => prevPoints + pointsNow);
    setPointsNow(0);
    setRoundEnd(true);
  }, "ArrowRight");

  keypressHook(() => {
    nextRound();
    navigate(`/${roundNum + 1}`);
  }, "Enter");

  keypressHook(() => {
    navigate(`/finals/${roundNum}`);
  }, "f");

  return (
    <>
      <QuestionJump
        defaultValue={roundNum}
        onSubmit={changeRound}
        visibility={visibilityQuestionJump}
      />

      <div className="wrongFlex">
        {Array.from({ length: wrongNum }).map((_, mapIndex) => (
          <Wrong key={mapIndex} visibility={visibilityWrong} />
        ))}
      </div>

      <div className="pointsGrid">
        <PointsTeamCard points={pointsTeam1} text={team1Name} />
        <PointsCard points={pointsNow} />
        <PointsTeamCard points={pointsTeam2} text={team2Name} />
      </div>

      <div className="questionBlock">
        <QuestionCard
          questionNumber={roundNum}
          questionText={roundNow.question}
          visibility={visibilityQuestion}
        />
      </div>

      <div className="answerGrid">
        {answers.map((answer, index) => (
          <AnswerCard
            key={index}
            answer={answer}
            visibility={visibilityAnswers[index]}
          />
        ))}
      </div>
    </>
  );
};

export default App;
