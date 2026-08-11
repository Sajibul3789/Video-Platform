"use client";

import { useState } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarker,
  FaPaperPlane,
  FaComment,
} from "react-icons/fa";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSending(false);
    setSent(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="glass-modern p-8 md:p-10 rounded-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl">
            <FaComment className="text-white text-3xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Contact Us</h1>
            <p className="text-gray-400">
              Have questions or feedback? We'd love to hear from you.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center flex-shrink-0">
                <FaEnvelope className="text-gray-400 text-xl" />
              </div>
              <div>
                <h3 className="text-white font-medium">Email</h3>
                <p className="text-gray-400 text-sm">support@videohub.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center flex-shrink-0">
                <FaPhone className="text-gray-400 text-xl" />
              </div>
              <div>
                <h3 className="text-white font-medium">Phone</h3>
                <p className="text-gray-400 text-sm">+1 (555) 123-4567</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center flex-shrink-0">
                <FaMapMarker className="text-gray-400 text-xl" />
              </div>
              <div>
                <h3 className="text-white font-medium">Location</h3>
                <p className="text-gray-400 text-sm">
                  123 Creator St, Digital City, DC 12345
                </p>
              </div>
            </div>

            <div className="glass-modern p-4">
              <h3 className="text-white font-medium mb-2">Office Hours</h3>
              <p className="text-gray-400 text-sm">
                Monday - Friday: 9:00 AM - 6:00 PM
              </p>
              <p className="text-gray-400 text-sm">Saturday - Sunday: Closed</p>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 block mb-1">Name</label>
              <input
                type="text"
                className="input-modern"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-1">Email</label>
              <input
                type="email"
                className="input-modern"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-1">
                Subject
              </label>
              <input
                type="text"
                className="input-modern"
                placeholder="Subject"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-1">
                Message
              </label>
              <textarea
                className="input-modern min-h-[120px] resize-none"
                placeholder="Your message..."
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                required
              />
            </div>
            <button
              type="submit"
              disabled={sending || sent}
              className="w-full btn-primary py-3 disabled:opacity-50"
            >
              {sending ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
                  Sending...
                </span>
              ) : sent ? (
                "✓ Message Sent!"
              ) : (
                <>
                  <FaPaperPlane className="inline mr-2" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
