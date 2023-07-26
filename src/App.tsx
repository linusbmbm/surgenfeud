import "./index.css";
import { useEffect, useState } from "react";
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
import TeamName from "./components/TeamName.tsx";

const App = () => {
  //Variables
  const navigate: NavigateFunction = useNavigate();
  const roundNum: number = Number(useParams().id) ? Number(useParams().id) : 0;

  const [team1, setTeam1] = useState<string>("Team 1");
  const [team2, setTeam2] = useState<string>("Team 2");
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

  const [visibilityTeamNames, setVisibilityTeamNames] =
    useState<boolean>(false);
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
  const changeTeamName = (newTeam1Name: string, newTeam2Name: string) => {
    setTeam1(newTeam1Name);
    setTeam2(newTeam2Name);
    setVisibilityTeamNames(false);
  };

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
    setRoundEnd(false);
  };

  const changeRound = (newRoundNum: number) => {
    nextRound();
    navigate(`/${newRoundNum}`);
    setVisibilityQuestionJump(false);
  };

  //Hooks
  useEffect(() => {
    setPointsNow(() => {
      if (roundEnd) {
        return 0;
      } else {
        let updatedPointsNow: number = 0;
        visibilityAnswers.map((visibilityAnswer, index) => {
          if (visibilityAnswer === "true") {
            updatedPointsNow += Number(answers[index][2]);
          }
        });
        return updatedPointsNow;
      }
    });
  }, [visibilityAnswers, roundEnd]);

  keypressHook(() => {
    if (!visibilityTeamNames && !visibilityQuestionJump) {
      setVisibilityTeamNames(true);
    }
  }, "t");

  keypressHook(() => {
    if (!visibilityTeamNames && !visibilityQuestionJump) {
      setVisibilityQuestionJump(true);
    }
  }, "j");

  keypressHook(() => {
    if (!visibilityTeamNames && !visibilityQuestionJump) {
      if (!visibilityWrong) {
        setWrongNum((prevWrongNum) => prevWrongNum + 1);
        setVisibilityWrong(true);
      } else {
        setVisibilityWrong(false);
      }
    }
  }, "x");

  keypressHook(() => {
    if (!visibilityTeamNames && !visibilityQuestionJump) {
      setWrongNum(0);
      setVisibilityWrong(false);
    }
  }, "y");

  keypressHook(() => {
    if (!visibilityTeamNames && !visibilityQuestionJump && !roundEnd) {
      if (
        visibilityAnswers.every(
          (visibilityAnswer) => visibilityAnswer === "number"
        )
      ) {
        visibilityAnswers.map((_, mapIndex) => {
          setVisibilityAnswers((prevVisibilityAnswers) => {
            const updatedVisibilityAnswers: Type_Visibility[] = [
              ...prevVisibilityAnswers,
            ];
            updatedVisibilityAnswers[mapIndex] = "false";
            return updatedVisibilityAnswers;
          });
        });
      } else {
        visibilityAnswers.map((_, mapIndex) => {
          setVisibilityAnswers((prevVisibilityAnswers) => {
            const updatedVisibilityAnswers: Type_Visibility[] = [
              ...prevVisibilityAnswers,
            ];
            updatedVisibilityAnswers[mapIndex] = "number";
            return updatedVisibilityAnswers;
          });
        });
      }
    }
  }, "a");

  keypressHook(() => {
    if (!visibilityTeamNames && !visibilityQuestionJump) {
      if (!visibilityQuestion) {
        setVisibilityQuestion(true);
      } else {
        setVisibilityQuestion(false);
      }
    }
  }, "q");

  Object.keys(indexKeyMap).map((mapIndex) => {
    const index: keyof typeof indexKeyMap = Number(
      mapIndex
    ) as keyof typeof indexKeyMap;

    keypressHook(() => {
      if (
        !visibilityTeamNames &&
        !visibilityQuestionJump &&
        roundNow.answers[index] !== undefined
      ) {
        if (visibilityAnswers[index] !== "true") {
          setVisibilityAnswers((prevVisibilityAnswers) => {
            const updatedVisibilityAnswers: Type_Visibility[] = [
              ...prevVisibilityAnswers,
            ];
            updatedVisibilityAnswers[index] = "true";
            return updatedVisibilityAnswers;
          });
        } else {
          setVisibilityAnswers((prevVisibilityAnswers) => {
            const updatedVisibilityAnswers: Type_Visibility[] = [
              ...prevVisibilityAnswers,
            ];
            updatedVisibilityAnswers[index] = "number";
            return updatedVisibilityAnswers;
          });
        }
      }
    }, indexKeyMap[index]);
  });

  keypressHook(() => {
    if (!visibilityTeamNames && !visibilityQuestionJump) {
      setPointsTeam1((prevPoints) => prevPoints + pointsNow);
      setRoundEnd(true);
    }
  }, "ArrowLeft");

  keypressHook(() => {
    if (!visibilityTeamNames && !visibilityQuestionJump) {
      setPointsTeam2((prevPoints) => prevPoints + pointsNow);
      setRoundEnd(true);
    }
  }, "ArrowRight");

  keypressHook(() => {
    if (!visibilityTeamNames && !visibilityQuestionJump) {
      nextRound();
      navigate(`/${roundNum + 1}`);
    }
  }, "Enter");

  keypressHook(() => {
    if (!visibilityTeamNames && !visibilityQuestionJump) {
      navigate(`/finals/${roundNum}`);
    }
  }, "f");

  return (
    <>
      <TeamName onSubmit={changeTeamName} visibility={visibilityTeamNames} />

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
        <PointsTeamCard points={pointsTeam1} text={team1} />
        <PointsCard points={pointsNow} />
        <PointsTeamCard points={pointsTeam2} text={team2} />
      </div>

      <div className="question">
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
