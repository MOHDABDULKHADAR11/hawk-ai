import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";

import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: any) {
  try {
    const { userId } = auth();
    const body = await req.json();
    console.log(body);
    const { messages } = body;

    if (!userId) {
      return new NextResponse("unauthorized", { status: 401 });
    }

    if (!messages) {
      new NextResponse("Messages are required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();

    if (!freeTrial) {
      return new NextResponse(
        "Free trial has expired. Please upgrade to pro.",
        { status: 403 }
      );
    }

    const response: any = await openai.chat.completions.create({
      messages: messages,
      model: "gpt-3.5-turbo",
    });

    await incrementApiLimit();

    return new NextResponse(JSON.stringify(response.choices[0].message), {
      status: 200,
    });
  } catch (error) {
    console.log("ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
