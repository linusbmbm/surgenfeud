import "/styles.css";
import "./HostGame.css";
import { useEffect, useState } from "react";
import datajson from "../../../data/data.json";
import PointsCard from "../../../components/PointsCard/PointsCard";
import AnswerVisibility from "../../../types/AnswerVisibility.enum";
import { NavigateFunction, useNavigate } from "react-router-dom";
import TeamColors from "../../../components/TeamColors/TeamColors";
import useLocalStorageWrite from "../../../helpers/useLocalStorageWrite";
import AnswerEntry from "../../../types/AnswerEntry.interface";
import QuestionEntry from "../../../types/QuestionEntry.interface";
import blinkingIf from "../../../helpers/blinkingIf";

const HostGame = () => {
  //Variables
  const navigator: NavigateFunction = useNavigate();

  const quiz: QuestionEntry[] = datajson;
  const specialQuestions: string[] = [
    "Nenne eine bekannte Weltstadt.",
    "Nenne einen Grund für Streitigkeiten zwischen Kindern.",
    "Nenne ein Schulfach, das den meisten Schülern gefällt.",
    "Nenne eine beliebte Urlaubsaktivität für Abenteuerlustige.",
  ];

  const [visibilityTeamColors, setvisibilityTeamColors] =
    useState<boolean>(false);
  const [stealPoints, setStealPoints] = useState<boolean>(false);
  const [stealPointsCorrectAnswers, setStealPointsCorrectAnswers] =
    useState<number>(0);
  const [roundEnd, setRoundEnd] = useState<boolean>(false);
  const [roundPoints, setRoundPoints] = useState<number>(0);

  const [navigate, setNavigate] = useLocalStorageWrite<string>("navigate", "");
  const [teamRightColor, setTeamRightColor] = useLocalStorageWrite<
    [number, number, number]
  >("teamRightColor", [255, 255, 255]);
  const [teamLeftColor, setTeamLeftColor] = useLocalStorageWrite<
    [number, number, number]
  >("teamLeftColor", [255, 255, 255]);
  const [questionOrder, setQuestionOrder] = useLocalStorageWrite<number[]>(
    "questionOrder",
    [0]
  );
  const [roundNum, setRoundNum] = useState<number>(questionOrder.length - 1);
  const [pointsTeamLeft, setPointsTeamLeft] = useLocalStorageWrite<number>(
    "pointsTeamLeft",
    0
  );
  const [pointsNow, setPointsNow] = useLocalStorageWrite<number>(
    "pointsNow",
    0
  );
  const [pointsTeamRight, setPointsTeamRight] = useLocalStorageWrite<number>(
    "pointsTeamRight",
    0
  );
  const [visibilityQuestion, setVisibilityQuestion] =
    useLocalStorageWrite<boolean>("visibilityQuestion", false);
  const [question, setQuestion] = useLocalStorageWrite<string>(
    "question",
    quiz[questionOrder[roundNum]]?.question
  );
  const [visibilityAnswers, setVisibilityAnswers] = useLocalStorageWrite<
    AnswerVisibility[]
  >("visibilityAnswers", [AnswerVisibility.false]);
  const [answers, setAnswers] = useLocalStorageWrite<AnswerEntry[]>(
    "answers",
    quiz[questionOrder[roundNum]]?.answers
  );
  const [wrongNum, setWrongNum] = useLocalStorageWrite<number>("wrongNum", 0);
  const [, setVisibilityWrong] = useLocalStorageWrite<boolean>(
    "visibilityWrong",
    false
  );
  const [, setFinalsColor] = useLocalStorageWrite<[number, number, number]>(
    "finalsColor",
    [255, 255, 255]
  );

  const pointsRightTeamBorder: string = `5px solid rgb(${teamRightColor[0]}, ${teamRightColor[1]}, ${teamRightColor[2]})`;
  const pointsLeftTeamBorder: string = `5px solid rgb(${teamLeftColor[0]}, ${teamLeftColor[1]}, ${teamLeftColor[2]})`;
  const isNextQuestionNavigatorVisible: boolean =
    questionOrder[roundNum + 1] !== undefined;

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
      setVisibilityAnswers(
        [
          ...Array(
            quiz[questionOrder[roundNum]].answers.filter(
              (answer) => answer.value > 1
            ).length
          ),
        ].fill(AnswerVisibility.false)
      );
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
      setStealPointsCorrectAnswers(0);
    }
  }, [wrongNum]);

  //Functions
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

  const setTeamColorBlinking = (): string => {
    return blinkingIf(
      teamLeftColor.every((colorValue) => colorValue === 255) ||
        teamRightColor.every((colorValue) => colorValue === 255)
    );
  };

  const goToFinalsBlinking = (): string => {
    const blinkingCondition: boolean =
      (pointsTeamLeft >= 200 || pointsTeamRight >= 200) &&
      visibilityAnswers.every(
        (visibility) => visibility === AnswerVisibility.true
      );
    return blinkingIf(blinkingCondition);
  };

  const pointsRightTeamBlinking = (): string => {
    const blinkingCondition: boolean =
      !roundEnd &&
      ((wrongNum >= 3 && !stealPoints) ||
        visibilityAnswers.every(
          (visibility) => visibility === AnswerVisibility.true
        ));
    return blinkingIf(blinkingCondition);
  };

  const pointsLeftTeamBlinking = (): string => {
    const blinkingCondition: boolean =
      !roundEnd &&
      ((wrongNum >= 3 && !stealPoints) ||
        visibilityAnswers.every(
          (visibility) => visibility === AnswerVisibility.true
        ));
    return blinkingIf(blinkingCondition);
  };

  const nextQuestionPickerBlinking = (): string => {
    const blinkingCondition: boolean =
      roundEnd &&
      visibilityAnswers.every(
        (visibility) => visibility === AnswerVisibility.true
      ) &&
      pointsTeamLeft < 200 &&
      pointsTeamRight < 200;
    return blinkingIf(blinkingCondition);
  };

  const questionsLeft = (): number => {
    return quiz.filter(
      (questionEntry, questionEntryIndex) =>
        !questionOrder.includes(questionEntryIndex) &&
        !specialQuestions.includes(questionEntry.question)
    ).length;
  };

  const specialQuestionsLeft = (): number => {
    return quiz.filter(
      (questionEntry, questionEntryIndex) =>
        !questionOrder.includes(questionEntryIndex) &&
        specialQuestions.includes(questionEntry.question)
    ).length;
  };

  const showAnswerNumberBlinking = (): string => {
    const blinkingCondition: boolean =
      visibilityAnswers.every(
        (visibility) => visibility === AnswerVisibility.false
      ) &&
      !teamLeftColor.every((colorValue) => colorValue === 255) &&
      !teamRightColor.every((colorValue) => colorValue === 255);
    return blinkingIf(blinkingCondition);
  };

  const showQuestionBlinking = (): string => {
    const blinkingCondition: boolean =
      visibilityAnswers.every(
        (visibility) => visibility === AnswerVisibility.number
      ) && visibilityQuestion === false;
    return blinkingIf(blinkingCondition);
  };

  const answersBlinking = (): string => {
    const blinkingCondition: boolean =
      stealPoints ||
      (roundEnd &&
        !visibilityAnswers.every(
          (visiblity) => visiblity === AnswerVisibility.true
        ));
    return blinkingIf(blinkingCondition);
  };

  const answerBackground = (index: number): string => {
    return visibilityAnswers[index] === AnswerVisibility.true
      ? "rgba(255, 255, 255, 0.7)"
      : "";
  };

  const answerColor = (index: number): string => {
    return visibilityAnswers[index] === AnswerVisibility.true ? "black" : "";
  };

  const showAnswerNumberBackground = (): string => {
    return visibilityAnswers.every(
      (visibility) => visibility === AnswerVisibility.number
    )
      ? "rgba(255, 255, 255, 0.7)"
      : "";
  };

  const showAnswerNumberColor = (): string => {
    return visibilityAnswers.every(
      (visibility) => visibility === AnswerVisibility.number
    )
      ? "black"
      : "";
  };

  const showQuestionBackground = (): string => {
    return visibilityQuestion === true ? "rgba(255, 255, 255, 0.7)" : "";
  };

  const showQuestionColor = (): string => {
    return visibilityQuestion === true ? "black" : "";
  };

  //Button Functions
  const setTeamColors = () => {
    setvisibilityTeamColors(!visibilityTeamColors);
  };

  const goToFinals = () => {
    setFinalsColor(
      pointsTeamLeft > pointsTeamRight ? teamLeftColor : teamRightColor
    );
    setNavigate("/finals");
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

  const showAnswerNumbers = () => {
    if (!roundEnd) {
      if (
        visibilityAnswers.every(
          (visibilityAnswer) => visibilityAnswer === AnswerVisibility.number
        )
      ) {
        setVisibilityAnswers(
          visibilityAnswers.map(() => {
            return AnswerVisibility.false;
          })
        );
      } else {
        setVisibilityAnswers(
          visibilityAnswers.map(() => {
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
        if (stealPoints) {
          const newStealPointsCorrectAnswers = stealPointsCorrectAnswers + 1;
          if (newStealPointsCorrectAnswers >= 2) {
            setStealPoints(false);
          }
          setStealPointsCorrectAnswers(newStealPointsCorrectAnswers);
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

  const goToPreviousQuestion = () => {
    if (roundNum > 0) {
      setRoundNum((prevRoundNum) => prevRoundNum - 1);
    }
  };

  const setAndGoToNextQuestion = () => {
    let newQuestionOrder = [...questionOrder];

    if (questionOrder[roundNum + 1] !== undefined) {
      newQuestionOrder.splice(roundNum + 1);
    }

    const eligibleQuestions = quiz.filter(
      (questionEntry, questionEntryIndex) =>
        !newQuestionOrder.includes(questionEntryIndex) &&
        !specialQuestions.includes(questionEntry.question)
    );

    const randomQuestionIndex = Math.floor(
      Math.random() * eligibleQuestions.length
    );
    const randomQuestion = eligibleQuestions[randomQuestionIndex];

    newQuestionOrder.push(quiz.indexOf(randomQuestion));

    setQuestionOrder(newQuestionOrder);

    goToNextQuestion();
  };

  const SetAndGoToNextSpecialQuestion = () => {
    let newQuestionOrder = [...questionOrder];

    newQuestionOrder.push(
      quiz.findIndex(
        (questionEntry, questionEntryIndex) =>
          !newQuestionOrder.includes(questionEntryIndex) &&
          specialQuestions.includes(questionEntry.question)
      )
    );

    setQuestionOrder(newQuestionOrder);

    goToNextQuestion();
  };

  const goToNextQuestion = () => {
    setRoundNum((prevRoundNum) => prevRoundNum + 1);
  };

  const showWrongs = () => {
    setWrongNum((prevWrongNum) => (wrongNum < 3 ? prevWrongNum + 1 : 3));
    setVisibilityWrong(true);
    setTimeout(() => {
      setVisibilityWrong(false);
      if (
        visibilityAnswers.every(
          (visibilityAnswer) => visibilityAnswer !== AnswerVisibility.true
        )
      ) {
        setWrongNum(0);
      }
    }, 2000);
    if (wrongNum >= 3) {
      setStealPoints(false);
    }
  };

  return (
    <>
      <div className="host-game">
        <TeamColors
          onSubmit={changeTeamColors}
          visibility={visibilityTeamColors}
        />

        <div className={`set-team-color ${setTeamColorBlinking()}`}>
          <button onClick={setTeamColors}>Team Farben</button>
        </div>

        <div className={`go-to-finals ${goToFinalsBlinking()}`}>
          <button onClick={goToFinals}>Finale</button>
        </div>

        <div className={`points-right-team ${pointsRightTeamBlinking()}`}>
          <button
            onClick={pointsNowToRightTeam}
            style={{ border: pointsRightTeamBorder }}
          >
            {pointsTeamRight}
          </button>
        </div>

        <div className="points-now">
          <PointsCard points={pointsNow} />
        </div>

        <div className={`points-left-team ${pointsLeftTeamBlinking()}`}>
          <button
            onClick={pointsNowToLeftTeam}
            style={{ border: pointsLeftTeamBorder }}
          >
            {pointsTeamLeft}
          </button>
        </div>

        <div className="question-navigator">
          <div className="previous-question-navigator">
            <button onClick={goToPreviousQuestion}>Vorherige Frage</button>
          </div>

          <div
            className={`next-question-picker ${nextQuestionPickerBlinking()}`}
          >
            <button onClick={setAndGoToNextQuestion}>
              {`Neue Frage ${questionsLeft()}`}
            </button>
            <button onClick={SetAndGoToNextSpecialQuestion}>
              {`Spezial-Frage ${specialQuestionsLeft()}`}
            </button>
          </div>

          <div className="next-question-navigator">
            {isNextQuestionNavigatorVisible && (
              <button onClick={goToNextQuestion}>Nächste Frage</button>
            )}
          </div>
        </div>

        <div className={`show-answer-number ${showAnswerNumberBlinking()}`}>
          <button
            onClick={showAnswerNumbers}
            style={{
              background: showAnswerNumberBackground(),
              color: showAnswerNumberColor(),
            }}
          >
            <span>Zeige Antworten-Anzahl</span>
            <span>{answers.filter((answer) => answer.value > 1).length}</span>
          </button>
        </div>

        <div className={`show-question ${showQuestionBlinking()}`}>
          <button
            onClick={showQuestion}
            style={{
              background: showQuestionBackground(),
              color: showQuestionColor(),
            }}
          >
            {question}
          </button>
        </div>

        <div className={`answers ${answersBlinking()}`}>
          {answers
            .filter((answer) => answer.value > 1)
            .map((answer, index) => (
              <button
                key={index}
                onClick={() => {
                  changeVisibilityAnswer(index);
                }}
                style={{
                  background: answerBackground(index),
                  color: answerColor(index),
                }}
              >
                <span>{index + 1}</span>
                <span>{answer.text}</span>
                <span>{answer.value}</span>
              </button>
            ))}
        </div>

        <div className="show-wrongs">
          <button onClick={showWrongs}>
            <span>
              {stealPoints
                ? `PUNKTE KLAUEN MÖGLICH! ${stealPointsCorrectAnswers} / 2`
                : "Falsche Antwort"}
            </span>
            <span>{stealPoints ? "" : wrongNum}</span>
          </button>
        </div>

        <div className="answers-one-person">
          {answers
            .filter((answer) => answer.value === 1)
            .map((answer) => (
              <span>{answer.text}</span>
            ))}
        </div>
      </div>
    </>
  );
};

export default HostGame;
