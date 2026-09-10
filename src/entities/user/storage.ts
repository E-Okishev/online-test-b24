import type { User } from "./model";

const usersKey = "bitrix-course-users";
const sessionKey = "bitrix-course-current-user";

function normalizeName(name: string) {
  return name.trim().replace(/\s+/g, " ");
}

export function login(name: string): User {
  const cleanName = normalizeName(name);
  const users = getUsers();
  const user = users.find((item) => item.name.toLocaleLowerCase("ru-RU") === cleanName.toLocaleLowerCase("ru-RU")) ?? { name: cleanName };
  if (!users.includes(user)) localStorage.setItem(usersKey, JSON.stringify([...users, user]));
  localStorage.setItem(sessionKey, JSON.stringify(user));
  return user;
}

export function getCurrentUser(): User | null {
  try {
    return JSON.parse(localStorage.getItem(sessionKey) ?? "null") as User | null;
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem(sessionKey);
}

export function getUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem(usersKey) ?? "[]") as User[];
  } catch {
    return [];
  }
}
