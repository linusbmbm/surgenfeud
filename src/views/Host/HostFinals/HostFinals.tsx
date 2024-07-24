import "/styles.css";
import "./HostFinals.css";
import { NavigateFunction, useNavigate } from "react-router-dom";
import datajson from "../../../data/data.json";
import useLocalStorageWrite from "../../../helpers/useLocalStorageWrite";
import AnswerVisibility from "../../../types/AnswerVisibility.enum";
import { useEffect, useState } from "react";
import PointsCard from "../../../components/PointsCard/PointsCard";
import QuestionEntry from "../../../types/QuestionEntry.interface";
import AnswerEntry from "../../../types/AnswerEntry.interface";
import blinkingIf from "../../../helpers/blinkingIf";

const HostFinals = () => {
  //Variables
  const navigator: NavigateFunction = useNavigate();

  const quiz: QuestionEntry[] = datajson;
  const specialQuestions: string[] = [
    "Nenne eine bekannte Weltstadt.",
    "Nenne einen Grund für Streitigkeiten zwischen Kindern.",
    "Nenne ein Schulfach, das den meisten Schülern gefällt.",
    "Nenne eine beliebte Urlaubsaktivität für Abenteuerlustige.",
  ];

  const [questionsFinals, setQuestionsFinals] = useState<string[]>([""]);
  const [questionFinalsNum, setQuestionFinalsNum] = useState<number>(0);

  const [navigate, setNavigate] = useLocalStorageWrite<string>("navigate", "");
  const [pointsFinals, setPointsFinals] = useLocalStorageWrite<number>(
    "pointsFinals",
    0
  );
  const [questionOrder, setQuestionOrder] = useLocalStorageWrite<number[]>(
    "questionOrder",
    [0]
  );
  const [visibilityAnswersFinals, setVisibilityAnswersFinals] =
    useLocalStorageWrite<AnswerVisibility[]>(
      "visibilityAnswersFinals",
      [...Array(10)].map(() => AnswerVisibility.number)
    );
  const [answersFinalsNumGiven, setAnswersFinalsNumGiven] =
    useLocalStorageWrite<number[]>(
      "answersFinalsNumGiven",
      [...Array(10)].map(() => -1)
    );
  const [answersFinals, setAnswersFinals] = useLocalStorageWrite<
    AnswerEntry[][]
  >("answersFinals", [[{ text: "", value: 0 }]]);

  const calcShotsTotal: number = Math.ceil(pointsFinals / 15);
  const calcShotsPerson: number = Math.floor(calcShotsTotal / 3);
  const calcShotsRest: number = calcShotsTotal % 3;
  const fixQuestionFinalsNum: number =
    questionFinalsNum < 5 ? questionFinalsNum : questionFinalsNum - 5;
  const questionExists: boolean =
    questionFinalsNum !== -1 &&
    answersFinals[fixQuestionFinalsNum] != undefined;

  //Hooks
  useEffect(() => {
    for (let key in localStorage) {
      if (!["navigate", "questionOrder", "finalsColor"].includes(key)) {
        localStorage.removeItem(key);
      }
    }

    let newQuestionOrder = [...questionOrder];
    let newQuestionsFinals = [];
    let newAnswersFinals = [];

    for (let index = 0; index < 5; index++) {
      let newQuestionIndex: number = -1;
      newQuestionIndex = 0;
      //assign
      if (generateQuestionIndex(newQuestionOrder) !== -1) {
        newQuestionIndex = generateQuestionIndex(newQuestionOrder);
      }

      newQuestionOrder.push(newQuestionIndex);
    }

    for (let index = 1; index <= 5; index++) {
      const newQuestionEntryFinals =
        quiz[newQuestionOrder[newQuestionOrder.length - index]];
      newQuestionsFinals.push(newQuestionEntryFinals.question);
      newAnswersFinals.push(newQuestionEntryFinals.answers);
    }

    setQuestionOrder(newQuestionOrder);
    setQuestionsFinals(newQuestionsFinals);
    setAnswersFinals(newAnswersFinals);
    setVisibilityAnswersFinals(
      [...Array(10)].map(() => AnswerVisibility.number)
    );
  }, []);

  useEffect(() => {
    if (navigate) {
      navigator(`/host${navigate}`);
    }
  }, [navigate]);

  useEffect(() => {
    let newPointsFinals: number = 0;

    answersFinals.map((answer, index) => {
      if (
        visibilityAnswersFinals[index] === AnswerVisibility.true &&
        answer[answersFinalsNumGiven[index]] != undefined
      ) {
        newPointsFinals += answer[answersFinalsNumGiven[index]].value;
      }
    });

    answersFinals.map((answer, index) => {
      if (
        visibilityAnswersFinals[index + 5] === AnswerVisibility.true &&
        answer[answersFinalsNumGiven[index + 5]] != undefined
      ) {
        newPointsFinals += answer[answersFinalsNumGiven[index + 5]].value;
      }
    });

    setPointsFinals(newPointsFinals);
  }, [visibilityAnswersFinals]);

  useEffect(() => {
    setQuestionFinalsNum(
      answersFinalsNumGiven.findIndex((answerNum) => answerNum === -1)
    );
  }, [answersFinalsNumGiven]);

  //Functions
  const fixAnswer = (
    answerNumGiven: number,
    answers: AnswerEntry[]
  ): AnswerEntry => {
    let result: AnswerEntry;

    if (answerNumGiven === -1) {
      result = { text: "", value: 0 };
    } else if (answerNumGiven === -2) {
      result = { text: "Falsch", value: 0 };
    } else {
      result = answers[answerNumGiven];
    }

    return result;
  };

  const generateQuestionIndex = (
    questionOrderNow: typeof questionOrder
  ): number => {
    return quiz.findIndex(
      (questionEntry, questionEntryIndex) =>
        !questionOrderNow.includes(questionEntryIndex) &&
        !specialQuestions.includes(questionEntry.question)
    );
  };

  const hostAnswersFinalsBlinking = (): string => {
    const blinkingCondition: boolean =
      (visibilityAnswersFinals
        .slice(0, 5)
        .every((visibility) => visibility === AnswerVisibility.hidden) &&
        answersFinalsNumGiven.slice(5).every((numGiven) => numGiven === -1)) ||
      answersFinalsNumGiven.every((numGiven) => numGiven === -1);
    return blinkingIf(blinkingCondition);
  };

  const hideFinalsAnswersBlinking = (): string => {
    const blinkingCondition: boolean =
      (visibilityAnswersFinals
        .slice(0, 5)
        .every((visibility) => visibility === AnswerVisibility.true) &&
        answersFinalsNumGiven.slice(5).every((numGiven) => numGiven === -1)) ||
      (visibilityAnswersFinals
        .slice(0, 5)
        .every((visibility) => visibility === AnswerVisibility.hidden) &&
        answersFinalsNumGiven.slice(5).every((numGiven) => numGiven !== -1));
    return blinkingIf(blinkingCondition);
  };

  const finalsAnswersGivenFirstPersonBlinking = (): string => {
    const blinkingCondition: boolean =
      answersFinalsNumGiven.slice(0, 5).every((numGiven) => numGiven !== -1) &&
      answersFinalsNumGiven.slice(5).every((numGiven) => numGiven === -1) &&
      visibilityAnswersFinals
        .slice(0, 5)
        .every((visibility) => visibility === AnswerVisibility.number);
    return blinkingIf(blinkingCondition);
  };

  const finalsAnswersGivenSecondPersonBlinking = (): string => {
    const blinkingCondition: boolean =
      visibilityAnswersFinals
        .slice(0, 5)
        .every((visibility) => visibility === AnswerVisibility.true) &&
      answersFinalsNumGiven.slice(5).every((numGiven) => numGiven !== -1) &&
      visibilityAnswersFinals
        .slice(5)
        .every((visibility) => visibility === AnswerVisibility.number);
    return blinkingIf(blinkingCondition);
  };

  const answerBackground = (index: number): string => {
    return visibilityAnswersFinals[index] === AnswerVisibility.true
      ? "rgba(255, 255, 255, 0.7)"
      : "";
  };

  const answerColor = (index: number): string => {
    return visibilityAnswersFinals[index] === AnswerVisibility.true
      ? "black"
      : "";
  };

  //Button Functions
  const goToGame = () => {
    setNavigate("/game");
  };

  const selectAnswerNum = (index: number) => {
    let newAnswersFinalsNumGiven = [...answersFinalsNumGiven];

    if (questionFinalsNum !== -1) {
      newAnswersFinalsNumGiven[questionFinalsNum] = index;
    }

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

  const wrongAnswerGiven = () => {
    let newAnswersFinalsNumGiven = [...answersFinalsNumGiven];

    if (questionFinalsNum !== -1) {
      newAnswersFinalsNumGiven[questionFinalsNum] = -2;
    }

    setAnswersFinalsNumGiven(newAnswersFinalsNumGiven);
  };

  const deleteLastAnswerNumGiven = () => {
    const questionFinalsNumDelete =
      questionFinalsNum !== -1 ? questionFinalsNum - 1 : 9;
    let newvisibilityAnswersFinals = [...visibilityAnswersFinals];
    newvisibilityAnswersFinals[questionFinalsNumDelete] =
      AnswerVisibility.number;
    setVisibilityAnswersFinals(newvisibilityAnswersFinals);

    let newAnswersFinalsNumGiven = [...answersFinalsNumGiven];
    newAnswersFinalsNumGiven[questionFinalsNumDelete] = -1;
    setAnswersFinalsNumGiven(newAnswersFinalsNumGiven);
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
          <PointsCard points={calcShotsTotal} />
        </div>

        <div className="shots-person">
          <PointsCard points={calcShotsPerson} />
        </div>

        <div className="shots-rest">
          <PointsCard points={calcShotsRest} />
        </div>

        <div className="finals-question">
          <span>{fixQuestionFinalsNum + 1}</span>
          <span>{questionsFinals[fixQuestionFinalsNum]}</span>
        </div>

        <div className={`host-finals-answers ${hostAnswersFinalsBlinking}`}>
          {questionExists
            ? answersFinals[fixQuestionFinalsNum]
                .filter((answer) => answer.value > 1)
                .map((answer, index) => (
                  <button
                    id={index.toString()}
                    onClick={() => {
                      selectAnswerNum(index);
                    }}
                    disabled={
                      index === answersFinalsNumGiven[questionFinalsNum - 5]
                    }
                  >
                    <span>{index + 1}</span>
                    <span>{answer.text}</span>
                    <span>{answer.value}</span>
                  </button>
                ))
            : ""}
        </div>

        <div className="answers-one-person">
          {answersFinals[fixQuestionFinalsNum]
            ?.filter((answer) => answer.value === 1)
            .map((answer) => (
              <span>{answer.text}</span>
            ))}
        </div>

        <div className={`hide-finals-answers ${hideFinalsAnswersBlinking()}`}>
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
            className={`finals-answers-given ${finalsAnswersGivenFirstPersonBlinking()}`}
          >
            {answersFinals.map((round, index) => (
              <button
                key={index}
                onClick={() => {
                  changeVisibilityAnswerFinals(index);
                }}
                style={{
                  background: answerBackground(index),
                  color: answerColor(index),
                }}
              >
                <span>{answersFinalsNumGiven[index] + 1}</span>
                <span>
                  {fixAnswer(answersFinalsNumGiven[index], round).text}
                </span>
                <span>
                  {fixAnswer(answersFinalsNumGiven[index], round).value}
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
            className={`finals-answers-given ${finalsAnswersGivenSecondPersonBlinking()}`}
          >
            {answersFinals.map((round, index) => (
              <button
                key={index + 5}
                onClick={() => {
                  changeVisibilityAnswerFinals(index + 5);
                }}
                style={{
                  background: answerBackground(index + 5),
                  color: answerColor(index + 5),
                }}
              >
                <span>{answersFinalsNumGiven[index + 5] + 1}</span>
                <span>
                  {fixAnswer(answersFinalsNumGiven[index + 5], round).text}
                </span>
                <span>
                  {fixAnswer(answersFinalsNumGiven[index + 5], round).value}
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
