import Link from "next/link";
import { MapPin, Mail, Instagram, Facebook, Youtube } from "lucide-react";

const FOOTER_LINKS = {
  Shop: [
    { label: "Sacred Items", href: "/products?category=sacred" },
    { label: "Himalayan Foods", href: "/products?category=foods" },
    { label: "Wellness", href: "/products?category=wellness" },
    { label: "Wholesale", href: "/wholesale" },
  ],
  Company: [
    { label: "Our Story", href: "/about" },
    { label: "Traceability", href: "/traceability" },
    { label: "Certifications", href: "/certifications" },
    { label: "Blog", href: "/blog" },
  ],
  Support: [
    { label: "Contact Us", href: "/contact" },
    { label: "FAQs", href: "/faqs" },
    { label: "Shipping Info", href: "/shipping" },
    { label: "Returns", href: "/returns" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-forest text-snow/80 mt-auto">
      <div className="section py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex flex-col leading-none mb-4 w-fit">
              <span className="text-2xl font-bold text-snow">Devtatva</span>
              <span className="text-xs text-snow/50 tracking-widest uppercase mt-0.5">
                Himalayan Heritage
              </span>
            </Link>
            <p className="text-sm text-snow/60 leading-relaxed mb-5 max-w-xs">
              Authentic sacred items, organic foods, and heritage wellness
              products sourced directly from the artisans &amp; farmers of
              Uttarakhand.
            </p>
            <div className="flex items-start gap-2 text-sm text-snow/50 mb-3">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
              <span>Rishikesh, Uttarakhand, India</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-snow/50">
              <Mail className="w-4 h-4 shrink-0" />
              <a
                href="mailto:hello@devtatva.com"
                className="hover:text-snow transition-colors"
              >
                hello@devtatva.com
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-snow text-sm font-semibold mb-4">{heading}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-snow/60 hover:text-snow transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-snow/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-snow/40">
            © {new Date().getFullYear()} Devtatva Himalayan Heritage. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/privacy"
              className="text-xs text-snow/40 hover:text-snow/70 transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-snow/20">·</span>
            <Link
              href="/terms"
              className="text-xs text-snow/40 hover:text-snow/70 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
          {/* Social */}
          <div className="flex items-center gap-3">
            {[
              { Icon: Instagram, href: "#", label: "Instagram" },
              { Icon: Facebook, href: "#", label: "Facebook" },
              { Icon: Youtube, href: "#", label: "YouTube" },
            ].map(({ Icon, href, label }) => (
              <span
                key={label}
                className="text-snow/40 cursor-not-allowed"
                aria-label={label}
              >
                <Icon className="w-4 h-4" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
