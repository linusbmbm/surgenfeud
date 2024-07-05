import "./HostGame.css";
import { useEffect, useState } from "react";
import datajson from "../../data/data.json";
import PointsCard from "../../components/PointsCard/PointsCard";
import AnswerVisibility from "../../types/Enum_AnswerVisibility";
import Interface_QuestionAnswer from "../../types/Interface_QuestionAnswer";
import { NavigateFunction, useNavigate } from "react-router-dom";
import Interface_Answer from "../../types/Interface_Answer";
import TeamColors from "../../components/TeamColors/TeamColors";
import useLocalStorageWrite from "../../helpers/useLocalStorageWrite";

const HostGame = () => {
  //Variables
  const navigator: NavigateFunction = useNavigate();

  const quiz: Interface_QuestionAnswer = datajson;
  const [roundNum, setRoundNum] = useLocalStorageWrite<number>("roundNum", 0);

  const [visibilityTeamColors, setvisibilityTeamColors] =
    useState<boolean>(false);

  const [roundPoints, setRoundPoints] = useState<number>(0);
  const [roundEnd, setRoundEnd] = useState<boolean>(false);

  const [teamRightColor, setTeamRightColor] = useLocalStorageWrite<
    [number, number, number]
  >("teamRightColor", [255, 255, 255]);
  const [teamLeftColor, setTeamLeftColor] = useLocalStorageWrite<
    [number, number, number]
  >("teamLeftColor", [255, 255, 255]);
  const [question, setQuestion] = useLocalStorageWrite<string>(
    "question",
    Object.keys(quiz)[roundNum]
  );
  const [answers, setAnswers] = useLocalStorageWrite<Interface_Answer[]>(
    "answers",
    quiz[question]
  );
  const [pointsNow, setPointsNow] = useLocalStorageWrite<number>(
    "pointsNow",
    0
  );
  const [pointsTeamLeft, setPointsTeamLeft] = useLocalStorageWrite<number>(
    "pointsTeamLeft",
    0
  );
  const [pointsTeamRight, setPointsTeamRight] = useLocalStorageWrite<number>(
    "pointsTeamRight",
    0
  );
  const [wrongNum, setWrongNum] = useLocalStorageWrite<number>("wrongNum", 0);
  const [, setVisibilityWrong] = useLocalStorageWrite<boolean>(
    "visibilityWrong",
    false
  );
  const [visibilityQuestion, setVisibilityQuestion] =
    useLocalStorageWrite<boolean>("visibilityQuestion", false);
  const [visibilityAnswers, setVisibilityAnswers] = useLocalStorageWrite<
    AnswerVisibility[]
  >(
    "visibilityAnswers",
    [...Array(10)].map(() => {
      return AnswerVisibility.false;
    })
  );

  const [, setFinalsColor] = useLocalStorageWrite<[number, number, number]>(
    "finalsColor",
    [255, 255, 255]
  );
  const [navigate, setNavigate] = useLocalStorageWrite<string>("navigate", "");

  //functions
  const changeTeamColors = (
    newTeamRightColor: string,
    newTeamLeftColor: string
  ): void => {
    setTeamRightColor(hexToRgb(newTeamRightColor));
    setTeamLeftColor(hexToRgb(newTeamLeftColor));
    setvisibilityTeamColors(false);
  };

  const changeRound = (): void => {
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

  const hexToRgb = (hex: string): [number, number, number] => {
    return [
      parseInt(hex.slice(1, 3), 16),
      parseInt(hex.slice(3, 5), 16),
      parseInt(hex.slice(5, 7), 16),
    ];
  };

  const setTeamColors = () => {
    setvisibilityTeamColors(!visibilityTeamColors);
  };

  const showWrongs = () => {
    setWrongNum((prevWrongNum) => (wrongNum >= 3 ? 1 : prevWrongNum + 1));
    setVisibilityWrong(true);
    setTimeout(() => {
      setVisibilityWrong(false);
    }, 1000);
  };

  const showAnswerNumbers = () => {
    if (!roundEnd) {
      if (
        visibilityAnswers.every(
          (visibilityAnswer) => visibilityAnswer === AnswerVisibility.number
        )
      ) {
        setVisibilityAnswers(
          answers.map(() => {
            return AnswerVisibility.false;
          })
        );
      } else {
        setVisibilityAnswers(
          answers.map(() => {
            return AnswerVisibility.number;
          })
        );
      }
    }
  };

  const showQuestion = () => {
    setVisibilityQuestion(!visibilityQuestion);
  };

  const changeVisibilityAnswer = (index: number): void => {
    if (answers[index] !== undefined) {
      if (visibilityAnswers[index] !== AnswerVisibility.true) {
        setVisibilityAnswers((prevVisibilityAnswers) => {
          let updatedVisibilityAnswers: AnswerVisibility[] = [
            ...prevVisibilityAnswers,
          ];
          updatedVisibilityAnswers[index] = AnswerVisibility.true;
          return updatedVisibilityAnswers;
        });
      } else {
        setVisibilityAnswers((prevVisibilityAnswers) => {
          let updatedVisibilityAnswers: AnswerVisibility[] = [
            ...prevVisibilityAnswers,
          ];
          updatedVisibilityAnswers[index] = AnswerVisibility.number;
          return updatedVisibilityAnswers;
        });
      }
    }
  };

  const pointsNowToRightTeam = () => {
    if (!roundEnd) {
      setPointsTeamLeft((prevPoints) => prevPoints + pointsNow);
      setRoundPoints(pointsNow);
      setRoundEnd(true);
    } else {
      setRoundEnd(false);
      setPointsTeamLeft((prevPoints) => prevPoints - roundPoints);
      setPointsNow(roundPoints);
      setRoundPoints(0);
    }
  };

  const pointsNowToLeftTeam = () => {
    if (!roundEnd) {
      setPointsTeamRight((prevPoints) => prevPoints + pointsNow);
      setRoundPoints(pointsNow);
      setRoundEnd(true);
    } else {
      setRoundEnd(false);
      setPointsTeamRight((prevPoints) => prevPoints - roundPoints);
      setPointsNow(roundPoints);
      setRoundPoints(0);
    }
  };

  const goToPreviousQuestion = () => {
    setRoundNum((prevRoundNum) => {
      return prevRoundNum >= 1 ? prevRoundNum - 1 : 0;
    });
    changeRound();
  };

  const goToNextQuestion = () => {
    setRoundNum((prevRoundNum) => {
      return prevRoundNum + 1;
    });
    changeRound();
  };

  const goToFinals = () => {
    setFinalsColor(
      pointsTeamLeft > pointsTeamRight ? teamLeftColor : teamRightColor
    );
    setRoundNum((prevRoundNum) => {
      return prevRoundNum + 1;
    });
    setNavigate("/finals");
  };

  //Hooks
  useEffect(() => {
    for (let key in localStorage) {
      if (!["navigate", "roundNum"].includes(key)) {
        localStorage.removeItem(key);
      }
    }
  }, []);

  useEffect(() => {
    if (navigate) {
      navigator(`/host${navigate}`);
    }
  }, [navigate]);

  useEffect(() => {
    const newQuestion = Object.keys(quiz)[roundNum];
    setQuestion(newQuestion);
    setAnswers(quiz[newQuestion]);
  }, [quiz, roundNum]);

  useEffect(() => {
    setPointsNow(() => {
      if (roundEnd) {
        return 0;
      } else {
        let updatedPointsNow: number = 0;
        visibilityAnswers.map((visibilityAnswer, index) => {
          if (visibilityAnswer === AnswerVisibility.true) {
            updatedPointsNow += Number(answers[index].answerValue);
          }
        });
        return updatedPointsNow;
      }
    });
  }, [answers, visibilityAnswers, roundEnd]);

  return (
    <>
      <div className="host-game">
        <TeamColors
          onSubmit={changeTeamColors}
          visibility={visibilityTeamColors}
        />

        <div className="points-left-team">
          <input
            type="button"
            value={pointsTeamRight}
            onClick={pointsNowToLeftTeam}
          />
        </div>
        <div className="points-now">
          <PointsCard points={pointsNow} />
        </div>
        <div className="points-right-team">
          <input
            type="button"
            value={pointsTeamLeft}
            onClick={pointsNowToRightTeam}
          />
        </div>
        <div className="set-team-color">
          <input type="button" value="Team Farben" onClick={setTeamColors} />
        </div>
        <div className="show-answer-number">
          <input
            type="button"
            name="showAnswerNumbers"
            value={`Zeige Antwortnummern | ${answers.length}`}
            onClick={showAnswerNumbers}
          />
        </div>
        <div className="show-wrongs">
          <input
            type="button"
            value={`Falsche Antwort | ${wrongNum}`}
            onClick={showWrongs}
          />
        </div>
        <div className="go-to-finals">
          <input type="button" value="Finale" onClick={goToFinals} />
        </div>
        <div className="previous-question">
          <input
            type="button"
            value="Vorherige Frage"
            onClick={goToPreviousQuestion}
          />
        </div>
        <div className="show-question">
          <input
            type="button"
            value={`${question} | ${visibilityQuestion}`}
            onClick={showQuestion}
          />
        </div>
        <div className="next-question">
          <input
            type="button"
            value="Nächste Frage"
            onClick={goToNextQuestion}
          />
        </div>
        <div className="answers">
          {answers.map((answer, index) => (
            <input
              key={index}
              type="button"
              value={`${index + 1} | ${answer.answerText} | ${
                answer.answerValue
              } | ${visibilityAnswers[index]}`}
              onClick={() => {
                changeVisibilityAnswer(index);
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default HostGame;
