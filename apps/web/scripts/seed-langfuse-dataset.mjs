import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { LangfuseClient } from '@langfuse/client';

const datasetPath = path.resolve(process.cwd(), 'server/observability/nornsight-dataset.json');
const raw = await readFile(datasetPath, 'utf-8');
const dataset = JSON.parse(raw);

const client = new LangfuseClient();

await client.api.datasets.create({
  name: dataset.datasetName,
  description: dataset.description
}).catch(() => null);

for (const item of dataset.cases) {
  await client.api.datasetItems.create({
    datasetName: dataset.datasetName,
    input: {
      theme: item.theme,
      question: item.question,
      runes: item.runes
    },
    expectedOutput: {
      expectedTone: item.expectedTone,
      notes: item.notes
    },
    metadata: {
      manualScoreKeys: dataset.manualScoreKeys,
      manualScores: item.manualScores
    }
  });
}

await client.flush();
console.log(`Langfuse dataset seeded: ${dataset.datasetName}`);
