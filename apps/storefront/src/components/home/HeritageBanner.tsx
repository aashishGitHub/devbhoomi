import { Mountain, Users, Award, Leaf } from "lucide-react";

const STATS = [
  { value: "200+", label: "Artisan families supported", icon: Users },
  { value: "50+", label: "Himalayan villages sourced", icon: Mountain },
  { value: "100%", label: "Naturally harvested", icon: Leaf },
  { value: "NPOP", label: "Organic certified", icon: Award },
];

export function HeritageBanner() {
  return (
    <section className="bg-forest text-snow py-16">
      <div className="section">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-snow mb-3">
            The Devtatva Commitment
          </h2>
          <p className="text-snow/60 max-w-xl mx-auto text-sm leading-relaxed">
            Every product we sell carries a story — from the hands that made it
            to the Himalayan valley it came from. We verify traceability,
            certify organics, and pay artisans fairly.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map(({ value, label, icon: Icon }) => (
            <div key={label} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-snow/10 border border-snow/15 mb-4 mx-auto">
                <Icon className="w-5 h-5 text-misty" aria-hidden="true" />
              </div>
              <div className="text-3xl font-bold text-snow mb-1">{value}</div>
              <div className="text-xs text-snow/50 font-medium">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
