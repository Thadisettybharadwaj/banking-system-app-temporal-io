import { buildError } from '../utils/helpers';
// import 'dotenv/config';

// const DYNATRACE_METRIC_URL = process.env.DYNATRACE_URL!;
// const DYNATRACE_API_TOKEN = process.env.DYNATRACE_API_TOKEN!;

export async function sendMetric(metricLine: string) {
  console.warn('first....');
  try {
    const res = await fetch('https://cer89933.live.dynatrace.com/api/v2/metrics/ingest', {
      method: 'POST',
      headers: {
        'Authorization': `Api-Token <TOKEN>`,
        'Content-Type': 'text/plain',
      },
      body: metricLine,
    });
    console.error('Status is...', res.status);

    // if (!res.ok) {
    //   throw new Error('Failed to Ingest Metric...');
    // }

    const aa = await res.json();

    console.log(aa);

    console.log('✅ Metric sent to Dynatrace:', metricLine);
  } catch (err: unknown) {
    const error = buildError(err)?.message;
    console.error('❌ Failed to send metric:', error);
  }
}
