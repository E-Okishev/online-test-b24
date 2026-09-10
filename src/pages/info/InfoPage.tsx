import { Button } from "../../shared/ui/Button";

export function InfoPage({ onStart }: { onStart: () => void }) {
  return (
    <main className="page article-page">
      <h1>Задачи Битрикс24</h1>
      <p>Задачи в Битрикс24 помогают организовать работу команды: ставить поручения, контролировать сроки, обсуждать детали и связывать работу с CRM, проектами и другими инструментами.</p>
      <img src="https://helpdesk.bitrix24.ru/upload/medialibrary/c56/6dn1xqmo6n5znozb6g93u6qa7ka3kyf9/1.jpg" alt="Раздел задач в Битрикс24" />
      <h2>Что можно делать в задачах</h2>
      <p>В задаче можно указать ответственного, крайний срок, описание, наблюдателей и соисполнителей. Для сложной работы удобно добавлять чек-листы: они разбивают одну задачу на понятные шаги.</p>
      <img src="https://helpdesk.bitrix24.ru/upload/medialibrary/2b9/hy1didjfkzzmh942khnzrux156ijn08g/2.jpg" alt="Настройки задачи" />
      <h2>Как находить нужное</h2>
      <p>Теги помогают группировать задачи по теме. Фильтры позволяют быстро найти задачи по ответственному, сроку, статусу или проекту. Просмотр можно переключать: список, канбан, планировщик или диаграмма Ганта.</p>
      <img src="https://helpdesk.bitrix24.ru/upload/medialibrary/1ca/r3bxarewop0vr2y9ht9llii4nr3m0iuu/4.jpg" alt="Фильтры и режимы просмотра" />
      <h2>Автоматизация</h2>
      <p>Роботы и триггеры помогают автоматизировать повторяющиеся действия: отправить уведомление, изменить статус, создать следующую задачу или запустить действие при наступлении события.</p>
      <div className="video">
        <iframe src="https://rutube.ru/play/embed/0c0736a6a0b4e1bb05a033c003817346" title="Видео о задачах Битрикс24" allow="clipboard-write; autoplay" allowFullScreen />
      </div>
      <div className="center"><Button onClick={onStart}>К тесту</Button></div>
    </main>
  );
}
