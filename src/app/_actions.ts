"use server";

import { env } from "@/env.mjs";
import { auth } from "@/lib/auth";
import { queryBuilder } from "@/lib/planetscale";
import { contact } from "@/lib/validations";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { type Session } from "next-auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { Resend } from "resend";
import {
  CreateEmailOptions,
  CreateEmailResponse,
} from "resend/build/src/emails/interfaces";
import { z } from "zod";

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(2, "1 d"),
});

async function sendMail(options: CreateEmailOptions) {
  const data = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options),
  });

  const response = await data.json();
  return response as CreateEmailResponse;
}

async function getSession(): Promise<Session> {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  return session;
}

export async function saveGuestbookEntry(entry: string) {
  const session = await getSession();
  const email = session.user?.email as string;
  const created_by = session.user?.name as string;
  const body = entry.slice(0, 500);

  await queryBuilder
    .insertInto("guestbook")
    .values({ email, body, created_by })
    .execute();

  revalidatePath("/guestbook");

  if (process.env.NODE_ENV === "production") {
    const response = await sendMail({
      from: "guestbook@rohi.dev",
      to: "n@rohi.dev",
      subject: "New Guestbook Entry",
      html: `<p>Email: ${email}</p><p>Message: ${body}</p>`,
    });

    console.log("Email sent", response);
    return response;
  }
}

export async function contactMail({
  message,
  messageBy,
  emailAddress,
}: z.infer<typeof contact>) {
  const ip = headers().get("x-forwarded-for");
  const { success } = await ratelimit.limit(ip ?? "anonymous");
  if (!success) {
    return "You have reached your request limit for the day.";
  }
  const response = await sendMail({
    from: `${messageBy} <contact@rohi.dev>`,
    to: "n@rohi.dev",
    subject: `Someone has contacted you!`,
    html: `<p>Email: ${emailAddress}</p><p>Message: ${message}</p>`,
  });
  return response;
}