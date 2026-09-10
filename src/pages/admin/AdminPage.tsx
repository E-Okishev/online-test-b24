import { useRef } from "react";
import Avatar from "boring-avatars";
import { courses, lessonKey } from "../../entities/course/model";
import { getCompletedLessons, getSubmissions } from "../../entities/course/progress";
import { getUsers } from "../../entities/user/storage";
import { Button } from "../../shared/ui/Button";

type Props = { onMaterial: () => void };

const demoUsers = ["Анна Смирнова", "Иван Петров", "Мария Волкова", "Алексей Соколов", "Елена Кузнецова"];
const lessons = courses.flatMap((course) => course.lessons.map((lesson) => ({ course, lesson })));

function submissionScore(userName: string, courseId: string, lessonId: string) {
  const submission = getSubmissions().find((item) => item.userName.toLocaleLowerCase("ru-RU") === userName.toLocaleLowerCase("ru-RU") && item.courseId === courseId && item.lessonId === lessonId);
  const checked = submission?.answers.filter((answer) => answer.correct !== null) ?? [];
  return checked.length ? Math.round((checked.filter((answer) => answer.correct).length / checked.length) * 100) : null;
}

function demoScore(userIndex: number, lessonIndex: number) {
  if (lessonIndex > 7 + userIndex * 2) return null;
  return [100, 50, 100, 0, 50][(lessonIndex + userIndex * 2) % 5];
}

export function AdminPage({ onMaterial }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, x: 0, scrollLeft: 0 });
  const realUsers = getUsers();
  const realNames = new Set(realUsers.map((user) => user.name.toLocaleLowerCase("ru-RU")));
  const users = [...realUsers.map((user) => ({ ...user, demoIndex: null as number | null })), ...demoUsers.filter((name) => !realNames.has(name.toLocaleLowerCase("ru-RU"))).map((name, demoIndex) => ({ name, demoIndex }))];
  const rows = users.map((user) => {
    const scores = lessons.map(({ course, lesson }, index) => user.demoIndex === null ? submissionScore(user.name, course.id, lesson.id) : demoScore(user.demoIndex, index));
    const percent = user.demoIndex === null
      ? Math.round((getCompletedLessons(user.name).length / lessons.length) * 100)
      : Math.round((scores.filter((score) => score !== null).length / lessons.length) * 100);
    return { ...user, scores, percent };
  });

  return (
    <main className="page admin-page">
      <div className="admin-panel">
        <div
          className="admin-table-scroll"
          ref={scrollRef}
          onPointerDown={(event) => {
            if (event.pointerType === "touch") return;
            dragRef.current = { active: true, x: event.clientX, scrollLeft: scrollRef.current?.scrollLeft ?? 0 };
            event.currentTarget.setPointerCapture(event.pointerId);
            event.currentTarget.classList.add("is-dragging");
          }}
          onPointerMove={(event) => {
            if (!dragRef.current.active || !scrollRef.current) return;
            scrollRef.current.scrollLeft = dragRef.current.scrollLeft - (event.clientX - dragRef.current.x);
          }}
          onPointerUp={(event) => {
            dragRef.current.active = false;
            event.currentTarget.releasePointerCapture(event.pointerId);
            event.currentTarget.classList.remove("is-dragging");
          }}
          onPointerCancel={(event) => {
            dragRef.current.active = false;
            event.currentTarget.classList.remove("is-dragging");
          }}
        >
          <table className="users-table">
            <thead><tr><th>Пользователь</th><th>Завершение курса</th>{lessons.map(({ course, lesson }) => <th className="lesson-result-heading" key={lessonKey(course.id, lesson.id)}><span>{course.title}</span>{lesson.title}</th>)}</tr></thead>
            <tbody>{rows.map((user) => {
              return (
                <tr key={user.name}>
                  <td><div className="admin-user"><Avatar name={user.name} size={40} variant="beam" colors={["#ffad08", "#edd75a", "#73b06f", "#0c8f8f", "#405059"]} /><span>{user.name}</span></div></td>
                  <td><div className="admin-progress"><div><span style={{ width: `${user.percent}%` }} /></div><strong>{user.percent}%</strong></div></td>
                  {user.scores.map((score, index) => <td className="lesson-result" key={lessonKey(lessons[index].course.id, lessons[index].lesson.id)}>{score === null ? "—" : `${score}%`}</td>)}
                </tr>
              );
            })}</tbody>
          </table>
        </div>
        <div className="admin-accordions">
          {rows.map((user) => (
            <details className="admin-user-accordion" key={user.name}>
              <summary>
                <span className="admin-user"><Avatar name={user.name} size={40} variant="beam" colors={["#ffad08", "#edd75a", "#73b06f", "#0c8f8f", "#405059"]} /><span>{user.name}</span></span>
                <span className="accordion-percent">{user.percent}%</span>
                <span className="accordion-chevron" aria-hidden="true" />
              </summary>
              <div className="admin-user-details">
                {courses.map((course) => (
                  <section className="admin-course-results" key={course.id}>
                    <h3>{course.title}</h3>
                    <dl>{course.lessons.map((lesson) => {
                      const index = lessons.findIndex((item) => item.course.id === course.id && item.lesson.id === lesson.id);
                      const score = user.scores[index];
                      return <div key={lesson.id}><dt>{lesson.title}</dt><dd>{score === null ? "—" : `${score}%`}</dd></div>;
                    })}</dl>
                  </section>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>
      <div className="admin-footer"><Button variant="ghost" onClick={onMaterial}>Материал</Button></div>
    </main>
  );
}
