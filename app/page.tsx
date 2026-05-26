"use client";

import { useState } from "react";

export default function Home() {
  const [mobile, setMobile] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const calculatePoints = (amt: number) => {
    return Math.floor(amt / 100) * 50;
  };

  const handleSubmit = async () => {
    if (!mobile || !amount) return;

    const points = calculatePoints(Number(amount));

    const res = await fetch("/api/add-points", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mobile,
        amount: Number(amount),
        points,
      }),
    });

    const data = await res.json();

    setMessage(
      `${points} points added successfully. Total: ${data.totalPoints}`
    );

    setMobile("");
    setAmount("");
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6">
          Shop Rewards
        </h1>

        <div className="space-y-4">
          <input
            type="tel"
            placeholder="Customer Mobile Number"
            className="w-full p-4 border rounded-xl"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />

          <input
            type="number"
            placeholder="Purchase Amount"
            className="w-full p-4 border rounded-xl"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-black text-white p-4 rounded-xl font-semibold"
          >
            Add Points
          </button>
        </div>

        {message && (
          <div className="mt-6 bg-green-100 text-green-700 p-4 rounded-xl">
            {message}
          </div>
        )}
      </div>
    </main>
  );
}