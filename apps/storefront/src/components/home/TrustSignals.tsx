"use client";

import { Truck, RefreshCcw, ShieldCheck, Headphones } from "lucide-react";
import { motion } from "framer-motion";

const SIGNALS = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Pan-India on orders above ₹999",
    color: "from-blue-500/20 to-blue-500/5",
    iconColor: "text-blue-400",
  },
  {
    icon: RefreshCcw,
    title: "Easy Returns",
    description: "Hassle-free 7-day return policy",
    color: "from-emerald-500/20 to-emerald-500/5",
    iconColor: "text-emerald-400",
  },
  {
    icon: ShieldCheck,
    title: "100% Authentic",
    description: "Certified, traceable products",
    color: "from-rust/20 to-rust/5",
    iconColor: "text-rust",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description: "Mon–Sat, 9 AM – 6 PM IST",
    color: "from-misty/20 to-misty/5",
    iconColor: "text-misty",
  },
];

export function TrustSignals() {
  return (
    <section className="bg-[#091519] py-14">
      <div className="section">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {SIGNALS.map(({ icon: Icon, title, description, color, iconColor }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-2xl bg-gradient-to-br ${color} border border-white/10 hover:border-white/20 transition-colors duration-300`}
            >
              <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center">
                <Icon className={`w-5 h-5 ${iconColor}`} aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-snow">{title}</p>
                <p className="text-xs text-snow/40 mt-0.5">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
