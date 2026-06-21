import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const P = "#6D4AFF";
const LAV = "#A78BFA";
const GLD = "#F5B841";
const PNK = "#F472B6";
const DARK = "#120B2E";

const beliefs = [
  {
    icon: "🧠",
    title: "Connection Heals",
    body: "We believe genuine human connection is one of the most powerful healing forces on earth.",
  },
  {
    icon: "💜",
    title: "You Are Not Broken",
    body: "You are not broken. You are human. Going through hard things doesn't define you — how you rise does.",
  },
  {
    icon: "🛡",
    title: "Safety First",
    body: "Every person deserves a space that is safe, moderated, and free from judgment.",
  },
  {
    icon: "🌱",
    title: "Community Over Competition",
    body: "We are building a platform where people lift each other up — not compete, compare, or judge.",
  },
  {
    icon: "🔒",
    title: "Privacy is Sacred",
    body: "Your story is yours. We protect it with the highest standards of privacy and data ethics.",
  },
  {
    icon: "✨",
    title: "Healing is a Journey",
    body: "There is no fixed timeline for healing. SoulConnect walks with you — wherever you are on your journey.",
  },
];

const roadmap = [
  {
    phase: "Phase 1",
    label: "Foundation",
    timing: "Now",
    desc: "Building the early access community. Listening. Learning. Designing with real people.",
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

export default function About() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Load Google Fonts
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,700;1,700&display=swap";
    document.head.appendChild(link);

    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        background: "#F8F5FF",
        color: DARK,
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      {/* ── Navbar ── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: scrolled ? "rgba(18,11,46,0.96)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(167,139,250,0.15)" : "none",
          transition: "all 0.3s ease",
          padding: "0 32px",
        }}
      >
        <div
          style={{
            maxWidth: 1440,
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
              style={{ height: 40, width: "auto", display: "block",
                filter: "drop-shadow(0 3px 10px rgba(109,74,255,0.45))" }} />
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: 20,
                color: "#fff",
                letterSpacing: "-0.3px",
              }}
            >
              SoulConnect
            </span>
          </Link>

          {/* Nav links */}
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {[
              { label: "Home", to: "/" },
              { label: "About", to: "/about" },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.to}
                style={{
                  color: "rgba(255,255,255,0.8)",
                  textDecoration: "none",
                  fontSize: 15,
                  fontWeight: 500,
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#fff")}
                onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,0.8)")}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/signup"
              style={{
                background: `linear-gradient(135deg, ${P}, ${LAV})`,
                color: "#fff",
                textDecoration: "none",
                padding: "10px 22px",
                borderRadius: 50,
                fontSize: 14,
                fontWeight: 600,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.target.style.opacity = "1")}
            >
              Get Early Access
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        style={{
          background: `linear-gradient(160deg, ${DARK} 0%, #1E1245 50%, #2D1B69 100%)`,
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "120px 32px 80px",
        }}
      >
        <div style={{ maxWidth: 760 }}>
          <span
            style={{
              display: "inline-block",
              background: "rgba(167,139,250,0.18)",
              color: LAV,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              padding: "6px 18px",
              borderRadius: 50,
              marginBottom: 28,
              border: `1px solid rgba(167,139,250,0.3)`,
            }}
          >
            OUR STORY
          </span>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(38px, 6vw, 64px)",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.15,
              margin: "0 0 24px",
            }}
          >
            Why SoulConnect Exists
          </h1>
          <p
            style={{
              fontSize: "clamp(16px, 2vw, 20px)",
              color: "rgba(255,255,255,0.72)",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            We started SoulConnect because we know what it feels like to struggle alone — and we believe no one should have to.
          </p>
        </div>
      </section>

      {/* ── Mission ── */}
      <section style={{ padding: "96px 32px", background: "#F8F5FF" }}>
        <div
          style={{
            maxWidth: 1440,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 48,
            alignItems: "center",
          }}
        >
          <div>
            <span
              style={{
                display: "inline-block",
                background: `rgba(109,74,255,0.1)`,
                color: P,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "2px",
                textTransform: "uppercase",
                padding: "5px 14px",
                borderRadius: 50,
                marginBottom: 20,
              }}
            >
              Mission
            </span>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 700,
                color: DARK,
                margin: "0 0 20px",
                lineHeight: 1.2,
              }}
            >
              Our Mission
            </h2>
          </div>
          <p
            style={{
              fontSize: "clamp(16px, 1.6vw, 20px)",
              color: "#3D2C6E",
              lineHeight: 1.75,
              margin: 0,
              borderLeft: `4px solid ${P}`,
              paddingLeft: 28,
            }}
          >
            To build the world's most compassionate peer-support community — where people navigating anxiety, loneliness, heartbreak, burnout, grief, and life transitions can find genuine connection, healing, and growth.
          </p>
        </div>
      </section>

      {/* ── Vision ── */}
      <section
        style={{
          padding: "96px 32px",
          background: `linear-gradient(135deg, #1E1245 0%, ${DARK} 100%)`,
        }}
      >
        <div
          style={{
            maxWidth: 1440,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 48,
            alignItems: "center",
          }}
        >
          <div>
            <span
              style={{
                display: "inline-block",
                background: "rgba(245,184,65,0.15)",
                color: GLD,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "2px",
                textTransform: "uppercase",
                padding: "5px 14px",
                borderRadius: 50,
                marginBottom: 20,
              }}
            >
              Vision
            </span>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 700,
                color: "#fff",
                margin: "0 0 20px",
                lineHeight: 1.2,
              }}
            >
              Our Vision
            </h2>
          </div>
          <p
            style={{
              fontSize: "clamp(16px, 1.6vw, 20px)",
              color: "rgba(255,255,255,0.78)",
              lineHeight: 1.75,
              margin: 0,
              borderLeft: `4px solid ${GLD}`,
              paddingLeft: 28,
            }}
          >
            A world where nobody struggles alone. Where healing is accessible, community is real, and every person feels seen, heard, and understood.
          </p>
        </div>
      </section>

      {/* ── What We Believe ── */}
      <section style={{ padding: "96px 32px", background: "#F8F5FF" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span
              style={{
                display: "inline-block",
                background: `rgba(109,74,255,0.1)`,
                color: P,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "2px",
                textTransform: "uppercase",
                padding: "5px 14px",
                borderRadius: 50,
                marginBottom: 16,
              }}
            >
              Our Values
            </span>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 700,
                color: DARK,
                margin: 0,
              }}
            >
              What We Believe
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 28,
            }}
          >
            {beliefs.map((b) => (
              <div
                key={b.title}
                style={{
                  background: "#fff",
                  borderRadius: 24,
                  padding: 32,
                  boxShadow: "0 4px 24px rgba(109,74,255,0.08)",
                  border: "1px solid rgba(109,74,255,0.08)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 36px rgba(109,74,255,0.14)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 24px rgba(109,74,255,0.08)";
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 16 }}>{b.icon}</div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 20,
                    fontWeight: 700,
                    color: DARK,
                    margin: "0 0 12px",
                  }}
                >
                  {b.title}
                </h3>
                <p style={{ fontSize: 15, color: "#4B3A7A", lineHeight: 1.65, margin: 0 }}>
                  {b.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Roadmap ── */}
      <section
        style={{
          padding: "96px 32px",
          background: `linear-gradient(160deg, #1A0F3C 0%, ${DARK} 100%)`,
        }}
      >
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span
              style={{
                display: "inline-block",
                background: "rgba(244,114,182,0.15)",
                color: PNK,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "2px",
                textTransform: "uppercase",
                padding: "5px 14px",
                borderRadius: 50,
                marginBottom: 16,
              }}
            >
              Where We Are Going
            </span>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 700,
                color: "#fff",
                margin: 0,
              }}
            >
              Our Roadmap
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 24,
              position: "relative",
            }}
          >
            {roadmap.map((r, i) => (
              <div
                key={r.phase}
                style={{
                  background: r.active
                    ? `linear-gradient(135deg, ${P}, #4C2FD6)`
                    : "rgba(255,255,255,0.05)",
                  borderRadius: 24,
                  padding: 32,
                  border: r.active
                    ? "none"
                    : "1px solid rgba(167,139,250,0.15)",
                  position: "relative",
                }}
              >
                {r.active && (
                  <span
                    style={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      background: GLD,
                      color: DARK,
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: 50,
                      letterSpacing: "0.5px",
                    }}
                  >
                    LIVE
                  </span>
                )}
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: r.active ? "rgba(255,255,255,0.2)" : `rgba(109,74,255,0.25)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                    fontWeight: 700,
                    fontSize: 15,
                    color: r.active ? "#fff" : LAV,
                  }}
                >
                  {i + 1}
                </div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#fff",
                    margin: "0 0 12px",
                  }}
                >
                  {r.label}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: r.active ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.55)",
                    lineHeight: 1.65,
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
      <section style={{ padding: "96px 32px", background: "#F8F5FF" }}>
        <div
          style={{
            maxWidth: 760,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <span
            style={{
              display: "inline-block",
              background: `rgba(109,74,255,0.1)`,
              color: P,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
              padding: "5px 14px",
              borderRadius: 50,
              marginBottom: 24,
            }}
          >
            The Story
          </span>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(26px, 4vw, 40px)",
              fontWeight: 700,
              color: DARK,
              margin: "0 0 40px",
            }}
          >
            A Note From The Founder
          </h2>
          <div
            style={{
              background: "#fff",
              borderRadius: 24,
              padding: "48px 48px 40px",
              boxShadow: "0 8px 40px rgba(109,74,255,0.1)",
              border: "1px solid rgba(109,74,255,0.08)",
              textAlign: "left",
              position: "relative",
            }}
          >
            <div
              style={{
                fontSize: 80,
                fontFamily: "Georgia, serif",
                color: `rgba(109,74,255,0.12)`,
                lineHeight: 1,
                position: "absolute",
                top: 16,
                left: 32,
                userSelect: "none",
              }}
            >
              "
            </div>
            <p
              style={{
                fontSize: "clamp(15px, 1.5vw, 18px)",
                color: "#3D2C6E",
                lineHeight: 1.85,
                margin: "0 0 32px",
                paddingTop: 24,
              }}
            >
              SoulConnect started with a simple observation: many people go through life's hardest moments feeling completely alone.
            </p>
            <p style={{ fontSize: "clamp(15px, 1.5vw, 18px)", color: "#3D2C6E", lineHeight: 1.85, margin: "0 0 24px" }}>
              Whether it's anxiety, heartbreak, grief, burnout, loneliness, or major life changes, support often feels difficult to find. Traditional social platforms connect us to everyone, but not always to the people who truly understand what we're experiencing.
            </p>
            <p style={{ fontSize: "clamp(15px, 1.5vw, 18px)", color: "#3D2C6E", lineHeight: 1.85, margin: "0 0 24px" }}>
              I created SoulConnect to make meaningful connection easier. A place where people facing similar challenges can find each other, share their stories, support one another, and grow together through guided healing journeys.
            </p>
            <p style={{ fontSize: "clamp(15px, 1.5vw, 18px)", color: "#3D2C6E", lineHeight: 1.85, margin: "0 0 32px" }}>
              We're currently building SoulConnect in public, alongside our early community. Every piece of feedback, every conversation, and every person who joins helps shape what this platform becomes.
            </p>
            <p style={{ fontSize: "clamp(15px, 1.5vw, 18px)", color: "#3D2C6E", lineHeight: 1.85, margin: "0 0 32px" }}>
              Thank you for being part of the journey.
            </p>
            <p
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: P,
                margin: 0,
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
              }}
            >
              — Founder, SoulConnect
            </p>
          </div>
        </div>
      </section>

      {/* ── Early Access CTA ── */}
      <section
        style={{
          padding: "100px 32px",
          background: `linear-gradient(160deg, ${DARK} 0%, #2D1B69 50%, #1E1245 100%)`,
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <span
            style={{
              display: "inline-block",
              background: "rgba(167,139,250,0.18)",
              color: LAV,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              padding: "6px 18px",
              borderRadius: 50,
              marginBottom: 28,
              border: `1px solid rgba(167,139,250,0.25)`,
            }}
          >
            Join the founding community
          </span>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(34px, 6vw, 60px)",
              fontWeight: 700,
              color: "#fff",
              margin: "0 0 20px",
              lineHeight: 1.15,
            }}
          >
            Be Part of Something Real.
          </h2>
          <p
            style={{
              fontSize: "clamp(15px, 1.8vw, 19px)",
              color: "rgba(255,255,255,0.68)",
              lineHeight: 1.7,
              margin: "0 0 44px",
              maxWidth: 580,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            We are building SoulConnect alongside real people navigating real struggles. Join our early access list and help shape the future of healing communities.
          </p>
          <Link
            to="/signup"
            style={{
              display: "inline-block",
              background: `linear-gradient(135deg, ${P}, #9B5DE5)`,
              color: "#fff",
              textDecoration: "none",
              padding: "16px 44px",
              borderRadius: 50,
              fontSize: 17,
              fontWeight: 700,
              boxShadow: `0 8px 32px rgba(109,74,255,0.45)`,
              transition: "transform 0.2s, box-shadow 0.2s",
              marginBottom: 20,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = `0 12px 40px rgba(109,74,255,0.6)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = `0 8px 32px rgba(109,74,255,0.45)`;
            }}
          >
            Find My Circle 💜
          </Link>
          <p
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.4)",
              margin: "16px 0 0",
              letterSpacing: "0.3px",
            }}
          >
            No spam. No fake promises. Just real community.
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          background: "#0A0618",
          padding: "40px 32px",
          textAlign: "center",
          borderTop: "1px solid rgba(167,139,250,0.1)",
        }}
      >
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              marginBottom: 16,
            }}
          >
            <img src="/brand/logo/soulconnect-logo-primary.png" alt="SoulConnect"
              style={{ height: 32, width: "auto", display: "block",
                filter: "drop-shadow(0 3px 10px rgba(109,74,255,0.45))" }} />
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: 17,
                color: "#fff",
              }}
            >
              SoulConnect
            </span>
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", margin: 0 }}>
            © {new Date().getFullYear()} SoulConnect. Built with care for every soul navigating the hard parts of life.
          </p>
        </div>
      </footer>
    </div>
  );
}
