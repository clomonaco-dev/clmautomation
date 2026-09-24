"use client";
import { useState, type FormEvent } from "react";
import { dictionary } from "@/lib/content";
import { type Locale, email, href } from "@/lib/routes";

export function ContactForm({ locale }: { locale: Locale }) {
  const t = dictionary(locale);
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error" | "local"
  >("idle");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    if (["localhost", "127.0.0.1"].includes(window.location.hostname)) {
      setStatus("local");
      return;
    }
    const form = event.currentTarget;
    setStatus("sending");
    const body = new URLSearchParams();
    new FormData(form).forEach((value, key) => body.append(key, String(value)));
    try {
      const response = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) throw new Error("submission");
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }
  return (
    <form
      className="contact-form"
      name="contatti"
      method="POST"
      action="/__forms.html"
      onSubmit={submit}
    >
      <input type="hidden" name="form-name" value="contatti" />
      <input type="hidden" name="language" value={locale} />
      <div hidden>
        <label>
          Leave empty
          <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="form-row">
        <label>
          {t.contactForm[0]} <span>*</span>
          <input name="name" autoComplete="name" required maxLength={120} />
        </label>
        <label>
          {t.contactForm[1]} <span>*</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
          />
        </label>
      </div>
      <label>
        {t.contactForm[2]} <small>({t.optional})</small>
        <input name="activity" autoComplete="organization" maxLength={180} />
      </label>
      <label>
        {t.contactForm[3]}
        <select name="service">
          {t.formOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </label>
      <label>
        {t.contactForm[4]} <span>*</span>
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={5}
          placeholder={t.formPlaceholder}
        />
      </label>
      <p className="form-note">
        * {t.required}. {t.formNote}{" "}
        <a href={href(locale, "privacy")}>{t.privacy}</a>
      </p>
      <button className="button" type="submit" disabled={status === "sending"}>
        {status === "sending" ? t.sending : t.contactForm[5]}
        <span aria-hidden="true">↗</span>
      </button>
      <div role="status" aria-live="polite">
        {status === "success" && <p className="notice success">{t.success}</p>}
        {(status === "error" || status === "local") && (
          <p className="notice">
            {status === "local" ? t.localForm : t.error}{" "}
            <a href={`mailto:${email}`}>{email}</a>
          </p>
        )}
      </div>
    </form>
  );
}
