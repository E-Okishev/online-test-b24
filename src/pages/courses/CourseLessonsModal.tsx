import { useEffect } from "react";
import { lessonKey, type Course } from "../../entities/course/model";

type Props = { course: Course; completed: string[]; onClose: () => void; onLesson: (lessonId: string) => void };

export function CourseLessonsModal({ course, completed, onClose, onLesson }: Props) {
  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [onClose]);

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="lessons-modal" role="dialog" aria-modal="true" aria-labelledby="course-modal-title">
        <button className="modal-close" aria-label="Закрыть" onClick={onClose}>×</button>
        <h1 id="course-modal-title">{course.title}</h1>
        <h2>Уроки</h2>
        <ol className="lesson-list">
          {course.lessons.map((lesson) => {
            const isCompleted = completed.includes(lessonKey(course.id, lesson.id));
            return <li key={lesson.id}><button onClick={() => onLesson(lesson.id)}><span>{lesson.title}</span>{isCompleted && <span className="lesson-check" aria-label="Пройден">✓</span>}</button></li>;
          })}
        </ol>
      </section>
    </div>
  );
}
