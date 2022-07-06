import React, {useState, useEffect } from 'react';
import { collection, getDocs, query, limit, getFirestore } from 'firebase/firestore';
import { db } from '../firebase';
import { async } from '@firebase/util';

const firestore = getFirestore()



export default function Quizpage() {

  const [questionNumber, setQuestionNumber] = useState(0);
  // used let for time useState for more flexibility with time checks
  // as well as rendering countdown
  let [time, setTime] = useState(15);
    // ranOnce for checks after each question
  // onlyOnce for capturing data during 1 game
  const [ranOnce, setRanOnce] = useState(false)
  const [onlyOnce, setOnlyOnce] = useState(false)
  // shuffle incorrect and correct answers into an array
  const [shuffledArray, setShuffledArray] = useState([])
  const [questionsFromDatabase, setQuestionsFromDatabase] = useState([])
  let [chosenAnswer, setChosenAnswer] = useState("");
  const [points, setPoints] = useState(0)
  // color constants for easy on-the-fly tailwind changes when answer is choosen/incorrect ect
  const red = 'bg-rose-700'
  const green = 'bg-green-500'
  const blue = 'bg-blue-400'
  const grey = 'bg-gray-400'

  // limit only pulls the first 10 questions instead of all of them
  // should be helpful to change questions every day
  async function queryForQuestions() {
    let questionsArr = []
    const questions = query(
      collection(firestore, 'questions'),
      limit(10)
    )


    // querySnapshot organizes the question data the way I want
    // generally unfamiliar with querying firstore, and surely not ideal...
    // but it does it's job
    const querySnapshot = await getDocs(questions)
    querySnapshot.docs.forEach((doc, i) => {
      questionsArr.push({
        category: doc._document.data.value.mapValue.fields.category.stringValue,
        id: i,
        correctAnswer: doc._document.data.value.mapValue.fields.correctAnswer.stringValue,
        incorrectAnswers: doc._document.data.value.mapValue.fields.incorrectAnswers.arrayValue.values.map((answer) => {return answer.stringValue}),
        question: doc._document.data.value.mapValue.fields.question.stringValue,
        tags: doc._document.data.value.mapValue.fields.tags.arrayValue.values.map((tag) => {return tag.stringValue}),
        type: doc._document.data.value.mapValue.fields.type.stringValue,
        difficulty: doc._document.data.value.mapValue.fields.difficulty.stringValue,
        regions: [ ]
        }
        )
    })
    setQuestionsFromDatabase(questionsArr)
  }





// on first run set the questions to local storage
// after every question re-shuffle questions array
  async function setData() {

    try {

    if (!onlyOnce) {
      console.log("ONLY ONCE")
      setOnlyOnce(true)
      const data = await queryForQuestions()
      setQuestionsFromDatabase(data)
    }

    if (!ranOnce) {
      console.log(questionsFromDatabase, "DATA IN !RANONCE")
    let newAnswerArr = [...questionsFromDatabase[questionNumber].incorrectAnswers]
    newAnswerArr.push(questionsFromDatabase[questionNumber].correctAnswer)
    const newShuffledArray = () => newAnswerArr.sort((a, b) => 0.5 - Math.random());
    setRanOnce(true)
    setShuffledArray(newShuffledArray())
    }
    }
    catch(err) {
      console.error(err)
    }

  }

  // go ahead and run that mama-jama
  setData()


  // reset a bunch of stuff after every question
  const resetQuestion = () => {
    setQuestionNumber(questionNumber + 1);
    setChosenAnswer("")
    setTime(15)
    time = 15
    startTimer()
    setRanOnce(false)
  }

  useEffect(() => {
    startTimer()
    // returned function will be called on component unmount
    return () => {
      stopTimer()
    }
  }, [])





  const startTimer = () => {
    console.log(time, "dis time")
    const interval = setInterval(() => {
      setTime(time => time - 1)
      time--
      console.log(time)
      if (time === 0) {
      clearInterval(interval)
      }
    }, 1000)
}

const stopTimer = () => {
clearInterval(setTime(0))
}


    // just logs for now.... will add points here in a jiff
    let checkAnswer = (chosen, answer) => {
      if (chosen === answer) {
        console.log("...Not bad", chosen)
      } else {
        console.log("You're a dumbass", chosen)
      }
    }

  // memo prevents array from shuffling every second from the timer re-render
  // tailwind css conditionals to be edgy
  const Answers = React.memo(({answers}) => {
    return (
      shuffledArray.map((answer, i) => {
        return (
        <button className={`w-full py-3 mt-10 ${time > 0 && answer === chosenAnswer ? blue : (answer === questionsFromDatabase[questionNumber].correctAnswer || time > 0 ? green : red)} rounded-md
        font-medium text-white uppercase
        focus:outline-none hover:ring-2 ring-offset-2 ring-blue-600  focus:outline-none`} key={i} onClick={() => setChosenAnswer(answer)}>{answer}</button>
        )
  })
    )
  })

  const Check = React.memo(() => {
    console.log(chosenAnswer)
    return (
      <button className='w-full py-3 mt-10 bg-blue-400 p-3 pl-4 pr-4 rounded-lg font-bold hover:ring-2 ring-offset-2 ring-blue-600'  onClick={() => checkAnswer(chosenAnswer, questionsFromDatabase[questionNumber].correctAnswer)}>Check answer</button>
    )
  })
  console.log(questionsFromDatabase)

   // if the questions are there let's do the thing ... or naw
   questionsFromDatabase.length ?
  (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#063970] to-blue-200">
      <span className='text-2xl text-white inline'>Difficulty: { questionsFromDatabase[questionNumber].difficulty}</span>
      <span className='text-2xl text-white text-right inline'>Points: {points}</span>
      <span className='text-2xl text-white text-right inline'>Time: {time}</span>
      <div className='text-2xl text-white text-center'>{questionsFromDatabase[questionNumber].question}</div>
    {
    <Answers/>
    }
    {
    <Check/>
    }
    <button className={`w-full py-3 mt-10 ${time > 0 ? grey : blue} p-3 pl-4 pr-4 rounded-lg font-bold transition duration-500 ease-in-out hover:ring-2 ring-offset-2 ring-gray-600 ${time > 0 ? 'cursor-not-allowed' : ''}`} onClick={resetQuestion} >next</button>

    </div>
  ) : <div>nope</div>


}

