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
    const { prompt, amount = 1, resolution = "512x512" } = body;
    console.log(resolution);
    if (!userId) {
      return new NextResponse("unauthorized", { status: 401 });
    }

    if (!prompt) {
      new NextResponse("Prompt is required", { status: 400 });
    }
    if (!amount) {
      new NextResponse("Amount is required", { status: 400 });
    }
    if (!resolution) {
      new NextResponse("Resolution is required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();

    if (!freeTrial) {
      return new NextResponse(
        "Free trial has expired. Please upgrade to pro.",
        { status: 403 }
      );
    }

    const response: any = await openai.images.generate({
      prompt: prompt,
      n: parseInt(amount, 10),
      size: resolution,
    });

    await incrementApiLimit();
    console.log(response);
    return NextResponse.json(response.data);
  } catch (error) {
    console.log("IMAGE ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
