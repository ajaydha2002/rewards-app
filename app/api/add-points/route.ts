import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
} from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { mobile, amount, points } = body;

    const customerRef = doc(db, "customers", mobile);

    const customerSnap = await getDoc(customerRef);

    let totalPoints = points;

    if (customerSnap.exists()) {
      totalPoints =
        customerSnap.data().totalPoints + points;

      await updateDoc(customerRef, {
        totalPoints,
      });
    } else {
      await setDoc(customerRef, {
        mobile,
        totalPoints,
      });
    }

    await addDoc(collection(db, "transactions"), {
      mobile,
      amount,
      points,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      totalPoints,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,
    });
  }
}