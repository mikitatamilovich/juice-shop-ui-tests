\echo '--- 1. WHERE: какие активные задачи сейчас в работе?'
SELECT id, title, priority FROM "Task"
WHERE status = 'IN_PROGRESS' AND "deletedAt" IS NULL;

\echo '--- 2. ORDER BY: у каких 5 задач ближайший срок?'
SELECT id, title, "dueDate" FROM "Task"
WHERE "deletedAt" IS NULL
ORDER BY "dueDate" ASC LIMIT 5;

\echo '--- 3. COUNT: сколько всего активных задач?'
SELECT COUNT(*) FROM "Task" WHERE "deletedAt" IS NULL;

\echo '--- 4. GROUP BY: сколько активных задач в каждом статусе?'
SELECT status, COUNT(*) FROM "Task"
WHERE "deletedAt" IS NULL
GROUP BY status ORDER BY COUNT(*) DESC;

\echo '--- 5. Какие задачи просрочены и не завершены?'
SELECT id, title, "dueDate", status FROM "Task"
WHERE "dueDate" < NOW() AND status <> 'COMPLETED' AND "deletedAt" IS NULL;

\echo '--- 6. Какие записи помечены удалёнными и когда?'
SELECT id, title, "deletedAt" FROM "Task"
WHERE "deletedAt" IS NOT NULL
ORDER BY "deletedAt" DESC;

\echo '--- 7. JOIN: сколько активных задач в каждом статусе, включая пустые?'
SELECT e.enumlabel AS status, COUNT(t.id) AS tasks
FROM pg_enum e
JOIN pg_type ty ON ty.oid = e.enumtypid AND ty.typname = 'TaskStatus'
LEFT JOIN "Task" t ON t.status::text = e.enumlabel AND t."deletedAt" IS NULL
GROUP BY e.enumlabel, e.enumsortorder
ORDER BY e.enumsortorder;
