"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

export default function Dashboard() {
  const router = useRouter();

  const [mobile, setMobile] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");

    if (!loggedIn) {
      router.push("/login");
    }

    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const snapshot = await getDocs(
      collection(db, "customers")
    );

    const data: any[] = [];

    snapshot.forEach((doc) => {
      data.push(doc.data());
    });

    setCustomers(data);
  };

  const calculatePoints = (amt: number) => {
    return Math.floor(amt / 100) * 50;
  };

  const handleSubmit = async () => {
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
      `${points} points added. Total: ${data.totalPoints}`
    );

    setMobile("");
    setAmount("");

    fetchCustomers();
  };

  const downloadExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(customers);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");

  XLSX.writeFile(workbook, "customers.xlsx");
};

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(fileData, "customers.xlsx");
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-5xl mx-auto">

        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h1 className="text-3xl font-bold mb-6">
            Rewards Dashboard
          </h1>

          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="tel"
              placeholder="Mobile Number"
              className="p-4 border rounded-xl"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />

            <input
              type="number"
              placeholder="Purchase Amount"
              className="p-4 border rounded-xl"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <button
              onClick={handleSubmit}
              className="bg-black text-white rounded-xl"
            >
              Add Points
            </button>
          </div>

          {message && (
            <div className="mt-4 bg-green-100 text-green-700 p-4 rounded-xl">
              {message}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">

          <div className="flex justify-between mb-4">
            <h2 className="text-2xl font-bold">
              Customers
            </h2>

            <button
              onClick={downloadExcel}
              className="bg-green-600 text-white px-4 py-2 rounded-xl"
            >
              Download Excel
            </button>
          </div>

          <div className="overflow-auto">
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 border">
                    Mobile Number
                  </th>

                  <th className="p-3 border">
                    Total Points
                  </th>
                </tr>
              </thead>

              <tbody>
                {customers.map((customer, index) => (
                  <tr key={index}>
                    <td className="p-3 border">
                      {customer.mobile}
                    </td>

                    <td className="p-3 border">
                      {customer.totalPoints}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </main>
  );
}