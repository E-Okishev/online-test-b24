import type { CourseId } from "./model";

const progressKey = "bitrix-course-lesson-progress";
const submissionsKey = "bitrix-course-test-submissions";

type Progress = Record<string, string[]>;

export type LessonSubmission = {
  date: string;
  userName: string;
  courseId: CourseId;
  lessonId: string;
  answers: Array<{ question: string; answer: string[]; correct: boolean | null }>;
};

function readProgress(): Progress {
  try {
    return JSON.parse(localStorage.getItem(progressKey) ?? "{}") as Progress;
  } catch {
    return {};
  }
}

export function getCompletedLessons(userName: string) {
  return readProgress()[userName.toLocaleLowerCase("ru-RU")] ?? [];
}

export function completeLesson(userName: string, lessonKey: string) {
  const progress = readProgress();
  const userKey = userName.toLocaleLowerCase("ru-RU");
  progress[userKey] = [...new Set([...(progress[userKey] ?? []), lessonKey])];
  localStorage.setItem(progressKey, JSON.stringify(progress));
}

export function getSubmissions() {
  try {
    return JSON.parse(localStorage.getItem(submissionsKey) ?? "[]") as LessonSubmission[];
  } catch {
    return [];
  }
}

export function saveSubmission(submission: LessonSubmission) {
  localStorage.setItem(submissionsKey, JSON.stringify([submission, ...getSubmissions()]));
}
