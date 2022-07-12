import React, { useState, useEffect, useRef } from "react";
import {
  collection,
  getDocs,
  query,
  limit,
  getFirestore,
} from "firebase/firestore";
import { db } from "../firebase";
import { getTodaysQuestions } from "../contexts/StoreContext";
import { useNavigate } from "react-router-dom";
import Result from "./Result";

export default function Quizpage() {
  // let background = document.getElementById("background")
  // background.style.backgroundImage = "url('./Quizpage.jpeg')"
  const [questionNumber, setQuestionNumber] = useState(0);
  // used let for time useState for more flexibility with time checks
  // as well as rendering countdown
  const [timer, setTimer] = useState("15");
  // ranOnce for checks after each question
  const [ranOnce, setRanOnce] = useState(false);
  // shuffle incorrect and correct answers into an array
  const [shuffledArray, setShuffledArray] = useState([]);
  const [questionsFromDatabase, setQuestionsFromDatabase] = useState([]);
  let [chosenAnswer, setChosenAnswer] = useState("");
  let [answerPicked, setAnswerPicked] = useState(false);
  const [points, setPoints] = useState(0);
  const Ref = useRef(null);
  const navigate = useNavigate();
  // color constants for easy on-the-fly tailwind changes when answer is choosen/incorrect ect
  const red = "bg-rose-700";
  const green = "bg-green-500";
  const blue = "bg-blue-400";
  const grey = "bg-gray-400";
  const transparent = "--tw-bg-opacity: 1"

  // limit only pulls the first 10 questions instead of all of them
  // should be helpful to change questions every day
  async function queryForQuestions() {
    const questions = await getTodaysQuestions();
    setQuestionsFromDatabase(questions);
  }

  // after every question re-shuffle questions array
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
      console.log("we're trying to navigate");
      console.log("the pioints being passed are: ", points);
      navigate("/result", { state: { points } });
    } else {
      setQuestionNumber(questionNumber + 1);
      setChosenAnswer("");
      clearTimer(getDeadTime());
      setRanOnce(false);
      console.log(answerPicked, "answer picked pre resetquestion");
      setAnswerPicked(false);
      console.log(answerPicked, "answer picked post resetquestion");
      // setTime(15)
      // time = 15
      // startTimer()
    }
  };

  useEffect(() => {
    // very important to call queryForQuestions before startTimer
    // unless you like pain
    // on first run set the questions to local storage
    queryForQuestions();
    // startTimer()
    clearTimer(getDeadTime());
    // returned function will be called on component unmount
    return () => {
      // stopTimer()
    };
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
    deadline.setSeconds(deadline.getSeconds() + 15);
    return deadline;
  };

  let checkAnswer = (chosen, answer) => {
    if (chosen === answer && timer > 0) {
      console.log(
        "...Not bad",
        "questionsFromDatabase[questionNumber].difficulty: ",
        questionsFromDatabase[questionNumber].difficulty,
        chosen
      );
      if (questionsFromDatabase[questionNumber].difficulty === "easy") {
        setPoints(points + 10);
      }
      if (questionsFromDatabase[questionNumber].difficulty === "medium") {
        setPoints(points + 20);
      }
      if (questionsFromDatabase[questionNumber].difficulty === "hard") {
        setPoints(points + 30);
      }
    }
    setAnswerPicked(true);
    setTimer(0);
  };

  // memo prevents array from shuffling every second from the timer re-render
  // tailwind css conditionals to be edgy

  const Answers = React.memo(({ answers }) => {
    return shuffledArray.map((answer, i) => {
      return (
        <button
          className={`flex justify-center gap-4 py-8 mt-4 ${
            (answer === chosenAnswer && timer > 0 && !answerPicked)
              ? blue
              : answer === chosenAnswer && (timer <= 0 || answerPicked) && answer !== questionsFromDatabase[questionNumber].correctAnswer
               ? red :
               ((timer <= 0 || answerPicked) && answer === questionsFromDatabase[questionNumber].correctAnswer ? green : transparent)
          } rounded-md
        font-medium text-white uppercase
        focus:outline-none hover:ring-2 ring-offset-2 ring-blue-600  focus:outline-none`}
          key={i}
          onClick={
            timer > 0 && !answerPicked
              ? () => setChosenAnswer(answer)
              : () => {}
          }
        >
          {answer}
        </button>
      );
    });
  });

  const Check = React.memo(() => {
    return (
      <button
        className="w-full py-3 mt-10 bg-blue-400 p-3 pl-4 pr-4 rounded-lg font-bold hover:ring-2 ring-offset-2 ring-blue-600"
        onClick={
          !answerPicked
            ? () =>
                checkAnswer(
                  chosenAnswer,
                  questionsFromDatabase[questionNumber].correctAnswer
                )
            : () => {
                console.log("CHECK ANSWER DOESNT WORK... good");
              }
        }
      >
        Check answer
      </button>
    );
  });

  // if the questions are there let's do the thing ... or naw

  return (
    <div>
    <div className="flex justify-between">
      <span className="text-2xl text-white text-left">
        Difficulty: {questionsFromDatabase[questionNumber]?.difficulty}
      </span>
      <span className="text-2xl text-white text-right inline">
        Points: {points}
      </span>
    </div>
    <div className="flex justify-between">
      <span className="text-2xl text-white text-left">
      Question: {questionNumber + 1}
      </span>
      <span className="text-2xl text-white text-right inline">
      Time: {!answerPicked ? timer : 0}
      </span>
    </div>
    <div className="grid h-screen place-items-center">
    <div className="my-6 text-center w-4/6">
      <div className="text-2xl text-white">
        {questionsFromDatabase[questionNumber]?.question}
      </div>
      <div id="answer-buttons" className="grid gap-4 grid-cols-2 my-6">
      {<Answers />}
      </div>
      <div className ="grid gap-4 grid-cols-2 my-7">
      {<Check />}
      <button
        className={`w-full py-3 mt-10 ${
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
