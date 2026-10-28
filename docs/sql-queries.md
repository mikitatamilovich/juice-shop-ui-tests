# SQL-запросы к стенду (пункт 2.1)

Таблица `"Task"` (имя в кавычках, так её создаёт Prisma). Мягкое удаление отражает поле `"deletedAt"`:
`NULL` у активной задачи, время удаления у удалённой. Связанных таблиц в схеме нет.

Подключение: `docker exec -it taskmanager_test_db psql -U taskmanager_postgres -d taskmanager_db`

| №   | Тип          | Вопрос о данных                                          |
| --- | ------------ | -------------------------------------------------------- |
| 1   | WHERE        | Какие активные задачи сейчас в работе?                   |
| 2   | ORDER BY     | У каких 5 задач ближайший срок?                          |
| 3   | COUNT        | Сколько всего активных задач?                            |
| 4   | GROUP BY     | Сколько активных задач в каждом статусе?                 |
| 5   | WHERE + даты | Какие задачи просрочены и не завершены?                  |
| 6   | WHERE        | Какие записи помечены удалёнными и когда?                |
| 7   | JOIN         | Сколько активных задач в каждом статусе, включая пустые? |

```sql
-- 1
SELECT id, title, priority FROM "Task"
WHERE status = 'IN_PROGRESS' AND "deletedAt" IS NULL;

-- 2
SELECT id, title, "dueDate" FROM "Task"
WHERE "deletedAt" IS NULL
ORDER BY "dueDate" ASC LIMIT 5;

-- 3
SELECT COUNT(*) FROM "Task" WHERE "deletedAt" IS NULL;

-- 4
SELECT status, COUNT(*) FROM "Task"
WHERE "deletedAt" IS NULL
GROUP BY status ORDER BY COUNT(*) DESC;

-- 5
SELECT id, title, "dueDate", status FROM "Task"
WHERE "dueDate" < NOW() AND status <> 'COMPLETED' AND "deletedAt" IS NULL;

-- 6
SELECT id, title, "deletedAt" FROM "Task"
WHERE "deletedAt" IS NOT NULL
ORDER BY "deletedAt" DESC;

-- 7: JOIN с системным каталогом, потому что связанных таблиц нет
SELECT e.enumlabel AS status, COUNT(t.id) AS tasks
FROM pg_enum e
JOIN pg_type ty ON ty.oid = e.enumtypid AND ty.typname = 'TaskStatus'
LEFT JOIN "Task" t ON t.status::text = e.enumlabel AND t."deletedAt" IS NULL
GROUP BY e.enumlabel, e.enumsortorder
ORDER BY e.enumsortorder;
```

Результаты запросов (вывод psql) вставьте под каждым запросом.
