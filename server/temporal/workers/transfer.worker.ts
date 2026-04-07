import { Worker } from '@temporalio/worker';
import path from 'path';
import { fileURLToPath } from 'url';
import * as activities from '../activities/tansfer.activites';
import '../../monitoring/metrics';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runWorker() {
  const worker = await Worker.create({
    workflowsPath: path.join(__dirname, '../workflows/transfer.workflow.ts'),
    activities,
    taskQueue: 'transfer-queue',
  });

  console.log('🏦 Transfer Worker started...');
  await worker.run();
}

runWorker().catch((err) => {
  console.error('Worker failed:', err);
  process.exit(1);
});
