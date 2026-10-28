const fs = require('node:fs');
const path = require('node:path');
const { test, expect } = require('../../src/fixtures/stand');
const { runInBatches, runSequential, summarize, toMarkdownTable } = require('../../src/utils/perf');

const REQUESTS_PER_SERIES = 20;
const BATCH_SIZE = 5;
const WARMUP_REQUESTS = 3;
const ROUNDS = 3;

// Basic experiment, not a load test. Run it separately: npm run test:perf
test.describe('GET performance', () => {
  test('sequential and parallel GET requests', async ({ api, createTask }, testInfo) => {
    const task = await createTask();
    const endpoints = [
      { name: 'GET /api/tasks', send: () => api.list() },
      { name: 'GET /api/tasks/{id}', send: () => api.getById(task.id) },
    ];
    const modes = [
      { name: 'последовательно', run: (send) => runSequential(send, REQUESTS_PER_SERIES) },
      {
        name: `параллельно (пачки по ${BATCH_SIZE})`,
        run: (send) => runInBatches(send, REQUESTS_PER_SERIES, BATCH_SIZE),
      },
    ];

    // series[endpoint][mode] collects the measured series of all rounds.
    const collected = new Map();
    for (let round = 1; round <= ROUNDS; round += 1) {
      for (const endpoint of endpoints) {
        for (const mode of modes) {
          // Warm-up requests are sent first and are not included in the results.
          await runSequential(endpoint.send, WARMUP_REQUESTS);
          const series = await mode.run(endpoint.send);
          expect(series.results).toHaveLength(REQUESTS_PER_SERIES);

          const key = `${endpoint.name} — ${mode.name}`;
          collected.set(key, [...(collected.get(key) ?? []), series]);
        }
      }
    }

    const rows = [...collected].map(([scenario, series]) => summarize(scenario, series));
    const report = [
      `# Результаты performance-эксперимента (${new Date().toISOString()})`,
      '',
      `Серий на сценарий: ${ROUNDS}; запросов в серии: ${REQUESTS_PER_SERIES}; ` +
        `прогрев перед каждой серией: ${WARMUP_REQUESTS} запроса (в расчёт не входят).`,
      'Общее время — среднее по сериям; среднее, медиана и p95 — по всем запросам всех серий.',
      '',
      toMarkdownTable(rows),
      '',
    ].join('\n');

    const dir = path.join(process.cwd(), 'perf-results');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'latest.md'), report);
    await testInfo.attach('perf-results.md', { body: report, contentType: 'text/markdown' });
    console.log(`\n${report}`);
  });
});
