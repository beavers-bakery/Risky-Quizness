import React, {useState, useEffect, useRef } from 'react';
import { collection, getDocs, query, limit, getFirestore } from 'firebase/firestore';
import { db } from '../firebase';
import { async } from '@firebase/util';

export default function Quizpage() {

  const [questionNumber, setQuestionNumber] = useState(0);
  // used let for time useState for more flexibility with time checks
  // as well as rendering countdown
   const [timer, setTimer] = useState('15');
    // ranOnce for checks after each question
  const [ranOnce, setRanOnce] = useState(false)
  // shuffle incorrect and correct answers into an array
  const [shuffledArray, setShuffledArray] = useState([])
  const [questionsFromDatabase, setQuestionsFromDatabase] = useState([])
  let [chosenAnswer, setChosenAnswer] = useState("");
  let [answerPicked, setAnswerPicked] = useState(false)
  const [points, setPoints] = useState(0)
   const Ref = useRef(null);
  // color constants for easy on-the-fly tailwind changes when answer is choosen/incorrect ect
  const red = 'bg-rose-700'
  const green = 'bg-green-500'
  const blue = 'bg-blue-400'
  const grey = 'bg-gray-400'

  // limit only pulls the first 10 questions instead of all of them
  // should be helpful to change questions every day
  async function queryForQuestions() {
    let returnArr = []
    const questions = query(
      collection(db, 'questions'),
      limit(10)
    )



    const querySnapshot = await getDocs(questions)

    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const data = doc.data()
      data.id = doc.id
      returnArr.push(data)
    });
    setQuestionsFromDatabase(returnArr)
  }





// after every question re-shuffle questions array
  async function setData() {

    try {


    if (!ranOnce) {
    let newAnswerArr = [...questionsFromDatabase[questionNumber].incorrectAnswers]
    newAnswerArr.push(questionsFromDatabase[questionNumber].correctAnswer)
    const newShuffledArray = () => newAnswerArr.sort((a, b) => 0.5 - Math.random());
    setRanOnce(true)
    setShuffledArray(newShuffledArray())
    }
    }
    // don't like errors? stop loging them. easy...
    // with console.error uncommented we get 1 incorrectAnswers doesn't exist error
    // before the data shows up
    catch(err) {
      // console.error(err)
    }

  }

  setData()
  // go ahead and run that mama-jama



  // reset a bunch of stuff after every question
  const resetQuestion = () => {
    setQuestionNumber(questionNumber + 1);
    setChosenAnswer("")
    clearTimer(getDeadTime())
    setRanOnce(false)
    console.log(answerPicked, "answer picked pre resetquestion")
    setAnswerPicked(false)
    console.log(answerPicked, "answer picked post resetquestion")
    // setTime(15)
    // time = 15
    // startTimer()
  }

  useEffect(() => {
    // very important to call queryForQuestions before startTimer
    // unless you like pain
    // on first run set the questions to local storage
    queryForQuestions()
    // startTimer()
    clearTimer(getDeadTime())
    // returned function will be called on component unmount
    return () => {
      // stopTimer()
    }
  }, [])


const getTimeRemaining = (e) => {
  const total = Date.parse(e) - Date.parse(new Date());
  const seconds = Math.floor((total / 1000) % 60);
  return {
      total, seconds
  };
}


const startTimer = (e) => {
  let { total, seconds }
              = getTimeRemaining(e);
  if (total >= 0) {

      // update the timer
      // check if less than 10 then we need to
      // add '0' at the beginning of the variable
      setTimer(
         (seconds > 9 ? seconds : '0' + seconds)
      )
  }
}

const clearTimer = (e) => {

  // If you adjust it you should also need to
  // adjust the Endtime formula we are about
  // to code next
  setTimer('15');

  // If you try to remove this line the
  // updating of timer Variable will be
  // after 1000ms or 1sec
  if (Ref.current) clearInterval(Ref.current);
  const id = setInterval(() => {
      startTimer(e);
  }, 1000)
  Ref.current = id;
}

const getDeadTime = () => {
  let deadline = new Date();

  // This is where you need to adjust if
  // you entend to add more time
  deadline.setSeconds(deadline.getSeconds() + 15);
  return deadline;
}

    let checkAnswer = (chosen, answer) => {
      if (chosen === answer && timer > 0) {
        console.log("...Not bad","questionsFromDatabase[questionNumber].difficulty: ",questionsFromDatabase[questionNumber].difficulty , chosen)
        if (questionsFromDatabase[questionNumber].difficulty === 'easy') {
          setPoints(points + 10)
        }
        if (questionsFromDatabase[questionNumber].difficulty === 'medium') {
          setPoints(points + 20)
        }
        if (questionsFromDatabase[questionNumber].difficulty === 'hard') {
          setPoints(points + 30)
        }
      }
      setAnswerPicked(true)
      setTimer(0)
    }

  // memo prevents array from shuffling every second from the timer re-render
  // tailwind css conditionals to be edgy

  const Answers = React.memo(({answers}) => {
    return (
      shuffledArray.map((answer, i) => {
        return (
        <button className={`w-full py-3 mt-10 ${(answer === chosenAnswer && timer > 0 && !answerPicked) || ((timer <= 0 || answerPicked) && chosenAnswer === answer)
             ? blue : (answer === questionsFromDatabase[questionNumber].correctAnswer || (timer > 0 && !answerPicked) ? green : red)} rounded-md
        font-medium text-white uppercase
        focus:outline-none hover:ring-2 ring-offset-2 ring-blue-600  focus:outline-none`} key={i} onClick={(timer > 0 && !answerPicked) ? () => setChosenAnswer(answer) : ()=> {}}>{answer}</button>
        )
  })
    )
  })

  // weird bug when check answer is pressed multiple times on the next question the timer falls too quickly...
  // thought I could combat this by passing a useless function to Onclick if the user has already checked thier answer
  // checkAnswer only runs on first button click but issue remains ...curious
  const Check = React.memo(() => {
    return (
      <button className='w-full py-3 mt-10 bg-blue-400 p-3 pl-4 pr-4 rounded-lg font-bold hover:ring-2 ring-offset-2 ring-blue-600'  onClick={!answerPicked ? () => checkAnswer(chosenAnswer, questionsFromDatabase[questionNumber].correctAnswer) : ()=> {console.log("CHECK ANSWER DOESNT WORK... good")}}>Check answer</button>
    )
  })


   // if the questions are there let's do the thing ... or naw

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#063970] to-blue-200">
     <span className='text-2xl text-white inline'>Difficulty: {questionsFromDatabase[questionNumber]?.difficulty}</span>
      <span className='text-2xl text-white text-right inline'>Points: {points}</span>
      <span className='text-2xl text-white text-right inline'>Time: {!answerPicked ? timer : 0}</span>
      <div className='text-2xl text-white text-center'>{questionsFromDatabase[questionNumber]?.question}</div>
    {
    <Answers/>
    }
    {
    <Check/>
    }
    <button className={`w-full py-3 mt-10 ${timer > 0 && !answerPicked ? grey : blue} p-3 pl-4 pr-4 rounded-lg font-bold transition duration-500 ease-in-out hover:ring-2 ring-offset-2 ring-gray-600 ${timer > 0 && !answerPicked ? 'cursor-not-allowed' : ''}`} onClick={timer <= 0 || answerPicked ? resetQuestion : () => {}} >next</button>

    </div>
  )


}

