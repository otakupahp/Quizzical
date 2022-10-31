import React from "react"
import Question from "./Question"
import {nanoid} from "nanoid"

export default function App() {
    const [isStartScreen, setStartScreen] = React.useState(true)
    const [questions, setQuestions] = React.useState([])
    const [result, setResult] = React.useState({
        isAnswered: false,
        score: 0,
        questions: 0
    })
    
    function shuffle(array) {
        let currentIndex = array.length, randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex != 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }

        return array;
    }
    
    function getNewQuestions() {
        fetch('https://opentdb.com/api.php?amount=5&type=multiple')
            .then(res => res.json())
            .then(data => {
                const fetchedQuestions = data.results.map(result => {
                    const options = shuffle(result.incorrect_answers.concat(result.correct_answer))
                    return {
                        id: nanoid(),
                        question: result.question,
                        answer: result.correct_answer,
                        options: options
                    }
                })
                setQuestions(fetchedQuestions)
            })
    }
    
    function checkAnswers() {
        if(! result.isAnswered) {
            setResult(prevResult => ({score: prevResult.score, isAnswered: true, questions: questions.length}))
        }
        else {
            getNewQuestions()
            setResult({score: 0, isAnswered: false, questions: 0})
        }
    }
    
    function updateScore(score) {
        const updatedScore = result.score + score;
        setResult(prevResult => ({isAnswered: false, questions: 0, score: updatedScore}))
    }
    
    React.useEffect(() => {
        getNewQuestions()
    }, [])
    const questionsElements = questions.map((question) => {
        return (
            <Question
                key={question.id}
                id={question.id}
                question={question.question}
                answer={question.answer}
                options={question.options}
                updateScore={updateScore}
            />
        )
    })
    const isAnswered = result.isAnswered ? "answered" : ""
    const finalScore = <div className="score">You scored {result.score}/{result.questions} correct answers</div>
    return (
        <main>
            {
                isStartScreen 
                ?
                <div className="start">
                    <h1>Quizzical</h1>
                    <p>OtakuPahp 2022 v1.0</p>
                    <button onClick={() => setStartScreen(false)}>Start quiz</button>
                </div>
                :
                <div className={`questions ${isAnswered}`}>
                    <section>
                        {questionsElements}
                    </section>
                    <footer>
                        {result.isAnswered && finalScore}
                        <button onClick={checkAnswers}>
                            {result.isAnswered ? "Play again" : "Check answers"}
                        </button>
                    </footer>
                </div>
            }
        </main>
    )
}