"use client";

import { useState, useEffect } from "react";

type Slot = string;

type Step = "form" | "slots" | "sms" | "success";

export default function FirstVisitPage() {
  const [step, setStep] = useState<Step>("form");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [smsCode, setSmsCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleShowSlots() {
    try {
      setLoading(true);
      setError(null);

      // reCAPTCHA token
      if (typeof window === "undefined" || !window.grecaptcha) {
        setError("Captcha nije spremna.");
        return;
      }

      const captchaToken = await window.grecaptcha.execute(
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
        { action: "submit" },
      );

      const res = await fetch(
        "/api/public/appointments/first-visit/available-slots",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            phone,
            captchaToken,
          }),
        },
      );

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Greška pri dohvaćanju termina.");
        return;
      }

      setSlots(data.slots || []);
      setStep("slots");
    } catch (e) {
      console.error(e);
      setError("Neočekivana greška.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectSlot(slot: Slot) {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        "/api/public/appointments/first-visit/request-code",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            phone,
            slot,
          }),
        },
      );

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Greška pri slanju SMS koda.");
        return;
      }

      setSelectedSlot(slot);
      setSessionId(data.sessionId);
      setStep("sms");
    } catch (e) {
      console.error(e);
      setError("Neočekivana greška.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyCode() {
    if (!sessionId) return;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        "/api/public/appointments/first-visit/verify-code",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            code: smsCode,
          }),
        },
      );

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Kod nije ispravan.");
        return;
      }

      setStep("success");
    } catch (e) {
      console.error(e);
      setError("Neočekivana greška.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-xl bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Prvi pregled</h1>

        {error && (
          <div className="mb-4 text-red-600 text-sm border border-red-200 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        {step === "form" && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Unesite svoje podatke. Nakon toga ponudit ćemo vam slobodne
              termine za prvi pregled.
            </p>

            <input
              type="text"
              placeholder="Ime"
              className="w-full border p-2 rounded"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Prezime"
              className="w-full border p-2 rounded"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full border p-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="tel"
              placeholder="Telefon"
              className="w-full border p-2 rounded"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <button
              onClick={handleShowSlots}
              disabled={loading}
              className="w-full bg-blue-600 text-white p-2 rounded font-semibold disabled:opacity-60"
            >
              {loading ? "Učitavanje..." : "Prikaži slobodne termine"}
            </button>
          </div>
        )}

        {step === "slots" && (
          <div className="space-y-4">
            <p className="text-gray-600 mb-2">
              Odaberite jedan od slobodnih termina:
            </p>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {slots.length === 0 && (
                <div className="text-gray-500 text-sm">
                  Trenutno nema slobodnih termina.
                </div>
              )}

              {slots.map((slot) => {
                const d = new Date(slot);
                return (
                  <button
                    key={slot}
                    onClick={() => handleSelectSlot(slot)}
                    disabled={loading}
                    className="w-full text-left border p-2 rounded hover:bg-blue-50 disabled:opacity-60"
                  >
                    {d.toLocaleDateString("hr-HR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}{" "}
                    u{" "}
                    {d.toLocaleTimeString("hr-HR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setStep("form")}
              className="text-sm text-gray-500 underline"
            >
              Natrag na unos podataka
            </button>
          </div>
        )}

        {step === "sms" && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Poslali smo vam SMS s kodom za potvrdu termina na broj{" "}
              <span className="font-semibold">{phone}</span>.
            </p>

            <input
              type="text"
              placeholder="Unesite kod"
              className="w-full border p-2 rounded"
              value={smsCode}
              onChange={(e) => setSmsCode(e.target.value)}
            />

            <button
              onClick={handleVerifyCode}
              disabled={loading}
              className="w-full bg-blue-600 text-white p-2 rounded font-semibold disabled:opacity-60"
            >
              {loading ? "Provjera..." : "Potvrdi termin"}
            </button>

            <button
              onClick={() => setStep("slots")}
              className="text-sm text-gray-500 underline"
            >
              Natrag na odabir termina
            </button>
          </div>
        )}

        {step === "success" && (
          <div className="space-y-4">
            <p className="text-green-700 font-semibold">
              Termin je uspješno rezerviran!
            </p>
            {selectedSlot && (
              <p className="text-gray-700">
                Datum:{" "}
                {new Date(selectedSlot).toLocaleString("hr-HR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
            <p className="text-gray-600 text-sm">
              Uskoro ćete dobiti potvrdu i dodatne informacije na email.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
