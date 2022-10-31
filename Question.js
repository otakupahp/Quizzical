import React from "react"
import {nanoid} from "nanoid"

export default function Question(props) {
    function sanitize(text) {
        const doc = new DOMParser().parseFromString(text, "text/html")
        return doc.documentElement.textContent
    }
    
    function pickOption(optionId, isAnswer) {
        const score = isAnswer ? 1 : 0
        setSelectedOption(optionId)
        props.updateScore(score)
    }
    
    const [selectedOption, setSelectedOption] = React.useState('')
    const answerOptions = props.options.map((option, index) => {
        const optionId = `${option.id}-option-${index}`
        const isAnswer = option === props.answer ? "answer" : ""
        const isSelected = optionId === selectedOption ? "checked-option" : ""
        return (
            <span 
                key={optionId} 
                className={`option ${isAnswer} ${isSelected}`}
                onClick={() => pickOption(optionId, isAnswer)}
                >
                {sanitize(option)}
            </span>
        )
    })
    
    return (
        <div className="question">
            <h2>{sanitize(props.question)}</h2>
            <div className="options">
                {answerOptions}
            </div>
        </div>
    )
}