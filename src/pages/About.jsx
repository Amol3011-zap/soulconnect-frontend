import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HeartHandshake, Heart, ShieldCheck, Sprout, Lock, Sparkles, Quote } from "lucide-react";

/* "Dawn" palette — same tokens as the landing page */
const P = "#6B4FA0";
const DARK = "#221B3A";
const NAVY_SOFT = "#5B5470";
const MUTED = "#6E6784";
const GOLD_TXT = "#8A6A3E";
const CREAM = "#FAF8FC";
const CREAM_2 = "#F3EFF9";
const LILAC_LINE = "#E6DDF3";
const SF = '"Playfair Display",Georgia,serif';
const F = "'Plus Jakarta Sans',Inter,system-ui,sans-serif";

// Soft tints (same family as the Explore / How It Works cards)
const TINTS = [
  { bg: "#F1ECF9", fg: "#6B4FA0", wash: "#F7F3FC", edge: ["#A992DA", "#DCD0F0", "#EFE9F8"] },
  { bg: "#E7F1EC", fg: "#3F7A5E", wash: "#F1F8F4", edge: ["#86BBA2", "#D3E7DC", "#EAF3EE"] },
  { bg: "#FBEEE6", fg: "#9A5A3A", wash: "#FEF6F1", edge: ["#E0A585", "#F3DACC", "#FAEEE7"] },
  { bg: "#F6EFE2", fg: "#8A6A3E", wash: "#FCF8F0", edge: ["#D6B27A", "#EEDFC4", "#F7F0E3"] },
];
const tintedCard = (t, washStop = "46%") => ({
  border: "1.5px solid transparent",
  background: `linear-gradient(180deg, ${t.wash} 0%, #FFFFFF ${washStop}) padding-box, linear-gradient(150deg, ${t.edge[0]} 0%, ${t.edge[1]} 45%, ${t.edge[2]} 100%) border-box`,
});
const GOLD_EDGE = "linear-gradient(150deg, #D4B07A 0%, #E7D3E4 45%, #9C86CC 100%) border-box";

const beliefs = [
  {
    Icon: HeartHandshake,
    title: "Connection Heals",
    body: "We believe genuine human connection is one of the most powerful healing forces on earth.",
  },
  {
    Icon: Heart,
    title: "You Are Not Broken",
    body: "You are not broken. You are human. Going through hard things doesn't define you — how you rise does.",
  },
  {
    Icon: ShieldCheck,
    title: "Safety First",
    body: "Every person deserves a space that is safe, moderated, and free from judgment.",
  },
  {
    Icon: Sprout,
    title: "Community Over Competition",
    body: "We are building a platform where people lift each other up — not compete, compare, or judge.",
  },
  {
    Icon: Lock,
    title: "Privacy is Sacred",
    body: "Your story is yours. We protect it with the highest standards of privacy and data ethics.",
  },
  {
    Icon: Sparkles,
    title: "Healing is a Journey",
    body: "There is no fixed timeline for healing. SoulConnect walks with you — wherever you are on your journey.",
  },
];

const roadmap = [
  {
    phase: "Phase 1",
    label: "Foundation",
    timing: "Now",
    desc: "Building our Early Community. Listening. Learning. Designing with real people.",
    active: true,
  },
  {
    phase: "Phase 2",
    label: "Community",
    timing: "Q3 2026",
    desc: "Launching support circles, community matching, and healing journal features.",
    active: false,
  },
  {
    phase: "Phase 3",
    label: "Growth",
    timing: "Q4 2026",
    desc: "Mood tracking, guided challenges, wellness guides, and group events.",
    active: false,
  },
  {
    phase: "Phase 4",
    label: "Scale",
    timing: "2027",
    desc: "Expanding to verified wellness guides, regional communities, and mobile apps.",
    active: false,
  },
];

const css = `
  .ab-nav-link{transition:color .15s;}
  .ab-nav-link:hover{color:${DARK}!important;}
  .ab-btn{transition:background .2s, transform .2s, box-shadow .2s;}
  .ab-btn:hover{background:#5A4190!important;transform:translateY(-1px);box-shadow:0 8px 22px rgba(107,79,160,0.24)!important;}
  .ab-btn:focus-visible,.ab-nav-link:focus-visible{outline:3px solid #C9B8E8;outline-offset:3px;}
  .ab-values-card{transition:transform .2s ease, box-shadow .2s ease;}
  .ab-values-card:hover{transform:translateY(-3px);box-shadow:0 14px 32px rgba(34,27,58,0.08)!important;}
  .ab-eyebrow{display:inline-block;font-size:12px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:${GOLD_TXT};margin:0 0 14px;}
  @media(max-width:640px){
    .ab-nav-links .ab-nav-link{display:none!important;}
    .ab-split{padding:28px 24px!important;}
    .ab-founder{padding:36px 24px 30px!important;}
    .ab-hero{min-height:auto!important;padding:112px 20px 40px!important;}
  }
`;

export default function About() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Load Google Fonts
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,700;1,700&display=swap";
    document.head.appendChild(link);

    // Responsive styles for Our Values grid
    const style = document.createElement("style");
    style.id = "ab-values-responsive";
    style.textContent = [
      "@media(max-width:767px){",
      ".ab-values-grid{grid-template-columns:1fr!important;gap:18px!important;}",
      ".ab-values-card{padding:24px!important;min-height:auto!important;width:100%!important;max-width:460px!important;margin-left:auto!important;margin-right:auto!important;box-sizing:border-box!important;}",
      ".ab-values-h3{font-size:20px!important;line-height:1.25!important;max-width:none!important;}",
      ".ab-values-p{font-size:15.5px!important;line-height:1.7!important;word-break:normal!important;overflow-wrap:break-word!important;}",
      "}",
      "@media(min-width:768px) and (max-width:1023px){",
      ".ab-values-grid{grid-template-columns:repeat(2,1fr)!important;gap:20px!important;}",
      "}",
    ].join("");
    document.head.appendChild(style);

    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.head.removeChild(link);
      const s = document.getElementById("ab-values-responsive");
      if (s) document.head.removeChild(s);
    };
  }, []);

  const section = { padding: "clamp(64px,8vw,96px) 24px" };
  const h2 = {
    fontFamily: SF,
    fontSize: "clamp(28px, 4vw, 42px)",
    fontWeight: 700,
    color: DARK,
    margin: 0,
    lineHeight: 1.18,
    letterSpacing: "-0.02em",
  };

  return (
    <div
      style={{
        fontFamily: F,
        background: CREAM,
        color: DARK,
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <style>{css}</style>

      {/* ── Navbar ── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: scrolled ? "rgba(250,248,252,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? `1px solid ${LILAC_LINE}` : "1px solid transparent",
          transition: "all 0.3s ease",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 68,
          }}
        >
          {/* Logo */}
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/brand/logo/soulconnect-logo-primary.png" alt="SoulConnect"
              style={{ height: 38, width: "auto", display: "block" }} />
            <span
              style={{
                fontFamily: SF,
                fontWeight: 700,
                fontSize: 20,
                color: DARK,
                letterSpacing: "-0.3px",
              }}
            >
              Soul<span style={{ color: P }}>Connect</span>
            </span>
          </Link>

          {/* Nav links */}
          <div className="ab-nav-links" style={{ display: "flex", alignItems: "center", gap: 28 }}>
            {[
              { label: "Home", to: "/" },
              { label: "About", to: "/about" },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="ab-nav-link"
                style={{
                  color: item.to === "/about" ? P : NAVY_SOFT,
                  textDecoration: "none",
                  fontSize: 15,
                  fontWeight: item.to === "/about" ? 700 : 500,
                }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/#early"
              className="ab-btn"
              style={{
                background: P,
                color: "#fff",
                textDecoration: "none",
                padding: "10px 20px",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 700,
                boxShadow: "0 2px 8px rgba(107,79,160,0.18)",
              }}
            >
              Get Early Access
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        className="ab-hero"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, #FBF1EC 0%, rgba(251,241,236,0) 60%), linear-gradient(180deg, ${CREAM_2} 0%, ${CREAM} 100%)`,
          minHeight: "44vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "124px 24px 56px",
        }}
      >
        <div style={{ maxWidth: 760 }}>
          <span
            style={{
              display: "inline-block",
              background: "#FFFFFF",
              color: GOLD_TXT,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              padding: "7px 18px",
              borderRadius: 50,
              marginBottom: 26,
              border: "1px solid #EEDFC4",
            }}
          >
            OUR STORY
          </span>
          <h1
            style={{
              fontFamily: SF,
              fontSize: "clamp(38px, 6vw, 62px)",
              fontWeight: 700,
              color: DARK,
              lineHeight: 1.12,
              letterSpacing: "-0.02em",
              margin: "0 0 22px",
            }}
          >
            Why SoulConnect <span style={{ color: P }}>Exists</span>
          </h1>
          <p
            style={{
              fontSize: "clamp(16px, 2vw, 19px)",
              color: NAVY_SOFT,
              lineHeight: 1.7,
              margin: "0 auto",
              maxWidth: 620,
            }}
          >
            We started SoulConnect because we know what it feels like to struggle alone — and we believe no one should have to.
          </p>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section style={{ ...section, paddingTop: 24, background: CREAM }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))",
            gap: 24,
          }}
        >
          {/* Mission */}
          <div className="ab-split" style={{
            ...tintedCard(TINTS[0], "60%"),
            borderRadius: 22,
            padding: "36px 36px 38px",
            boxShadow: "0 6px 24px rgba(34,27,58,0.04)",
          }}>
            <span className="ab-eyebrow" style={{ color: TINTS[0].fg }}>Mission</span>
            <h2 style={{ ...h2, fontSize: "clamp(26px, 3.2vw, 34px)", margin: "0 0 18px" }}>
              Our Mission
            </h2>
            <p
              style={{
                fontSize: "clamp(16px, 1.5vw, 18px)",
                color: NAVY_SOFT,
                lineHeight: 1.75,
                margin: 0,
                borderLeft: `3px solid ${TINTS[0].edge[0]}`,
                paddingLeft: 22,
              }}
            >
              To build the world's most compassionate peer-support community — where people navigating anxiety, loneliness, heartbreak, burnout, grief, and life transitions can find genuine connection, healing, and growth.
            </p>
          </div>

          {/* Vision */}
          <div className="ab-split" style={{
            ...tintedCard(TINTS[3], "60%"),
            borderRadius: 22,
            padding: "36px 36px 38px",
            boxShadow: "0 6px 24px rgba(34,27,58,0.04)",
          }}>
            <span className="ab-eyebrow">Vision</span>
            <h2 style={{ ...h2, fontSize: "clamp(26px, 3.2vw, 34px)", margin: "0 0 18px" }}>
              Our Vision
            </h2>
            <p
              style={{
                fontSize: "clamp(16px, 1.5vw, 18px)",
                color: NAVY_SOFT,
                lineHeight: 1.75,
                margin: 0,
                borderLeft: `3px solid ${TINTS[3].edge[0]}`,
                paddingLeft: 22,
              }}
            >
              A world where nobody struggles alone. Where healing is accessible, community is real, and every person feels seen, heard, and understood.
            </p>
          </div>
        </div>
      </section>

      {/* ── What We Believe ── */}
      <section style={{ ...section, background: `linear-gradient(180deg, ${CREAM} 0%, ${CREAM_2} 100%)` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="ab-eyebrow">Our Values</span>
            <h2 style={h2}>What We Believe</h2>
          </div>

          <div
            className="ab-values-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 22,
            }}
          >
            {beliefs.map((b, i) => {
              const t = TINTS[i % TINTS.length];
              const Icon = b.Icon;
              return (
                <div
                  key={b.title}
                  className="ab-values-card"
                  style={{
                    ...tintedCard(t),
                    borderRadius: 20,
                    padding: 28,
                    boxShadow: "0 2px 12px rgba(34,27,58,0.03)",
                  }}
                >
                  <div className="ab-values-icon" style={{
                    width: 46, height: 46, borderRadius: 13, background: t.bg,
                    display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18,
                  }}>
                    <Icon size={22} strokeWidth={1.7} color={t.fg} />
                  </div>
                  <h3
                    className="ab-values-h3"
                    style={{
                      fontFamily: SF,
                      fontSize: 20,
                      fontWeight: 700,
                      color: DARK,
                      margin: "0 0 10px",
                    }}
                  >
                    {b.title}
                  </h3>
                  <p className="ab-values-p" style={{ fontSize: 15, color: NAVY_SOFT, lineHeight: 1.7, margin: 0 }}>
                    {b.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Roadmap ── */}
      <section style={{ ...section, background: CREAM_2 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span className="ab-eyebrow">Where We Are Going</span>
            <h2 style={h2}>Our Roadmap</h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 20,
              position: "relative",
            }}
          >
            {roadmap.map((r, i) => (
              <div
                key={r.phase}
                style={{
                  borderRadius: 20,
                  padding: 28,
                  position: "relative",
                  ...(r.active
                    ? {
                        border: "2px solid transparent",
                        background: `linear-gradient(170deg, #FBF1EC 0%, #FFFFFF 55%) padding-box, ${GOLD_EDGE}`,
                        boxShadow: "0 0 0 5px rgba(255,255,255,0.6), 0 16px 36px rgba(107,79,160,0.12)",
                      }
                    : {
                        border: `1.5px solid ${LILAC_LINE}`,
                        background: "rgba(255,255,255,0.72)",
                        boxShadow: "0 2px 10px rgba(34,27,58,0.02)",
                      }),
                }}
              >
                {r.active && (
                  <span
                    style={{
                      position: "absolute",
                      top: 18,
                      right: 18,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      background: "#E7F1EC",
                      color: "#2F5A45",
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "4px 10px",
                      borderRadius: 50,
                      letterSpacing: "0.08em",
                    }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3F7A5E" }} />
                    LIVE
                  </span>
                )}
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: r.active ? P : "#FFFFFF",
                    border: r.active ? "none" : `1.5px solid #DCD0F0`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 18,
                    fontFamily: SF,
                    fontWeight: 700,
                    fontSize: 16,
                    color: r.active ? "#fff" : P,
                  }}
                >
                  {i + 1}
                </div>
                <h3
                  style={{
                    fontFamily: SF,
                    fontSize: 21,
                    fontWeight: 700,
                    color: DARK,
                    margin: "0 0 10px",
                  }}
                >
                  {r.label}
                </h3>
                <p
                  style={{
                    fontSize: 14.5,
                    color: r.active ? NAVY_SOFT : MUTED,
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {r.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Founder Story ── */}
      <section style={{ ...section, background: `linear-gradient(180deg, ${CREAM_2} 0%, ${CREAM} 100%)` }}>
        <div
          style={{
            maxWidth: 760,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <span className="ab-eyebrow">The Story</span>
          <h2 style={{ ...h2, margin: "0 0 36px" }}>A Note From The Founder</h2>
          <div
            className="ab-founder"
            style={{
              border: "1.5px solid transparent",
              background: `linear-gradient(180deg, #FFFCFA 0%, #FFFFFF 100%) padding-box, ${GOLD_EDGE}`,
              borderRadius: 22,
              padding: "48px 48px 40px",
              boxShadow: "0 16px 44px rgba(107,79,160,0.08)",
              textAlign: "left",
              position: "relative",
            }}
          >
            <Quote
              aria-hidden="true"
              size={44}
              strokeWidth={1.4}
              color="#D4B07A"
              style={{ position: "absolute", top: 22, left: 28, opacity: 0.55 }}
            />
            <p
              style={{
                fontSize: "clamp(15px, 1.5vw, 17.5px)",
                color: "#3A3350",
                lineHeight: 1.85,
                margin: "0 0 24px",
                paddingTop: 30,
              }}
            >
              SoulConnect started with a simple observation: many people go through life's hardest moments feeling completely alone.
            </p>
            <p style={{ fontSize: "clamp(15px, 1.5vw, 17.5px)", color: NAVY_SOFT, lineHeight: 1.85, margin: "0 0 22px" }}>
              Whether it's anxiety, heartbreak, grief, burnout, loneliness, or major life changes, support often feels difficult to find. Traditional social platforms connect us to everyone, but not always to the people who truly understand what we're experiencing.
            </p>
            <p style={{ fontSize: "clamp(15px, 1.5vw, 17.5px)", color: NAVY_SOFT, lineHeight: 1.85, margin: "0 0 22px" }}>
              I created SoulConnect to make meaningful connection easier. A place where people facing similar challenges can find each other, share their stories, support one another, and grow together through guided healing journeys.
            </p>
            <p style={{ fontSize: "clamp(15px, 1.5vw, 17.5px)", color: NAVY_SOFT, lineHeight: 1.85, margin: "0 0 22px" }}>
              We're currently building SoulConnect in public, alongside our early community. Every piece of feedback, every conversation, and every person who joins helps shape what this platform becomes.
            </p>
            <p style={{ fontSize: "clamp(15px, 1.5vw, 17.5px)", color: NAVY_SOFT, lineHeight: 1.85, margin: "0 0 28px" }}>
              Thank you for being part of the journey.
            </p>
            <div style={{ height: 1, background: LILAC_LINE, margin: "0 0 20px" }} />
            <p
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: P,
                margin: 0,
                fontFamily: SF,
                fontStyle: "italic",
              }}
            >
              — Founder, SoulConnect
            </p>
          </div>
        </div>
      </section>

      {/* ── Early Access CTA ── */}
      <section style={{ padding: "24px 24px clamp(72px,9vw,104px)", background: CREAM }}>
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            textAlign: "center",
            padding: "clamp(40px,6vw,64px) clamp(24px,5vw,56px)",
            borderRadius: 26,
            border: "2px solid transparent",
            background: `linear-gradient(160deg, #FBF1EC 0%, ${CREAM_2} 60%, #F1ECF9 100%) padding-box, ${GOLD_EDGE}`,
            boxShadow: "0 0 0 6px rgba(255,255,255,0.6), 0 24px 56px rgba(107,79,160,0.10)",
          }}
        >
          <span
            style={{
              display: "inline-block",
              background: "#FFFFFF",
              color: GOLD_TXT,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              padding: "7px 18px",
              borderRadius: 50,
              marginBottom: 24,
              border: "1px solid #EEDFC4",
            }}
          >
            Join the founding community
          </span>
          <h2
            style={{
              fontFamily: SF,
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 700,
              color: DARK,
              margin: "0 0 18px",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
          >
            Be Part of Something <span style={{ color: P }}>Real.</span>
          </h2>
          <p
            style={{
              fontSize: "clamp(15px, 1.7vw, 18px)",
              color: NAVY_SOFT,
              lineHeight: 1.7,
              margin: "0 auto 36px",
              maxWidth: 580,
            }}
          >
            We are building SoulConnect alongside real people navigating real struggles. Join our Early Community and help shape the future of healing communities.
          </p>
          <Link
            to="/#early"
            className="ab-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: P,
              color: "#fff",
              textDecoration: "none",
              padding: "15px 36px",
              borderRadius: 14,
              fontSize: 16.5,
              fontWeight: 700,
              boxShadow: "0 4px 14px rgba(107,79,160,0.22)",
            }}
          >
            Find My Circle
            <Heart size={17} strokeWidth={2} fill="#E7D3E4" color="#FFFFFF" />
          </Link>
          <p
            style={{
              fontSize: 13,
              color: MUTED,
              margin: "18px 0 0",
              letterSpacing: "0.02em",
            }}
          >
            No spam. No fake promises. Just real community.
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          background: "#FFFFFF",
          padding: "36px 24px",
          textAlign: "center",
          borderTop: `1px solid ${LILAC_LINE}`,
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <img src="/brand/logo/soulconnect-logo-primary.png" alt="SoulConnect"
              style={{ height: 30, width: "auto", display: "block" }} />
            <span
              style={{
                fontFamily: SF,
                fontWeight: 700,
                fontSize: 17,
                color: DARK,
              }}
            >
              Soul<span style={{ color: P }}>Connect</span>
            </span>
          </div>
          <p style={{ fontSize: 13, color: MUTED, margin: 0 }}>
            © {new Date().getFullYear()} SoulConnect. Built with care for every soul navigating the hard parts of life.
          </p>
        </div>
      </footer>
    </div>
  );
}
