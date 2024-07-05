import "./HostFinals.css";
import { NavigateFunction, useNavigate } from "react-router-dom";
import datajson from "../../data/data.json";
import useLocalStorageWrite from "../../helpers/useLocalStorageWrite";
import AnswerVisibility from "../../types/Enum_AnswerVisibility";
import Interface_Answer from "../../types/Interface_Answer";
import { useEffect, useState } from "react";
import Interface_QuestionAnswer from "../../types/Interface_QuestionAnswer";
import PointsCard from "../../components/PointsCard/PointsCard";

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
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
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
        answer[answersFinalsNumGiven[index]].answerValue != undefined
      ) {
        newPointsFinals += answer[answersFinalsNumGiven[index]].answerValue;
      }
    });

    answersFinals.map((answer, index) => {
      if (
        visibilityAnswersFinals[index + 5] === AnswerVisibility.true &&
        answer[answersFinalsNumGiven[index + 5]].answerValue != undefined
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
  ): string => {
    return answerNumGiven === -1
      ? ""
      : answerNumGiven === 10
      ? "Falsche Antwort"
      : answers[answerNumGiven].answerText;
  };

  const changeVisibilityAnswerFinals = (index: number) => {
    let newVisibilityAnswersFinals = [...visibilityAnswersFinals];
    newVisibilityAnswersFinals[index] =
      newVisibilityAnswersFinals[index] === AnswerVisibility.true
        ? AnswerVisibility.false
        : AnswerVisibility.true;
    setVisibilityAnswersFinals(newVisibilityAnswersFinals);
  };

  return (
    <>
      <div className="host-finals">
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
        <div className="finals-answers-given">
          {answersFinals.map((round, index) => (
            <>
              <input
                key={index}
                type="button"
                value={`${fixAnswer(answersFinalsNumGiven[index], round)} | ${
                  visibilityAnswersFinals[index]
                }`}
                onClick={() => {
                  changeVisibilityAnswerFinals(index);
                }}
              />
              <input
                key={index + 5}
                type="button"
                value={`${fixAnswer(
                  answersFinalsNumGiven[index + 5],
                  round
                )} | ${visibilityAnswersFinals[index + 5]}`}
                onClick={() => {
                  changeVisibilityAnswerFinals(index + 5);
                }}
              />
            </>
          ))}
        </div>
        <div className="go-to-game">
          <input type="button" value="Spiel" onClick={goToGame} />
        </div>
        <div className="finals-question">
          {`${
            (questionFinalsNum < 5
              ? questionFinalsNum
              : questionFinalsNum - 5) + 1
          } | ${
            questionsFinals[
              questionFinalsNum < 5 ? questionFinalsNum : questionFinalsNum - 5
            ]
          }`}
        </div>
        <div className="wrong-finals-answer">
          <input
            type="button"
            value="Falsche Antwort"
            onClick={wrongAnswerGiven}
          />
        </div>
        <div className="delete-finals-answer">
          <input
            type="button"
            value="Letzte Antwort löschen"
            onClick={deleteLastAnswerNumGiven}
          />
        </div>

        <div className="hide-finals-answers">
          <input
            type="button"
            value={"Antworten verstecken"}
            onClick={hideAnswers}
          />
        </div>
        <div className="host-finals-answers">
          {questionFinalsNum !== -1
            ? answersFinals[
                questionFinalsNum < 5
                  ? questionFinalsNum
                  : questionFinalsNum - 5
              ].map((answer, index) => (
                <input
                  key={index}
                  type="button"
                  value={`${index + 1} | ${answer.answerText} | ${
                    answer.answerValue
                  }`}
                  onClick={() => {
                    selectAnswerNum(index);
                  }}
                  disabled={
                    index === answersFinalsNumGiven[questionFinalsNum - 5]
                  }
                />
              ))
            : ""}
        </div>
      </div>
    </>
  );
};

export default HostFinals;
