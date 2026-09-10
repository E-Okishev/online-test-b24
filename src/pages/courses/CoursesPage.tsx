import { courses, lessonKey, type CourseId } from "../../entities/course/model";
import { getCompletedLessons, getSubmissions } from "../../entities/course/progress";
import { CourseLessonsModal } from "./CourseLessonsModal";

type Props = { userName: string; openCourse?: CourseId; onOpen: (course: CourseId) => void; onClose: () => void; onLesson: (course: CourseId, lessonId: string) => void };

export function CoursesPage({ userName, openCourse, onOpen, onClose, onLesson }: Props) {
  const completed = getCompletedLessons(userName);
  const submissions = getSubmissions().filter((submission) => submission.userName.toLocaleLowerCase("ru-RU") === userName.toLocaleLowerCase("ru-RU"));
  const progress = Math.round((completed.length / courses.flatMap((course) => course.lessons).length) * 100);

  return (
    <main className="page courses-page">
      <section className="course-card">
        <h1>Курс по Битрикс24</h1>
        <div className="course-progress"><span style={{ width: `${progress}%` }} /></div>
        <div className="course-meta"><span>Прогресс по курсу</span><strong>{progress}%</strong></div>
      </section>
      <section className="course-program">
        <h2>Программа курса</h2>
        <div className="course-grid">
          {courses.map((course) => {
            const completedCount = course.lessons.filter((lesson) => completed.includes(lessonKey(course.id, lesson.id))).length;
            const courseProgress = Math.round((completedCount / course.lessons.length) * 100);
            return (
              <button className="module-card" onClick={() => onOpen(course.id)} key={course.id}>
                <h3>{course.title}</h3>
                <div className="module-status">{courseProgress === 100 ? "Пройден" : `${courseProgress}%`}</div>
                <div className="module-progress"><span style={{ width: `${courseProgress}%` }} /></div>
              </button>
            );
          })}
        </div>
      </section>
      {openCourse && <CourseLessonsModal course={courses.find((course) => course.id === openCourse)!} completed={completed} submissions={submissions} onClose={onClose} onLesson={(lessonId) => onLesson(openCourse, lessonId)} />}
    </main>
  );
}
