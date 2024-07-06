import "/styles.css";
import "./HostFinals.css";
import { NavigateFunction, useNavigate } from "react-router-dom";
import datajson from "../../../data/data.json";
import useLocalStorageWrite from "../../../helpers/useLocalStorageWrite";
import AnswerVisibility from "../../../types/Enum_AnswerVisibility";
import Interface_Answer from "../../../types/Interface_Answer";
import { useEffect, useState } from "react";
import Interface_QuestionAnswer from "../../../types/Interface_QuestionAnswer";
import PointsCard from "../../../components/PointsCard/PointsCard";

const HostFinals = () => {
  //Variables
  const quiz: Interface_QuestionAnswer = datajson;
  const [roundNum, setRoundNum] = useLocalStorageWrite<number>("roundNum", 0);

  const [questionsFinals, setQuestionsFinals] = useState<string[]>([""]);
  const [questionFinalsNum, setQuestionFinalsNum] = useState<number>(0);
  const [answersFinals, setAnswersFinals] = useLocalStorageWrite<
    Interface_Answer[][]
  >("answersFinals", [[{ answerText: "", answerValue: 0 }]]);
  const [answersFinalsNumGiven, setAnswersFinalsNumGiven] =
    useLocalStorageWrite<number[]>(
      "answersFinalsNumGiven",
      [...Array(10)].map(() => -1)
    );
  const [visibilityAnswersFinals, setVisibilityAnswersFinals] =
    useLocalStorageWrite<AnswerVisibility[]>(
      "visibilityAnswersFinals",
      [...Array(10)].map(() => AnswerVisibility.false)
    );

  const [pointsFinals, setPointsFinals] = useLocalStorageWrite<number>(
    "pointsFinals",
    0
  );

  const [navigate, setNavigate] = useLocalStorageWrite<string>("navigate", "");
  const navigator: NavigateFunction = useNavigate();

  //Hooks
  useEffect(() => {
    for (let key in localStorage) {
      if (!["navigate", "roundNum", "finalsColor"].includes(key)) {
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
    let newQuestionsFinals = [];
    let newAnswersFinals = [];

    for (let index = 0; index < 5; index++) {
      const newQuestionFinals = Object.keys(quiz)[roundNum + index];
      newQuestionsFinals[index] = newQuestionFinals;
      newAnswersFinals[index] = quiz[newQuestionFinals];
    }

    setQuestionsFinals(newQuestionsFinals);
    setAnswersFinals(newAnswersFinals);
    setVisibilityAnswersFinals(
      [...Array(10)].map(() => AnswerVisibility.false)
    );
  }, [quiz, roundNum]);

  useEffect(() => {
    let newPointsFinals: number = 0;

    answersFinals.map((answer, index) => {
      if (
        visibilityAnswersFinals[index] === AnswerVisibility.true &&
        answer[answersFinalsNumGiven[index]] != undefined
      ) {
        newPointsFinals += answer[answersFinalsNumGiven[index]].answerValue;
      }
    });

    answersFinals.map((answer, index) => {
      if (
        visibilityAnswersFinals[index + 5] === AnswerVisibility.true &&
        answer[answersFinalsNumGiven[index + 5]] != undefined
      ) {
        newPointsFinals += answer[answersFinalsNumGiven[index + 5]].answerValue;
      }
    });

    setPointsFinals(newPointsFinals);
  }, [visibilityAnswersFinals]);

  useEffect(() => {
    setQuestionFinalsNum(
      answersFinalsNumGiven.findIndex((answerNum) => answerNum === -1)
    );
  }, [answersFinalsNumGiven]);

  const wrongAnswerGiven = () => {
    let newAnswersFinalsNumGiven = [...answersFinalsNumGiven];

    if (questionFinalsNum !== -1) {
      newAnswersFinalsNumGiven[questionFinalsNum] = 10;
    }

    setAnswersFinalsNumGiven(newAnswersFinalsNumGiven);
  };

  const selectAnswerNum = (index: number) => {
    let newAnswersFinalsNumGiven = [...answersFinalsNumGiven];

    if (questionFinalsNum !== -1) {
      newAnswersFinalsNumGiven[questionFinalsNum] = index;
    }

    setAnswersFinalsNumGiven(newAnswersFinalsNumGiven);
  };

  const deleteLastAnswerNumGiven = () => {
    const questionFinalsNumDelete =
      questionFinalsNum !== -1 ? questionFinalsNum - 1 : 9;
    let newvisibilityAnswersFinals = [...visibilityAnswersFinals];
    newvisibilityAnswersFinals[questionFinalsNumDelete] =
      AnswerVisibility.false;
    setVisibilityAnswersFinals(newvisibilityAnswersFinals);

    let newAnswersFinalsNumGiven = [...answersFinalsNumGiven];
    newAnswersFinalsNumGiven[questionFinalsNumDelete] = -1;
    setAnswersFinalsNumGiven(newAnswersFinalsNumGiven);
  };

  const hideAnswers = () => {
    let newVisibilityAnswersFinals = [...visibilityAnswersFinals];

    const newVisibilityFirstFiveAnswersFinals = newVisibilityAnswersFinals
      .slice(0, 5)
      .every(
        (visibilityAnswerFinals) =>
          visibilityAnswerFinals === AnswerVisibility.hidden
      )
      ? AnswerVisibility.true
      : AnswerVisibility.hidden;

    for (let index = 0; index < 5; index++) {
      newVisibilityAnswersFinals[index] = newVisibilityFirstFiveAnswersFinals;
    }

    setVisibilityAnswersFinals(newVisibilityAnswersFinals);
  };

  const goToGame = () => {
    setRoundNum((prevRoundNum) => {
      return prevRoundNum + 5;
    });
    setNavigate("/game");
  };

  const fixAnswer = (
    answerNumGiven: number,
    answers: Interface_Answer[]
  ): Interface_Answer => {
    let result: Interface_Answer;

    if (answerNumGiven === -1) {
      result = { answerText: "", answerValue: 0 };
    } else if (answerNumGiven === 10) {
      result = { answerText: "Falsch", answerValue: 0 };
    } else {
      result = answers[answerNumGiven];
    }

    return result;
  };

  const changeVisibilityAnswerFinals = (index: number) => {
    let newVisibilityAnswersFinals = [...visibilityAnswersFinals];
    if (answersFinalsNumGiven[index] !== -1) {
      newVisibilityAnswersFinals[index] =
        newVisibilityAnswersFinals[index] === AnswerVisibility.true
          ? AnswerVisibility.false
          : AnswerVisibility.true;
    }
    setVisibilityAnswersFinals(newVisibilityAnswersFinals);
  };

  return (
    <>
      <div className="host-finals">
        <div className="go-to-game">
          <button onClick={goToGame}>Spiel</button>
        </div>

        <div className="finals-points">
          <PointsCard points={pointsFinals} />
        </div>

        <div className="shots-total">
          <PointsCard points={Math.ceil(pointsFinals / 15)} />
        </div>

        <div className="shots-person">
          <PointsCard points={Math.floor(Math.ceil(pointsFinals / 15) / 3)} />
        </div>

        <div className="shots-rest">
          <PointsCard points={Math.ceil(pointsFinals / 15) % 3} />
        </div>

        <div className="finals-question">
          <span>
            {(questionFinalsNum < 5
              ? questionFinalsNum
              : questionFinalsNum - 5) + 1}
          </span>
          <span>
            {
              questionsFinals[
                questionFinalsNum < 5
                  ? questionFinalsNum
                  : questionFinalsNum - 5
              ]
            }
          </span>
        </div>

        <div
          className={`host-finals-answers ${
            (visibilityAnswersFinals
              .slice(0, 5)
              .every((visibility) => visibility === AnswerVisibility.hidden) &&
              answersFinalsNumGiven
                .slice(5)
                .every((numGiven) => numGiven === -1)) ||
            answersFinalsNumGiven.every((numGiven) => numGiven === -1)
              ? "blinking"
              : ""
          }`}
        >
          {questionFinalsNum !== -1
            ? answersFinals[
                questionFinalsNum < 5
                  ? questionFinalsNum
                  : questionFinalsNum - 5
              ].map((answer, index) => (
                <button
                  onClick={() => {
                    selectAnswerNum(index);
                  }}
                  disabled={
                    index === answersFinalsNumGiven[questionFinalsNum - 5]
                  }
                >
                  <span>{index + 1}</span>
                  <span>{answer.answerText}</span>
                  <span>{answer.answerValue}</span>
                </button>
              ))
            : ""}
        </div>

        <div
          className={`hide-finals-answers ${
            (visibilityAnswersFinals
              .slice(0, 5)
              .every((visibility) => visibility === AnswerVisibility.true) &&
              answersFinalsNumGiven
                .slice(5)
                .every((numGiven) => numGiven === -1)) ||
            (visibilityAnswersFinals
              .slice(0, 5)
              .every((visibility) => visibility === AnswerVisibility.hidden) &&
              answersFinalsNumGiven.slice(5).every((numGiven) => numGiven >= 0))
              ? "blinking"
              : ""
          }`}
        >
          <button onClick={hideAnswers}>Antworten verstecken</button>
        </div>

        <div className="wrong-finals-answer">
          <button onClick={wrongAnswerGiven}>Falsche Antwort</button>
        </div>

        <div className="delete-finals-answer">
          <button onClick={deleteLastAnswerNumGiven}>
            Letzte Antwort löschen
          </button>
        </div>

        <div className="finals-overview">
          <div
            className={`finals-answers-given ${
              answersFinalsNumGiven
                .slice(0, 5)
                .every((numGiven) => numGiven >= 0) &&
              answersFinalsNumGiven
                .slice(5)
                .every((numGiven) => numGiven === -1) &&
              visibilityAnswersFinals
                .slice(0, 5)
                .every((visibility) => visibility === AnswerVisibility.false)
                ? "blinking"
                : ""
            }`}
          >
            {answersFinals.map((round, index) => (
              <button
                key={index}
                onClick={() => {
                  changeVisibilityAnswerFinals(index);
                }}
                style={{
                  background:
                    visibilityAnswersFinals[index] === AnswerVisibility.true
                      ? "rgba(255, 255, 255, 0.7)"
                      : "",
                  color:
                    visibilityAnswersFinals[index] === AnswerVisibility.true
                      ? "black"
                      : "",
                }}
              >
                <span>{answersFinalsNumGiven[index] + 1}</span>
                <span>
                  {fixAnswer(answersFinalsNumGiven[index], round).answerText}
                </span>
                <span>
                  {fixAnswer(answersFinalsNumGiven[index], round).answerValue}
                </span>
                <span>{visibilityAnswersFinals[index]}</span>
              </button>
            ))}
          </div>
          <div className="finals-questions">
            {questionsFinals.map((question) => (
              <span>{question}</span>
            ))}
          </div>
          <div
            className={`finals-answers-given ${
              visibilityAnswersFinals
                .slice(0, 5)
                .every((visibility) => visibility === AnswerVisibility.true) &&
              answersFinalsNumGiven
                .slice(5)
                .every((numGiven) => numGiven >= 0) &&
              visibilityAnswersFinals
                .slice(5)
                .every((visibility) => visibility === AnswerVisibility.false)
                ? "blinking"
                : ""
            }`}
          >
            {answersFinals.map((round, index) => (
              <button
                key={index + 5}
                onClick={() => {
                  changeVisibilityAnswerFinals(index + 5);
                }}
                style={{
                  background:
                    visibilityAnswersFinals[index + 5] === AnswerVisibility.true
                      ? "rgba(255, 255, 255, 0.7)"
                      : "",
                  color:
                    visibilityAnswersFinals[index + 5] === AnswerVisibility.true
                      ? "black"
                      : "",
                }}
              >
                <span>{answersFinalsNumGiven[index + 5] + 1}</span>
                <span>
                  {
                    fixAnswer(answersFinalsNumGiven[index + 5], round)
                      .answerText
                  }
                </span>
                <span>
                  {
                    fixAnswer(answersFinalsNumGiven[index + 5], round)
                      .answerValue
                  }
                </span>
                <span>{visibilityAnswersFinals[index + 5]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HostFinals;
