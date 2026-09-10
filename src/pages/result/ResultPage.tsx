import { questions } from "../../entities/quiz/model";
import { Button } from "../../shared/ui/Button";

type Props = { score: number; onRetry: () => void; onAdmin: () => void };

export function ResultPage({ score, onRetry, onAdmin }: Props) {
  const percent = Math.round((score / questions.length) * 100);
  return (
    <main className="page quiz-page">
      <article className="quiz-card result-card">
        <h1>Результат</h1>
        <p>Вы набрали {score} из {questions.length} ({percent}%).</p>
        <div className="center result-actions">
          <Button onClick={onRetry}>Пройти еще раз</Button>
          <Button variant="ghost" onClick={onAdmin}>Админка</Button>
        </div>
      </article>
    </main>
  );
}
