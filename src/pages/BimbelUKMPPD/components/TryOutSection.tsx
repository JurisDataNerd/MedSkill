import { useMemo, useState } from "react";

type LeaderRow = {
  name: string;
  score: number; // 0..100
};

type TryoutItem = {
  id: string;
  title: string;
  questions: number;
  start?: string; // only for upcoming/live
  status?: "finished" | "live" | "upcoming";
  buttons?: Array<"register" | "start" | "cek" | "kelas">;
};

const BATCHES = ["BATCH I 2025", "BATCH II 2025", "BATCH III 2025", "BATCH IV 2025"];

const leaderboardDummy: LeaderRow[] = [
  { name: "Alien", score: 84 },
  { name: "Putri Aisyah", score: 84 },
  { name: "Mia Nilamsari", score: 81 },
  { name: "Karina Rahma", score: 80 },
  { name: "smooth operator", score: 78.89 },
  { name: "R. Raraswangi", score: 78.67 },
  { name: "I Made Dwi Yudi…", score: 78.67 },
];

const upcomingDummy: TryoutItem[] = [
  {
    id: "to-ukmppd-1",
    title: "Try Out UKMPPD I",
    questions: 150,
    start: "17 Oktober 18:00 WIB",
    status: "upcoming",
    buttons: ["register"],
  },
];

const finishedDummy: TryoutItem[] = [
  {
    id: "pemanasan-cbt",
    title: "Try Out Pemanasan CBT UKOMNAS",
    questions: 150,
    status: "finished",
    buttons: ["cek"],
  },
  {
    id: "aipki-1",
    title: "Try Out AIPKI I",
    questions: 150,
    status: "finished",
    buttons: ["cek"],
  },
  {
    id: "prediksi-aipki",
    title: "Try Out PREDIKSI AIPKI",
    questions: 150,
    status: "finished",
    buttons: ["kelas", "cek"],
  },
];

function Medal({ rank }: { rank: number }) {
  if (rank === 1) return <span className="inline-block">🥇</span>;
  if (rank === 2) return <span className="inline-block">🥈</span>;
  if (rank === 3) return <span className="inline-block">🥉</span>;
  return <span className="inline-block w-5" />;
}

export default function TryOutSection() {
  const [batch, setBatch] = useState(BATCHES[3]); // default BATCH IV 2025
  const leaderboard = useMemo(() => leaderboardDummy, [batch]); // nanti tinggal ganti fetch per-batch
  const upcoming = useMemo(() => upcomingDummy, [batch]);
  const finished = useMemo(() => finishedDummy, [batch]);

  return (
    <div className="space-y-10">
      {/* Header + Controls */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Try Out UKMPPD</h2>

        <div className="flex flex-wrap items-center gap-3">
          {/* Batch Select */}
          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <label className="mr-2 text-sm text-slate-500">Pilihan Try Out</label>
            <select
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 outline-none hover:bg-slate-50"
            >
              {BATCHES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* WA Groups */}
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-white/80"
          >
            🟢 Gabung Group 1
          </a>
          <a
            href="https://wa.me/6289876543210"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-white/80"
          >
            🟢 Gabung Group 2
          </a>
        </div>
      </div>

      {/* Leaderboard */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Leaderboard Try Out</h3>
          <button className="text-sm font-medium text-blue-700 hover:underline">
            Lihat semua
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50/60">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Rank</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Nama</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-600">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leaderboard.map((row, idx) => (
                <tr key={row.name} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3 text-sm text-slate-800">
                    <div className="flex items-center gap-2">
                      <Medal rank={idx + 1} />
                      <span className="tabular-nums">{idx + 1}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">{row.name}</td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                    {row.score.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Upcoming / Live */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Try Out Mendatang</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {upcoming.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-col gap-2">
                <h4 className="text-base font-semibold text-slate-900">{t.title}</h4>
                <p className="text-sm text-slate-600">Jumlah Soal: {t.questions} Butir</p>
                {t.start && (
                  <p className="text-sm font-medium text-blue-700">mulai {t.start}</p>
                )}
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                {t.buttons?.includes("register") && (
                  <button
                    onClick={() => alert("Register (dummy). Nanti arahkan ke Payment/GForm.")}
                    className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Register
                  </button>
                )}
                {t.buttons?.includes("start") && (
                  <button
                    onClick={() => alert("Mulai Ujian (dummy)")}
                    className="rounded-xl border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                  >
                    Mulai Ujian
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Finished */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Selesai / Sudah Berakhir</h3>

        <div className="grid gap-4 md:grid-cols-2">
          {finished.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl bg-[#1E3A8A] p-5 text-white shadow-sm ring-1 ring-inset ring-white/10 transition hover:shadow-md"
            >
              <h4 className="text-base font-semibold">{t.title}</h4>
              <p className="mt-1 text-sm text-blue-100/90">Jumlah Soal: {t.questions} Butir</p>
              <p className="mt-2 text-sm italic text-blue-100/90">
                masa pengerjaan sudah lewat
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
                {t.buttons?.includes("kelas") && (
                  <button
                    onClick={() => alert("Kelas pembahasan (dummy)")}
                    className="rounded-xl bg-white/95 px-4 py-2 text-sm font-semibold text-[#1E3A8A] shadow-sm transition hover:bg-white"
                  >
                    Kelas
                  </button>
                )}
                {t.buttons?.includes("cek") && (
                  <button
                    onClick={() => alert("Cek hasil (dummy)")}
                    className="rounded-xl bg-white/95 px-4 py-2 text-sm font-semibold text-[#1E3A8A] shadow-sm transition hover:bg-white"
                  >
                    Cek
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
