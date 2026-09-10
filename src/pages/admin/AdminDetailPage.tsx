import Avatar from "boring-avatars";
import { courses } from "../../entities/course/model";
import { getSubmissions } from "../../entities/course/progress";
import { Button } from "../../shared/ui/Button";

type Props = { userName: string; onBack: () => void };

export function AdminDetailPage({ userName, onBack }: Props) {
  const submissions = getSubmissions().filter((item) => item.userName.toLocaleLowerCase("ru-RU") === userName.toLocaleLowerCase("ru-RU"));

  return (
    <main className="page admin-page admin-detail">
      <section className="admin-user-heading">
        <Avatar name={userName} size={52} variant="beam" colors={["#ffad08", "#edd75a", "#73b06f", "#0c8f8f", "#405059"]} />
        <div><h1>{userName}</h1><p>{submissions.length} завершенных уроков</p></div>
      </section>
      {submissions.length === 0 ? <div className="admin-panel"><p className="muted">Пользователь пока не отправлял ответы.</p></div> : (
        <div className="submission-list">
          {submissions.map((submission, index) => {
            const course = courses.find((item) => item.id === submission.courseId);
            const lesson = course?.lessons.find((item) => item.id === submission.lessonId);
            return (
              <article className="submission-card" key={`${submission.date}-${index}`}>
                <div className="submission-block">{course?.title}</div>
                <h2>{lesson?.title}</h2>
                <time>{submission.date}</time>
                <div className="submission-answers">
                  {submission.answers.map((answer, answerIndex) => (
                    <div className="submission-answer" key={answer.question}>
                      <strong>{answerIndex + 1}. {answer.question}</strong>
                      <p>{answer.answer.join(", ")}</p>
                      <span className={answer.correct === false ? "answer-bad" : "answer-ok"}>{answer.correct === null ? "Открытый ответ" : answer.correct ? "Верно" : "Неверно"}</span>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      )}
      <div className="admin-footer"><Button variant="ghost" onClick={onBack}>К пользователям</Button></div>
    </main>
  );
}
