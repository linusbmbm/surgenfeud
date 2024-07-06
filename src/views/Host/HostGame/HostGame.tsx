import "/styles.css";
import "./HostGame.css";
import { useEffect, useState } from "react";
import datajson from "../../../data/data.json";
import PointsCard from "../../../components/PointsCard/PointsCard";
import AnswerVisibility from "../../../types/Enum_AnswerVisibility";
import Interface_QuestionAnswer from "../../../types/Interface_QuestionAnswer";
import { NavigateFunction, useNavigate } from "react-router-dom";
import Interface_Answer from "../../../types/Interface_Answer";
import TeamColors from "../../../components/TeamColors/TeamColors";
import useLocalStorageWrite from "../../../helpers/useLocalStorageWrite";

const HostGame = () => {
  //Variables
  const navigator: NavigateFunction = useNavigate();

  const quiz: Interface_QuestionAnswer = datajson;
  const [roundNum, setRoundNum] = useLocalStorageWrite<number>("roundNum", 0);

  const [visibilityTeamColors, setvisibilityTeamColors] =
    useState<boolean>(false);

  const [stealPoints, setStealPoints] = useState<boolean>(false);

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
    setWrongNum((prevWrongNum) => (wrongNum < 3 ? prevWrongNum + 1 : 3));
    setVisibilityWrong(true);
    setTimeout(() => {
      setVisibilityWrong(false);
    }, 2000);
    if (wrongNum >= 3) {
      setStealPoints(false);
    }
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
        if (wrongNum >= 3) {
          setStealPoints(false);
        }
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

  const pointsNowToLeftTeam = () => {
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

  const goToPreviousQuestion = () => {
    setRoundNum((prevRoundNum) => {
      return prevRoundNum >= 1 ? prevRoundNum - 1 : 0;
    });
  };

  const goToNextQuestion = () => {
    setRoundNum((prevRoundNum) => {
      return prevRoundNum + 1;
    });
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
    setVisibilityAnswers([...Array(10)].map(() => AnswerVisibility.false));
    setVisibilityQuestion(false);
    setWrongNum(0);
    setRoundPoints(0);
    setRoundEnd(false);
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

  useEffect(() => {
    if (wrongNum >= 3 && !stealPoints) {
      setStealPoints(true);
    }
  }, [wrongNum]);

  return (
    <>
      <div className="host-game">
        <TeamColors
          onSubmit={changeTeamColors}
          visibility={visibilityTeamColors}
        />

        <div
          className={`set-team-color ${
            teamLeftColor.every((colorValue) => colorValue === 255) ||
            teamRightColor.every((colorValue) => colorValue === 255)
              ? "blinking"
              : ""
          }`}
        >
          <button onClick={setTeamColors}>Team Farben</button>
        </div>

        <div
          className={`go-to-finals ${
            pointsTeamLeft >= 200 || pointsTeamRight >= 200 ? "blinking" : ""
          }`}
        >
          <button onClick={goToFinals}>Finale</button>
        </div>

        <div className="previous-question">
          <button onClick={goToPreviousQuestion}>Vorherige Frage</button>
        </div>

        <div
          className={`points-right-team ${
            !roundEnd &&
            ((wrongNum >= 3 && !stealPoints) ||
              visibilityAnswers.every(
                (visibility) => visibility === AnswerVisibility.true
              ))
              ? "blinking"
              : ""
          }`}
        >
          <button
            onClick={pointsNowToRightTeam}
            style={{
              border: `5px solid rgb(${teamRightColor[0]}, ${teamRightColor[1]}, ${teamRightColor[2]})`,
            }}
          >
            {pointsTeamRight}
          </button>
        </div>

        <div className="points-now">
          <PointsCard points={pointsNow} />
        </div>

        <div
          className={`points-left-team
    ${
      !roundEnd &&
      ((wrongNum >= 3 && !stealPoints) ||
        visibilityAnswers.every(
          (visibility) => visibility === AnswerVisibility.true
        ))
        ? "blinking"
        : ""
    }`}
        >
          <button
            onClick={pointsNowToLeftTeam}
            style={{
              border: `5px solid rgb(${teamLeftColor[0]}, ${teamLeftColor[1]}, ${teamLeftColor[2]})`,
            }}
          >
            {pointsTeamLeft}
          </button>
        </div>

        <div
          className={`next-question ${
            roundEnd &&
            visibilityAnswers.every(
              (visibility) => visibility === AnswerVisibility.true
            ) &&
            pointsTeamLeft < 200 &&
            pointsTeamRight < 200
              ? "blinking"
              : ""
          }`}
        >
          <button onClick={goToNextQuestion}>Nächste Frage</button>
        </div>

        <div
          className={`show-answer-number ${
            visibilityAnswers.every(
              (visibility) => visibility === AnswerVisibility.false
            ) &&
            !teamLeftColor.every((colorValue) => colorValue === 255) &&
            !teamRightColor.every((colorValue) => colorValue === 255)
              ? "blinking"
              : ""
          }`}
        >
          <button onClick={showAnswerNumbers}>
            <span>Zeige Antworten-Anzahl</span>
            <span>{answers.length}</span>
          </button>
        </div>

        <div
          className={`show-question ${
            visibilityAnswers.every(
              (visibility) => visibility === AnswerVisibility.number
            ) && visibilityQuestion === false
              ? "blinking"
              : ""
          }`}
        >
          <button onClick={showQuestion}>
            <span>{question}</span>
            <span>{visibilityQuestion.toString()}</span>
          </button>
        </div>

        <div
          className={`answers ${
            stealPoints ||
            (roundEnd &&
              !visibilityAnswers.every(
                (visiblity) => visiblity === AnswerVisibility.true
              ))
              ? "blinking"
              : ""
          }`}
        >
          {answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => {
                changeVisibilityAnswer(index);
              }}
              style={{
                background:
                  visibilityAnswers[index] === AnswerVisibility.true
                    ? "rgba(255, 255, 255, 0.7)"
                    : "",
                color:
                  visibilityAnswers[index] === AnswerVisibility.true
                    ? "black"
                    : "",
              }}
            >
              <span>{index + 1}</span>
              <span>{answer.answerText}</span>
              <span>{answer.answerValue}</span>
              <span>{visibilityAnswers[index]}</span>
            </button>
          ))}
        </div>

        <div className="show-wrongs">
          <button onClick={showWrongs}>
            <span>
              {stealPoints ? "PUNKTE KLAUEN MÖGLICH!" : "Falsche Antwort"}
            </span>
            <span>{stealPoints ? "" : wrongNum}</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default HostGame;
