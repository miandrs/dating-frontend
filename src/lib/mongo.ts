/**
 * Frontend client for the NestJS date-plans API.
 * The NestJS server (in /server) handles all MongoDB Atlas Data API communication.
 * Only the server URL is configurable here.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001';

export function isApiConfigured(): boolean {
  return Boolean(API_BASE_URL);
}

export interface DatePlanRecord {
  activity: string;
  date: string;
  time: string;
  location: string;
  message: string;
  createdAt: string;
}

interface CreatePlanDto {
  activity: string;
  date: string;
  time: string;
  location: string;
  message: string;
}

interface FindAllResponse {
  configured: boolean;
  plans: DatePlanRecord[];
}

interface CreateResponse {
  configured: boolean;
  result?: { insertedId?: string };
}

export async function saveDatePlan(plan: CreatePlanDto): Promise<CreateResponse> {
  const res = await fetch(`${API_BASE_URL}/date-plans`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(plan),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error: ${res.status} ${text}`);
  }

  return res.json() as Promise<CreateResponse>;
}

export async function getDatePlans(): Promise<DatePlanRecord[]> {
  const res = await fetch(`${API_BASE_URL}/date-plans`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error: ${res.status} ${text}`);
  }

  const data = (await res.json()) as FindAllResponse;
  return data.plans ?? [];
}

export async function checkApiConfigured(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/date-plans`);
    if (!res.ok) return false;
    const data = (await res.json()) as FindAllResponse;
    return data.configured;
  } catch {
    return false;
  }
}
