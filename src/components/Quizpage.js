import React, {useState, useEffect } from 'react';
import { collection, getDocs, query, limit, getFirestore } from 'firebase/firestore';
import { db } from '../firebase';
import { async } from '@firebase/util';

// const firestore = getFirestore()



export default function Quizpage() {

  const [questionNumber, setQuestionNumber] = useState(0);
  // used let for time useState for more flexibility with time checks
  // as well as rendering countdown
  let [time, setTime] = useState(15);
    // ranOnce for checks after each question
  const [ranOnce, setRanOnce] = useState(false)
  // shuffle incorrect and correct answers into an array
  const [shuffledArray, setShuffledArray] = useState([])
  const [questionsFromDatabase, setQuestionsFromDatabase] = useState([])
  let [chosenAnswer, setChosenAnswer] = useState("");
  let [answerPicked, setAnswerPicked] = useState(false)
  const [points, setPoints] = useState(0)
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
    setTime(15)
    time = 15
    startTimer()
    setRanOnce(false)
    console.log(answerPicked, "answer picked pre resetquestion")
    setAnswerPicked(false)
    console.log(answerPicked, "answer picked post resetquestion")
  }

  useEffect(() => {
    // very important to call queryForQuestions before startTimer
    // unless you like pain
    // on first run set the questions to local storage
    queryForQuestions()
    startTimer()
    // returned function will be called on component unmount
    return () => {
      stopTimer()
    }
  }, [])





  const startTimer = () => {
    const interval = setInterval(() => {
      setTime(time => time - 1)
      time--
      console.log(time)
      console.log(answerPicked)
      if (time === 0) {
      clearInterval(interval)
      }
    }, 1000)
}



const stopTimer = () => {
clearInterval(setTime(0))
console.log("ya fuckin did it stop timer ran")
}


    // just logs for now.... will add points here in a jiff
    let checkAnswer = (chosen, answer) => {
      if (chosen === answer && time > 0) {
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
      } else {
        console.log("You're a dumbass","questionsFromDatabase[questionNumber].difficulty: ",questionsFromDatabase[questionNumber].difficulty, chosen)
      }
      console.log("WIGALEE WOGALEE")
      setAnswerPicked(true)
      console.log(answerPicked, "answerPicked")
      stopTimer()
    }

  // memo prevents array from shuffling every second from the timer re-render
  // tailwind css conditionals to be edgy

    // ${answer === chosenAnswer &&
  //   (answer !== questionsFromDatabase[questionNumber].correctAnswer || time > 0)
  //   ? blue : (answer === questionsFromDatabase[questionNumber].correctAnswer || time > 0 ? green : red)}


  const Answers = React.memo(({answers}) => {
    return (
      shuffledArray.map((answer, i) => {
        return (
        <button className={`w-full py-3 mt-10 ${answer === chosenAnswer &&
             (answer !== questionsFromDatabase[questionNumber].correctAnswer || time > 0)
             ? blue : (answer === questionsFromDatabase[questionNumber].correctAnswer || time > 0 ? green : red)} rounded-md
        font-medium text-white uppercase
        focus:outline-none hover:ring-2 ring-offset-2 ring-blue-600  focus:outline-none`} key={i} onClick={() => setChosenAnswer(answer)}>{answer}</button>
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
      <span className='text-2xl text-white text-right inline'>Time: {!answerPicked ? time : 0}</span>
      <div className='text-2xl text-white text-center'>{questionsFromDatabase[questionNumber]?.question}</div>
    {
    <Answers/>
    }
    {
    <Check/>
    }
    <button className={`w-full py-3 mt-10 ${time > 0 ? grey : blue} p-3 pl-4 pr-4 rounded-lg font-bold transition duration-500 ease-in-out hover:ring-2 ring-offset-2 ring-gray-600 ${time > 0 ? 'cursor-not-allowed' : ''}`} onClick={time <= 0 || answerPicked ? resetQuestion : () => {}} >next</button>

    </div>
  )


}

