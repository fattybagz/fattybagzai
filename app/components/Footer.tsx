import { Mail, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold tracking-wide text-white mb-4">
              Atlas<span className="text-[#d8ff00]"> Ward</span>
            </h3>
            <p className="text-xs font-normal text-white/60 leading-relaxed">
              Innovation through intelligence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase mb-4 text-white/80">
              Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-xs font-light text-white/40 hover:text-[#7fff00] transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/portfolio"
                  className="text-xs font-light text-white/40 hover:text-[#7fff00] transition-colors"
                >
                  Portfolio
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-xs font-light text-white/40 hover:text-[#7fff00] transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase mb-4 text-white/80">
              Connect
            </h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-white/40 hover:text-[#7fff00] transition-colors"
              >
                <Mail size={20} />
              </a>
              <a
                href="#"
                className="text-white/40 hover:text-[#7fff00] transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="#"
                className="text-white/40 hover:text-[#7fff00] transition-colors"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/40">
          <p className="text-xs font-normal">
            &copy; {new Date().getFullYear()} Atlas Ward
          </p>
        </div>
      </div>
    </footer>
  );
}
