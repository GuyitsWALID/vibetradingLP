import { NextResponse } from 'next/server';

type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};

type QuizResponse = {
  dateKey: string;
  questions: QuizQuestion[];
};

const FALLBACK_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    prompt: 'The Fed signals higher-for-longer rates while inflation stays sticky. What is the most likely immediate impact on USD?',
    options: [
      'USD tends to strengthen as rate expectations rise',
      'USD always weakens because higher rates slow growth',
      'No reaction because FX ignores central bank guidance',
      'Gold and USD both always rally equally',
    ],
    answerIndex: 0,
    explanation: 'Higher policy-rate expectations usually support USD via yield differentials.',
  },
  {
    id: 'q2',
    prompt: 'NFP prints far above consensus while unemployment drops. Which first reaction is most consistent?',
    options: [
      'US yields can rise and USD may get bid',
      'USD must sell off because jobs data is lagging',
      'Treasury yields always fall on strong labor data',
      'FX is unaffected unless CPI is also released',
    ],
    answerIndex: 0,
    explanation: 'Stronger labor data can lift yield expectations and support USD in the near term.',
  },
];

function getTodayUtcDateKey() {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, '0');
  const d = String(now.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function stripCodeFence(raw: string) {
  return raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();
}

function normalizeQuestion(input: any, index: number): QuizQuestion | null {
  const prompt = String(input?.prompt || '').trim();
  const explanation = String(input?.explanation || '').trim();
  const options = Array.isArray(input?.options)
    ? input.options.map((item: unknown) => String(item || '').trim()).filter(Boolean)
    : [];
  const answerIndex = Number(input?.answerIndex);

  if (!prompt || options.length < 2) return null;
  if (!Number.isInteger(answerIndex) || answerIndex < 0 || answerIndex >= options.length) return null;

  return {
    id: String(input?.id || `q${index + 1}`),
    prompt,
    options,
    answerIndex,
    explanation: explanation || 'Review the fundamentals behind this setup before your next attempt.',
  };
}

async function generateQuizFromGroq(dateKey: string): Promise<QuizResponse | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  const prompt = [
    `Generate exactly 2 new forex fundamentals quiz questions for date ${dateKey}.`,
    'Audience: beginner to intermediate traders.',
    'Each question must be multiple choice with exactly 4 options.',
    'Mix literal macro questions and scenario-based trading questions.',
    'Return strict JSON only with this schema:',
    '{"questions":[{"id":"q1","prompt":"...","options":["a","b","c","d"],"answerIndex":0,"explanation":"..."},{"id":"q2","prompt":"...","options":["a","b","c","d"],"answerIndex":1,"explanation":"..."}]}',
    'Do not include markdown, comments, or extra keys.',
  ].join('\n');

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: 'You are a financial education assistant. Always return valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
    next: { revalidate: 3600 },
  });

  if (!res.ok) return null;

  const data = await res.json();
  const content = stripCodeFence(String(data?.choices?.[0]?.message?.content || ''));
  if (!content) return null;

  let parsed: any;
  try {
    parsed = JSON.parse(content);
  } catch {
    return null;
  }

  const questionsRaw = Array.isArray(parsed?.questions) ? parsed.questions : [];
  if (questionsRaw.length < 2) return null;

  const normalized = questionsRaw
    .slice(0, 2)
    .map((item: unknown, index: number) => normalizeQuestion(item, index))
    .filter((item: QuizQuestion | null): item is QuizQuestion => item !== null);

  if (normalized.length < 2) return null;

  return {
    dateKey,
    questions: normalized,
  };
}

export async function GET() {
  const dateKey = getTodayUtcDateKey();

  try {
    const generated = await generateQuizFromGroq(dateKey);
    if (generated) {
      return NextResponse.json(generated);
    }

    return NextResponse.json({
      dateKey,
      questions: FALLBACK_QUESTIONS,
    });
  } catch {
    return NextResponse.json({
      dateKey,
      questions: FALLBACK_QUESTIONS,
    });
  }
}
