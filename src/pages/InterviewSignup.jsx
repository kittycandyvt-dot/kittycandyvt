import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import SectionHeading from "@/components/SectionHeading";
import { CheckCircle2, CalendarCheck } from "lucide-react";
import StreamSchedule from "@/components/StreamSchedule";
import SlotPicker from "@/components/SlotPicker";

export default function InterviewSignup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    handle: "",
    platform: "",
    preferredDate: "",
    details: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);

  // Load currently booked slots when the page opens.
  const loadBookedSlots = async () => {
    try {
      const res = await base44.functions.invoke(
        "getBookedSlots",
        {}
      );

      const slots = Array.isArray(res.data?.bookedSlots)
        ? res.data.bookedSlots
        : [];

      setBookedSlots(slots);

      return slots;
    } catch (err) {
      console.error("Unable to load booked slots:", err);

      // Don't block the page if availability can't be loaded.
      setBookedSlots([]);

      return [];
    }
  };

  useEffect(() => {
    loadBookedSlots();
  }, []);

  const platforms = [
    "Twitch",
    "YouTube",
    "TikTok",
    "X/Twitter",
    "Instagram",
    "Other",
  ];

  const handleChange = (e) => {
    setForm((currentForm) => ({
      ...currentForm,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");

  if (!form.name.trim() || !form.email.trim()) {
    setError("Please fill in your name and email.");
    return;
  }

  if (!selectedSlot) {
    setError("Please select a time slot.");
    return;
  }

  setSubmitting(true);

  try {
    // Check availability immediately before booking.
    const availabilityResponse =
      await base44.functions.invoke("getBookedSlots", {});

    const latestBookedSlots =
      Array.isArray(availabilityResponse.data?.bookedSlots)
        ? availabilityResponse.data.bookedSlots
        : [];

    if (latestBookedSlots.includes(selectedSlot)) {
      setBookedSlots(latestBookedSlots);

      setSelectedSlot("");

      setForm((currentForm) => ({
        ...currentForm,
        preferredDate: "",
      }));

      setError(
        "Sorry, someone has already taken that slot. Please choose another time."
      );

      return;
    }

    // Create the booking.
    const bookingData = {
      ...form,
      preferredDate: selectedSlot.slice(0, 10),
      selectedSlot: selectedSlot,
      status: "pending",
    };

    await base44.entities.InterviewSignup.create(
      bookingData
    );

    // Add the slot to the local booked list immediately.
    setBookedSlots((currentSlots) => [
      ...currentSlots,
      selectedSlot,
    ]);

    // The booking itself succeeded.
    // Notification/calendar failures should NOT make
    // the user think the booking failed.
    try {
      await base44.functions.invoke(
        "sendInterviewNotification",
        bookingData
      );
    } catch (notificationError) {
      console.error(
        "Interview notification failed:",
        notificationError
      );
    }

    try {
      await base44.functions.invoke(
        "sendCalendarInvite",
        bookingData
      );
    } catch (calendarError) {
      console.error(
        "Calendar invite failed:",
        calendarError
      );
    }

    // Show successful booking.
    setSubmitted(true);

  } catch (err) {
    console.error(
      "Interview booking failed:",
      err
    );

    setError(
      "We couldn't complete your booking. Please try again."
    );
  } finally {
    setSubmitting(false);
  }
};
    setForm({
      name: "",
      email: "",
      handle: "",
      platform: "",
      preferredDate: "",
      details: "",
    });

    setSelectedSlot("");
    setError("");

    // Refresh availability.
    await loadBookedSlots();
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-20 text-center">
        <div className="glass rounded-3xl p-10">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-fuchsia-400 grid place-items-center text-white mb-4">
            <CheckCircle2 size={32} />
          </div>

          <h2 className="font-display text-3xl font-bold text-plum-900">
            You're on the list! 💕
          </h2>

          <p className="mt-3 text-plum-600">
            Thanks for signing up for an interview! I'll reach out to{" "}
            <span className="font-semibold text-pink-600">
              {form.email}
            </span>{" "}
            soon to confirm a time.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link
              to="/"
              className="px-6 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 shadow-lg hover:scale-105 transition-transform"
            >
              Back Home
            </Link>

            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 rounded-full font-semibold text-plum-900 bg-white border border-pink-200 hover:bg-pink-50 transition-colors"
            >
              Sign Up Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-12">
      <SectionHeading
        eyebrow="Interview Sign-Up"
        title="Let's chat on stream ✨"
        subtitle="Sign up for a VTuber interview and we'll get you scheduled for a fun conversation!"
      />

      <form
        onSubmit={handleSubmit}
        className="glass rounded-3xl p-6 md:p-8 space-y-5"
      >
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Name" required>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Your display name"
              className="w-full px-4 py-2.5 rounded-xl border border-pink-200 bg-white/70 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition"
            />
          </Field>

          <Field label="Email" required>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-pink-200 bg-white/70 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition"
            />
          </Field>

          <Field label="Social Handle">
            <input
              name="handle"
              value={form.handle}
              onChange={handleChange}
              placeholder="@username"
              className="w-full px-4 py-2.5 rounded-xl border border-pink-200 bg-white/70 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition"
            />
          </Field>

          <Field label="Platform">
            <select
              name="platform"
              value={form.platform}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-pink-200 bg-white/70 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition"
            >
              <option value="">Select a platform</option>

              {platforms.map((platform) => (
                <option
                  key={platform}
                  value={platform}
                >
                  {platform}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div>
          <label className="block text-sm font-semibold text-plum-700 mb-3">
            Choose a time slot
          </label>

          <SlotPicker
            selectedSlot={selectedSlot}
            bookedSlots={bookedSlots}
            onSelect={(iso) => {
              setSelectedSlot(iso);

              setForm((currentForm) => ({
                ...currentForm,
                preferredDate: iso.slice(0, 10),
              }));

              setError("");
            }}
          />
        </div>

        <Field label="Additional Details">
          <textarea
            name="details"
            value={form.details}
            onChange={handleChange}
            rows={4}
            placeholder="Anything else you'd like me to know?"
            className="w-full px-4 py-2.5 rounded-xl border border-pink-200 bg-white/70 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition resize-none"
          />
        </Field>

        {error && (
          <p className="text-sm text-red-500 font-medium">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 shadow-lg hover:scale-[1.02] transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Booking...
            </>
          ) : (
            <>
              <CalendarCheck size={18} />
              Book My Interview
            </>
          )}
        </button>
      </form>

      <div className="mt-16">
        <StreamSchedule />
      </div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-plum-700 mb-1.5">
        {label}
        {required && (
          <span className="text-pink-500"> *</span>
        )}
      </label>

      {children}
    </div>
  );
}