import Avatar from "boring-avatars";
import { courses } from "../../entities/course/model";
import { getCompletedLessons } from "../../entities/course/progress";
import { getUsers } from "../../entities/user/storage";
import { Button } from "../../shared/ui/Button";

type Props = { onMaterial: () => void; onUser: (name: string) => void };

export function AdminPage({ onMaterial, onUser }: Props) {
  const users = getUsers();
  const lessonCount = courses.flatMap((course) => course.lessons).length;

  return (
    <main className="page admin-page">
      <div className="admin-panel">
        {users.length === 0 ? <p className="muted">Пользователей пока нет.</p> : (
          <table className="users-table">
            <thead><tr><th>Пользователь</th><th>Завершение курса</th></tr></thead>
            <tbody>{users.map((user) => {
              const percent = Math.round((getCompletedLessons(user.name).length / lessonCount) * 100);
              return (
                <tr role="button" tabIndex={0} onClick={() => onUser(user.name)} onKeyDown={(event) => (event.key === "Enter" || event.key === " ") && onUser(user.name)} key={user.name}>
                  <td><div className="admin-user"><Avatar name={user.name} size={40} variant="beam" colors={["#ffad08", "#edd75a", "#73b06f", "#0c8f8f", "#405059"]} /><span>{user.name}</span></div></td>
                  <td><div className="admin-progress"><div><span style={{ width: `${percent}%` }} /></div><strong>{percent}%</strong></div></td>
                </tr>
              );
            })}</tbody>
          </table>
        )}
      </div>
      <div className="admin-footer"><Button variant="ghost" onClick={onMaterial}>Материал</Button></div>
    </main>
  );
}
