type BookingSession = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  slot: string;
  createdAt: number;
  code: string;
};

const sessions = new Map<string, BookingSession>(); // demo

export async function verifyCaptcha(token: string): Promise<boolean> {
  if (!token) return false;

  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
  });

  const data = await res.json();
  return data.success && data.score > 0.5;
}

export async function sendSMSCode(phone: string, code: string): Promise<void> {
  //kasnije spojit neku uslugu
  console.log(`SMS to ${phone}: code = ˘${code}`);
}

export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function createSession(input: Omit<BookingSession, "id" | "createdAt">) {
  const id = crypto.randomUUID();
  const session: BookingSession = {
    id,
    createdAt: Date.now(),
    ...input,
  };
  sessions.set(id, session);
  return session;
}

export function getSession(id: string): BookingSession | undefined {
  return sessions.get(id);
}

export function deleteSession(id: string) {
  sessions.delete(id);
}

//demo
export async function getAvailableSlotsForFirstVisit(): Promise<string[]> {
  const now = new Date();
  now.setHours(9, 0, 0, 0);

  const slots: string[] = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + 1);
    // 9:00, 9:30, 10:00
    for (const minutes of [0, 30, 60]) {
      const s = new Date(d);
      s.setMinutes(s.getMinutes() + minutes);
      slots.push(s.toISOString());
    }
  }

  return slots;
}
