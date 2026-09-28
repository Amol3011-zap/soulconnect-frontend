/**
 * public-pages-content.js — crawler-readable text of the 14 public pages
 * prerendered by generate-index-pages.js (/about, /faq, /how-it-works, …).
 *
 * WHAT THIS IS: a verbatim snapshot of each page's rendered content — its
 * headings, paragraphs, list items and in-page links — taken from the live
 * React pages (src/pages/About.jsx, FAQ.jsx, …) as rendered on 2026-09-27.
 * Nothing here is rewritten or summarised. Site-wide chrome (nav, footer),
 * forms and buttons are excluded; decorative fragments (emoji-only lines,
 * single-letter avatars, step numbers) are dropped. FAQ answers come from
 * opening each FAQ item, and `faq` holds the same question/answer pairs for
 * the FAQPage JSON-LD, so the visible text and the structured data match.
 *
 * KEEP IN SYNC: like scripts/inject-static.js, this is a static copy. When
 * the copy on one of these pages changes, re-take the snapshot (or edit the
 * matching block here) so the crawler HTML does not drift from the app.
 *
 * Block shape: { tag: 'h1'|'h2'|'h3'|'p'|'li', html, list?, ordered? } where
 * html is already HTML-escaped text that may contain <a href> links, and
 * consecutive 'li' blocks with the same `list` id belong to one list.
 */

export const PUBLIC_PAGE_CONTENT = {
  "/about": {
    "blocks": [
      {
        "tag": "p",
        "html": "OUR STORY"
      },
      {
        "tag": "h1",
        "html": "Why SoulConnect Exists"
      },
      {
        "tag": "p",
        "html": "We started SoulConnect because we know what it feels like to struggle alone — and we believe no one should have to."
      },
      {
        "tag": "p",
        "html": "Mission"
      },
      {
        "tag": "h2",
        "html": "Our Mission"
      },
      {
        "tag": "p",
        "html": "To build the world's most compassionate peer-support community — where people navigating anxiety, loneliness, heartbreak, burnout, grief, and life transitions can find genuine connection, healing, and growth."
      },
      {
        "tag": "p",
        "html": "Vision"
      },
      {
        "tag": "h2",
        "html": "Our Vision"
      },
      {
        "tag": "p",
        "html": "A world where nobody struggles alone. Where healing is accessible, community is real, and every person feels seen, heard, and understood."
      },
      {
        "tag": "p",
        "html": "Our Values"
      },
      {
        "tag": "h2",
        "html": "What We Believe"
      },
      {
        "tag": "h3",
        "html": "Connection Heals"
      },
      {
        "tag": "p",
        "html": "We believe genuine human connection is one of the most powerful healing forces on earth."
      },
      {
        "tag": "h3",
        "html": "You Are Not Broken"
      },
      {
        "tag": "p",
        "html": "You are not broken. You are human. Going through hard things doesn't define you — how you rise does."
      },
      {
        "tag": "h3",
        "html": "Safety First"
      },
      {
        "tag": "p",
        "html": "Every person deserves a space that is safe, moderated, and free from judgment."
      },
      {
        "tag": "h3",
        "html": "Community Over Competition"
      },
      {
        "tag": "p",
        "html": "We are building a platform where people lift each other up — not compete, compare, or judge."
      },
      {
        "tag": "h3",
        "html": "Privacy is Sacred"
      },
      {
        "tag": "p",
        "html": "Your story is yours. We protect it with the highest standards of privacy and data ethics."
      },
      {
        "tag": "h3",
        "html": "Healing is a Journey"
      },
      {
        "tag": "p",
        "html": "There is no fixed timeline for healing. SoulConnect walks with you — wherever you are on your journey."
      },
      {
        "tag": "p",
        "html": "Where We Are Going"
      },
      {
        "tag": "h2",
        "html": "Our Roadmap"
      },
      {
        "tag": "p",
        "html": "LIVE"
      },
      {
        "tag": "h3",
        "html": "Foundation"
      },
      {
        "tag": "p",
        "html": "Building our Early Community. Listening. Learning. Designing with real people."
      },
      {
        "tag": "h3",
        "html": "Community"
      },
      {
        "tag": "p",
        "html": "Launching support circles, community matching, and healing journal features."
      },
      {
        "tag": "h3",
        "html": "Growth"
      },
      {
        "tag": "p",
        "html": "Mood tracking, guided challenges, wellness guides, and group events."
      },
      {
        "tag": "h3",
        "html": "Scale"
      },
      {
        "tag": "p",
        "html": "Expanding to verified wellness guides, regional communities, and mobile apps."
      },
      {
        "tag": "p",
        "html": "The Story"
      },
      {
        "tag": "h2",
        "html": "A Note From The Founder"
      },
      {
        "tag": "p",
        "html": "SoulConnect started with a simple observation: many people go through life's hardest moments feeling completely alone."
      },
      {
        "tag": "p",
        "html": "Whether it's anxiety, heartbreak, grief, burnout, loneliness, or major life changes, support often feels difficult to find. Traditional social platforms connect us to everyone, but not always to the people who truly understand what we're experiencing."
      },
      {
        "tag": "p",
        "html": "I created SoulConnect to make meaningful connection easier. A place where people facing similar challenges can find each other, share their stories, support one another, and grow together through guided healing journeys."
      },
      {
        "tag": "p",
        "html": "We're currently building SoulConnect in public, alongside our early community. Every piece of feedback, every conversation, and every person who joins helps shape what this platform becomes."
      },
      {
        "tag": "p",
        "html": "Thank you for being part of the journey."
      },
      {
        "tag": "p",
        "html": "— Founder, SoulConnect"
      },
      {
        "tag": "p",
        "html": "Join the founding community<a href=\"/#early\">Find My Circle</a>"
      },
      {
        "tag": "h2",
        "html": "Be Part of Something Real."
      },
      {
        "tag": "p",
        "html": "We are building SoulConnect alongside real people navigating real struggles. Join our Early Community and help shape the future of healing communities."
      },
      {
        "tag": "p",
        "html": "No spam. No fake promises. Just real community."
      }
    ]
  },
  "/faq": {
    "blocks": [
      {
        "tag": "p",
        "html": "<a href=\"/\">Back to Home</a>"
      },
      {
        "tag": "p",
        "html": "Help centre"
      },
      {
        "tag": "h1",
        "html": "Frequently Asked Questions"
      },
      {
        "tag": "p",
        "html": "Find answers to common questions about SoulConnect, our services, privacy, and mental health support."
      },
      {
        "tag": "h3",
        "html": "What is SoulConnect?"
      },
      {
        "tag": "p",
        "html": "SoulConnect is a mental wellness platform where people can find emotional support through community, guided wellness activities, and connections with mental health professionals when needed. Whether you're feeling anxious, lonely, overwhelmed, grieving, or simply need someone to talk to, SoulConnect is designed to help you feel less alone in a safe and supportive environment. While professional support is available through verified practitioners, SoulConnect is not a replacement for emergency medical care or crisis intervention."
      },
      {
        "tag": "h3",
        "html": "Who is SoulConnect for?"
      },
      {
        "tag": "p",
        "html": "SoulConnect is for anyone looking for emotional support, meaningful connection, or tools to improve their mental well-being. Whether you're experiencing stress, anxiety, loneliness, burnout, relationship challenges, grief, or simply want to build healthier habits, the platform is designed to support your journey. If you're experiencing a mental health emergency or are at immediate risk of harm, please contact your local emergency services or a crisis helpline immediately."
      },
      {
        "tag": "h3",
        "html": "Is SoulConnect free to use?"
      },
      {
        "tag": "p",
        "html": "Yes. Many core features of SoulConnect are available free of charge, including exploring the platform, joining the community, participating in wellness challenges, and accessing educational mental health resources. Some optional services offered by independent mental health professionals or healers may require payment. Any paid services will always display pricing clearly before you book."
      },
      {
        "tag": "h3",
        "html": "Are therapy sessions or professional consultations paid?"
      },
      {
        "tag": "p",
        "html": "Professional consultations, therapy sessions, or healing sessions offered through independent practitioners may have their own fees. Pricing varies depending on the professional and the type of session. SoulConnect itself does not charge hidden fees, and you will always be able to review pricing before confirming a booking."
      },
      {
        "tag": "h3",
        "html": "How private is my information?"
      },
      {
        "tag": "p",
        "html": "Your privacy is extremely important to us. Personal information is handled according to our Privacy Policy, and we work to protect your data using modern security practices. You control what information you choose to share within the platform. While we strive to provide a safe environment, no online service can guarantee absolute security, so we encourage users not to share sensitive personal or financial information unnecessarily."
      },
      {
        "tag": "h3",
        "html": "How do I get started?"
      },
      {
        "tag": "p",
        "html": "Getting started is simple. Create your account, complete your profile, and explore the different areas of SoulConnect. You can browse community spaces, participate in wellness activities, read educational resources, or connect with professionals if you choose. The platform is designed so you can begin at your own pace based on your individual needs."
      },
      {
        "tag": "h3",
        "html": "Does SoulConnect replace therapy or medical treatment?"
      },
      {
        "tag": "p",
        "html": "No. SoulConnect is designed to complement—not replace—professional mental health care. The platform provides community support, wellness resources, and access to professionals where available. If you are experiencing severe symptoms, suicidal thoughts, or a mental health emergency, you should immediately contact emergency services or a qualified mental health professional."
      },
      {
        "tag": "h3",
        "html": "What mental health topics does SoulConnect support?"
      },
      {
        "tag": "p",
        "html": "SoulConnect provides resources and community support for a wide range of emotional well-being topics, including anxiety, stress, loneliness, burnout, grief, relationships, emotional wellness, mindfulness, meditation, self-care, and personal growth. The platform continues to expand its educational content and wellness programs to support different mental health journeys."
      },
      {
        "tag": "h3",
        "html": "How are professionals verified?"
      },
      {
        "tag": "p",
        "html": "Professionals listed on SoulConnect go through a verification process before appearing on the platform. Verification requirements may vary depending on the type of practitioner and applicable regulations. We encourage users to review each professional's profile, qualifications, and experience before booking a session. Verification does not replace your own judgment when choosing a provider."
      },
      {
        "tag": "h3",
        "html": "What should I do if I'm in crisis or need immediate help?"
      },
      {
        "tag": "p",
        "html": "If you believe you or someone else is in immediate danger, call your local emergency services immediately. If you are in India and need urgent emotional support, you can contact Tele-MANAS (14416) or the Vandrevala Foundation (+91 9999 666 555) for confidential mental health support. SoulConnect is not an emergency or crisis response service and should not be used as a substitute for immediate medical assistance."
      },
      {
        "tag": "h2",
        "html": "Still have questions?"
      },
      {
        "tag": "p",
        "html": "Reach out to our support team — we're here to help."
      },
      {
        "tag": "p",
        "html": "<a href=\"/contact\">Contact Support</a>"
      }
    ],
    "faq": [
      {
        "q": "What is SoulConnect?",
        "a": "SoulConnect is a mental wellness platform where people can find emotional support through community, guided wellness activities, and connections with mental health professionals when needed. Whether you're feeling anxious, lonely, overwhelmed, grieving, or simply need someone to talk to, SoulConnect is designed to help you feel less alone in a safe and supportive environment. While professional support is available through verified practitioners, SoulConnect is not a replacement for emergency medical care or crisis intervention."
      },
      {
        "q": "Who is SoulConnect for?",
        "a": "SoulConnect is for anyone looking for emotional support, meaningful connection, or tools to improve their mental well-being. Whether you're experiencing stress, anxiety, loneliness, burnout, relationship challenges, grief, or simply want to build healthier habits, the platform is designed to support your journey. If you're experiencing a mental health emergency or are at immediate risk of harm, please contact your local emergency services or a crisis helpline immediately."
      },
      {
        "q": "Is SoulConnect free to use?",
        "a": "Yes. Many core features of SoulConnect are available free of charge, including exploring the platform, joining the community, participating in wellness challenges, and accessing educational mental health resources. Some optional services offered by independent mental health professionals or healers may require payment. Any paid services will always display pricing clearly before you book."
      },
      {
        "q": "Are therapy sessions or professional consultations paid?",
        "a": "Professional consultations, therapy sessions, or healing sessions offered through independent practitioners may have their own fees. Pricing varies depending on the professional and the type of session. SoulConnect itself does not charge hidden fees, and you will always be able to review pricing before confirming a booking."
      },
      {
        "q": "How private is my information?",
        "a": "Your privacy is extremely important to us. Personal information is handled according to our Privacy Policy, and we work to protect your data using modern security practices. You control what information you choose to share within the platform. While we strive to provide a safe environment, no online service can guarantee absolute security, so we encourage users not to share sensitive personal or financial information unnecessarily."
      },
      {
        "q": "How do I get started?",
        "a": "Getting started is simple. Create your account, complete your profile, and explore the different areas of SoulConnect. You can browse community spaces, participate in wellness activities, read educational resources, or connect with professionals if you choose. The platform is designed so you can begin at your own pace based on your individual needs."
      },
      {
        "q": "Does SoulConnect replace therapy or medical treatment?",
        "a": "No. SoulConnect is designed to complement—not replace—professional mental health care. The platform provides community support, wellness resources, and access to professionals where available. If you are experiencing severe symptoms, suicidal thoughts, or a mental health emergency, you should immediately contact emergency services or a qualified mental health professional."
      },
      {
        "q": "What mental health topics does SoulConnect support?",
        "a": "SoulConnect provides resources and community support for a wide range of emotional well-being topics, including anxiety, stress, loneliness, burnout, grief, relationships, emotional wellness, mindfulness, meditation, self-care, and personal growth. The platform continues to expand its educational content and wellness programs to support different mental health journeys."
      },
      {
        "q": "How are professionals verified?",
        "a": "Professionals listed on SoulConnect go through a verification process before appearing on the platform. Verification requirements may vary depending on the type of practitioner and applicable regulations. We encourage users to review each professional's profile, qualifications, and experience before booking a session. Verification does not replace your own judgment when choosing a provider."
      },
      {
        "q": "What should I do if I'm in crisis or need immediate help?",
        "a": "If you believe you or someone else is in immediate danger, call your local emergency services immediately. If you are in India and need urgent emotional support, you can contact Tele-MANAS (14416) or the Vandrevala Foundation (+91 9999 666 555) for confidential mental health support. SoulConnect is not an emergency or crisis response service and should not be used as a substitute for immediate medical assistance."
      }
    ]
  },
  "/how-it-works": {
    "blocks": [
      {
        "tag": "p",
        "html": "<a href=\"/\">Back to Home</a>"
      },
      {
        "tag": "p",
        "html": "Your path forward"
      },
      {
        "tag": "h1",
        "html": "How SoulConnect Works"
      },
      {
        "tag": "p",
        "html": "A 7-step guide to finding support, connection, and personal growth"
      },
      {
        "tag": "h3",
        "html": "Join the Community"
      },
      {
        "tag": "p",
        "html": "Create your free account in just a few minutes."
      },
      {
        "tag": "p",
        "html": "Whether you're looking for support, connection, or personal growth, SoulConnect is designed to help you take the first step in a safe and welcoming environment."
      },
      {
        "tag": "h3",
        "html": "Complete Your Profile"
      },
      {
        "tag": "p",
        "html": "Tell us a little about yourself."
      },
      {
        "tag": "p",
        "html": "You can share: Your interests, Challenges you're facing, Wellness goals, Preferred language, Support preferences. You decide how much information to share."
      },
      {
        "tag": "h3",
        "html": "Explore Community Spaces"
      },
      {
        "tag": "p",
        "html": "Join discussions with people who understand what you're going through."
      },
      {
        "tag": "p",
        "html": "Explore topics like: Anxiety, Stress, Burnout, Loneliness, Relationships, Grief, Self-care, Meditation, Personal growth"
      },
      {
        "tag": "h3",
        "html": "Participate in Wellness Activities"
      },
      {
        "tag": "p",
        "html": "Build healthy habits through guided activities such as:"
      },
      {
        "tag": "p",
        "html": "Daily breathing exercises, Meditation sessions, Journaling prompts, Gratitude challenges, Mindfulness practices, Community healing circles"
      },
      {
        "tag": "h3",
        "html": "Connect with Professionals (Optional)"
      },
      {
        "tag": "p",
        "html": "If you need additional support, you can browse independent mental health professionals and wellness practitioners available through the platform."
      },
      {
        "tag": "p",
        "html": "Review their profiles, experience, and available services before choosing what feels right for you."
      },
      {
        "tag": "h3",
        "html": "Protect Your Privacy"
      },
      {
        "tag": "p",
        "html": "Your privacy matters."
      },
      {
        "tag": "p",
        "html": "SoulConnect is designed to help you control what you share. You can choose how much personal information you make visible, and we encourage everyone to respect the privacy of others within the community."
      },
      {
        "tag": "h3",
        "html": "Stay Safe"
      },
      {
        "tag": "p",
        "html": "SoulConnect is built around respectful, supportive conversations."
      },
      {
        "tag": "p",
        "html": "Community guidelines, moderation tools, and reporting features help create a positive environment for everyone. If you're experiencing a mental health emergency, please contact your local emergency services or a crisis helpline immediately."
      },
      {
        "tag": "h2",
        "html": "Ready to Start Your Journey?"
      },
      {
        "tag": "p",
        "html": "Join SoulConnect today and connect with a supportive community"
      },
      {
        "tag": "p",
        "html": "<a href=\"/\">Get Started</a>"
      }
    ]
  },
  "/crisis-support": {
    "blocks": [
      {
        "tag": "p",
        "html": "If you are in immediate danger — call emergency services (112 / 911 / 999) right now."
      },
      {
        "tag": "h1",
        "html": "Need Immediate Help?"
      },
      {
        "tag": "p",
        "html": "If you are in immediate danger, thinking about harming yourself, or believe someone else may be at risk — please seek emergency assistance immediately. You are not alone."
      },
      {
        "tag": "h2",
        "html": "🚨 Emergency Situations"
      },
      {
        "tag": "p",
        "html": "If you are experiencing any of the following, contact emergency services immediately:"
      },
      {
        "tag": "p",
        "html": "Thoughts of suicide or self-harm"
      },
      {
        "tag": "p",
        "html": "Feeling unable to keep yourself safe"
      },
      {
        "tag": "p",
        "html": "Immediate danger from another person"
      },
      {
        "tag": "p",
        "html": "Medical emergency or overdose"
      },
      {
        "tag": "p",
        "html": "Severe emotional distress or breakdown"
      },
      {
        "tag": "p",
        "html": "Domestic violence or abuse"
      },
      {
        "tag": "p",
        "html": "<a href=\"tel:112\">📞 Call Emergency: 112</a>"
      },
      {
        "tag": "p",
        "html": "<a href=\"tel:100\">🚔 Police: 100</a>"
      },
      {
        "tag": "h2",
        "html": "📞 Crisis Support Lines"
      },
      {
        "tag": "p",
        "html": "Free, confidential support available 24/7."
      },
      {
        "tag": "p",
        "html": "iCall"
      },
      {
        "tag": "p",
        "html": "India 🇮🇳 · Mon–Sat, 8am–10pm"
      },
      {
        "tag": "p",
        "html": "9152987821"
      },
      {
        "tag": "p",
        "html": "<a href=\"tel:9152987821\">Call</a>"
      },
      {
        "tag": "p",
        "html": "AASRA"
      },
      {
        "tag": "p",
        "html": "India 🇮🇳 · 24 / 7"
      },
      {
        "tag": "p",
        "html": "9820466627"
      },
      {
        "tag": "p",
        "html": "<a href=\"tel:9820466627\">Call</a>"
      },
      {
        "tag": "p",
        "html": "Vandrevala Foundation"
      },
      {
        "tag": "p",
        "html": "India 🇮🇳 · 24 / 7"
      },
      {
        "tag": "p",
        "html": "1860-2662-345"
      },
      {
        "tag": "p",
        "html": "<a href=\"tel:1860-2662-345\">Call</a>"
      },
      {
        "tag": "p",
        "html": "Suicide &amp; Crisis Lifeline"
      },
      {
        "tag": "p",
        "html": "United States 🇺🇸 · 24 / 7"
      },
      {
        "tag": "p",
        "html": "988"
      },
      {
        "tag": "p",
        "html": "<a href=\"tel:988\">Call</a>"
      },
      {
        "tag": "p",
        "html": "Samaritans"
      },
      {
        "tag": "p",
        "html": "United Kingdom 🇬🇧 · 24 / 7"
      },
      {
        "tag": "p",
        "html": "116 123"
      },
      {
        "tag": "p",
        "html": "<a href=\"tel:116123\">Call</a>"
      },
      {
        "tag": "p",
        "html": "Crisis Text Line"
      },
      {
        "tag": "p",
        "html": "United States 🇺🇸 · 24 / 7"
      },
      {
        "tag": "p",
        "html": "Text HOME to 741741"
      },
      {
        "tag": "p",
        "html": "<a href=\"tel:TextHOMEto741741\">Call</a>"
      },
      {
        "tag": "p",
        "html": "Lifeline"
      },
      {
        "tag": "p",
        "html": "Australia 🇦🇺 · 24 / 7"
      },
      {
        "tag": "p",
        "html": "13 11 14"
      },
      {
        "tag": "p",
        "html": "<a href=\"tel:131114\">Call</a>"
      },
      {
        "tag": "h2",
        "html": "💜 You Are Not Alone"
      },
      {
        "tag": "p",
        "html": "Whatever you are going through right now, there are people who care and who want to help. Reaching out is an act of incredible strength and courage."
      },
      {
        "tag": "p",
        "html": "SoulConnect is a peer wellness community. We are not a crisis service, but we care deeply about your wellbeing. Please use the crisis resources above for immediate professional support."
      },
      {
        "tag": "h2",
        "html": "💬 What to Say When You Call"
      },
      {
        "tag": "p",
        "html": "If you're not sure what to say, you can start with:"
      },
      {
        "tag": "p",
        "html": "\"I'm struggling and need someone to talk to.\""
      },
      {
        "tag": "p",
        "html": "\"I'm having thoughts of hurting myself.\""
      },
      {
        "tag": "p",
        "html": "\"I'm worried about someone I know.\""
      },
      {
        "tag": "p",
        "html": "\"I'm not sure what to do right now.\""
      },
      {
        "tag": "p",
        "html": "SoulConnect is a peer wellness platform and is not a crisis service or emergency provider. For emergencies, always contact local emergency services immediately."
      }
    ]
  },
  "/trust-safety": {
    "blocks": [
      {
        "tag": "p",
        "html": "<a href=\"/\">Back to Home</a>"
      },
      {
        "tag": "p",
        "html": "Our commitment"
      },
      {
        "tag": "h1",
        "html": "Trust &amp; Safety"
      },
      {
        "tag": "p",
        "html": "Your privacy, safety, and well-being are our highest priorities"
      },
      {
        "tag": "h2",
        "html": "Your Privacy Matters"
      },
      {
        "tag": "h3",
        "html": "Your personal information belongs to you."
      },
      {
        "tag": "p",
        "html": "We are committed to protecting your privacy and giving you control over what you choose to share on SoulConnect."
      },
      {
        "tag": "h3",
        "html": "You decide what information appears on your profile."
      },
      {
        "tag": "p",
        "html": "We encourage users not to share sensitive personal information publicly. Read our Privacy Policy to learn how your data is handled."
      },
      {
        "tag": "h2",
        "html": "A Respectful Community"
      },
      {
        "tag": "h3",
        "html": "SoulConnect is built around empathy, kindness, and respect."
      },
      {
        "tag": "p",
        "html": "Everyone is expected to:"
      },
      {
        "tag": "li",
        "html": "Treat others respectfully",
        "list": 0,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Avoid harassment or discrimination",
        "list": 0,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Respect personal boundaries",
        "list": 0,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Support others without judgment",
        "list": 0,
        "ordered": false
      },
      {
        "tag": "p",
        "html": "Content that violates our Community Guidelines may be removed."
      },
      {
        "tag": "h2",
        "html": "Community Moderation"
      },
      {
        "tag": "h3",
        "html": "To help maintain a safe environment, SoulConnect uses moderation tools and reporting features."
      },
      {
        "tag": "p",
        "html": "Users can:"
      },
      {
        "tag": "li",
        "html": "Report inappropriate content",
        "list": 1,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Block unwanted interactions",
        "list": 1,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Flag harmful behavior",
        "list": 1,
        "ordered": false
      },
      {
        "tag": "p",
        "html": "Our team reviews reports to help keep the community safe."
      },
      {
        "tag": "h2",
        "html": "Verified Professionals"
      },
      {
        "tag": "h3",
        "html": "Where professional services are offered, practitioners go through a verification process before appearing on the platform."
      },
      {
        "tag": "p",
        "html": "Users should always review a professional's profile, qualifications, and experience before booking a session."
      },
      {
        "tag": "h2",
        "html": "Peer Support, Not Emergency Care"
      },
      {
        "tag": "h3",
        "html": "SoulConnect provides peer support, wellness resources, and access to professionals where available."
      },
      {
        "tag": "p",
        "html": "It is not an emergency service and should not be used as a substitute for urgent medical or psychiatric care."
      },
      {
        "tag": "h3",
        "html": "If you are in immediate danger or experiencing a mental health crisis, contact your local emergency services or a crisis helpline immediately."
      },
      {
        "tag": "h2",
        "html": "Transparency"
      },
      {
        "tag": "h3",
        "html": "We believe trust is earned through honesty."
      },
      {
        "tag": "p",
        "html": "We do not intentionally display misleading statistics, fake testimonials, or fabricated reviews. Our goal is to build a supportive community through genuine experiences and meaningful connections."
      },
      {
        "tag": "h2",
        "html": "Account &amp; Data Security"
      },
      {
        "tag": "h3",
        "html": "We continuously work to protect user accounts and platform security using industry-standard security practices."
      },
      {
        "tag": "p",
        "html": "To help keep your account safe:"
      },
      {
        "tag": "li",
        "html": "Use a strong password.",
        "list": 2,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Never share your login credentials.",
        "list": 2,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Contact us if you believe your account has been compromised.",
        "list": 2,
        "ordered": false
      },
      {
        "tag": "h2",
        "html": "Your Well-being Comes First"
      },
      {
        "tag": "h3",
        "html": "We encourage users to seek professional support whenever it is needed."
      },
      {
        "tag": "p",
        "html": "SoulConnect is designed to complement—not replace—professional mental health care."
      },
      {
        "tag": "h2",
        "html": "Need Immediate Help?"
      },
      {
        "tag": "p",
        "html": "If you or someone you know is experiencing a mental health crisis, contact emergency services immediately or reach out to:"
      },
      {
        "tag": "p",
        "html": "<a href=\"tel:14416\">Tele-MANAS</a>"
      },
      {
        "tag": "p",
        "html": "<a href=\"tel:14416\">14416</a>"
      },
      {
        "tag": "p",
        "html": "<a href=\"tel:14416\">24/7 Mental Health Support</a>"
      },
      {
        "tag": "p",
        "html": "<a href=\"tel:+919999666555\">Vandrevala Foundation</a>"
      },
      {
        "tag": "p",
        "html": "<a href=\"tel:+919999666555\">+91 9999 666 555</a>"
      },
      {
        "tag": "p",
        "html": "<a href=\"tel:+919999666555\">Crisis Support</a>"
      },
      {
        "tag": "p",
        "html": "<a href=\"tel:9152987821\">iCall</a>"
      },
      {
        "tag": "p",
        "html": "<a href=\"tel:9152987821\">9152987821</a>"
      },
      {
        "tag": "p",
        "html": "<a href=\"tel:9152987821\">Mental Health Support</a>"
      },
      {
        "tag": "p",
        "html": "<a href=\"tel:9820466726\">AASRA</a>"
      },
      {
        "tag": "p",
        "html": "<a href=\"tel:9820466726\">9820466726</a>"
      },
      {
        "tag": "p",
        "html": "<a href=\"tel:9820466726\">Suicide Prevention</a>"
      },
      {
        "tag": "h2",
        "html": "More Questions?"
      },
      {
        "tag": "p",
        "html": "Check our FAQ or contact our support team for more information"
      },
      {
        "tag": "p",
        "html": "<a href=\"/faq\">Visit FAQ</a>"
      },
      {
        "tag": "p",
        "html": "<a href=\"/contact\">Contact Us</a>"
      }
    ]
  },
  "/safety": {
    "blocks": [
      {
        "tag": "p",
        "html": "<a href=\"/\">← Back to Home</a>"
      },
      {
        "tag": "h1",
        "html": "Safety Policy"
      },
      {
        "tag": "p",
        "html": "Last Updated: June 2026"
      },
      {
        "tag": "p",
        "html": "At SoulConnect, your safety and wellbeing are our highest priority. Please read this page carefully so you understand what SoulConnect is, what it is not, and how we keep our community safe."
      },
      {
        "tag": "h2",
        "html": "What SoulConnect Is"
      },
      {
        "tag": "p",
        "html": "SoulConnect is a peer wellness and community support platform designed to help people:"
      },
      {
        "tag": "li",
        "html": "Connect with others experiencing similar life challenges",
        "list": 0,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Share experiences in a safe and supportive environment",
        "list": 0,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Participate in guided wellness activities and reflections",
        "list": 0,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Build meaningful support networks",
        "list": 0,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Access wellness education and community resources",
        "list": 0,
        "ordered": false
      },
      {
        "tag": "p",
        "html": "SoulConnect is a space for connection, healing, and growth — built on compassion, respect, and community."
      },
      {
        "tag": "h2",
        "html": "What SoulConnect Is Not"
      },
      {
        "tag": "p",
        "html": "SoulConnect is not a clinical, medical, or emergency service. We do not provide:"
      },
      {
        "tag": "li",
        "html": "Emergency or crisis intervention services",
        "list": 1,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Medical advice, diagnosis, or treatment",
        "list": 1,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Psychiatric care or psychotherapy",
        "list": 1,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Suicide prevention hotline services",
        "list": 1,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Mental health hospital or inpatient services",
        "list": 1,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Legal or financial advice",
        "list": 1,
        "ordered": false
      },
      {
        "tag": "p",
        "html": "Nothing on SoulConnect should be used as a substitute for professional medical, psychological, or emergency care."
      },
      {
        "tag": "h2",
        "html": "Emergency Situations"
      },
      {
        "tag": "p",
        "html": "If you or someone you know is in immediate danger or experiencing a mental health emergency, please contact emergency services immediately."
      },
      {
        "tag": "p",
        "html": "SoulConnect is not equipped to respond to emergencies. If you are experiencing:"
      },
      {
        "tag": "li",
        "html": "Suicidal thoughts or thoughts of self-harm",
        "list": 2,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "A mental health crisis",
        "list": 2,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "A medical emergency",
        "list": 2,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Immediate danger to yourself or others",
        "list": 2,
        "ordered": false
      },
      {
        "tag": "p",
        "html": "Please call your local emergency services, a crisis hotline, or attend your nearest emergency department immediately."
      },
      {
        "tag": "h2",
        "html": "Community Safety Principles"
      },
      {
        "tag": "p",
        "html": "Every member of the SoulConnect community is expected to uphold these principles:"
      },
      {
        "tag": "li",
        "html": "Respect — honour every person's journey and lived experience",
        "list": 3,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Privacy — what is shared in the community stays within the community",
        "list": 3,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Compassion — lead with empathy and kindness at all times",
        "list": 3,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Non-Judgment — all paths and experiences are valid",
        "list": 3,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Inclusion — everyone belongs here, regardless of background",
        "list": 3,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Honesty — engage authentically and with integrity",
        "list": 3,
        "ordered": false
      },
      {
        "tag": "h2",
        "html": "Unacceptable Behaviour"
      },
      {
        "tag": "p",
        "html": "The following behaviours are not tolerated on SoulConnect:"
      },
      {
        "tag": "li",
        "html": "Harassment, bullying, or threatening behaviour toward any member",
        "list": 4,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Sharing content that promotes self-harm, suicide, or violence",
        "list": 4,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Discrimination based on race, gender, religion, sexuality, disability, or any other characteristic",
        "list": 4,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Sharing personal information of others without consent (doxxing)",
        "list": 4,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Spam, scams, or unsolicited commercial promotion",
        "list": 4,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Impersonation of other members, guides, or staff",
        "list": 4,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Sharing inappropriate, explicit, or harmful content",
        "list": 4,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Any activity that violates applicable laws",
        "list": 4,
        "ordered": false
      },
      {
        "tag": "p",
        "html": "Violations may result in removal from the platform without notice."
      },
      {
        "tag": "h2",
        "html": "Reporting a Concern"
      },
      {
        "tag": "p",
        "html": "If you witness or experience behaviour that violates our safety standards, please report it to us. All reports are handled confidentially."
      },
      {
        "tag": "p",
        "html": "We take every report seriously and aim to review concerns promptly. You can report a concern by contacting us directly at the email below."
      },
      {
        "tag": "p",
        "html": "SoulConnect reserves the right to remove any content or member that poses a risk to the safety and wellbeing of the community."
      },
      {
        "tag": "h2",
        "html": "Contact"
      },
      {
        "tag": "p",
        "html": "For safety-related questions or to report a concern, please contact: <a href=\"mailto:community@soulconnect.health\">community@soulconnect.health</a>"
      },
      {
        "tag": "p",
        "html": "Your safety matters to us. We are committed to maintaining a safe, respectful, and supportive community for everyone."
      }
    ]
  },
  "/contact": {
    "blocks": [
      {
        "tag": "p",
        "html": "<a href=\"/\">Back to Home</a>"
      },
      {
        "tag": "p",
        "html": "Get in touch"
      },
      {
        "tag": "h1",
        "html": "Contact Us"
      },
      {
        "tag": "p",
        "html": "Have a question or want to get in touch? We'd love to hear from you."
      },
      {
        "tag": "p",
        "html": "<a href=\"mailto:community@soulconnect.health\">community@soulconnect.health</a>"
      }
    ]
  },
  "/community-rules": {
    "blocks": [
      {
        "tag": "h1",
        "html": "Community Guidelines"
      },
      {
        "tag": "p",
        "html": "SoulConnect exists to create a safe healing environment where every person feels respected, valued, and free to grow. These guidelines protect that space for everyone."
      },
      {
        "tag": "p",
        "html": "The golden rule: Treat every soul the way you would wish to be treated on your hardest day."
      },
      {
        "tag": "h2",
        "html": "What's Allowed vs. What Isn't"
      },
      {
        "tag": "h3",
        "html": "Encouraged in Our Community"
      },
      {
        "tag": "li",
        "html": "Sharing your personal experiences and emotions",
        "list": 0,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Seeking peer support and connection",
        "list": 0,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Offering encouragement and kind words",
        "list": 0,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Respectful discussion of wellness topics",
        "list": 0,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Celebrating others' healing milestones",
        "list": 0,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Asking questions without judgment",
        "list": 0,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Sharing resources that have helped you",
        "list": 0,
        "ordered": false
      },
      {
        "tag": "h3",
        "html": "Not Allowed — Zero Tolerance"
      },
      {
        "tag": "li",
        "html": "Harassment, bullying, or intimidation",
        "list": 1,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Hate speech or discrimination",
        "list": 1,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Threats of violence or harm",
        "list": 1,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Exploitation or manipulation of vulnerable users",
        "list": 1,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Dangerous medical or wellness advice",
        "list": 1,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Spam, self-promotion, or advertising",
        "list": 1,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Sharing others' private information",
        "list": 1,
        "ordered": false
      },
      {
        "tag": "h2",
        "html": "Specific Policies"
      },
      {
        "tag": "h2",
        "html": "📬 Reporting Process"
      },
      {
        "tag": "p",
        "html": "You can report any user, guide, message, or circle. All reports are reviewed by our moderation team."
      },
      {
        "tag": "p",
        "html": "Report Submitted"
      },
      {
        "tag": "p",
        "html": "You submit a report via the Report page"
      },
      {
        "tag": "p",
        "html": "Moderator Review"
      },
      {
        "tag": "p",
        "html": "Our team reviews your report confidentially"
      },
      {
        "tag": "p",
        "html": "Action Taken"
      },
      {
        "tag": "p",
        "html": "We take appropriate action based on findings"
      },
      {
        "tag": "p",
        "html": "User Notified"
      },
      {
        "tag": "p",
        "html": "You receive confirmation of the outcome"
      },
      {
        "tag": "p",
        "html": "You can report: users · guides · circles · messages"
      },
      {
        "tag": "h3",
        "html": "⚖️ Consequences of Violations"
      },
      {
        "tag": "p",
        "html": "Content Removal"
      },
      {
        "tag": "p",
        "html": "Formal Warning"
      },
      {
        "tag": "p",
        "html": "Temporary Suspension"
      },
      {
        "tag": "p",
        "html": "Permanent Ban"
      },
      {
        "tag": "p",
        "html": "Consequences are determined by severity, intent, and history. We always aim to be fair, transparent, and proportionate."
      }
    ]
  },
  "/report": {
    "blocks": [
      {
        "tag": "h1",
        "html": "Report a Safety Concern"
      },
      {
        "tag": "p",
        "html": "All reports are reviewed by our moderation team. Your identity will be kept confidential."
      }
    ]
  },
  "/guide-terms": {
    "blocks": [
      {
        "tag": "h1",
        "html": "Guide &amp; Healer Agreement"
      },
      {
        "tag": "p",
        "html": "Guides and healers on SoulConnect are independent wellness practitioners. This agreement outlines your responsibilities, the scope of your practice, and our shared commitment to keeping the community safe."
      },
      {
        "tag": "p",
        "html": "Guides are independent practitioners. They are not employees, contractors, or agents of SoulConnect. SoulConnect is a platform that facilitates connection between guides and users."
      },
      {
        "tag": "h2",
        "html": "Scope of Practice — What Guides May Provide"
      },
      {
        "tag": "p",
        "html": "As a guide or healer on SoulConnect, you may offer the following types of support:"
      },
      {
        "tag": "li",
        "html": "Wellness coaching and personal development support",
        "list": 0,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Meditation guidance and mindfulness practices",
        "list": 0,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Breathwork support and stress relief techniques",
        "list": 0,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Emotional support and compassionate listening",
        "list": 0,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Energy healing sessions (Reiki, pranic healing, etc.)",
        "list": 0,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Spiritual guidance and life purpose exploration",
        "list": 0,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Guided relaxation and visualisation",
        "list": 0,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Journaling prompts and self-reflection exercises",
        "list": 0,
        "ordered": false
      },
      {
        "tag": "h2",
        "html": "Guides Must NOT Claim to:"
      },
      {
        "tag": "li",
        "html": "Diagnose any physical or mental illness",
        "list": 1,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Prescribe, recommend, or adjust medication",
        "list": 1,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Provide emergency or crisis intervention",
        "list": 1,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Replace licensed medical, psychiatric, or psychological professionals",
        "list": 1,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Guarantee specific healing outcomes or results",
        "list": 1,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Provide legal, financial, or medical advice",
        "list": 1,
        "ordered": false
      },
      {
        "tag": "h2",
        "html": "No Emergency Support Obligation"
      },
      {
        "tag": "p",
        "html": "Guides are not trained crisis responders and are not responsible for:"
      },
      {
        "tag": "li",
        "html": "Suicide intervention or prevention",
        "list": 2,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Emergency response or safety monitoring",
        "list": 2,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Crisis management or acute mental health support",
        "list": 2,
        "ordered": false
      },
      {
        "tag": "p",
        "html": "If a user expresses thoughts of self-harm or suicide, you must direct them to emergency services or the SoulConnect crisis resources page immediately. Do not attempt to manage this yourself."
      },
      {
        "tag": "h2",
        "html": "Independent Practitioner Agreement"
      },
      {
        "tag": "p",
        "html": "By operating as a guide on SoulConnect, you acknowledge and agree:"
      },
      {
        "tag": "li",
        "html": "You operate as an independent practitioner, not an employee of SoulConnect",
        "list": 3,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "SoulConnect does not supervise, direct, or control your clinical or healing decisions",
        "list": 3,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "You are responsible for maintaining your own qualifications, certifications, and credentials",
        "list": 3,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "You assume all responsibility for the services you provide to users",
        "list": 3,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "You carry your own professional liability insurance where applicable",
        "list": 3,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "SoulConnect reserves the right to remove guides who violate these terms",
        "list": 3,
        "ordered": false
      },
      {
        "tag": "h2",
        "html": "Guide Responsibilities"
      },
      {
        "tag": "p",
        "html": "Professionalism"
      },
      {
        "tag": "p",
        "html": "Conduct all sessions with care, respect, and appropriate boundaries"
      },
      {
        "tag": "p",
        "html": "Privacy"
      },
      {
        "tag": "p",
        "html": "Protect user confidentiality at all times"
      },
      {
        "tag": "p",
        "html": "Helpful Advice Only"
      },
      {
        "tag": "p",
        "html": "Avoid harmful, misleading, or pseudoscientific claims"
      },
      {
        "tag": "p",
        "html": "Stay in Scope"
      },
      {
        "tag": "p",
        "html": "Only offer services within your genuine area of expertise"
      },
      {
        "tag": "p",
        "html": "Refer When Needed"
      },
      {
        "tag": "p",
        "html": "Direct users to professional help when appropriate"
      },
      {
        "tag": "p",
        "html": "Continuous Growth"
      },
      {
        "tag": "p",
        "html": "Maintain and develop your knowledge and practice"
      },
      {
        "tag": "h3",
        "html": "Guide Acknowledgement"
      },
      {
        "tag": "p",
        "html": "By continuing to offer services on SoulConnect, you confirm that you have read, understood, and agree to these terms. You commit to practising safely, ethically, and within your scope."
      }
    ]
  },
  "/privacy": {
    "blocks": [
      {
        "tag": "p",
        "html": "<a href=\"/\">← Back to Home</a>"
      },
      {
        "tag": "h1",
        "html": "Privacy Policy"
      },
      {
        "tag": "p",
        "html": "Effective Date: June 2026"
      },
      {
        "tag": "p",
        "html": "At SoulConnect, your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you visit our website or join our waitlist."
      },
      {
        "tag": "h2",
        "html": "1. About This Policy"
      },
      {
        "tag": "p",
        "html": "This Privacy Policy explains how SoulConnect (\"we\", \"us\", or \"our\") collects, uses, stores, and protects information you provide when using our website or joining our waitlist."
      },
      {
        "tag": "p",
        "html": "By using SoulConnect, you agree to the practices described in this Privacy Policy."
      },
      {
        "tag": "h2",
        "html": "2. Information We Collect"
      },
      {
        "tag": "p",
        "html": "We may collect the following types of information:"
      },
      {
        "tag": "li",
        "html": "Name and email address (when you join the waitlist)",
        "list": 0,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Any additional details you voluntarily provide through forms or communications",
        "list": 0,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Technical data such as IP address, browser type, and device information",
        "list": 0,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Usage data including pages visited and time spent on the site",
        "list": 0,
        "ordered": false
      },
      {
        "tag": "p",
        "html": "We only collect information that is necessary for the purposes described in this policy."
      },
      {
        "tag": "h2",
        "html": "3. How We Use Your Information"
      },
      {
        "tag": "p",
        "html": "We use the information we collect to:"
      },
      {
        "tag": "li",
        "html": "Process and manage your waitlist registration",
        "list": 1,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Send you updates, announcements, and launch information about SoulConnect",
        "list": 1,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Respond to your enquiries and support requests",
        "list": 1,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Improve and develop our platform and services",
        "list": 1,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Comply with legal obligations",
        "list": 1,
        "ordered": false
      },
      {
        "tag": "p",
        "html": "We will never sell your personal information to third parties."
      },
      {
        "tag": "h2",
        "html": "4. Cookies and Tracking"
      },
      {
        "tag": "p",
        "html": "SoulConnect uses cookies and similar tracking technologies to improve your experience on our website."
      },
      {
        "tag": "p",
        "html": "Cookies help us understand how visitors use our site and allow us to make improvements."
      },
      {
        "tag": "li",
        "html": "Essential cookies — required for the website to function correctly",
        "list": 2,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Analytics cookies — help us understand how users interact with our site",
        "list": 2,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Preference cookies — remember your settings and preferences",
        "list": 2,
        "ordered": false
      },
      {
        "tag": "p",
        "html": "You can control cookie settings through your browser at any time. Disabling certain cookies may affect your experience on the site."
      },
      {
        "tag": "h2",
        "html": "5. Third-Party Services"
      },
      {
        "tag": "p",
        "html": "We may use trusted third-party services to help us operate the website and manage our waitlist. These providers are required to handle your data securely and only for the purposes we specify."
      },
      {
        "tag": "p",
        "html": "Third-party services we may use include:"
      },
      {
        "tag": "li",
        "html": "Email delivery providers (for sending waitlist and announcement emails)",
        "list": 3,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Analytics platforms (to understand website usage)",
        "list": 3,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Cloud hosting services (to store data securely)",
        "list": 3,
        "ordered": false
      },
      {
        "tag": "p",
        "html": "We do not authorise third parties to use your data for their own marketing purposes."
      },
      {
        "tag": "h2",
        "html": "6. Data Security"
      },
      {
        "tag": "p",
        "html": "We take the security of your personal information seriously and implement appropriate technical and organisational measures to protect it."
      },
      {
        "tag": "p",
        "html": "Your data is protected through encryption in transit (TLS/SSL) and at rest. We use secure cloud infrastructure with industry-standard access controls."
      },
      {
        "tag": "p",
        "html": "While we strive to protect your data, no method of transmission over the internet is completely secure. We cannot guarantee absolute security but will notify you promptly if a breach occurs that may affect your rights."
      },
      {
        "tag": "h2",
        "html": "6a. DPDPA 2023 Compliance (India)"
      },
      {
        "tag": "p",
        "html": "SoulConnect complies with the Digital Personal Data Protection Act (DPDPA), 2023, India's primary data protection framework."
      },
      {
        "tag": "p",
        "html": "We process personal data fairly, lawfully, and transparently with appropriate consent. Your data is stored on secure Indian data centers where applicable."
      },
      {
        "tag": "p",
        "html": "All personal data including mental health information is treated as sensitive personal data and protected under DPDPA guidelines."
      },
      {
        "tag": "h2",
        "html": "7. Data Retention"
      },
      {
        "tag": "p",
        "html": "We retain your personal information for as long as necessary to fulfil the purposes outlined in this Privacy Policy, or as required by law."
      },
      {
        "tag": "p",
        "html": "If you request removal of your data, we will delete or anonymise your information within a reasonable timeframe, unless we are legally required to retain it."
      },
      {
        "tag": "h2",
        "html": "8. Your Rights"
      },
      {
        "tag": "p",
        "html": "Depending on your location, you may have the following rights regarding your personal information:"
      },
      {
        "tag": "li",
        "html": "The right to access the information we hold about you",
        "list": 4,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "The right to correct inaccurate or incomplete information",
        "list": 4,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "The right to request deletion of your personal data",
        "list": 4,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "The right to withdraw consent at any time",
        "list": 4,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "The right to opt out of marketing communications",
        "list": 4,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "The right to lodge a complaint with a data protection authority",
        "list": 4,
        "ordered": false
      },
      {
        "tag": "p",
        "html": "To exercise any of these rights, please contact us at community@soulconnect.health."
      },
      {
        "tag": "h2",
        "html": "9. Children's Privacy"
      },
      {
        "tag": "p",
        "html": "SoulConnect is intended for users who are 18 years of age or older."
      },
      {
        "tag": "p",
        "html": "We do not knowingly collect personal information from individuals under the age of 18. If we become aware that a minor has provided us with personal information, we will take steps to delete it promptly."
      },
      {
        "tag": "h2",
        "html": "10. Links to Other Websites"
      },
      {
        "tag": "p",
        "html": "Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those websites."
      },
      {
        "tag": "p",
        "html": "We encourage you to review the privacy policies of any external sites you visit."
      },
      {
        "tag": "h2",
        "html": "11. Updates to This Policy"
      },
      {
        "tag": "p",
        "html": "We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons."
      },
      {
        "tag": "p",
        "html": "Any updates will be posted on this page with a revised effective date. We encourage you to review this policy periodically."
      },
      {
        "tag": "h2",
        "html": "12. Governing Law"
      },
      {
        "tag": "p",
        "html": "This Privacy Policy is governed by the laws applicable in the jurisdiction where SoulConnect operates."
      },
      {
        "tag": "h2",
        "html": "Contact"
      },
      {
        "tag": "p",
        "html": "For questions, requests, or concerns regarding this Privacy Policy, please contact: <a href=\"mailto:community@soulconnect.health\">community@soulconnect.health</a>"
      },
      {
        "tag": "p",
        "html": "We are committed to protecting your privacy and will respond to your enquiry as promptly as possible."
      }
    ]
  },
  "/terms": {
    "blocks": [
      {
        "tag": "p",
        "html": "<a href=\"/\">← Back to Home</a>"
      },
      {
        "tag": "h1",
        "html": "Terms &amp; Conditions"
      },
      {
        "tag": "p",
        "html": "Effective Date: June 2026"
      },
      {
        "tag": "p",
        "html": "Welcome to SoulConnect. By accessing our website, joining the waitlist, or interacting with our platform, you agree to these Terms &amp; Conditions. If you do not agree with these Terms, please do not use the website."
      },
      {
        "tag": "h2",
        "html": "1. About SoulConnect"
      },
      {
        "tag": "p",
        "html": "SoulConnect is an early-stage community platform currently in development."
      },
      {
        "tag": "p",
        "html": "Our mission is to help people connect with others experiencing similar life challenges, share experiences, participate in guided wellness activities, and build meaningful support networks."
      },
      {
        "tag": "p",
        "html": "At this stage, SoulConnect primarily operates as a waitlist and informational platform while future features are being developed."
      },
      {
        "tag": "h2",
        "html": "2. Eligibility"
      },
      {
        "tag": "p",
        "html": "You must be at least 18 years old to use SoulConnect or join the waitlist."
      },
      {
        "tag": "p",
        "html": "By using the website, you confirm that you meet this requirement."
      },
      {
        "tag": "h2",
        "html": "3. Waitlist Participation"
      },
      {
        "tag": "p",
        "html": "Joining the SoulConnect waitlist does not guarantee:"
      },
      {
        "tag": "li",
        "html": "Access to future platform features",
        "list": 0,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Membership approval",
        "list": 0,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Specific launch dates",
        "list": 0,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Pricing or subscription terms",
        "list": 0,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Availability in all locations",
        "list": 0,
        "ordered": false
      },
      {
        "tag": "p",
        "html": "SoulConnect may modify, delay, or discontinue features at any time."
      },
      {
        "tag": "h2",
        "html": "4. Acceptable Use"
      },
      {
        "tag": "p",
        "html": "You agree not to:"
      },
      {
        "tag": "li",
        "html": "Violate any applicable laws",
        "list": 1,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Attempt unauthorized access to the website",
        "list": 1,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Interfere with website functionality",
        "list": 1,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Submit false or misleading information",
        "list": 1,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Use the platform for spam or fraudulent activity",
        "list": 1,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Upload harmful code, malware, or malicious content",
        "list": 1,
        "ordered": false
      },
      {
        "tag": "h2",
        "html": "5. Wellness Information Disclaimer"
      },
      {
        "tag": "p",
        "html": "Content provided on SoulConnect is intended for informational, educational, and community-support purposes only."
      },
      {
        "tag": "p",
        "html": "Nothing on this website should be considered:"
      },
      {
        "tag": "li",
        "html": "Medical advice",
        "list": 2,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Psychological advice",
        "list": 2,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Mental health treatment",
        "list": 2,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Psychiatric care",
        "list": 2,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Legal advice",
        "list": 2,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Financial advice",
        "list": 2,
        "ordered": false
      },
      {
        "tag": "p",
        "html": "Always seek guidance from qualified professionals regarding your individual circumstances."
      },
      {
        "tag": "h2",
        "html": "6. Emergency Situations"
      },
      {
        "tag": "p",
        "html": "SoulConnect is not an emergency service."
      },
      {
        "tag": "p",
        "html": "If you are experiencing:"
      },
      {
        "tag": "li",
        "html": "Suicidal thoughts",
        "list": 3,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Thoughts of self-harm",
        "list": 3,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "A mental health crisis",
        "list": 3,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "A medical emergency",
        "list": 3,
        "ordered": false
      },
      {
        "tag": "p",
        "html": "Please contact local emergency services, a crisis hotline, or a qualified healthcare professional immediately."
      },
      {
        "tag": "h2",
        "html": "7. Intellectual Property"
      },
      {
        "tag": "p",
        "html": "All SoulConnect content, branding, logos, graphics, text, designs, and website materials are owned by SoulConnect and protected by applicable intellectual property laws."
      },
      {
        "tag": "p",
        "html": "You may not reproduce, distribute, modify, or commercially exploit any content without prior written permission."
      },
      {
        "tag": "h2",
        "html": "8. Privacy"
      },
      {
        "tag": "p",
        "html": "Information submitted through the website, including waitlist registrations, is handled in accordance with our Privacy Policy."
      },
      {
        "tag": "p",
        "html": "By joining the waitlist, you consent to receiving communications related to SoulConnect updates, announcements, and launch information."
      },
      {
        "tag": "p",
        "html": "You may unsubscribe from communications at any time."
      },
      {
        "tag": "h2",
        "html": "9. No Guarantees"
      },
      {
        "tag": "p",
        "html": "SoulConnect makes no guarantees regarding:"
      },
      {
        "tag": "li",
        "html": "Future platform availability",
        "list": 4,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Specific features",
        "list": 4,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Community outcomes",
        "list": 4,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Wellness outcomes",
        "list": 4,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Personal results",
        "list": 4,
        "ordered": false
      },
      {
        "tag": "p",
        "html": "Any future testimonials or success stories represent individual experiences and may not reflect typical results."
      },
      {
        "tag": "h2",
        "html": "10. Limitation of Liability"
      },
      {
        "tag": "p",
        "html": "To the maximum extent permitted by law, SoulConnect shall not be liable for any direct, indirect, incidental, consequential, or special damages arising from:"
      },
      {
        "tag": "li",
        "html": "Use of the website",
        "list": 5,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Reliance on website content",
        "list": 5,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Website interruptions",
        "list": 5,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Technical errors",
        "list": 5,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Future platform participation",
        "list": 5,
        "ordered": false
      },
      {
        "tag": "p",
        "html": "Your use of SoulConnect is at your own risk."
      },
      {
        "tag": "h2",
        "html": "11. Changes to These Terms"
      },
      {
        "tag": "p",
        "html": "SoulConnect may update these Terms &amp; Conditions from time to time."
      },
      {
        "tag": "p",
        "html": "Any updates will be posted on this page with a revised effective date."
      },
      {
        "tag": "p",
        "html": "Continued use of the website constitutes acceptance of the updated Terms."
      },
      {
        "tag": "h2",
        "html": "12. Governing Law"
      },
      {
        "tag": "p",
        "html": "These Terms shall be governed and interpreted in accordance with the laws applicable in the jurisdiction where SoulConnect operates."
      },
      {
        "tag": "h2",
        "html": "Contact"
      },
      {
        "tag": "p",
        "html": "For questions regarding these Terms &amp; Conditions, please contact: <a href=\"mailto:community@soulconnect.health\">community@soulconnect.health</a>"
      },
      {
        "tag": "p",
        "html": "We appreciate your interest in SoulConnect and thank you for being part of our early community."
      }
    ]
  },
  "/cookies": {
    "blocks": [
      {
        "tag": "p",
        "html": "<a href=\"/\">← Back to Home</a>"
      },
      {
        "tag": "h1",
        "html": "Cookie Policy"
      },
      {
        "tag": "p",
        "html": "Last updated: June 2026"
      },
      {
        "tag": "h2",
        "html": "1. What Are Cookies"
      },
      {
        "tag": "p",
        "html": "Cookies are small text files placed on your device by websites you visit. They are widely used to make websites work more efficiently and to provide information to site owners."
      },
      {
        "tag": "h2",
        "html": "2. How We Use Cookies"
      },
      {
        "tag": "p",
        "html": "SoulConnect uses a minimal set of cookies strictly necessary for the platform to function. We do not use advertising cookies or cross-site tracking cookies."
      },
      {
        "tag": "li",
        "html": "Session cookies — to keep you logged in during your visit",
        "list": 0,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Security cookies — to protect against cross-site request forgery (CSRF)",
        "list": 0,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Preference cookies — to remember your theme and language settings",
        "list": 0,
        "ordered": false
      },
      {
        "tag": "h2",
        "html": "3. Cookies We Do NOT Use"
      },
      {
        "tag": "li",
        "html": "Advertising or retargeting cookies",
        "list": 1,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Third-party analytics cookies that track you across websites",
        "list": 1,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Social media tracking pixels",
        "list": 1,
        "ordered": false
      },
      {
        "tag": "h2",
        "html": "4. Third-Party Cookies"
      },
      {
        "tag": "p",
        "html": "We may use limited third-party services (such as error monitoring) that may set their own cookies. These are used only for platform stability and do not track your personal wellness activity."
      },
      {
        "tag": "h2",
        "html": "5. Managing Cookies"
      },
      {
        "tag": "p",
        "html": "You can control and delete cookies through your browser settings. Note that disabling certain cookies may affect the functionality of SoulConnect, including the ability to stay logged in."
      },
      {
        "tag": "h2",
        "html": "6. Contact"
      },
      {
        "tag": "p",
        "html": "If you have questions about our use of cookies, please contact us at privacy@soulconnect.health"
      },
      {
        "tag": "p",
        "html": "<a href=\"/terms\">Privacy Policy</a>"
      },
      {
        "tag": "p",
        "html": "<a href=\"/terms\">Terms of Service</a>"
      },
      {
        "tag": "p",
        "html": "<a href=\"/safety\">Safety Policy</a>"
      }
    ]
  },
  "/accessibility": {
    "blocks": [
      {
        "tag": "p",
        "html": "<a href=\"/\">← Back to Home</a>"
      },
      {
        "tag": "h1",
        "html": "Accessibility Statement"
      },
      {
        "tag": "p",
        "html": "Last Updated: June 2026"
      },
      {
        "tag": "p",
        "html": "At SoulConnect, we believe that support, connection, and healing should be accessible to everyone. We are committed to improving the accessibility of our platform and creating an inclusive experience for all users."
      },
      {
        "tag": "h2",
        "html": "Our Commitment"
      },
      {
        "tag": "p",
        "html": "We are working toward conformance with the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA and continuously review our platform to identify and address accessibility barriers."
      },
      {
        "tag": "h2",
        "html": "Accessibility Features"
      },
      {
        "tag": "p",
        "html": "SoulConnect currently includes:"
      },
      {
        "tag": "li",
        "html": "Semantic HTML structure and logical heading hierarchy",
        "list": 0,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Keyboard-accessible navigation and interactive elements",
        "list": 0,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Visible focus indicators",
        "list": 0,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Responsive layouts across devices and screen sizes",
        "list": 0,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Alternative text for meaningful images",
        "list": 0,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "ARIA labels where appropriate",
        "list": 0,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Support for browser and operating system text scaling",
        "list": 0,
        "ordered": false
      },
      {
        "tag": "li",
        "html": "Colour contrast considerations for readability",
        "list": 0,
        "ordered": false
      },
      {
        "tag": "h2",
        "html": "Ongoing Improvements"
      },
      {
        "tag": "p",
        "html": "SoulConnect is an early-stage platform and accessibility is an ongoing priority. We regularly review feedback and make improvements as the platform evolves."
      },
      {
        "tag": "h2",
        "html": "Report an Accessibility Issue"
      },
      {
        "tag": "p",
        "html": "If you experience difficulty accessing any part of SoulConnect or would like to suggest an improvement, we encourage you to contact us."
      },
      {
        "tag": "p",
        "html": "We aim to acknowledge accessibility-related requests within 5 business days."
      },
      {
        "tag": "h2",
        "html": "Contact"
      },
      {
        "tag": "p",
        "html": "Email: <a href=\"mailto:community@soulconnect.health\">community@soulconnect.health</a>"
      },
      {
        "tag": "p",
        "html": "We welcome your feedback and appreciate your help in making SoulConnect more accessible for everyone."
      }
    ]
  }
};
