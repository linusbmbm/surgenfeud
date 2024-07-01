import "../../../styles.css";
import "./Game.css";
import { useEffect, useMemo, useState } from "react";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import datajson from "../../data/data.json";
import Interface_Round from "../../types/Interface_Round";
import Type_Answer from "../../types/Type_Answer";
import KeypressHook from "../../hooks/KeypressHook";
import QuestionJump from "../../components/QuestionJump/QuestionJump";
import Wrong from "../../components/Wrong/Wrong";
import PointsCard from "../../components/PointsCard/PointsCard";
import QuestionCard from "../../components/QuestionCard/QuestionCard";
import AnswerCard from "../../components/AnswerCard/AnswerCard";
import TeamName from "../../components/TeamName/TeamName";
import PointsFillCard from "../../components/PointsFillCard/PointsFillCard";
import AnswerVisibility from "../../types/Enum_AnswerVisibility";

declare module "react" {
  interface CSSProperties {
    "--team-color-alpha"?: number;
    "--team1-color-red"?: number;
    "--team1-color-green"?: number;
    "--team1-color-blue"?: number;
    "--team2-color-red"?: number;
    "--team2-color-green"?: number;
    "--team2-color-blue"?: number;
  }
}

const Game = () => {
  //Variables
  const navigate: NavigateFunction = useNavigate();
  const { id } = useParams();
  const roundNum: number = id ? Number(id) : 0;

  const [team1Color, setTeam1Color] = useState<[number, number, number]>([
    255, 255, 255,
  ]);
  const [team2Color, setTeam2Color] = useState<[number, number, number]>([
    255, 255, 255,
  ]);

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

  const [visibilityTeamColors, setvisibilityTeamColors] =
    useState<boolean>(false);
  const [visibilityQuestionJump, setVisibilityQuestionJump] =
    useState<boolean>(false);
  const [visibilityWrong, setVisibilityWrong] = useState<boolean>(false);
  const [visibilityQuestion, setVisibilityQuestion] = useState<boolean>(false);
  const [visibilityAnswers, setVisibilityAnswers] = useState<
    AnswerVisibility[]
  >([
    AnswerVisibility.false,
    AnswerVisibility.false,
    AnswerVisibility.false,
    AnswerVisibility.false,
    AnswerVisibility.false,
    AnswerVisibility.false,
    AnswerVisibility.false,
    AnswerVisibility.false,
    AnswerVisibility.false,
    AnswerVisibility.false,
  ]);

  const [roundPoints, setRoundPoints] = useState<number>(0);
  const [roundEnd, setRoundEnd] = useState<boolean>(false);

  //Functions
  const changeTeamName = (
    newTeam1Color: string,
    newTeam2Color: string
  ): void => {
    setTeam1Color(hexToRgb(newTeam1Color));
    setTeam2Color(hexToRgb(newTeam2Color));
    setvisibilityTeamColors(false);
  };

  const nextRound = (): void => {
    setVisibilityAnswers((prevVisibilityAnswers) => {
      const updatedVisibilityAnswers: AnswerVisibility[] = [
        ...prevVisibilityAnswers,
      ];
      updatedVisibilityAnswers.map((_, mapIndex) => {
        updatedVisibilityAnswers[mapIndex] = AnswerVisibility.false;
      });
      return updatedVisibilityAnswers;
    });
    setVisibilityQuestion(false);
    setWrongNum(0);
    setRoundPoints(0);
    setRoundEnd(false);
  };

  const changeRound = (newRoundNum: number): void => {
    nextRound();
    navigate(`/game/${newRoundNum}`);
    setVisibilityQuestionJump(false);
  };

  const hexToRgb = (hex: string): [number, number, number] => {
    return [
      parseInt(hex.slice(1, 3), 16),
      parseInt(hex.slice(3, 5), 16),
      parseInt(hex.slice(5, 7), 16),
    ];
  };

  //Hooks
  const answers: Type_Answer[] = useMemo(() => {
    return [
      ...roundNow.answers,
      ...Array(numAnswers - roundNow.answers.length).fill(["", "", ""]),
    ];
  }, [roundNow.answers, numAnswers]);

  useEffect(() => {
    setPointsNow(() => {
      if (roundEnd) {
        return 0;
      } else {
        let updatedPointsNow: number = 0;
        visibilityAnswers.map((visibilityAnswer, index) => {
          if (visibilityAnswer === AnswerVisibility.true) {
            updatedPointsNow += Number(answers[index][2]);
          }
        });
        return updatedPointsNow;
      }
    });
  }, [answers, visibilityAnswers, roundEnd]);

  KeypressHook(() => {
    setvisibilityTeamColors(!visibilityTeamColors);
  }, "t");

  KeypressHook(() => {
    setVisibilityQuestionJump(!visibilityQuestionJump);
  }, "j");

  KeypressHook(() => {
    setWrongNum((prevWrongNum) => (wrongNum >= 3 ? 1 : prevWrongNum + 1));
    setVisibilityWrong(true);
    setTimeout(() => setVisibilityWrong(false), 1000);
  }, "x");

  KeypressHook(() => {
    if (!roundEnd) {
      if (
        visibilityAnswers.every(
          (visibilityAnswer) => visibilityAnswer === AnswerVisibility.number
        )
      ) {
        visibilityAnswers.map((_, mapIndex) => {
          setVisibilityAnswers((prevVisibilityAnswers) => {
            const updatedVisibilityAnswers: AnswerVisibility[] = [
              ...prevVisibilityAnswers,
            ];
            updatedVisibilityAnswers[mapIndex] = AnswerVisibility.false;
            return updatedVisibilityAnswers;
          });
        });
      } else {
        visibilityAnswers.map((_, mapIndex) => {
          setVisibilityAnswers((prevVisibilityAnswers) => {
            const updatedVisibilityAnswers: AnswerVisibility[] = [
              ...prevVisibilityAnswers,
            ];
            updatedVisibilityAnswers[mapIndex] = AnswerVisibility.number;
            return updatedVisibilityAnswers;
          });
        });
      }
    }
  }, "a");

  KeypressHook(() => {
    setVisibilityQuestion(!visibilityQuestion);
  }, "q");

  Object.keys(indexKeyMap).map((mapIndex) => {
    const index: keyof typeof indexKeyMap = Number(
      mapIndex
    ) as keyof typeof indexKeyMap;

    KeypressHook(() => {
      if (!visibilityQuestionJump && roundNow.answers[index] !== undefined) {
        if (visibilityAnswers[index] !== AnswerVisibility.true) {
          setVisibilityAnswers((prevVisibilityAnswers) => {
            const updatedVisibilityAnswers: AnswerVisibility[] = [
              ...prevVisibilityAnswers,
            ];
            updatedVisibilityAnswers[index] = AnswerVisibility.true;
            return updatedVisibilityAnswers;
          });
        } else {
          setVisibilityAnswers((prevVisibilityAnswers) => {
            const updatedVisibilityAnswers: AnswerVisibility[] = [
              ...prevVisibilityAnswers,
            ];
            updatedVisibilityAnswers[index] = AnswerVisibility.number;
            return updatedVisibilityAnswers;
          });
        }
      }
    }, indexKeyMap[index]);
  });

  KeypressHook(() => {
    if (!roundEnd) {
      setPointsTeam1((prevPoints) => prevPoints + pointsNow);
      setRoundPoints(pointsNow);
      setRoundEnd(true);
    } else {
      setRoundEnd(false);
      setPointsTeam1((prevPoints) => prevPoints - roundPoints);
      setPointsNow(roundPoints);
      setRoundPoints(0);
    }
  }, "ArrowLeft");

  KeypressHook(() => {
    if (!roundEnd) {
      setPointsTeam2((prevPoints) => prevPoints + pointsNow);
      setRoundPoints(pointsNow);
      setRoundEnd(true);
    } else {
      setRoundEnd(false);
      setPointsTeam2((prevPoints) => prevPoints - roundPoints);
      setPointsNow(roundPoints);
      setRoundPoints(0);
    }
  }, "ArrowRight");

  KeypressHook(() => {
    nextRound();
    navigate(`/game/${roundNum + 1}`);
  }, "Enter");

  KeypressHook(() => {
    const winnerColor: [number, number, number] =
      pointsTeam1 > pointsTeam2 ? team1Color : team2Color;
    navigate(`/finals/${roundNum}`, { state: { winnerColor } });
  }, "f");

  return (
    <>
      <div className="game">
        <QuestionJump
          defaultValue={roundNum}
          onSubmit={changeRound}
          visibility={visibilityQuestionJump}
        />

        <TeamName onSubmit={changeTeamName} visibility={visibilityTeamColors} />

        <div className="wrongs">
          {Array.from({ length: wrongNum }).map((_, mapIndex) => (
            <Wrong key={mapIndex} visibility={visibilityWrong} />
          ))}
        </div>

        <div
          className="game-elements"
          style={{
            "--team-color-alpha":
              team1Color.every((color) => color === 255) &&
              team2Color.every((color) => color === 255)
                ? 0.1
                : 0.3,
            "--team1-color-red": team1Color[0],
            "--team1-color-green": team1Color[1],
            "--team1-color-blue": team1Color[2],
            "--team2-color-red": team2Color[0],
            "--team2-color-green": team2Color[1],
            "--team2-color-blue": team2Color[2],
          }}
        >
          <div className="pointsTeam1">
            <PointsFillCard points={pointsTeam1} color={team1Color} />
          </div>

          <div className="game-element pointsNow">
            <PointsCard points={pointsNow} />
          </div>

          <div className="pointsTeam2">
            <PointsFillCard points={pointsTeam2} color={team2Color} />
          </div>

          <div className="game-element question">
            <QuestionCard
              questionText={roundNow.question}
              visibility={visibilityQuestion}
            />
          </div>

          <div className="game-element answers">
            {answers.map((answer, index) => (
              <AnswerCard
                key={index}
                answer={answer}
                visibility={visibilityAnswers[index]}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Game;
