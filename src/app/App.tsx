import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { courses, type CourseId } from "../entities/course/model";
import type { User } from "../entities/user/model";
import { getCurrentUser, logout } from "../entities/user/storage";
import { AdminPage } from "../pages/admin/AdminPage";
import { CoursesPage } from "../pages/courses/CoursesPage";
import { LessonPage } from "../pages/lesson/LessonPage";
import { LoginPage } from "../pages/login/LoginPage";
import { Header } from "../widgets/header/Header";
import { ThemeSwitcher, type ThemeMode } from "../widgets/theme-switcher/ThemeSwitcher";

function CoursesRoute({ userName }: { userName: string }) {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const openCourse = courses.some((course) => course.id === courseId) ? courseId as CourseId : undefined;
  return <CoursesPage userName={userName} openCourse={openCourse} onOpen={(id) => navigate(`/courses/${id}`)} onClose={() => navigate("/courses")} onLesson={(id, lessonId) => navigate(`/courses/${id}/lessons/${lessonId}`)} />;
}

function LessonRoute({ userName }: { userName: string }) {
  const navigate = useNavigate();
  const { courseId, lessonId } = useParams();
  const course = courses.find((item) => item.id === courseId);
  const lesson = course?.lessons.find((item) => item.id === lessonId);
  if (!course || !lesson) return <Navigate to="/courses" replace />;
  const lessons = courses.flatMap((item) => item.lessons.map((courseLesson) => ({ course: item, lesson: courseLesson })));
  const currentIndex = lessons.findIndex((item) => item.course.id === course.id && item.lesson.id === lesson.id);
  const next = lessons[currentIndex + 1];
  const back = () => navigate("/courses");
  return <LessonPage key={`${course.id}:${lesson.id}`} course={course} lesson={lesson} userName={userName} onBack={back} onNext={next ? () => navigate(`/courses/${next.course.id}/lessons/${next.lesson.id}`) : undefined} />;
}

export function App() {
  const [user, setUser] = useState<User | null>(getCurrentUser);
  const [theme, setTheme] = useState<ThemeMode>(() => (localStorage.getItem("bitrix-course-theme") as ThemeMode | null) ?? "auto");
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => document.documentElement.dataset.theme = theme === "auto" ? (media.matches ? "dark" : "light") : theme;
    applyTheme();
    localStorage.setItem("bitrix-course-theme", theme);
    media.addEventListener("change", applyTheme);
    return () => media.removeEventListener("change", applyTheme);
  }, [theme]);
  const go = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!user) {
    return <><Routes><Route path="/login" element={<LoginPage onLogin={(nextUser) => { setUser(nextUser); go("/courses"); }} />} /><Route path="*" element={<Navigate to="/login" replace />} /></Routes><ThemeSwitcher value={theme} onChange={setTheme} /></>;
  }

  return (
    <>
      <Header user={user} title={isAdmin ? "Админка" : "Обучение"} onCourses={() => go(isAdmin ? "/admin" : "/courses")} onAdmin={() => go("/admin")} onLogout={() => { logout(); setUser(null); go("/login"); }} />
      <Routes>
        <Route path="/courses" element={<CoursesRoute userName={user.name} />} />
        <Route path="/courses/:courseId" element={<CoursesRoute userName={user.name} />} />
        <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonRoute userName={user.name} />} />
        <Route path="/admin" element={<AdminPage onMaterial={() => go("/courses")} />} />
        <Route path="*" element={<Navigate to="/courses" replace />} />
      </Routes>
      <ThemeSwitcher value={theme} onChange={setTheme} />
    </>
  );
}
