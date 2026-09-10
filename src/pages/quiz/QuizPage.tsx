import { useState } from "react";
import { questions, type QuizResult } from "../../entities/quiz/model";
import { saveResult } from "../../entities/quiz/storage";
import { Button } from "../../shared/ui/Button";

type Props = { userName: string; onBack: () => void; onFinish: (score: number) => void };

export function QuizPage({ userName, onBack, onFinish }: Props) {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number[]>([]);
  const selected = picked[step];
  const question = questions[step];

  const next = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
      return;
    }

    const score = picked.reduce((total, answer, index) => total + Number(answer === questions[index].correct), 0);
    const result: QuizResult = {
      date: new Date().toLocaleString("ru-RU"),
      name: userName,
      score,
      total: questions.length,
      percent: Math.round((score / questions.length) * 100),
      answers: picked.map((answer, index) => ({
        question: questions[index].text,
        answer: questions[index].answers[answer],
        correct: answer === questions[index].correct,
      })),
    };
    saveResult(result);
    onFinish(score);
  };

  return (
    <main className="page quiz-page" aria-live="polite">
      <div className="topline">
        <Button variant="ghost" onClick={onBack}>Материал</Button>
        <span className="progress">Вопрос {step + 1} из {questions.length}</span>
      </div>
      <>
          <article className="quiz-card">
            <h2>{question.text}</h2>
            <div className="answers">
              {question.answers.map((answer, index) => {
                const isCorrect = index === question.correct;
                const className = selected === undefined ? "answer" : isCorrect ? `answer correct${selected !== index ? " missed" : ""}` : selected === index ? "answer wrong" : "answer";
                return <button type="button" className={className} disabled={selected !== undefined} onClick={() => setPicked([...picked, index])} key={answer}>{answer}</button>;
              })}
            </div>
            {selected !== undefined && (
              <p className={`feedback ${selected === question.correct ? "correct" : "wrong"}`}>
                {selected === question.correct ? "Верно." : "Неверно."} {question.note}
              </p>
            )}
          </article>
          {selected !== undefined && <div className="center quiz-actions"><Button onClick={next}>{step === questions.length - 1 ? "Показать результат" : "Следующий вопрос"}</Button></div>}
      </>
    </main>
  );
}
