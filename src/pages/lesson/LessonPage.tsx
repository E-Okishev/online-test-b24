import { useState, type FormEvent } from "react";
import { completeLesson, getCompletedLessons, saveSubmission } from "../../entities/course/progress";
import { lessonKey, type Course, type Lesson } from "../../entities/course/model";
import { Button } from "../../shared/ui/Button";

type Props = { course: Course; lesson: Lesson; userName: string; onBack: () => void; onNext?: () => void };

export function LessonPage({ course, lesson, userName, onBack, onNext }: Props) {
  const key = lessonKey(course.id, lesson.id);
  const [done, setDone] = useState(getCompletedLessons(userName).includes(key));
  const [submitted, setSubmitted] = useState(false);
  const [single, setSingle] = useState<number | null>(null);
  const [multiple, setMultiple] = useState<number[]>([]);
  const [openAnswer, setOpenAnswer] = useState("");
  const [error, setError] = useState("");
  const singleCorrect = single === lesson.questions[0].correct;
  const multipleCorrect = [...multiple].sort().join() === lesson.questions[1].correct.join();

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (multiple.length === 0) {
      setError("Выберите хотя бы один вариант во втором вопросе.");
      return;
    }
    completeLesson(userName, key);
    saveSubmission({
      date: new Date().toLocaleString("ru-RU"),
      userName,
      courseId: course.id,
      lessonId: lesson.id,
      answers: [
        { question: lesson.questions[0].text, answer: single === null ? [] : [lesson.questions[0].options[single]], correct: singleCorrect },
        { question: lesson.questions[1].text, answer: multiple.map((index) => lesson.questions[1].options[index]), correct: multipleCorrect },
        { question: lesson.questions[2].text, answer: [openAnswer.trim()], correct: null },
      ],
    });
    setDone(true);
    setSubmitted(true);
    setError("");
  };

  return (
    <main className="page lesson-page">
      <article className="lesson-content">
        <div className="lesson-label">{course.title}</div>
        <h1>{lesson.title}</h1>
        <p>{lesson.theory}</p>
        <img src="https://helpdesk.bitrix24.ru/upload/medialibrary/c56/6dn1xqmo6n5znozb6g93u6qa7ka3kyf9/1.jpg" alt={`Интерфейс Битрикс24: ${lesson.title}`} />
        <div className="video"><iframe src="https://rutube.ru/play/embed/0c0736a6a0b4e1bb05a033c003817346" title={`Видео: ${lesson.title}`} allow="clipboard-write; autoplay" allowFullScreen /></div>
        <a className="video-link" href="https://www.bitrix24.ru/training/" target="_blank" rel="noreferrer">Другие видео Битрикс24</a>
      </article>

      <form className="lesson-quiz" onSubmit={submit}>
        <h2>Контрольные вопросы</h2>
        {lesson.questions.map((question, questionIndex) => (
          <fieldset className={submitted ? question.type === "single" ? (singleCorrect ? "checked-correct" : "checked-wrong") : question.type === "multiple" ? (multipleCorrect ? "checked-correct" : "checked-wrong") : "checked-correct" : ""} key={question.text}>
            <legend>{questionIndex + 1}. {question.text}</legend>
            {question.type === "single" && question.options.map((option, index) => <label key={option}><input type="radio" name="single" value={index} checked={single === index} onChange={() => setSingle(index)} required disabled={submitted} />{option}</label>)}
            {question.type === "multiple" && question.options.map((option, index) => <label key={option}><input type="checkbox" checked={multiple.includes(index)} onChange={() => setMultiple(multiple.includes(index) ? multiple.filter((item) => item !== index) : [...multiple, index])} disabled={submitted} />{option}</label>)}
            {question.type === "text" && <textarea name="openAnswer" rows={5} value={openAnswer} onChange={(event) => setOpenAnswer(event.target.value)} required placeholder="Напишите ответ" disabled={submitted} />}
            {submitted && <div className="answer-result">{question.type === "single" ? (singleCorrect ? "Верно" : "Неверно") : question.type === "multiple" ? (multipleCorrect ? "Верно" : "Неверно") : "Ответ принят"}</div>}
          </fieldset>
        ))}
        {error && <p className="form-error">{error}</p>}
        {done && <div className="lesson-complete">✓ Урок пройден</div>}
        <div className="lesson-actions">
          <Button type="button" variant="ghost" onClick={onBack}>К урокам</Button>
          {done
            ? <Button type="button" onClick={onNext} disabled={!onNext}>К следующему уроку</Button>
            : <Button type="submit">Завершить урок</Button>}
        </div>
      </form>
    </main>
  );
}
