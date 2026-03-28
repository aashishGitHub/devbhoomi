import { Truck, RefreshCcw, ShieldCheck, Headphones } from "lucide-react";

const SIGNALS = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Pan-India on orders above ₹999",
  },
  {
    icon: RefreshCcw,
    title: "Easy Returns",
    description: "Hassle-free 7-day return policy",
  },
  {
    icon: ShieldCheck,
    title: "100% Authentic",
    description: "Certified, traceable products",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description: "Mon–Sat, 9 AM – 6 PM IST",
  },
];

export function TrustSignals() {
  return (
    <section className="section py-12">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {SIGNALS.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-2xl bg-snow border border-muted/20"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-forest/8 flex items-center justify-center">
              <Icon className="w-5 h-5 text-forest" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-forest">{title}</p>
              <p className="text-xs text-forest/50 mt-0.5">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
