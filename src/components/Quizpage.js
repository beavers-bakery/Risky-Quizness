import React, { useState, useEffect, useRef } from "react";
import {
  getTodaysQuestions,
  addOrUpdateUserGameState,
  getUserGameState,
} from "../contexts/StoreContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Quizpage() {
  //initialize state variables
  const maxTime = 15;
  const { user } = useAuth();
  const [questionNumber, setQuestionNumber] = useState(0);
  const [points, setPoints] = useState(0);
  const [timer, setTimer] = useState(maxTime.toString());
  // ranOnce for checks after each question
  const [ranOnce, setRanOnce] = useState(false);

  // shuffle incorrect and correct answers into an array
  const [shuffledArray, setShuffledArray] = useState([]);
  const [questionsFromDatabase, setQuestionsFromDatabase] = useState([]);
  let [chosenAnswer, setChosenAnswer] = useState("");
  let [answerPicked, setAnswerPicked] = useState(false);
  const [isRight, setIsRight] = useState(false);
  const Ref = useRef(null);
  const navigate = useNavigate();

  // color constants for easy on-the-fly tailwind changes when answer is choosen/incorrect ect
  const red = "bg-rose-700";
  const green = "bg-green-500";
  const blue = "bg-blue-400";
  const grey = "bg-gray-400";
  const transparent = "--tw-bg-opacity: 1";

  async function initialFirebaseQueries() {
    const savedGameState = await getUserGameState(user.uid);
    const questions = await getTodaysQuestions();
    setQuestionsFromDatabase(questions);
    if (savedGameState.timeSaved) {
      // Day only of user - Wed Jul 28 1993
      const userDay = new Date(Date.now).toDateString();
      // Day only of savedGame - Thu Jul 29 1993
      const savedGameDate = new Date(savedGameState.timeSaved).toDateString();
      if (userDay === savedGameDate) {
        //if its still the same day, used the saved state,
        setQuestionNumber(savedGameState?.currentQuestion);
        setPoints(savedGameState?.currentScore);
      } else {
        // if not the same day, adjust saved game data on firebase
        addOrUpdateUserGameState(user?.uid, 0, 0); // reset GameState to 0
      }
    }
  }

  // after every question repopulate and shuffle the answers array
  async function setData() {
    try {
      if (!ranOnce) {
        let newAnswerArr = [
          ...questionsFromDatabase[questionNumber].incorrectAnswers,
        ];
        newAnswerArr.push(questionsFromDatabase[questionNumber].correctAnswer);
        const newShuffledArray = () =>
          newAnswerArr.sort((a, b) => 0.5 - Math.random());
        setRanOnce(true);
        setShuffledArray(newShuffledArray());
      }
    } catch (err) {
      // don't like errors? stop loging them. easy...
      // with console.error uncommented we get 1 incorrectAnswers doesn't exist error
      // before the data shows up
      // console.error(err)
    }
  }

  setData();
  // go ahead and run that mama-jama

  // reset a bunch of stuff after every question
  const resetQuestion = () => {
    if (questionNumber === questionsFromDatabase.length - 1) {
      navigate("/result", { state: { points } });
    } else {
      // typically, call below functions to go to next questions
      setQuestionNumber(questionNumber + 1);
      setChosenAnswer("");
      clearTimer(getDeadTime());
      setRanOnce(false);
      setAnswerPicked(false);
      setIsRight(false);
    }
  };

  useEffect(() => {
    // very important to call initialFirebaseQueries before startTimer
    // unless you like pain
    // on first run set the questions to local storage
    initialFirebaseQueries();
    // startTimer()
    clearTimer(getDeadTime());
    // returned function will be called on component unmount
    return () => {
      // stopTimer()
    };
    // eslint-disable-next-line
  }, []);

  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    return {
      total,
      seconds,
    };
  };

  const startTimer = (e) => {
    let { total, seconds } = getTimeRemaining(e);
    if (total >= 0) {
      // update the timer
      // check if less than 10 then we need to
      // add '0' at the beginning of the variable
      setTimer(seconds > 9 ? seconds : "0" + seconds);
    }
  };

  const clearTimer = (e) => {
    // If you adjust it you should also need to
    // adjust the Endtime formula we are about
    // to code next
    setTimer("15");

    // If you try to remove this line the
    // updating of timer Variable will be
    // after 1000ms or 1sec
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    Ref.current = id;
  };

  const getDeadTime = () => {
    let deadline = new Date();

    // This is where you need to adjust if
    // you entend to add more time
    deadline.setSeconds(deadline.getSeconds() + maxTime);
    return deadline;
  };

  let checkAnswer = (chosen, answer) => {
    let newPoints = points;
    if (chosen === answer && timer > 0) {
      const timerPercentage = timer / maxTime;
      if (questionsFromDatabase[questionNumber].difficulty === "easy") {
        newPoints += Math.ceil(10 * timerPercentage);
      }
      if (questionsFromDatabase[questionNumber].difficulty === "medium") {
        newPoints += Math.ceil(20 * timerPercentage);
      }
      if (questionsFromDatabase[questionNumber].difficulty === "hard") {
        newPoints += Math.ceil(30 * timerPercentage);
      }
      setPoints(newPoints);
      setIsRight(true);
    }
    setAnswerPicked(true);
    setTimer(0);
    addOrUpdateUserGameState(user?.uid, questionNumber + 1, newPoints);
  };

  // memo prevents array from shuffling every second from the timer re-render
  // tailwind css conditionals to be edgy

  const Answers = React.memo(({ answers }) => {
    return shuffledArray.map((answer, i) => {
      return (
        <button
          className={`w-10/12 py-4 mb-4 md:py-8 md:mt-4 rounded-md
        font-small text-white uppercase
        focus:outline-none ring-2 ring-offset-2 ${
          answer === chosenAnswer && timer > 0 && !answerPicked
            ? blue
            : answer === chosenAnswer &&
              (timer <= 0 || answerPicked) &&
              answer !== questionsFromDatabase[questionNumber].correctAnswer
            ? red
            : (timer <= 0 || answerPicked) &&
              answer === questionsFromDatabase[questionNumber].correctAnswer
            ? green
            : transparent
        } ring-blue-600  focus:outline-none`}
          key={i}
          onClick={
            timer > 0 && !answerPicked
              ? () => {
                  setChosenAnswer(answer);
                  checkAnswer(
                    answer,
                    questionsFromDatabase[questionNumber].correctAnswer
                  );
                }
              : () => {}
          }
        >
          {answer}
        </button>
      );
    });
  });

  // if the questions are there let's do the thing ... or naw

  return (
    <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 flex justify-center h-full py-20">
      <div className="m-4 w-full md:max-w-[750px]">
        {isRight && (timer <= 0 || answerPicked) ? (
          <h1 className="mb-1 font-mono text-4xl text-center text-gray-100 md:text-6xl">
            <span className="neon-text inline-flex h-20 pt-2 overflow-x-hidden animate-type group-hover:animate-type-reverse whitespace-nowrap text-brand-accent will-change-transform">
              Nice Work!
            </span>
            <span className="box-border inline-block w-1 h-10 ml-2 -mb-2 bg-white md:-mb-4 md:h-16 animate-cursor will-change-transform"></span>
          </h1>
        ) : !isRight && (timer <= 0 || answerPicked) ? (
          <div className="mb-1 font-mono text-4xl text-center text-gray-100 md:text-6xl">
            <h1 className="neon-text inline-flex h-20 pt-2 overflow-x-hidden animate-type group-hover:animate-type-reverse whitespace-nowrap text-brand-accent will-change-transform">
              Try Again!
            </h1>
            <span className="box-border inline-block w-1 h-10 ml-2 -mb-2 bg-white md:-mb-4 md:h-16 animate-cursor will-change-transform"></span>
          </div>
        ) : (
          <h1 className="neon-text mb-1 font-mono text-4xl text-center text-gray-100 md:text-6xl">
            Good Luck!
          </h1>
        )}
        <div className="flex flex-col items-center neon-wrapper">
          <div className="my-6 mb-4 px-8 text-center w-full flex justify-between items-center">
            <span
              className={`text-xl text-white my-2 ${
                questionsFromDatabase[questionNumber]?.difficulty === "easy"
                  ? "text-green-500"
                  : questionsFromDatabase[questionNumber]?.difficulty ===
                    "medium"
                  ? "text-blue-400"
                  : "text-rose-700"
              } `}
            >
              {questionsFromDatabase[questionNumber]?.difficulty === "easy"
                ? "Easy "
                : questionsFromDatabase[questionNumber]?.difficulty === "medium"
                ? "Medium "
                : "Hard "}
            </span>
            <span
              className={`text-2xl border-2 rounded-full py-2 px-3 ${
                timer <= 5 && !answerPicked
                  ? "text-rose-700"
                  : timer <= 10 && !answerPicked
                  ? "text-yellow-400"
                  : "text-green-500"
              } inline`}
            >
              {!answerPicked ? timer : 0}
            </span>
            <span className="text-2xl neon-text">score: {points}</span>
            <span className="text-2xl neon-text">
              {questionNumber + 1} / 10
            </span>
          </div>
          <div className="flex flex-col items-center w-full">
            <h2 className="text-xl md:text-2xl px-4 text-center text-white">
              {questionsFromDatabase[questionNumber]?.question}
            </h2>
            <div
              id="answer-buttons"
              className="flex flex-col items-center w-full md:grid md:place-items-center md:gap-4 md:grid-cols-2 my-6"
            >
              {<Answers />}
            </div>

            <button
              className={`w-10/12 mb-6 py-3 md:mt-10 ${
                timer > 0 && !answerPicked ? grey : blue
              } p-3 pl-4 pr-4 rounded-lg font-bold transition duration-500 ease-in-out hover:ring-2 ring-offset-2 ring-gray-600 ${
                timer > 0 && !answerPicked ? "cursor-not-allowed" : ""
              }`}
              onClick={timer <= 0 || answerPicked ? resetQuestion : () => {}}
            >
              next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
