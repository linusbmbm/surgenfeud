import "/styles.css";
import "./HostGame.css";
import { useEffect, useState } from "react";
import datajson from "../../../data/data.json";
import PointsCard from "../../../components/PointsCard/PointsCard";
import AnswerVisibility from "../../../types/Enum_AnswerVisibility";
import { NavigateFunction, useNavigate } from "react-router-dom";
import TeamColors from "../../../components/TeamColors/TeamColors";
import useLocalStorageWrite from "../../../helpers/useLocalStorageWrite";
import AnswerEntry from "../../../types/AnswerEntry.interface";
import QuestionEntry from "../../../types/QuestionEntry.interface";
import QuestionDifficulty from "../../../types/QuestionDifficulty.interface";

const HostGame = () => {
  //Variables
  const navigator: NavigateFunction = useNavigate();

  const quiz: QuestionEntry[] = datajson;
  const [questionOrder, setQuestionOrder] = useLocalStorageWrite<number[]>(
    "questionOrder",
    [0]
  );
  const [roundNum, setRoundNum] = useState<number>(questionOrder.length - 1);
  const [question, setQuestion] = useLocalStorageWrite<string>(
    "question",
    quiz[questionOrder[roundNum]]?.question
  );
  const [answers, setAnswers] = useLocalStorageWrite<AnswerEntry[]>(
    "answers",
    quiz[questionOrder[roundNum]]?.answers
  );

  const [visibilityTeamColors, setvisibilityTeamColors] =
    useState<boolean>(false);
  const [teamRightColor, setTeamRightColor] = useLocalStorageWrite<
    [number, number, number]
  >("teamRightColor", [255, 255, 255]);
  const [teamLeftColor, setTeamLeftColor] = useLocalStorageWrite<
    [number, number, number]
  >("teamLeftColor", [255, 255, 255]);

  const [stealPoints, setStealPoints] = useState<boolean>(false);
  const [roundEnd, setRoundEnd] = useState<boolean>(false);

  const [roundPoints, setRoundPoints] = useState<number>(0);
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

  const manyAnswers: QuestionDifficulty = { topAnswerMin: 0, topAnswerMax: 25 };
  const someAnswers: QuestionDifficulty = {
    topAnswerMin: 25,
    topAnswerMax: 40,
  };
  const fewAnswers: QuestionDifficulty = {
    topAnswerMin: 40,
    topAnswerMax: 101,
  };
  const specialQuestions: string[] = [
    "Nenne etwas vor dem du als Kind Angst hattest",
    "Nenne etwas, das du mit Äypten in Verbindung bringst",
  ];

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
    if (roundNum > 0) {
      setRoundNum((prevRoundNum) => prevRoundNum - 1);
    }
  };

  const goToNextQuestion = () => {
    setRoundNum((prevRoundNum) => prevRoundNum + 1);
  };

  const setAndGoToNextQuestion = ({
    topAnswerMin = 0,
    topAnswerMax = 101,
  }: QuestionDifficulty) => {
    let newQuestionOrder = [...questionOrder];

    if (questionOrder[roundNum + 1] !== undefined) {
      newQuestionOrder.splice(roundNum + 1);
    }

    if (topAnswerMin === 0 && topAnswerMax === 101) {
      newQuestionOrder.push(
        quiz.findIndex(
          (questionEntry, questionEntryIndex) =>
            !newQuestionOrder.includes(questionEntryIndex) &&
            specialQuestions.includes(questionEntry.question)
        )
      );
    } else {
      newQuestionOrder.push(
        quiz.findIndex(
          (questionEntry, questionEntryIndex) =>
            !newQuestionOrder.includes(questionEntryIndex) &&
            questionEntry.answers[0].value >= topAnswerMin &&
            questionEntry.answers[0].value < topAnswerMax
        )
      );
    }

    setQuestionOrder(newQuestionOrder);

    goToNextQuestion();
  };

  const goToFinals = () => {
    setFinalsColor(
      pointsTeamLeft > pointsTeamRight ? teamLeftColor : teamRightColor
    );
    setNavigate("/finals");
  };

  //Hooks
  useEffect(() => {
    for (let key in localStorage) {
      if (!["navigate", "questionOrder"].includes(key)) {
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
    if (questionOrder[roundNum] !== -1) {
      setQuestion(quiz[questionOrder[roundNum]].question);
      setAnswers(quiz[questionOrder[roundNum]].answers);
      setVisibilityAnswers([...Array(10)].map(() => AnswerVisibility.false));
      setVisibilityQuestion(false);
      setWrongNum(0);
      setRoundPoints(0);
      setRoundEnd(false);
    } else {
      setQuestion("Keine Frage gefunden");
      setAnswers([{ text: "", value: 0 }]);
    }
  }, [roundNum]);

  useEffect(() => {
    setPointsNow(() => {
      if (roundEnd) {
        return 0;
      } else {
        let updatedPointsNow: number = 0;
        visibilityAnswers.map((visibilityAnswer, index) => {
          if (visibilityAnswer === AnswerVisibility.true) {
            updatedPointsNow += Number(answers[index].value);
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
            (pointsTeamLeft >= 200 || pointsTeamRight >= 200) &&
            visibilityAnswers.every(
              (visibility) => visibility === AnswerVisibility.true
            )
              ? "blinking"
              : ""
          }`}
        >
          <button onClick={goToFinals}>Finale</button>
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

        <div className="question-navigator">
          <button onClick={goToPreviousQuestion}>Vorherige Frage</button>

          <div
            className={`next-question-navigator ${
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
            <button
              onClick={() => {
                setAndGoToNextQuestion(manyAnswers);
              }}
            >
              {`Viele ${
                quiz.filter(
                  (questionEntry, questionEntryIndex) =>
                    !questionOrder.includes(questionEntryIndex) &&
                    questionEntry.answers[0].value >=
                      manyAnswers.topAnswerMin &&
                    questionEntry.answers[0].value < manyAnswers.topAnswerMax
                ).length
              }`}
            </button>
            <button
              onClick={() => {
                setAndGoToNextQuestion(someAnswers);
              }}
            >
              {`Einige ${
                quiz.filter(
                  (questionEntry, questionEntryIndex) =>
                    !questionOrder.includes(questionEntryIndex) &&
                    questionEntry.answers[0].value >=
                      someAnswers.topAnswerMin &&
                    questionEntry.answers[0].value < someAnswers.topAnswerMax
                ).length
              }`}
            </button>
            <button
              onClick={() => {
                setAndGoToNextQuestion(fewAnswers);
              }}
            >
              {`Wenige ${
                quiz.filter(
                  (questionEntry, questionEntryIndex) =>
                    !questionOrder.includes(questionEntryIndex) &&
                    questionEntry.answers[0].value >= fewAnswers.topAnswerMin &&
                    questionEntry.answers[0].value < fewAnswers.topAnswerMax
                ).length
              }`}
            </button>
            <button
              onClick={() => {
                setAndGoToNextQuestion({ topAnswerMin: 0, topAnswerMax: 101 });
              }}
            >
              {`Spezial ${
                quiz.filter(
                  (questionEntry, questionEntryIndex) =>
                    !questionOrder.includes(questionEntryIndex) &&
                    specialQuestions.includes(questionEntry.question)
                ).length
              }`}
            </button>
          </div>

          {questionOrder[roundNum + 1] !== undefined && (
            <button
              onClick={() => {
                goToNextQuestion();
              }}
            >
              Nächste Frage
            </button>
          )}
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
              <span>{answer.text}</span>
              <span>{answer.value}</span>
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
