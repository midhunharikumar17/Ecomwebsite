import { useState, useRef, useEffect } from "react";
import "./Footer.css";

const popups = {
  newsletter: {
    title: "Join Our Newsletter",
    content: "newsletter",
  },
  about: {
    title: "About",
    links: ["Our Story", "Blog", "Careers", "Press"],
  },
  service: {
    title: "Customer Service",
    links: ["Contact Us", "Shipping Policy", "Returns & Refunds", "FAQ"],
  },
};

const Footer = () => {
  const [active, setActive] = useState(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const popupRef = useRef(null);
  const btnRefs = useRef({});

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        popupRef.current && !popupRef.current.contains(e.target) &&
        !Object.values(btnRefs.current).some((r) => r?.contains(e.target))
      ) {
        setActive(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (key) => setActive(active === key ? null : key);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => { setSubscribed(false); setEmail(""); setActive(null); }, 2500);
  };

  // Popup position relative to button
  const getPopupStyle = (key) => {
    const btn = btnRefs.current[key];
    if (!btn) return {};
    const rect = btn.getBoundingClientRect();
    const footerEl = btn.closest(".footer");
    const footerRect = footerEl?.getBoundingClientRect() || { left: 0, top: 0 };
    return {
      left: rect.left - footerRect.left,
      bottom: footerEl ? footerEl.getBoundingClientRect().bottom - rect.top + 12 : 60,
    };
  };

  return (
    <footer className="footer">
      <div className="footer__inner">

        {/* ── Brand ── */}
        <div className="footer__brand">
          <span className="footer__logo">ShopApp</span>
          <p className="footer__tagline">Curated products, delivered with care.</p>
        </div>

        {/* ── Nav buttons ── */}
        <nav className="footer__nav">
          {[
            { key: "newsletter", label: "Newsletter" },
            { key: "about",      label: "About" },
            { key: "service",    label: "Customer Service" },
          ].map(({ key, label }) => (
            <button
              key={key}
              ref={(el) => (btnRefs.current[key] = el)}
              className={`footer__nav-btn ${active === key ? "footer__nav-btn--active" : ""}`}
              onClick={() => toggle(key)}
            >
              {label}
              <svg className="footer__nav-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="18 15 12 9 6 15"/>
              </svg>
            </button>
          ))}
        </nav>

        {/* ── Contact ── */}
        <div className="footer__contact">
          <a href="mailto:hello@shopapp.com" className="footer__contact-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            hello@shopapp.com
          </a>
          <a href="tel:+911234567890" className="footer__contact-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
            </svg>
            +91 12345 67890
          </a>
          <span className="footer__contact-item footer__contact-item--address">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            Kochi, Kerala, India
          </span>
        </div>

        {/* ── Social ── */}
        <div className="footer__social">
          {[
            { label: "Instagram", path: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M7.5 2h9A5.5 5.5 0 0122 7.5v9A5.5 5.5 0 0116.5 22h-9A5.5 5.5 0 012 16.5v-9A5.5 5.5 0 017.5 2z" },
            { label: "Twitter/X", path: "M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0012 8v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" },
            { label: "Facebook", path: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
          ].map(({ label, path }) => (
            <a key={label} href="#" className="footer__social-btn" aria-label={label}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d={path}/>
              </svg>
            </a>
          ))}
        </div>
      </div>

      {/* ── Popup ── */}
      {active && (
        <div
          className="footer__popup"
          ref={popupRef}
          style={getPopupStyle(active)}
        >
          <div className="footer__popup-arrow" />

          {active === "newsletter" ? (
            <div className="footer__popup-inner">
              <p className="footer__popup-title">Newsletter</p>
              <p className="footer__popup-sub">Get deals, new arrivals & exclusive offers.</p>
              {subscribed ? (
                <div className="footer__popup-success">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  You're subscribed!
                </div>
              ) : (
                <form className="footer__popup-form" onSubmit={handleSubscribe}>
                  <input
                    type="email"
                    className="footer__popup-input"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit" className="footer__popup-submit">Subscribe</button>
                </form>
              )}
            </div>
          ) : (
            <div className="footer__popup-inner">
              <p className="footer__popup-title">{popups[active].title}</p>
              <ul className="footer__popup-links">
                {popups[active].links.map((link) => (
                  <li key={link}>
                    <a href="#" className="footer__popup-link">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ── Bottom bar ── */}
      <div className="footer__bottom">
        <span>Shop<em>App. All rights reserved.</em></span>
        <div className="footer__payments">
          {["VISA", "MC", "UPI", "EMI"].map((p) => (
            <span key={p} className="footer__payment-chip">{p}</span>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;