import React, { useMemo, useState, useEffect } from 'react';




export default function Quizpage() {
  const [questionNumber, setQuestionNumber] = useState(0);
  let [time, setTime] = useState(15);
  const [ranOnce, setRanOnce] = useState(false)
  const [shuffledArray, setShuffledArray] = useState([])
  let [chosenAnswer, setChosenAnswer] = useState("");
  const red = 'bg-rose-700'
  const green = 'bg-green-500'
  const blue = 'bg-blue-400'
  const grey = 'bg-gray-400'


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
      // time = 15
      }
    }, 1000)
}

const stopTimer = () => {
clearInterval(setTime(0))
// document.querySelector('#counter').remove()
}



    let checkAnswer = (chosen, answer) => {
      if (chosen === answer) {
        console.log("...Not bad", chosen)
      } else {
        console.log("You're a dumbass", chosen)
      }
    }


  const dummyData = [
    {
    category: "Arts & Literature",
    id: "622a1c347cc59eab6f94f993",
    correctAnswer: "One Hundred Years of Solitude",
    incorrectAnswers: [
    "The Sound and the Fury",
    "Under the Volcano",
    "The English Patient"
    ],
    question: "Which book contains the character 'Aureliano Buendia'?",
    tags: [
    "literature",
    "fictitious_characters",
    "arts_and_literature"
    ],
    type: "Multiple Choice",
    difficulty: "hard",
    regions: [ ]
    },
    {
    category: "Society & Culture",
    id: "622a1c367cc59eab6f950114",
    correctAnswer: "Taoism",
    incorrectAnswers: [
    "Buddhism",
    "Zoroastrianism",
    "Hinduism"
    ],
    question: "What religion was founded by Lao-tzu ?",
    tags: [
    "society_and_culture"
    ],
    type: "Multiple Choice",
    difficulty: "medium",
    regions: [ ]
    },
    {
      category: "Geography",
      id: "625e9f00796f721e95543f7c",
      correctAnswer: "Green",
      incorrectAnswers: [
      "White",
      "Blue",
      "Maroon"
      ],
      question: "Which of these colors would you find on the flag of Jamaica?",
      tags: [
      "flags",
      "geography"
      ],
      type: "Multiple Choice",
      difficulty: "medium",
      regions: [ ]
      }
  ]


  if (!ranOnce) {
    console.log(!ranOnce)
  let newAnswerArr = [...dummyData[questionNumber].incorrectAnswers]
  newAnswerArr.push(dummyData[questionNumber].correctAnswer)
  const newShuffledArray = () => newAnswerArr.sort((a, b) => 0.5 - Math.random());
  setRanOnce(true)
  setShuffledArray(newShuffledArray())
  }
  const Answers = React.memo(({answers}) => {
    return (
      shuffledArray.map((answer, i) => {
        return (
        <button className={`w-full py-3 mt-10 ${time > 0 || answer === dummyData[questionNumber].correctAnswer ? green : red} rounded-md
        font-medium text-white uppercase
        focus:outline-none hover:ring-2 ring-offset-2 ring-blue-600 active:bg-green-700 focus:outline-none focus:ring focus:bg-green-700`} key={i} onClick={() => setChosenAnswer(answer)}>{answer}</button>
        )
  })
    )
  })

  const Check = React.memo(() => {
    console.log(chosenAnswer)
    return (
      <button className='w-full py-3 mt-10 bg-blue-400 p-3 pl-4 pr-4 rounded-lg font-bold transition duration-500 ease-in-out hover:ring-2 ring-offset-2 ring-blue-600'  onClick={() => checkAnswer(chosenAnswer, dummyData[questionNumber].correctAnswer)}>Check answer</button>
    )
  })

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#063970] to-blue-200">
      <span className='text-2xl text-white inline'>Difficulty: { dummyData[questionNumber].difficulty}</span>
      <span className='text-2xl text-white text-right inline'>Time: {time}</span>
      <div className='text-2xl text-white text-center'>{dummyData[questionNumber].question}</div>
    {
    <Answers/>
    }
    {
    <Check/>
    }
    <button className={`w-full py-3 mt-10 ${time > 0 ? grey : blue} p-3 pl-4 pr-4 rounded-lg font-bold transition duration-500 ease-in-out hover:ring-2 ring-offset-2 ring-gray-600 ${time > 0 ? 'cursor-not-allowed' : ''}`} onClick={resetQuestion} >next</button>

    </div>
  )
}


