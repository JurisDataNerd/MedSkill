 import { useEffect, useMemo, useRef, useState } from "react";
import { Bars3Icon, FlagIcon, XMarkIcon } from "@heroicons/react/24/outline";

// ===== Dummy Questions (single choice) =====
type Choice = { key: "a" | "b" | "c" | "d"; label: string };
type Question = { id: string; text: string; choices: Choice[]; correct?: Choice["key"] };

const DUMMY_QUESTIONS: Question[] = [
  {
    id: "q1",
    text: "Munculnya pembelajaran digital pada umumnya disebabkan terutama oleh perkembangan ....",
    choices: [
      { key: "a", label: "teknologi informasi dan komunikasi" },
      { key: "b", label: "ilmu pengetahuan" },
      { key: "c", label: "kebudayaan manusia" },
      { key: "d", label: "proses bisnis perguruan tinggi" },
    ],
    correct: "a",
  },
  {
    id: "q2",
    text: "Di bawah ini yang termasuk jenis evaluasi formatif adalah ....",
    choices: [
      { key: "a", label: "ujian akhir semester" },
      { key: "b", label: "kuis mingguan" },
      { key: "c", label: "ujian nasional" },
      { key: "d", label: "ujian kelulusan" },
    ],
    correct: "b",
  },
  {
    id: "q3",
    text: "Tujuan utama rubrik penilaian adalah ....",
    choices: [
      { key: "a", label: "menentukan bobot mata kuliah" },
      { key: "b", label: "membantu dosen melakukan penelitian" },
      { key: "c", label: "memberi kriteria jelas penilaian kinerja" },
      { key: "d", label: "meningkatkan absensi mahasiswa" },
    ],
    correct: "c",
  },
  {
    id: "q4",
    text: "Pendekatan PBL menekankan pada ....",
    choices: [
      { key: "a", label: "hafalan konsep" },
      { key: "b", label: "pemecahan masalah nyata" },
      { key: "c", label: "ceramah satu arah" },
      { key: "d", label: "evaluasi sumatif" },
    ],
    correct: "b",
  },
  {
    id: "q5",
    text: "Instrumen yang tepat untuk mengukur sikap adalah ....",
    choices: [
      { key: "a", label: "tes esai" },
      { key: "b", label: "angket skala Likert" },
      { key: "c", label: "tes pilihan ganda" },
      { key: "d", label: "tes benar-salah" },
    ],
    correct: "b",
  },
];

// ===== Helpers =====
const formatTime = (s: number) => {
  const m = Math.floor(s / 60);
  const ss = s % 60;
  const mm = String(m).padStart(2, "0");
  const sss = String(ss).padStart(2, "0");
  return `${mm}:${sss}`;
};

export default function TryoutExamPage() {
  // ----- CONFIG -----
  const durationSeconds = 60 * 30; // 30 menit (dummy)
  const questions = DUMMY_QUESTIONS;

  // ----- EXAM STATE -----
  const [started, setStarted] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Choice["key"] | null>>({});
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
  const [showNavMobile, setShowNavMobile] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  // init answers & flags
  useEffect(() => {
    const initA: Record<string, Choice["key"] | null> = {};
    const initF: Record<string, boolean> = {};
    questions.forEach((q) => {
      initA[q.id] = null;
      initF[q.id] = false;
    });
    setAnswers(initA);
    setFlags(initF);
  }, [questions]);

  // timer
  useEffect(() => {
    if (!started) return;
    if (secondsLeft <= 0) {
      handleSubmit(true);
      return;
    }
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [started, secondsLeft]);

  // warn before unload when started
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (started) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [started]);

  const current = useMemo(() => questions[currentIndex], [questions, currentIndex]);
  const answeredCount = useMemo(
    () => Object.values(answers).filter((v) => v !== null).length,
    [answers]
  );
  const flaggedCount = useMemo(
    () => Object.values(flags).filter(Boolean).length,
    [flags]
  );

  // ----- ACTIONS -----
  const selectAnswer = (qid: string, key: Choice["key"]) => {
    setAnswers((prev) => ({ ...prev, [qid]: key }));
  };

  const toggleFlag = (qid: string) => {
    setFlags((prev) => ({ ...prev, [qid]: !prev[qid] }));
  };

  const goTo = (idx: number) => {
    if (!started) return;
    setCurrentIndex(idx);
    setShowNavMobile(false);
  };

  const next = () => {
    if (!started) return;
    setCurrentIndex((i) => Math.min(i + 1, questions.length - 1));
  };

  const prev = () => {
    if (!started) return;
    setCurrentIndex((i) => Math.max(i - 1, 0));
  };

  const handleStart = () => {
    if (!agreed) return;
    setStarted(true);
  };

  const handleSubmit = (auto = false) => {
    // compute dummy score (pakai key correct)
    let score = 0;
    questions.forEach((q) => {
      if (answers[q.id] && q.correct && answers[q.id] === q.correct) score += 1;
    });
    const percent = (score / questions.length) * 100;

    // tutup konfirmasi kalau manual
    setShowConfirmSubmit(false);

    // di kehidupan nyata → kirim ke backend
    alert(
      auto
        ? `⏰ Waktu habis!\nSkor dummy kamu: ${percent.toFixed(2)}%`
        : `✅ Submit terkirim!\nSkor dummy kamu: ${percent.toFixed(2)}%`
    );
  };

  // ----- UI BADGES -----
  const statusClass = (qid: string) => {
    const isAnswered = answers[qid] !== null;
    const isFlagged = flags[qid];
    if (isFlagged) return "bg-red-100 text-red-700 ring-1 ring-red-300";
    if (isAnswered) return "bg-blue-600 text-white";
    return "bg-slate-200 text-slate-700";
  };

  // ----- Focus ring helper for radio -----
  const radioRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      {/* Header bar */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Try Out UKMPPD — Demo</h1>
          <p className="text-sm text-slate-600">
            Soal {currentIndex + 1} dari {questions.length}
          </p>
        </div>

        {/* Timer + mobile nav button */}
        <div className="flex items-center gap-2">
          <div
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-800 shadow-sm"
            aria-live="polite"
          >
            ⏳ {formatTime(secondsLeft)}
          </div>

          {/* Mobile drawer trigger */}
          <button
            onClick={() => setShowNavMobile(true)}
            className="md:hidden inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <Bars3Icon className="h-5 w-5" />
            Daftar Soal
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_280px]">
        {/* Question area */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          {/* Left side info (like Moodle) */}
          <div className="mb-4 flex items-center gap-3">
            <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-sm font-semibold text-blue-700">
              Question {currentIndex + 1}
            </span>
            {flags[current.id] && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1 text-sm font-semibold text-red-700">
                <FlagIcon className="h-4 w-4" /> Flagged
              </span>
            )}
          </div>

          {/* Question text */}
          <div className="mb-4 rounded-xl bg-slate-50 p-4 text-slate-800">
            {current.text}
          </div>

          {/* Choices */}
          <div className="space-y-2">
            {current.choices.map((c) => {
              const checked = answers[current.id] === c.key;
              return (
                <label
                  key={c.key}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 transition ${
                    checked
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <input
                    ref={radioRef}
                    type="radio"
                    name={current.id}
                    className="h-4 w-4"
                    checked={checked || false}
                    onChange={() => selectAnswer(current.id, c.key)}
                  />
                  <span className="font-medium text-slate-800">
                    {c.key}.</span>
                  <span className="text-slate-800">{c.label}</span>
                </label>
              );
            })}
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => toggleFlag(current.id)}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold shadow-sm transition ${
                flags[current.id]
                  ? "border-red-600 text-red-700 hover:bg-red-50"
                  : "border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <FlagIcon className="h-5 w-5" />
              {flags[current.id] ? "Unflag" : "Flag question"}
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={prev}
                disabled={currentIndex === 0}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Back
              </button>
              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={next}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  Next page
                </button>
              ) : (
                <button
                  onClick={() => setShowConfirmSubmit(true)}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  Finish attempt
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Right navigator (desktop) */}
        <aside className="hidden md:block">
          <div className="sticky top-20 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Quiz navigation</h3>
              <span className="text-xs text-slate-600">
                {answeredCount}/{questions.length} answered
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => goTo(idx)}
                  className={`rounded-lg px-2 py-2 text-center text-sm font-semibold ${statusClass(
                    q.id
                  )} transition hover:opacity-90`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowConfirmSubmit(true)}
              className="mt-4 w-full rounded-xl border border-blue-600 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              Finish attempt…
            </button>
          </div>
        </aside>
      </div>

      {/* Mobile drawer: navigator */}
      {showNavMobile && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowNavMobile(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[82%] max-w-sm bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="text-sm font-bold text-slate-900">Quiz navigation</h3>
              <button
                onClick={() => setShowNavMobile(false)}
                className="rounded-lg p-1 hover:bg-slate-100"
              >
                <XMarkIcon className="h-6 w-6 text-slate-700" />
              </button>
            </div>

            <div className="p-4">
              <div className="mb-3 text-xs text-slate-600">
                {answeredCount}/{questions.length} answered • {flaggedCount} flagged
              </div>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => goTo(idx)}
                    className={`rounded-lg px-2 py-2 text-center text-sm font-semibold ${statusClass(
                      q.id
                    )} transition hover:opacity-90`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  setShowNavMobile(false);
                  setShowConfirmSubmit(true);
                }}
                className="mt-4 w-full rounded-xl border border-blue-600 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
              >
                Finish attempt…
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pre-start overlay */}
      {!started && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-slate-900">Sebelum mulai Try Out</h2>
            <p className="mt-2 text-sm text-slate-600">
              Baca ketentuan singkat berikut. Waktu akan berjalan setelah kamu menekan tombol{" "}
              <span className="font-semibold">Mulai Ujian</span>.
            </p>

            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-700">
              <li>Durasi ujian: 30 menit (dummy).</li>
              <li>Dilarang refresh / menutup halaman ketika ujian berlangsung.</li>
              <li>Satu soal per halaman. Kamu bisa loncat via navigasi soal.</li>
              <li>Waktu habis = auto submit.</li>
            </ul>

            <label className="mt-5 flex items-center gap-2 text-sm text-slate-800">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="h-4 w-4"
              />
              Saya telah membaca dan menyetujui ketentuan di atas.
            </label>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => history.back()}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Kembali
              </button>
              <button
                disabled={!agreed}
                onClick={handleStart}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Mulai Ujian
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm submit modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900">Kumpulkan jawaban?</h3>
            <p className="mt-1 text-sm text-slate-600">
              Ringkasan percobaan:
            </p>
            <ul className="mt-3 space-y-1 text-sm text-slate-800">
              <li>Terjawab: <b>{answeredCount}</b></li>
              <li>Belum terjawab: <b>{questions.length - answeredCount}</b></li>
              <li>Ditandai: <b>{flaggedCount}</b></li>
              <li>Sisa waktu: <b>{formatTime(secondsLeft)}</b></li>
            </ul>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Kembali
              </button>
              <button
                onClick={() => handleSubmit(false)}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Kumpulkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
