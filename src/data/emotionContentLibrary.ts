/**
 * emotionContentLibrary.ts
 *
 * Comprehensive content for all 25 emotion categories.
 *
 * Each emotion includes:
 * - SEO metadata
 * - Hero section
 * - Quick summary
 * - Relatable experiences
 * - Common situations
 * - Practical tips
 * - Reflection questions
 * - When to seek support
 * - Related categories
 * - FAQ
 *
 * Content is evidence-informed, human-centered, and compassionate.
 */

export interface EmotionContent {
  slug: string;
  displayName: string;

  // SEO Metadata
  seo: {
    title: string;
    description: string;
    openGraph: {
      title: string;
      description: string;
    };
    keywords: string[];
  };

  // Hero Section
  hero: {
    title: string;
    subtitle: string;
  };

  // Quick Summary (max 120 words)
  summary: string;

  // 6-8 relatable experiences
  relatable: string[];

  // 6-10 common situations
  situations: string[];

  // Practical tips for today
  tips: string[];

  // Reflection questions
  reflectionQuestions: string[];

  // When to seek professional support
  whenToSeekSupport: string;

  // Related emotion categories
  relatedCategories: string[];

  // FAQ (8 questions)
  faq: {
    question: string;
    answer: string;
  }[];

  // Trust & Safety
  trustSafety: {
    disclaimer: string;
    lastReviewedDate: string;
  };
}

export const emotionContentLibrary: EmotionContent[] = [
  // 1. ANXIETY
  {
    slug: 'anxiety',
    displayName: 'Anxiety',
    seo: {
      title: 'Anxiety Support & Coping Strategies | Feeling Worried? Connect Here',
      description: 'Understand anxiety, recognize triggers, and discover practical ways to calm your mind. Connect with others who get it on SoulConnect.',
      openGraph: {
        title: 'Anxiety Support | You\'re Not Alone',
        description: 'Learn to manage worry, panic, and anxious thoughts with evidence-based strategies.',
      },
      keywords: ['anxiety help', 'manage anxiety', 'anxiety support', 'anxious thoughts', 'worry management', 'panic relief'],
    },
    hero: {
      title: 'Feeling worried or on edge?',
      subtitle: 'Anxiety can make your thoughts race, your chest tighten, and everyday situations feel overwhelming. If you\'ve been carrying that weight, you\'re not alone.',
    },
    summary: 'Anxiety is a normal emotion that everyone experiences, but when worry becomes constant and affects your daily life, it deserves attention. Anxiety can feel like racing thoughts, physical tension, or a sense of dread. The good news: anxiety is treatable, manageable, and many people learn to live well with it.',
    relatable: [
      'Your mind races with "what if" thoughts, even at night',
      'You feel tension in your chest, shoulders, or stomach',
      'You worry about things that might never happen',
      'You avoid certain situations because they make you anxious',
      'You check your phone repeatedly for messages',
      'Your heart feels like it\'s racing for no clear reason',
      'You struggle to relax even when nothing\'s wrong',
      'Others tell you to "just calm down," which makes you feel worse',
    ],
    situations: [
      'Starting a new job or school',
      'Speaking in front of groups',
      'Health concerns or medical appointments',
      'Relationship worries',
      'Financial stress',
      'Uncertainty about the future',
      'Social gatherings or meeting new people',
      'Flying or driving on highways',
    ],
    tips: [
      'Try the 5-4-3-2-1 grounding technique: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste',
      'Take slow, deep breaths—try breathing in for 4 counts, holding for 4, exhaling for 6',
      'Move your body: take a walk, do some stretches, or dance to music',
      'Limit caffeine and screens 1-2 hours before bed',
      'Write down your worries, then deliberately set them aside',
      'Spend 10 minutes doing something that brings you calm',
      'Connect with someone you trust—call a friend or family member',
      'Practice one small thing you\'re anxious about (gradual exposure helps)',
    ],
    reflectionQuestions: [
      'When does your anxiety tend to show up most? Morning, evening, or specific situations?',
      'What physical sensations do you notice when anxiety arrives?',
      'What\'s one worry that keeps returning? Can you separate what you can control from what you can\'t?',
      'Who in your life makes you feel safe and understood?',
      'What activity or place has ever made you feel calm?',
    ],
    whenToSeekSupport: 'Consider speaking with a mental health professional if: anxiety is interfering with work, school, or relationships; you\'re having panic attacks; you\'re using alcohol or substances to cope; anxiety persists despite trying coping strategies; or you\'re having thoughts of harming yourself.',
    relatedCategories: ['overthinking', 'stress', 'loneliness', 'panic-attacks', 'sleep-issues', 'depression', 'relationship-issues'],
    faq: [
      {
        question: 'Is anxiety the same as panic attacks?',
        answer: 'Anxiety and panic are related but different. Anxiety is a persistent worry or tension. Panic attacks are sudden, intense bursts of fear with physical symptoms like racing heart or difficulty breathing. You can have anxiety without panic attacks, and vice versa.',
      },
      {
        question: 'Why does anxiety make my heart race?',
        answer: 'When you\'re anxious, your body releases stress hormones (adrenaline) to prepare you for danger. Your heart beats faster, breathing quickens, and muscles tense. This is helpful in real danger, but with anxiety, your brain perceives a threat that may not exist.',
      },
      {
        question: 'Can I have anxiety and still function?',
        answer: 'Absolutely. Many people have anxiety and live full, meaningful lives. They work, have relationships, pursue hobbies, and achieve goals. Anxiety is challenging, but it doesn\'t have to define you or stop you.',
      },
      {
        question: 'Is anxiety permanent?',
        answer: 'Anxiety is not permanent. With proper support—whether through therapy, lifestyle changes, or professional treatment—people learn to manage and reduce anxiety. Recovery looks different for everyone.',
      },
      {
        question: 'What\'s the difference between worry and anxiety?',
        answer: 'Worry is thinking about what might go wrong (mainly mental). Anxiety includes worry plus physical symptoms and avoidance behaviors. Worry is normal; anxiety that disrupts your life deserves support.',
      },
      {
        question: 'Does exercise really help with anxiety?',
        answer: 'Yes. Exercise reduces stress hormones, releases endorphins (natural mood boosters), and helps your body process anxiety. You don\'t need intense exercise—even a 20-minute walk helps.',
      },
      {
        question: 'Should I avoid the things that make me anxious?',
        answer: 'Avoidance might feel safer in the moment, but it reinforces anxiety. With support, gradually facing fears (in manageable steps) actually reduces anxiety over time. This is called exposure therapy.',
      },
      {
        question: 'Can I manage anxiety without medication?',
        answer: 'Many people do—through therapy, breathing exercises, lifestyle changes, and support. Others benefit from medication. Some use both. There\'s no one-size-fits-all answer. Talk to a professional about what\'s right for you.',
      },
    ],
    trustSafety: {
      disclaimer: 'This content is educational and not a substitute for professional mental health care. If you\'re in crisis, contact a crisis helpline or emergency services.',
      lastReviewedDate: '2025-02-15',
    },
  },

  // 2. DEPRESSION
  {
    slug: 'depression',
    displayName: 'Depression',
    seo: {
      title: 'Depression Support & Hope | Feeling Empty or Hopeless? Get Help',
      description: 'Understand depression, recognize signs of low mood, and discover ways to reconnect with life. You\'re not broken. Connect with supportive peers.',
      openGraph: {
        title: 'Depression Support | There\'s Hope',
        description: 'Learn about depression and discover practical ways to feel better.',
      },
      keywords: ['depression help', 'feeling depressed', 'low mood', 'hopelessness', 'depression support', 'mental health'],
    },
    hero: {
      title: 'Feeling empty, hopeless, or stuck?',
      subtitle: 'Depression is more than sadness. It\'s a weight that makes everything harder. Many people experience it, and many recover. There\'s hope.',
    },
    summary: 'Depression is a persistent low mood that affects how you think, feel, and function. It\'s not a sign of weakness or failure. Depression can drain your energy, make joy feel impossible, and make you question your worth. The key difference from sadness: depression lasts weeks or months and disrupts your daily life. The hopeful truth: depression is treatable, and people recover.',
    relatable: [
      'Nothing feels enjoyable anymore, even things you used to love',
      'You feel exhausted even after sleeping',
      'Thoughts like "I\'m useless" or "People would be better off without me" feel true',
      'You withdraw from friends and family',
      'Simple tasks like showering or eating feel overwhelming',
      'Everything feels gray and pointless',
      'You sleep too much or can\'t sleep at all',
      'Your motivation has disappeared',
    ],
    situations: [
      'After a major loss or breakup',
      'Major life changes or transitions',
      'Chronic illness or pain',
      'Job loss or career setbacks',
      'Isolation or loneliness',
      'Seasonal changes (winter depression)',
      'Grief after a death',
      'Accumulation of stress over time',
    ],
    tips: [
      'Start tiny: do one small thing today that brings slight comfort',
      'Move your body, even if it\'s just a 10-minute walk or gentle stretch',
      'Reach out to one person—a friend, family member, or helpline',
      'Maintain basic routines: eat, drink water, change clothes',
      'Limit negative self-talk—if you\'re not kind to yourself, be neutral instead',
      'Spend a few minutes outside in sunlight (vitamin D helps mood)',
      'Spend a few quiet minutes reflecting on your feelings without judging yourself',
      'Do one thing you used to enjoy, even if it doesn\'t feel fun yet',
    ],
    reflectionQuestions: [
      'When did you first notice this low mood? Was there a trigger or did it creep in gradually?',
      'What small thing, if anything, has brought you a moment of relief?',
      'Who in your life could you tell you\'re struggling?',
      'What does depression tell you about yourself? Is that true?',
      'If you could do one thing differently tomorrow, what would it be?',
    ],
    whenToSeekSupport: 'Seek professional help if: low mood persists for more than 2 weeks; you\'re having thoughts of suicide or self-harm; depression is affecting work, school, or relationships; you\'re using substances to cope; or you feel hopeless about the future. If you\'re having suicidal thoughts, reach out to a crisis helpline immediately.',
    relatedCategories: ['overthinking', 'loneliness', 'burnout', 'grief', 'sleep-issues', 'anxiety', 'low-self-esteem'],
    faq: [
      {
        question: 'Is depression the same as sadness?',
        answer: 'Sadness is a normal response to loss or difficult events. Depression is different—it\'s a persistent low mood that lasts weeks or months and affects how you function. You can be sad and still enjoy things; depression often removes the ability to feel joy.',
      },
      {
        question: 'Did I do something to cause my depression?',
        answer: 'Depression isn\'t caused by one thing. It can result from brain chemistry, life circumstances, loss, stress, genetics, or a combination. Depression isn\'t your fault. It\'s not a failure or weakness.',
      },
      {
        question: 'Will I feel this way forever?',
        answer: 'No. Depression is treatable. People recover with therapy, medication, lifestyle changes, or a combination. Recovery takes time and varies for everyone, but hopelessness is a symptom of depression, not reality.',
      },
      {
        question: 'Should I wait it out or get help?',
        answer: 'If depression lasts more than 2 weeks and affects your life, get professional support. Waiting can deepen depression. Early intervention helps. You don\'t have to suffer alone.',
      },
      {
        question: 'What if therapy doesn\'t work?',
        answer: 'Different therapies work for different people. If one approach doesn\'t help, try a different therapist or style. Medication is also an option. Finding what works might take time, but persistence pays off.',
      },
      {
        question: 'Can exercise really help depression?',
        answer: 'Exercise is powerful for depression. Physical activity releases endorphins, improves sleep, and gives a sense of accomplishment. Even 20-30 minutes of movement a few times weekly helps.',
      },
      {
        question: 'Is depression a sign of weakness?',
        answer: 'No. Depression doesn\'t mean you\'re weak, broken, or failing. It\'s a health condition. The strength is in acknowledging it and asking for help.',
      },
      {
        question: 'What if I don\'t want to be alive but I\'m not actively suicidal?',
        answer: 'These thoughts can be a symptom of depression and are a sign that you deserve support. Please consider reaching out to a mental health professional, a trusted person, or local emergency services.',
      },
    ],
    trustSafety: {
      disclaimer: 'This content is educational and not a substitute for professional mental health care. If you\'re having thoughts of suicide, contact a crisis helpline or emergency services immediately.',
      lastReviewedDate: '2025-02-15',
    },
  },

  // 3. GRIEF & LOSS
  {
    slug: 'grief',
    displayName: 'Grief',
    seo: {
      title: 'Grief Support & Bereavement | Processing Loss & Mourning',
      description: 'Grief is love with nowhere to go. Navigate your loss with compassion. Connect with others who understand what you\'re going through.',
      openGraph: {
        title: 'Grief Support | Your Loss Matters',
        description: 'Process grief and honor your loss with compassionate support.',
      },
      keywords: ['grief support', 'bereavement', 'losing someone', 'mourning', 'processing loss', 'death of loved one'],
    },
    hero: {
      title: 'Grieving someone you lost?',
      subtitle: 'Grief is the price we pay for love. There\'s no "right way" to grieve. Your loss is real, your pain is valid, and healing is possible.',
    },
    summary: 'Grief is the emotional response to loss—whether death, breakup, relocation, or life change. It\'s not linear. You might feel sadness, anger, guilt, numbness, or unexpected moments of peace, often all in one day. Grief isn\'t something to "get over"; it\'s something to integrate. Over time, the sharp pain often softens, though missing someone never completely goes away.',
    relatable: [
      'You forget they\'re gone, then remember all over again',
      'Certain songs, places, or smells bring overwhelming sadness',
      'You feel angry at them for leaving, even though you know that doesn\'t make sense',
      'You wonder if they\'d be proud of you now',
      'Holidays and birthdays feel especially hard',
      'You catch yourself reaching for your phone to tell them something',
      'Some days grief feels fresh; other days it\'s background sadness',
      'You feel guilty for laughing or having fun',
    ],
    situations: [
      'Death of a loved one',
      'End of a long relationship or breakup',
      'Moving away from a place or community',
      'Loss of a job or career',
      'Diagnosis of a chronic illness',
      'Aging and loss of independence',
      'Loss of a friendship',
      'Unexpected life changes',
    ],
    tips: [
      'Honor their memory in a way that feels right: write, create, plant something, donate',
      'Talk about them—share memories with people who knew them',
      'Let yourself feel whatever comes up; grief isn\'t one emotion',
      'Do something physical: walk, cry, punch a pillow—let grief move through your body',
      'Create a ritual: light a candle, write a letter, visit a meaningful place',
      'Be gentle with yourself on hard days—anniversaries, holidays, random moments',
      'Connect with others who\'ve experienced loss; you\'re not alone',
      'Write an unsent letter to the person you\'re missing',
    ],
    reflectionQuestions: [
      'What\'s one memory of them that brings a smile?',
      'What do you miss most about them?',
      'What would they want for you right now?',
      'How has this loss changed you?',
      'What would honoring their memory look like for you?',
    ],
    whenToSeekSupport: 'Consider professional support if: grief is intensifying after months; you\'re having thoughts of suicide; you\'re using substances to cope; you feel completely isolated; or grief is preventing basic self-care. If grief continues to feel overwhelming for a long period of time or makes daily life difficult, professional support can help.',
    relatedCategories: ['depression', 'anxiety', 'emotional-exhaustion', 'loneliness', 'guilt'],
    faq: [
      {
        question: 'How long should grief last?',
        answer: 'There\'s no timeline. Grief is individual and complex. Some people feel intense grief for weeks, others for years. The acute pain often softens after weeks or months, but missing someone can last a lifetime. That\'s normal and okay.',
      },
      {
        question: 'Is it wrong to laugh or feel happy while grieving?',
        answer: 'No. Grief is complex. You can miss someone deeply and still laugh, enjoy moments, or feel happiness. These aren\'t contradictions—they\'re part of being human. You don\'t have to grieve in a particular way.',
      },
      {
        question: 'Should I keep their belongings or let go?',
        answer: 'There\'s no right answer. Some people find comfort keeping certain items. Others find closure in letting go. Do what feels right for you, in your own timeline. Some people keep one meaningful item and donate the rest.',
      },
      {
        question: 'How do I handle the "firsts" after their death?',
        answer: 'First holidays, birthdays, and anniversaries can be especially hard. Plan ahead: spend time with supportive people, create a ritual, or stay busy if that helps. Be gentle with yourself. Firsts are hard.',
      },
      {
        question: 'Is grief a sign of weakness?',
        answer: 'No. Grief is evidence of love. The depth of your grief reflects how much you cared. Grieving fully and asking for support is strength, not weakness.',
      },
      {
        question: 'What if I feel nothing?',
        answer: 'Numbness is a common grief response, especially right after loss. Your mind protects you from overwhelming pain. As numbness fades, emotions often emerge. This is normal.',
      },
      {
        question: 'Should I go to a grief support group?',
        answer: 'Support groups can be powerful—hearing others\' stories, feeling less alone, getting practical advice. Some find them invaluable; others prefer individual therapy. Try what feels right for you.',
      },
      {
        question: 'How do I move forward without forgetting?',
        answer: 'Moving forward doesn\'t mean forgetting. It means integrating the loss into your life. You can honor their memory, share their story, and build a life that includes the absence they left behind.',
      },
    ],
    trustSafety: {
      disclaimer: 'This content is supportive, not therapeutic. If grief is overwhelming or you\'re having thoughts of self-harm, seek professional help from a grief counselor or therapist.',
      lastReviewedDate: '2025-02-15',
    },
  },

  // 4. STRESS
  {
    slug: 'stress',
    displayName: 'Stress',
    seo: {
      title: 'Stress Management & Relief | Overwhelmed by Pressure?',
      description: 'Manage work stress, life pressure, and burnout. Learn practical ways to reduce stress and reclaim your peace. You don\'t have to carry everything.',
      openGraph: {
        title: 'Stress Relief | Breathe Again',
        description: 'Discover ways to manage stress and pressure in your life.',
      },
      keywords: ['stress management', 'stress relief', 'managing pressure', 'overwhelm', 'burnout prevention', 'work stress'],
    },
    hero: {
      title: 'Feeling overwhelmed by pressure?',
      subtitle: 'Stress is your body\'s response to demands. Some stress is normal; too much stress exhausts you. You have more control than you think.',
    },
    summary: 'Feeling overwhelmed, tense, or constantly under pressure? Stress is your body and mind\'s reaction to pressure—work deadlines, relationship conflicts, financial worries, or life changes. A little stress can motivate you. Too much stress overwhelms your system. Physical symptoms can include muscle tension, headaches, fatigue, digestive issues, and trouble sleeping. Emotional symptoms include irritability, worry, and exhaustion. The good news: stress is manageable with awareness and action.',
    relatable: [
      'You feel tension in your neck, shoulders, or jaw',
      'Your mind races with everything you need to do',
      'You\'re irritable with people you love',
      'You can\'t relax even when you have free time',
      'Sleep is disrupted by racing thoughts',
      'You\'ve stopped doing things you enjoy',
      'Everything feels urgent and important',
      'You forget things because your mind is scattered',
    ],
    situations: [
      'Work deadlines and performance pressure',
      'Financial worries or unexpected bills',
      'Family conflict or caregiving responsibilities',
      'Major life changes (moving, new job, relationship changes)',
      'Health concerns',
      'Balancing multiple responsibilities',
      'Perfectionism and high standards',
      'Uncertainty about the future',
    ],
    tips: [
      'Take 5 minutes for deep breathing—in through nose, out through mouth',
      'Move your body: walk, dance, stretch, exercise',
      'Identify what you can control vs. what you can\'t; let go of what you can\'t',
      'Break big tasks into smaller, manageable steps',
      'Say no to things that don\'t align with your priorities',
      'Spend time in nature—even 15 minutes reduces stress hormones',
      'Connect with people who support you',
      'Do something enjoyable today, even for 10 minutes',
    ],
    reflectionQuestions: [
      'What\'s causing the most stress right now?',
      'Which stressors can you influence or change? Which are beyond your control?',
      'What helps you feel calm? When did you last do it?',
      'What would it look like to let go of one thing?',
      'What small relief could you give yourself today?',
    ],
    whenToSeekSupport: 'Seek help if: stress is affecting your health, relationships, or ability to function; you\'re having panic symptoms; you\'re using alcohol or substances to cope; stress doesn\'t improve with basic self-care; or you feel hopeless.',
    relatedCategories: ['loneliness', 'overthinking', 'burnout', 'grief', 'anxiety', 'sleep-issues', 'low-self-esteem', 'relationship-issues'],
    faq: [
      {
        question: 'Is all stress bad?',
        answer: 'No. Some stress (called eustress) motivates you—like preparing for an important presentation or athletic competition. It\'s chronic, overwhelming stress that\'s harmful. Finding your optimal stress level is key.',
      },
      {
        question: 'How do I know if my stress is serious?',
        answer: 'Stress is serious if it\'s affecting sleep, relationships, health, work performance, or mental well-being for weeks. If you\'re having chest pain, persistent headaches, or thoughts of harming yourself, seek medical help.',
      },
      {
        question: 'Can stress cause physical illness?',
        answer: 'Yes. Chronic stress weakens immunity, raises blood pressure, contributes to heart disease, and exacerbates many conditions. Stress management is preventive health care.',
      },
      {
        question: 'Why doesn\'t relaxation help my stress?',
        answer: 'Relaxation helps short-term but not if the stressor persists. Addressing the stressor itself—setting boundaries, problem-solving, getting support—is essential alongside relaxation.',
      },
      {
        question: 'Should I quit my stressful job?',
        answer: 'Not necessarily. Some stress is normal in any job. Consider: Is this job sustainable? What specifically is stressful? What would improve? Sometimes boundary-setting, a conversation with your boss, or therapy helps. Sometimes a change is needed.',
      },
      {
        question: 'How much exercise helps with stress?',
        answer: '30 minutes of moderate exercise most days is ideal. Even 10-20 minutes helps. Consistency matters more than intensity. Find something you enjoy so you\'ll stick with it.',
      },
      {
        question: 'Is meditation the only way to manage stress?',
        answer: 'No. Meditation helps many people, but so do exercise, creative activities, time in nature, social connection, good sleep, and talking about stress. Find what works for you.',
      },
      {
        question: 'Can I eliminate stress completely?',
        answer: 'No. Stress is part of life. The goal isn\'t zero stress but sustainable stress—enough to motivate you, not so much that it harms you. Learning to manage stress is a lifelong skill.',
      },
    ],
    trustSafety: {
      disclaimer: 'This content is educational. For serious health concerns related to stress, consult a healthcare provider.',
      lastReviewedDate: '2025-02-15',
    },
  },

  // 5. LONELINESS
  {
    slug: 'loneliness',
    displayName: 'Loneliness',
    seo: {
      title: 'Loneliness Support & Connection | Feeling Isolated?',
      description: 'Loneliness is painful but treatable. Discover ways to build meaningful connections and combat isolation. You deserve to belong.',
      openGraph: {
        title: 'Loneliness Support | You\'re Not Alone',
        description: 'Overcome loneliness and build meaningful connections.',
      },
      keywords: ['loneliness support', 'feeling isolated', 'social connection', 'making friends', 'overcoming isolation'],
    },
    hero: {
      title: 'Feeling isolated or disconnected?',
      subtitle: 'Loneliness can strike even when surrounded by people. Loneliness is often a sign that your need for connection isn\'t being met. That need is human, valid, and can be met.',
    },
    summary: 'Loneliness is the painful gap between the connection you want and what you have. It\'s not the same as being alone. You can be surrounded by people and still feel lonely. Loneliness affects mental and physical health, but it\'s also changeable. Real, meaningful connections are possible—and they start with small steps.',
    relatable: [
      'You feel disconnected even in groups',
      'You struggle to find people who "get you"',
      'You check your phone hoping for messages that don\'t come',
      'You want connection but don\'t know how to initiate it',
      'You feel like an outsider looking in',
      'Weekends or evenings feel especially lonely',
      'You sometimes feel invisible or forgotten',
      'You feel like nobody really knows the real you',
    ],
    situations: [
      'Moving to a new city or country',
      'Ending a close relationship',
      'Life stage changes (starting school, retiring)',
      'Social anxiety or shyness',
      'Grief after a major loss',
      'Health issues that limit social activity',
      'Being in a crowd but not feeling connected',
      'Having interests nobody around you shares',
    ],
    tips: [
      'Start small: attend one group event, take one class, join one online community',
      'Reach out: text a friend, start a conversation, send a message to someone you\'ve lost touch with',
      'Find your people: look for communities around your interests (hobbies, values, beliefs)',
      'Be authentic: share something real. Shallow connections feed loneliness more than they help',
      'Practice listening: people feel valued when heard. Ask about others\' lives',
      'Volunteer or help others: service connects you to community and builds meaning',
      'Spend time with yourself without judgment: loneliness sometimes means learning to enjoy solitude',
      'Be patient: meaningful friendships take time. Keep showing up',
    ],
    reflectionQuestions: [
      'When did loneliness start? Was there a trigger?',
      'What does meaningful connection look like to you?',
      'Who in your past did you feel truly connected to? What made that relationship work?',
      'What\'s one small step toward connection you could take this week?',
      'What prevents you from reaching out? Is it fear, shame, or something else?',
    ],
    whenToSeekSupport: 'Seek help if: loneliness is persistent and causing depression or anxiety; you\'re isolating yourself; loneliness is linked to thoughts of self-harm; or you feel hopeless about ever connecting. A therapist can help address underlying issues and build connection skills.',
    relatedCategories: ['depression', 'social-anxiety', 'self-doubt', 'grief', 'anxiety'],
    faq: [
      {
        question: 'Is loneliness the same as being alone?',
        answer: 'No. Being alone can be peaceful and restorative. Loneliness is painful—it\'s feeling disconnected or isolated. Some people feel lonely in crowds; others feel fine alone.',
      },
      {
        question: 'Why is loneliness so painful?',
        answer: 'Humans are wired for connection. Loneliness signals that this need isn\'t being met. It\'s a real pain, not weakness. Addressing it improves both mental and physical health.',
      },
      {
        question: 'How do I make friends as an adult?',
        answer: 'Join groups around interests (classes, clubs, volunteer opportunities, online communities). Show up consistently. Be yourself. Friendships develop through repeated, authentic interaction. It\'s slower than childhood but absolutely possible.',
      },
      {
        question: 'What if I\'m afraid of rejection?',
        answer: 'Fear of rejection is common. Rejection happens, but the pain is temporary. Many people want connection too—some will say yes. Taking small risks (inviting someone for coffee) is how real friendships start.',
      },
      {
        question: 'Is social media helping or hurting my loneliness?',
        answer: 'Social media can feel connecting but often deepens loneliness (comparing yourself to others, passive scrolling). Balance it with real-world connection. Use it to coordinate in-person hangouts, not replace them.',
      },
      {
        question: 'What if I have social anxiety and making friends feels impossible?',
        answer: 'Social anxiety makes connection harder but not impossible. Therapy (especially exposure therapy) helps many people. Start with low-pressure settings and build from there. Small steps count.',
      },
      {
        question: 'Should I wait for people to reach out, or reach out first?',
        answer: 'Reaching out first is brave and often necessary. Many people want connection but are afraid to initiate. If you reach out and get ignored, that person wasn\'t your person. But keep reaching out—some will say yes.',
      },
      {
        question: 'Can online communities really reduce loneliness?',
        answer: 'Yes, especially for people with shared interests or who struggle with in-person connection. Online communities can be a stepping stone to in-person friendships. Both matter.',
      },
    ],
    trustSafety: {
      disclaimer: 'This content is supportive. If loneliness is linked to depression or suicidal thoughts, seek professional mental health support immediately.',
      lastReviewedDate: '2025-02-15',
    },
  },

  // 6. ANGER
  {
    slug: 'anger',
    displayName: 'Anger',
    seo: {
      title: 'Anger Management & Control | Tools for Emotional Regulation',
      description: 'Learn healthy ways to express and manage anger. Anger isn\'t bad—it\'s how you express it that matters. Build better emotional control.',
      openGraph: {
        title: 'Anger Management | Express Healthy',
        description: 'Develop skills to manage anger and express frustration constructively.',
      },
      keywords: ['anger management', 'controlling anger', 'managing frustration', 'emotional regulation', 'anger control'],
    },
    hero: {
      title: 'Struggling with anger?',
      subtitle: 'Anger is a natural human emotion. The challenge is understanding it and expressing it in healthy ways. With support and practice, anger can become easier to manage.',
    },
    summary: 'Anger is a natural, healthy emotion—a response to feeling disrespected, threatened, or wronged. The problem isn\'t anger itself; it\'s unmanaged anger. Healthy anger motivates you to set boundaries and stand up for yourself. Unhealthy anger damages relationships and hurts people you care about. The good news: anger management is a learnable skill.',
    relatable: [
      'You feel a sudden rush of heat and rage',
      'Small things trigger disproportionate reactions',
      'You say things you regret when angry',
      'You feel like your anger controls you, not the other way around',
      'You feel guilty or ashamed after angry reactions',
      'You blame others for your anger',
      'You worry about how your anger affects you or the people around you',
      'You hold grudges for a long time',
    ],
    situations: [
      'Feeling disrespected or dismissed',
      'Financial stress or loss of control',
      'Family conflicts or parenting challenges',
      'Work stress or unfair treatment',
      'Relationship betrayal or abandonment',
      'Feeling powerless in a situation',
      'Injustice or mistreatment of others',
      'Accumulated stress without release',
    ],
    tips: [
      'Pause before reacting: count to 10, step away, breathe deeply',
      'Identify the real issue: anger often masks hurt, fear, or feeling powerless',
      'Express anger, not attack: say "I feel angry when..." not "You always..."',
      'Release tension safely: go for a walk, exercise, stretch, or take deep breaths',
      'Communicate when calm: never important conversations when angry',
      'Set boundaries: often anger signals a boundary that\'s been crossed',
      'Write it out: journal angry thoughts, then decide what to do',
      'Get support: talk to someone you trust about what\'s making you angry',
    ],
    reflectionQuestions: [
      'What\'s underneath your anger? Hurt? Fear? Feeling powerless?',
      'Who or what are you really angry at?',
      'What do you need that you\'re not getting?',
      'When does anger serve you? When does it hurt you?',
      'How would you like to express anger more effectively?',
    ],
    whenToSeekSupport: 'Seek help if: you\'re hurting people (physically or emotionally); anger feels out of control; you\'re damaging relationships or property; you\'re having violent thoughts; or your anger is linked to substance use. Anger management therapy is effective.',
    relatedCategories: ['stress', 'frustration', 'overwhelm', 'relationship-issues', 'anxiety'],
    faq: [
      {
        question: 'Is anger bad?',
        answer: 'No. Anger is a valid emotion that signals something matters to you. The problem is unmanaged or aggressive anger. Healthy anger can motivate positive change and help you set boundaries.',
      },
      {
        question: 'How do I know if my anger is normal or a problem?',
        answer: 'Anger is a problem if it\'s hurting relationships, if you hurt people, if you can\'t control it, or if it\'s damaging your health or property. Normal anger comes and goes; problem anger is intense, frequent, or destructive.',
      },
      {
        question: 'Why do small things make me so angry?',
        answer: 'Small triggers often aren\'t really about the small thing. They\'re the last straw when you\'re already stressed or when they remind you of past hurts. The small thing is just the trigger; bigger stuff is underneath.',
      },
      {
        question: 'Is it okay to yell when angry?',
        answer: 'Strong emotions are normal, but shouting often escalates conflict and hurts relationships. Taking space, calming down, and returning to the conversation later usually leads to better outcomes.',
      },
      {
        question: 'Can anger management therapy really help?',
        answer: 'Yes. Therapy helps you identify triggers, understand what\'s underneath anger, and learn new responses. Cognitive-behavioral therapy for anger is particularly effective.',
      },
      {
        question: 'Should I tell someone what I\'m angry about?',
        answer: 'Yes, but only when you\'re calm enough to communicate clearly. Talking about anger when you\'re in it usually escalates conflict. Wait until you can explain without attacking.',
      },
      {
        question: 'What if my anger is about injustice?',
        answer: 'Anger at injustice can be motivating and righteous. Channel it: advocate, volunteer, take action. Unmanaged anger at injustice can become bitterness or burnout.',
      },
      {
        question: 'Am I abusive if I get angry?',
        answer: 'Getting angry doesn\'t make you abusive. Abuse is a pattern of control and harm. If you\'re concerned about your behavior, talk to a therapist. Wanting to change is a sign of care and conscience.',
      },
    ],
    trustSafety: {
      disclaimer: 'This content is educational and not a substitute for professional mental health care. If anger feels overwhelming, affects your relationships, or leads to harmful behavior, consider speaking with a mental health professional.',
      lastReviewedDate: '2025-02-15',
    },
  },

  // Continuing with 7-25 emotions...
  // Due to length, I'll create a helper structure for the remaining emotions

  {
    slug: 'self-doubt',
    displayName: 'Self-Esteem & Self-Doubt',
    seo: {
      title: 'Self-Doubt Support | Building Confidence & Self-Trust',
      description: 'Overcome self-doubt and imposter syndrome. You\'re more capable than you believe. Build genuine confidence from within.',
      openGraph: {
        title: 'Self-Doubt Support | You\'re Worthy',
        description: 'Address self-doubt and reconnect with your strengths.',
      },
      keywords: ['self-doubt support', 'lack of confidence', 'building confidence', 'imposter syndrome', 'self-worth'],
    },
    hero: {
      title: 'Struggling with self-doubt?',
      subtitle: 'That voice questioning your abilities is loud, but it\'s not always telling you the truth. You have more capability than you think.',
    },
    summary: 'Self-doubt is that voice that questions your abilities, worth, and decisions. It whispers, "You\'re not good enough," "You\'ll fail," or "Everyone will figure out you\'re a fraud." Self-doubt and low self-esteem often go together. When you repeatedly question your abilities or worth, it can become difficult to trust yourself. Everyone experiences self-doubt sometimes. The difference is: some manage it, others let it paralyze them. Self-doubt is changeable through awareness, evidence, and compassion.',
    relatable: [
      'You attribute success to luck instead of ability',
      'You compare yourself to others and always come up short',
      'You overanalyze mistakes or criticism',
      'You\'re afraid to try new things in case you fail',
      'You don\'t speak up even when you have valuable input',
      'You downplay your achievements or hesitate to share your opinions',
      'You seek constant reassurance from others',
      'You sabotage yourself before others can reject you',
    ],
    situations: [
      'Starting a new job or role',
      'Public speaking or presentations',
      'Pursuing creative goals',
      'Entering new social groups',
      'After a failure or rejection',
      'Comparing yourself to others',
      'Receiving criticism',
      'Taking on challenges beyond your comfort zone',
    ],
    tips: [
      'Challenge your doubts by remembering past successes, skills, and situations you\'ve already overcome',
      'Practice self-compassion: talk to yourself like you\'d talk to a friend',
      'Do something small that scares you; you\'ll realize you can handle more than doubt says',
      'Focus on progress, not perfection—small steps build confidence over time',
      'Limit comparison: unfollow accounts that make you feel inadequate',
      'Speak up in one small way today—your voice matters',
      'Remember: everyone doubts themselves; it\'s part of being human',
      'Reframe failure as information, not identity: "I failed at this, not I am a failure"',
    ],
    reflectionQuestions: [
      'Where does your self-doubt come from? A past experience? Someone\'s words?',
      'What would you do if you trusted yourself?',
      'What proof contradicts your self-doubt?',
      'What would believing in yourself change?',
      'Who in your life believes in you? Why?',
    ],
    whenToSeekSupport: 'Seek help if: self-doubt is preventing you from pursuing goals or meaningful relationships; it\'s linked to depression or anxiety; it\'s affecting your work or school; or you\'re struggling to function. Therapy can help identify roots of self-doubt and rebuild confidence.',
    relatedCategories: ['perfectionism', 'anxiety', 'social-anxiety', 'low-self-esteem', 'imposter-syndrome'],
    faq: [
      {
        question: 'Is self-doubt ever useful?',
        answer: 'In small doses, yes. Healthy doubt makes you prepare and reflect. Paralyzing self-doubt that prevents action is harmful. The goal isn\'t zero doubt but managing it well.',
      },
      {
        question: 'How do I build real confidence?',
        answer: 'Real confidence comes from doing difficult things and proving to yourself you can handle them. Start small, build evidence of capability, and practice self-compassion.',
      },
      {
        question: 'Why do I doubt myself even when I\'ve succeeded before?',
        answer: 'Each new situation feels risky. Past success doesn\'t always transfer to new domains in your mind. Your brain protects you by doubting. You have to remind it: you\'ve handled challenges before.',
      },
      {
        question: 'Is imposter syndrome the same as self-doubt?',
        answer: 'Related but different. Self-doubt is questioning your abilities. Imposter syndrome is the specific belief that you\'re a fraud despite evidence of competence. Therapy helps with both.',
      },
      {
        question: 'What if people\'s doubts are making me doubt myself?',
        answer: 'Other people\'s opinions can influence how you see yourself, but they don\'t define your worth or potential. If many trusted people doubt you, it\'s worth considering. But often, people project their insecurities. Trust yourself, especially if others have believed in you before.',
      },
      {
        question: 'Can I ever get rid of self-doubt completely?',
        answer: 'Probably not—most people have some self-doubt. The goal is managing it so it doesn\'t paralyze you. Over time, confidence can outweigh doubt.',
      },
      {
        question: 'How do I stop comparing myself to others?',
        answer: 'Limit social media, unfollow accounts that trigger comparison, and remind yourself: you\'re comparing your behind-the-scenes to others\' highlight reel. Focus on your own progress instead.',
      },
      {
        question: 'What if I fail? Will that confirm my doubts?',
        answer: 'Failure doesn\'t confirm doubt; it proves you tried. Everyone fails. Failure is information, not identity. Some of history\'s most successful people failed repeatedly.',
      },
    ],
    trustSafety: {
      disclaimer: 'This content is supportive. If self-doubt is linked to depression or anxiety, seek professional help.',
      lastReviewedDate: '2025-02-15',
    },
  },

  // I'll continue with the remaining 18 emotions in a similar format
  // For brevity in this context, I'll create condensed versions

  {
    slug: 'relationship-issues',
    displayName: 'Relationship Issues',
    seo: {
      title: 'Relationship Support & Communication Help | Connection & Conflict',
      description: 'Improve relationships through better communication and boundaries. Navigate conflict, connection, and intimacy with compassion.',
      openGraph: {
        title: 'Relationship Support | Healthy Connection',
        description: 'Build stronger, healthier relationships with better communication.',
      },
      keywords: ['relationship help', 'relationship advice', 'communication skills', 'couple counseling', 'relationship conflict'],
    },
    hero: {
      title: 'Struggling in a relationship?',
      subtitle: 'Relationship challenges are universal. With better communication and boundaries, connection deepens. You can improve this.',
    },
    summary: 'Relationship issues span dating, marriage, family, and friendships. Common challenges: poor communication, unmet expectations, conflict patterns, and loss of intimacy. Healthy relationships require vulnerability, boundaries, and willingness to work through conflict. The good news: most relationship problems are solvable with effort, communication, and sometimes professional support.',
    relatable: [
      'You feel unheard or misunderstood',
      'Conflict escalates quickly and doesn\'t get resolved',
      'You feel emotionally distant from someone you care about',
      'You\'re afraid to express your needs',
      'You\'re stuck in repeating arguments',
      'Intimacy or closeness has declined',
      'You\'re staying in a relationship that doesn\'t fulfill you',
      'You wonder if the other person actually cares',
    ],
    situations: [
      'Ongoing conflict that doesn\'t resolve',
      'Loss of intimacy or emotional connection',
      'Unmet expectations or misaligned values',
      'Infidelity or trust violations',
      'Poor communication patterns',
      'Life transitions (moving, career changes, parenthood)',
      'Financial stress affecting the relationship',
      'Family interference or in-law conflict',
    ],
    tips: [
      'Practice active listening: listen to understand, not to respond',
      'Use "I" statements: "I feel hurt when..." instead of "You always..."',
      'Schedule difficult conversations when calm and unrushed',
      'Set clear, kind boundaries about needs and non-negotiables',
      'Apologize sincerely when you\'re wrong; make amends',
      'Do something together you both enjoy—reconnect, not just communicate',
      'Seek couples therapy if communication keeps breaking down',
      'Reflect on your own patterns; what do you bring to the dynamic?',
    ],
    reflectionQuestions: [
      'What attracted you to this person initially?',
      'What\'s one need you haven\'t expressed?',
      'How do you typically handle conflict?',
      'What would healthy conflict look like for you?',
      'Is this relationship fulfilling you, draining you, or both?',
    ],
    whenToSeekSupport: 'Seek couples therapy if: conflict is constant and unresolved; there\'s infidelity or broken trust; communication has broken down; or you\'re considering ending the relationship. Individual therapy also helps if your patterns are harming relationships.',
    relatedCategories: ['communication', 'heartbreak', 'anxiety', 'grief', 'loneliness'],
    faq: [
      {
        question: 'Should we go to couples therapy?',
        answer: 'Couples therapy helps most couples, whether improving a good relationship or resolving serious conflict. It\'s not just for crisis; it\'s preventive. If you\'re considering it, the answer is probably yes.',
      },
      {
        question: 'How do I communicate about difficult topics?',
        answer: 'Choose calm timing, use "I" statements, listen without interrupting, focus on one issue at a time, and work toward solutions together. If you can\'t do this, a therapist can help.',
      },
      {
        question: 'What if my partner won\'t go to therapy?',
        answer: 'Individual therapy can still help you. You can learn communication skills and boundaries. You can\'t change your partner, but you can change how you respond to dynamics.',
      },
      {
        question: 'Is my relationship worth fighting for?',
        answer: 'Only you can answer this. Consider: Do you share values? Is there mutual respect? Can you communicate? Are you both willing to work on things? If yes to most, it\'s likely worth it.',
      },
      {
        question: 'How do I know if a relationship is toxic?',
        answer: 'Red flags: abuse, control, repeated betrayal, constant criticism, feeling afraid, isolation from others. Healthy relationships have conflict but resolve it. Toxic relationships don\'t improve despite efforts.',
      },
      {
        question: 'Why do I choose the same type of partner repeatedly?',
        answer: 'We often repeat patterns from childhood or past relationships. Therapy can help you recognize patterns and make different choices. Self-awareness is the first step.',
      },
      {
        question: 'Can a relationship come back from infidelity?',
        answer: 'Some do with therapy, commitment to rebuild trust, and honest communication. Others don\'t. It depends on both people\'s willingness and the specific circumstances. Professional support helps.',
      },
      {
        question: 'What if I love someone but the relationship isn\'t working?',
        answer: 'Love is necessary but not sufficient. Relationships need mutual respect, good communication, and shared values. Love doesn\'t always mean staying. Sometimes love means letting go.',
      },
    ],
    trustSafety: {
      disclaimer: 'This content is educational and not a substitute for professional support. If your relationship involves abuse, control, or violence, seek help from a trusted professional or support service.',
      lastReviewedDate: '2025-02-15',
    },
  },

  // 8. WORK STRESS
  {
    slug: 'work-stress',
    displayName: 'Work Stress',
    seo: {
      title: 'Work Stress Support | Career Pressure & Job Anxiety Relief',
      description: 'Manage workplace stress, job pressure, and career burnout. Set boundaries and reclaim your well-being.',
      openGraph: {
        title: 'Work Stress Support | Balance Matters',
        description: 'Learn to manage work pressure without sacrificing your health.',
      },
      keywords: ['work stress', 'job stress', 'workplace anxiety', 'career pressure', 'job burnout'],
    },
    hero: {
      title: 'Struggling with work stress?',
      subtitle: 'Work stress is real, but your worth isn\'t defined by your job. You can set boundaries and protect your well-being.',
    },
    summary: 'Work stress comes from long hours, high expectations, difficult colleagues, job insecurity, or misalignment with your values. It bleeds into your personal life, affecting sleep, relationships, and health. The key: recognizing that you can\'t control everything at work, but you can control your boundaries and how much of your energy you give.',
    relatable: [
      'You think about work even on days off',
      'Sunday anxiety about Monday is intense',
      'You skip lunch or breaks to keep working',
      'You feel underappreciated despite hard work',
      'Criticism or feedback triggers disproportionate anxiety',
      'You\'re afraid of making mistakes',
      'Work conflicts keep you up at night',
      'You feel trapped—can\'t leave, can\'t stay',
    ],
    situations: [
      'Demanding deadlines or unrealistic expectations',
      'Difficult boss or toxic coworkers',
      'Job insecurity or fear of layoffs',
      'Lack of recognition or advancement',
      'Misalignment with company values',
      'Work-life balance collapse',
      'Perfectionism at work',
      'Major projects or transitions',
    ],
    tips: [
      'Set clear work boundaries and stick to them. Protect your personal time whenever possible.',
      'Communicate expectations with your boss: "What does success look like?"',
      'Break big projects into smaller milestones to reduce overwhelm',
      'Take your breaks and lunch—not selfish, necessary',
      'Find one person at work you trust; debrief with them',
      'Do something to mark the end of your workday (change clothes, walk, music)',
      'Remember: you\'re not your job. Your value isn\'t your productivity',
      'Consider: Is this job sustainable? What would change need to happen?',
    ],
    reflectionQuestions: [
      'What specific aspects of work are causing you the most stress?',
      'What boundaries do you need to set?',
      'Is this job aligned with your values and well-being?',
      'What would feel like a "good day" at work?',
      'What do you need from your employer to thrive?',
    ],
    whenToSeekSupport: 'Seek help if: work stress is affecting your health, sleep, or relationships; you\'re having panic symptoms at work; you\'re using substances to cope; or you\'re having thoughts of self-harm. A therapist can help you process stress and decide if changes are needed.',
    relatedCategories: ['burnout', 'stress', 'anxiety', 'perfectionism', 'sleep-issues'],
    faq: [
      {
        question: 'Is it normal to stress about work?',
        answer: 'Yes. Some work stress is normal. Chronic, overwhelming stress that affects your health is not normal and deserves attention.',
      },
      {
        question: 'Should I quit if I\'m stressed?',
        answer: 'Not necessarily. Some stress is everywhere. Consider: Is it the job, the culture, your expectations, or something else? Sometimes changing your approach or setting boundaries helps. Sometimes you do need to leave.',
      },
      {
        question: 'How do I talk to my boss about stress?',
        answer: 'Focus on solutions: "I want to deliver quality work. Here\'s what I need..." Avoid complaints without solutions. Good managers want to keep good employees.',
      },
      {
        question: 'Can I have work-life balance in a demanding job?',
        answer: 'Yes, but it requires clear boundaries. You can have a demanding job and still protect personal time. It\'s about intentional choices.',
      },
      {
        question: 'What if my workplace is toxic?',
        answer: 'Toxic workplaces are damaging. You can try addressing it or leaving. Sometimes leaving is the healthiest choice. Your well-being matters more than any job.',
      },
      {
        question: 'How do I stop thinking about work after hours?',
        answer: 'Create a transition ritual: change clothes, take a walk, put your phone away. Practice mindfulness to redirect thoughts. Over time, your brain learns work time ≠ personal time.',
      },
      {
        question: 'Is it selfish to prioritize my well-being over work?',
        answer: 'No. You can\'t pour from an empty cup. Taking care of yourself makes you better at work anyway. Boundaries aren\'t selfish; they\'re necessary.',
      },
      {
        question: 'What if I can\'t afford to leave my job?',
        answer: 'Financial constraints are real. Set small boundaries while looking for alternatives. Talk to HR about mental health resources. Therapy can help you manage stress in a difficult situation.',
      },
    ],
    trustSafety: {
      disclaimer: 'This content is educational. If work stress is causing serious health issues, consult a healthcare provider.',
      lastReviewedDate: '2025-02-15',
    },
  },

  // 9. FINANCIAL WORRY
  {
    slug: 'financial-worry',
    displayName: 'Financial Worry',
    seo: {
      title: 'Financial Stress & Money Anxiety | Overcome Financial Worry',
      description: 'Manage money anxiety and financial stress. Build confidence with your finances. You\'re not alone in this worry.',
      openGraph: {
        title: 'Financial Support | Money Anxiety Relief',
        description: 'Address financial stress and build a healthier relationship with money.',
      },
      keywords: ['financial stress', 'money anxiety', 'financial worry', 'debt stress', 'money problems'],
    },
    hero: {
      title: 'Anxious about money?',
      subtitle: 'Financial stress is one of the biggest life stressors. It\'s not shameful. Many people struggle. Small steps create progress.',
    },
    summary: 'Financial stress can come from debt, insufficient income, unexpected expenses, or job insecurity. Money anxiety affects sleep, relationships, and mental health. The challenge: financial stress often feels too big to face. The opportunity: even small steps toward understanding your finances reduce anxiety and build agency.',
    relatable: [
      'You avoid checking your account balance',
      'Unexpected expenses trigger panic',
      'You lie awake worrying about bills',
      'You feel shame about your financial situation',
      'You\'re comparing your finances to others',
      'You feel trapped by debt',
      'Income uncertainty makes you anxious',
      'You feel helpless to improve your situation',
    ],
    situations: [
      'Unexpected job loss or income reduction',
      'High-interest debt or credit card bills',
      'Medical expenses or emergencies',
      'Living paycheck to paycheck',
      'Student loans or housing costs',
      'Divorce or relationship financial impact',
      'Helping family members financially',
      'Lack of emergency savings',
    ],
    tips: [
      'Face your numbers: write down income, expenses, debts. Knowledge reduces panic',
      'Create a small budget: track where money goes for one month',
      'Start with one small savings goal—even a tiny amount saved regularly can build confidence over time',
      'Look for one area where you can reduce spending without affecting your quality of life',
      'Look into financial assistance programs if eligible',
      'Talk to someone you trust about finances (shame thrives in silence)',
      'Seek free financial counseling (many nonprofits offer it)',
      'Start one small financial goal: "I will save $10/week" or "I will reduce one subscription"',
    ],
    reflectionQuestions: [
      'What\'s your earliest money memory? Does it affect how you feel about finances now?',
      'What about your finances scares you most?',
      'What\'s one small financial step you could take this month?',
      'Who could you talk to about financial stress?',
      'What would financial stability look like for you?',
    ],
    whenToSeekSupport: 'Seek help if: financial stress is causing depression or anxiety; you\'re unable to meet basic needs; you\'re avoiding bills or using substances to cope; or thoughts of self-harm emerge. Financial counseling and therapy both help.',
    relatedCategories: ['work-stress', 'stress', 'anxiety', 'depression', 'overwhelm'],
    faq: [
      {
        question: 'Is it normal to stress about money?',
        answer: 'Absolutely. Most people stress about money. The key is managing that stress rather than avoiding it.',
      },
      {
        question: 'Should I ignore financial problems?',
        answer: 'No. Ignoring problems makes them worse. Facing numbers might be uncomfortable, but it gives you agency to improve.',
      },
      {
        question: 'Where do I start with financial stress?',
        answer: 'Start simple: write down income and major expenses. Understand the basics. Then make one small change (reduce one expense, start small savings, etc).',
      },
      {
        question: 'Can I get help with debt?',
        answer: 'Yes. Look for nonprofit financial counseling (often free), talk to creditors about payment plans, or explore debt consolidation. Professional help is available.',
      },
      {
        question: 'Will my financial situation ever improve?',
        answer: 'Most situations improve with time and small steps. Immediate change isn\'t realistic, but progress is. Focus on what you can control.',
      },
      {
        question: 'Should I hide my financial struggles from my partner?',
        answer: 'No. Financial stress in relationships grows in secrecy. Talk to your partner. Work together on solutions. Transparency builds trust.',
      },
      {
        question: 'Is bankruptcy an option?',
        answer: 'Bankruptcy is sometimes appropriate, but it has long-term consequences. Consult a financial advisor or bankruptcy attorney to understand options.',
      },
      {
        question: 'How do I stop comparing my finances to others?',
        answer: 'Limit social media, focus on your journey, remember you\'re seeing others\' highlight reels. Compare yourself to your past self instead.',
      },
    ],
    trustSafety: {
      disclaimer: 'Financial stress is a real and valid experience. This content is educational and supportive, not financial or investment advice. Everyone\'s financial situation is unique. A financial advisor or counselor can help you create a personalized plan.',
      lastReviewedDate: '2025-02-15',
    },
  },

  // 10. SLEEP ISSUES
  {
    slug: 'sleep-issues',
    displayName: 'Sleep Issues',
    seo: {
      title: 'Sleep Support & Insomnia Help | Better Sleep, Better Life',
      description: 'Overcome sleep issues and insomnia. Understand sleep and discover natural ways to improve rest.',
      openGraph: {
        title: 'Sleep Support | Rest Matters',
        description: 'Get help with insomnia and sleep problems.',
      },
      keywords: ['sleep issues', 'insomnia help', 'sleep problems', 'cannot sleep', 'sleep anxiety'],
    },
    hero: {
      title: 'Struggling to sleep?',
      subtitle: 'Sleep issues are common and treatable. Poor sleep affects everything. Better sleep is possible.',
    },
    summary: 'Sleep issues range from insomnia (can\'t fall or stay asleep) to poor sleep quality to racing thoughts at night. Sleep problems often stem from stress, anxiety, depression, poor sleep habits, or medical issues. Good sleep is foundational to mental and physical health. The encouraging news: sleep usually improves with consistent habits and reduced stress.',
    relatable: [
      'You lie awake for hours unable to fall asleep',
      'You wake up at 3am and can\'t get back to sleep',
      'Your mind races with worries at night',
      'You\'re exhausted but can\'t sleep',
      'You wake up multiple times throughout the night',
      'You don\'t feel rested even after 8 hours',
      'You use sleep aids or substances to sleep',
      'You dread bedtime because you know you won\'t sleep',
    ],
    situations: [
      'Work or life stress',
      'Anxiety or racing thoughts',
      'Depression or low mood',
      'Irregular schedule or screen time before bed',
      'Caffeine or alcohol use',
      'Sleep apnea or medical conditions',
      'Grief or major life changes',
      'Aging or hormonal changes',
    ],
    tips: [
      'Keep a consistent sleep schedule (bedtime and wake time) even weekends',
      'Reduce screen time before bed whenever possible. Bright screens and stimulating content can make it harder to fall asleep',
      'Keep bedroom dark, cool, and quiet',
      'Limit caffeine after 2pm',
      'Exercise during the day (not close to bedtime)',
      'Try deep breathing or progressive muscle relaxation at bedtime',
      'If you\'re awake 20+ minutes, get up and do something calm (not screen)',
      'Reserve bed for sleep only—not work or worry',
    ],
    reflectionQuestions: [
      'When did sleep problems start? Was there a trigger?',
      'What happens when you can\'t sleep—what do you think about?',
      'What\'s your ideal sleep schedule?',
      'What helps you feel calm before bed?',
      'How does poor sleep affect your mood and function?',
    ],
    whenToSeekSupport: 'Seek professional help if: insomnia persists 3+ months; sleep is affecting your health or work; you\'re using substances or sleeping pills nightly; or sleep is linked to depression or anxiety. Sleep specialists and cognitive behavioral therapy for insomnia (CBT-I) are effective.',
    relatedCategories: ['anxiety', 'stress', 'depression', 'work-stress', 'overwhelm'],
    faq: [
      {
        question: 'How much sleep do I need?',
        answer: 'Most adults need 7-9 hours. Quality matters too. Some people feel good on 7 hours; others need 9. Know your body\'s needs.',
      },
      {
        question: 'Is melatonin safe?',
        answer: 'Short-term melatonin is generally safe for most people. Long-term use effects aren\'t fully studied. Talk to a doctor before using it nightly.',
      },
      {
        question: 'What\'s the difference between insomnia and just having a bad night?',
        answer: 'Everyone has occasional bad nights. Insomnia involves ongoing difficulty falling asleep, staying asleep, or getting restful sleep that affects daily life.',
      },
      {
        question: 'Can I get addicted to sleep medicine?',
        answer: 'Some sleep medications can lead to dependence. Talk to a doctor about risks. Non-medication approaches (CBT-I, sleep hygiene) are often preferred.',
      },
      {
        question: 'Does exercise help sleep?',
        answer: 'Yes. Regular exercise improves sleep. Just avoid vigorous exercise close to bedtime (within 3 hours).',
      },
      {
        question: 'Is napping bad if I sleep poorly at night?',
        answer: 'Brief naps (20 mins) can help. Long naps or afternoon naps can make nighttime sleep worse. Use naps strategically.',
      },
      {
        question: 'What if nothing I try works?',
        answer: 'Consult a sleep specialist. Sometimes sleep issues have medical causes (sleep apnea, restless legs). CBT-I (cognitive behavioral therapy for insomnia) is highly effective.',
      },
      {
        question: 'Is it okay to use alcohol to sleep?',
        answer: 'Alcohol might help you fall asleep initially but disrupts sleep quality later. It\'s not a sustainable solution. Avoid using it as a sleep aid.',
      },
    ],
    trustSafety: {
      disclaimer: 'This content is educational. If sleep problems are severe or linked to health concerns, consult a doctor or sleep specialist.',
      lastReviewedDate: '2025-02-15',
    },
  },

  // Continuing with remaining emotions (11-25)...
  // I'll add condensed but complete versions for all remaining emotions

  {
    slug: 'panic-attacks',
    displayName: 'Panic Attacks',
    seo: {
      title: 'Panic Attack Help & Support | Managing Panic Disorder',
      description: 'Understand panic attacks and learn grounding techniques. Panic is treatable. You\'re not dying.',
      openGraph: {
        title: 'Panic Attack Support | You\'re Safe',
        description: 'Learn to manage panic attacks with evidence-based techniques.',
      },
      keywords: ['panic attack help', 'panic disorder', 'managing panic', 'panic anxiety', 'grounding techniques'],
    },
    hero: {
      title: 'Experiencing panic attacks?',
      subtitle: 'Panic feels life-threatening but it\'s not. Your body is in overdrive. With support, panic is manageable.',
    },
    summary: 'Panic attacks are sudden episodes of intense fear that can cause physical symptoms such as a racing heart, dizziness, chest tightness, sweating, and difficulty breathing. They feel like a heart attack or dying. Panic attacks themselves are not physically dangerous, although they can feel overwhelming and frightening. They usually peak within 5-10 minutes and gradually subside. Repeated panic attacks can become panic disorder (fear of having more panic). Professional support and grounding techniques help.',
    relatable: [
      'Your heart races without warning',
      'You feel like you\'re dying or losing control',
      'Your breathing becomes shallow and fast',
      'You get dizzy or feel detached from reality',
      'Chest pain or pressure makes you fear a heart attack',
      'You avoid places where panic happened before',
      'You\'re afraid of having another panic attack',
      'Panic has disrupted your life (avoiding work, driving, public places)',
    ],
    situations: [
      'Sudden onset without clear trigger',
      'Triggered by specific situations (crowds, driving, flying)',
      'Following a major stress or loss',
      'Caffeine or stimulant use',
      'Underlying anxiety disorder',
      'Medical triggers (hormonal changes, health issues)',
      'Fear of having another panic attack',
      'Trauma reminders',
    ],
    tips: [
      'Remember: panic is not dangerous. You won\'t faint, have a heart attack, or lose control',
      'Stay in the moment: use 5-4-3-2-1 grounding (name 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste)',
      'Slow your breathing: take gentle, steady breaths and focus on making your exhale longer than your inhale',
      'Don\'t fight the panic; observe it like a cloud passing by',
      'Do something grounding: hold ice, splash cold water on your face, or press your feet firmly into the ground',
      'Call someone you trust and tell them what\'s happening',
      'Remind yourself: "This will pass. I\'m safe."',
      'Get professional help; therapy (especially exposure therapy) is highly effective for panic',
    ],
    reflectionQuestions: [
      'When did your first panic attack happen?',
      'What do you think panic is trying to tell you?',
      'What thoughts scare you most during panic?',
      'What grounds you and makes you feel safe?',
      'How has panic changed your life? What would change if you weren\'t afraid of panic?',
    ],
    whenToSeekSupport: 'Seek professional support if panic attacks are becoming frequent, affecting your daily life, causing you to avoid certain places, or leading you to rely on alcohol or substances. Seek immediate help if you\'re having thoughts of self-harm. Cognitive behavioral therapy and sometimes medication effectively treat panic disorder.',
    relatedCategories: ['anxiety', 'stress', 'agoraphobia', 'health-anxiety', 'trauma'],
    faq: [
      {
        question: 'Is a panic attack dangerous?',
        answer: 'No. Panic feels dangerous but it\'s not. Your heart rate increases but your heart is healthy. You won\'t faint, have a stroke, or die. Panic itself is not physically dangerous.',
      },
      {
        question: 'Why do panic attacks happen?',
        answer: 'Panic can be triggered by stress, anxiety, caffeine, hormones, or medical conditions. Sometimes there\'s no clear trigger. Understanding the cause can help, but learning how to manage panic is often the most important step.',
      },
      {
        question: 'How long do panic attacks last?',
        answer: 'Panic typically peaks at 5-10 minutes then gradually subsides. The total episode might last 15-30 minutes. Knowing it will pass helps.',
      },
      {
        question: 'Will I have panic attacks forever?',
        answer: 'No. With proper treatment (therapy, sometimes medication), most people recover. Therapy is highly effective; many people become panic-free.',
      },
      {
        question: 'Should I go to the ER during panic?',
        answer: 'If it\'s your first panic attack and you\'re unsure, getting checked is reasonable. If you\'ve had panic before and recognize the pattern, you don\'t need ER. A therapist can help you learn the difference.',
      },
      {
        question: 'Can exercise help panic?',
        answer: 'Regular exercise helps prevent panic. During a panic attack, gentle movement (walking) can help. Intense exercise might trigger panic in some people.',
      },
      {
        question: 'Is medication necessary for panic?',
        answer: 'Therapy alone often works. Some people benefit from medication too. Talk to a doctor about what\'s right for you.',
      },
      {
        question: 'What if I have panic in public?',
        answer: 'People are usually understanding. You can excuse yourself if needed. Knowing you\'ve survived panic before helps. Most people around you don\'t notice the intensity of what you\'re experiencing.',
      },
    ],
    trustSafety: {
      disclaimer: 'This content is educational and not a substitute for medical advice. If you\'re experiencing chest pain, breathing difficulties, or panic symptoms for the first time, seek medical evaluation to rule out other health conditions.',
      lastReviewedDate: '2025-02-15',
    },
  },

  // Adding remaining emotions (Social Anxiety through Self-Discovery)
  // Due to length, I\'ll add them more concisely but completely

  {
    slug: 'social-anxiety',
    displayName: 'Social Anxiety',
    seo: {
      title: 'Social Anxiety Support | Overcome Social Fear',
      description: 'Navigate social anxiety and fear of judgment. Build confidence in social settings. You\'re not broken.',
      openGraph: {
        title: 'Social Anxiety Support | Connection is Possible',
        description: 'Overcome social anxiety with practical strategies.',
      },
      keywords: ['social anxiety support', 'social fear', 'social anxiety disorder', 'overcoming shyness', 'anxiety in social situations'],
    },
    hero: {
      title: 'Struggling with social anxiety?',
      subtitle: 'Social anxiety can make everyday interactions feel overwhelming, but it is treatable. The fear of being judged or embarrassed often feels very real, even when others aren\'t thinking about you as much as you imagine.',
    },
    summary: 'Social anxiety is intense fear in social situations—worrying you\'ll be judged, embarrassed, or rejected. It causes avoidance of parties, meetings, or speaking up. Social anxiety is different from shyness; it causes significant distress. The hopeful news: therapy, gradual exposure, and coping strategies can significantly reduce social anxiety over time.',
    relatable: [
      'You rehearse conversations obsessively',
      'You imagine worst-case social scenarios',
      'Physical symptoms arrive before social situations (racing heart, sweating, nausea)',
      'You avoid eye contact or speaking',
      'You feel intensely self-conscious around others',
      'You leave social situations early or avoid them',
      'You worry about being judged for how you look or act',
      'You feel safe only with a few trusted people',
    ],
    situations: [
      'Parties or group gatherings',
      'Speaking up at work or school',
      'Meeting new people',
      'Making phone calls',
      'Eating or drinking in public',
      'Speaking in front of groups',
      'Dating or romantic interest',
      'Situations where you might be the center of attention',
    ],
    tips: [
      'Start small: attend one low-pressure social event',
      'Focus on others, not yourself—ask questions, listen',
      'Remember: most people are too focused on themselves to judge you harshly',
      'Practice small steps: talk to one cashier, ask a simple question, or start a brief conversation',
      'Practice self-compassion when anxiety shows up',
      'Don\'t use alcohol to manage social anxiety; it deepens anxiety long-term',
      'Breathing exercises before social situations help calm the nervous system',
      'Seek therapy, especially cognitive-behavioral therapy or exposure therapy',
    ],
    reflectionQuestions: [
      'What\'s your biggest fear in social situations?',
      'Have your fears about social situations come true in the way you expected?',
      'What would you do socially if you weren\'t afraid?',
      'Who in your life makes you feel comfortable and accepted?',
      'What\'s one small social step you could take?',
    ],
    whenToSeekSupport: 'Seek professional support if social anxiety is interfering with work, school, relationships, or daily life; if you\'re isolating yourself; if it\'s contributing to depression; or if you\'re relying on alcohol or substances to cope. Cognitive-behavioral therapy and exposure therapy are highly effective.',
    relatedCategories: ['anxiety', 'self-doubt', 'perfectionism', 'loneliness', 'low-self-esteem'],
    faq: [
      {
        question: 'Is social anxiety the same as shyness?',
        answer: 'No. Shyness is being quiet or reserved. Social anxiety is intense fear and avoidance. Shy people can be socially anxious, but they\'re different.',
      },
      {
        question: 'Will I always have social anxiety?',
        answer: 'No. With therapy, most people see significant improvement. Exposure therapy is particularly effective.',
      },
      {
        question: 'How do I handle anxiety during social situations?',
        answer: 'Grounding techniques help (5-4-3-2-1), breathing exercises, and reminding yourself anxiety is temporary. Over time, exposure reduces anxiety.',
      },
      {
        question: 'Should I force myself to socialize?',
        answer: 'Gentle exposure helps, but forced situations can backfire. Work with a therapist on gradual, manageable steps.',
      },
      {
        question: 'What if I panic at a social event?',
        answer: 'If you need to leave, leave. No shame. Over time, with exposure, staying becomes easier. Panic always passes.',
      },
      {
        question: 'How do I make friends with social anxiety?',
        answer: 'Join groups around interests, start small, be authentic. One or two genuine friends matter more than many shallow connections.',
      },
      {
        question: 'Is medication helpful for social anxiety?',
        answer: 'For some people, yes. Therapy is effective on its own, but combined treatment works well. Talk to a doctor.',
      },
      {
        question: 'What if I\'m afraid of being judged for my appearance or accent?',
        answer: 'These fears are common with social anxiety. Many people are more accepting than social anxiety makes us believe. Finding supportive communities and people who value you can help build confidence over time.',
      },
    ],
    trustSafety: {
      disclaimer: 'This content is educational and supportive. If social anxiety is affecting your daily life, relationships, work, or mental health, consider speaking with a mental health professional.',
      lastReviewedDate: '2025-02-15',
    },
  },

  // 14. PERFECTIONISM (already partially added above, but need to format properly)
  {
    slug: 'perfectionism',
    displayName: 'Perfectionism',
    seo: {
      title: 'Perfectionism Support | Release Impossible Standards',
      description: 'Overcome perfectionism and embrace good enough. Perfectionism robs joy. Real success is progress, not perfection.',
      openGraph: { title: 'Perfectionism Support | Good Enough Matters', description: 'Learn to release perfectionist standards and embrace progress.' },
      keywords: ['perfectionism support', 'perfectionism anxiety', 'high standards', 'overcoming perfectionism', 'all-or-nothing thinking'],
    },
    hero: { title: 'Struggling with perfectionism?', subtitle: 'Perfectionism can feel motivating or protective, but it often leads to stress, self-criticism, and exhaustion. Learning to value progress over perfection can improve both well-being and performance.' },
    summary: 'Perfectionism is the relentless pursuit of flawlessness and high standards. It leads to procrastination, burnout, anxiety, and missed opportunities. Perfectionism can feel motivating at first, but over time it often leads to stress, procrastination, and self-criticism. The key shift: aiming for excellence while accepting good enough.',
    relatable: ['You delay starting projects because they won\'t be perfect', 'Criticism or mistakes feel devastating', 'You can\'t enjoy accomplishments; you focus on what went wrong', 'You set impossibly high standards for yourself', 'You think in black-and-white: perfect or failure', 'You feel anxious about being judged', 'You spend excessive time on details that don\'t matter', 'You believe your worth depends on achievement'],
    situations: ['Work or academic pressure', 'Creative projects or writing', 'Relationships (being the perfect partner)', 'Parenting (being the perfect parent)', 'Appearance or body image', 'Fear of failure in any domain', 'High-achieving environments', 'Childhood experiences with critical parents'],
    tips: ['Aim for progress rather than perfection. Finishing something imperfect is often better than never finishing at all', 'Set a time limit for tasks; perfectionism often means endless tweaking', 'Practice saying "good enough" and moving on', 'Celebrate mistakes as learning, not failure', 'Notice the cost: perfectionism costs time, joy, and opportunities', 'Practice letting go of small imperfections, such as sending an email without rereading it multiple times or trying a hobby without focusing on the outcome', 'Separate your worth from your achievements', 'Ask yourself: "What would happen if this wasn\'t perfect?" Often, the outcome is less serious than you imagine.'],
    reflectionQuestions: ['Where did your perfectionism come from?', 'What has perfectionism cost you?', 'What would you do differently if good enough was truly okay?', 'What\'s one area where you could relax standards?', 'How would your life feel with 20% fewer standards?'],
    whenToSeekSupport: 'Seek professional support if perfectionism is affecting your mental health, relationships, work, or daily life, or if it is contributing to anxiety, depression, procrastination, or avoidance.',
    relatedCategories: ['anxiety', 'self-doubt', 'overwhelm', 'burnout', 'procrastination'],
    faq: [{ question: 'Isn\'t perfectionism good?', answer: 'Some drive for excellence is good. Perfectionism—the belief that only perfection is acceptable—is harmful. Striving for excellence can be healthy, but perfectionism often creates unrealistic expectations that are difficult to sustain.' }, { question: 'Will relaxing standards make me lazy?', answer: 'No. Most people work better with realistic standards. Perfectionism actually reduces productivity through procrastination and endless revision.' }, { question: 'How do I know when something is good enough?', answer: 'Ask: "Does this meet the actual requirements? Will it serve its purpose?" If yes, it\'s good enough. Often your standards are far higher than necessary.' }, { question: 'Can I be ambitious without being perfectionist?', answer: 'Yes. Ambition is wanting to achieve; perfectionism is believing only perfect outcomes are acceptable. High standards and perfectionism aren\'t the same.' }, { question: 'Why does perfectionism feel necessary?', answer: 'Often from past experiences: critical parents, conditional approval, or valuing performance over intrinsic worth. Therapy can address roots and loosen perfectionism\'s grip.' }, { question: 'How do I stop all-or-nothing thinking?', answer: 'Notice when you think "perfect or worthless." Interrupt that: "Actually, this is 7/10 and that\'s good." Practice gradation instead of extremes.' }, { question: 'Is perfectionism linked to anxiety or depression?', answer: 'Often yes. Perfectionism feeds anxiety (fear of not meeting standards) and depression (nothing ever feels good enough). Addressing perfectionism can improve both.' }, { question: 'Can perfectionism in one area (work) be okay?', answer: 'Sometimes, but perfectionism often spreads into other parts of life over time. Even when it seems helpful, it can come at the cost of rest, relationships, and well-being.' }],
    trustSafety: { disclaimer: 'This content is educational and supportive. If perfectionism is causing significant distress or is linked to anxiety, depression, or obsessive thoughts, consider speaking with a mental health professional.', lastReviewedDate: '2025-02-15' },
  },

  // 15-25: REMAINING EMOTIONS (condensed format for token efficiency)
  {
    slug: 'overwhelm',
    displayName: 'Overwhelm',
    seo: {
      title: 'Overwhelm Support | Managing Information Overload & Too Much',
      description: 'Overcome feeling overwhelmed. Too much is happening at once. Learn to simplify and prioritize.',
      openGraph: { title: 'Overwhelm Support | Breathe', description: 'Manage overwhelm and regain control of your life.' },
      keywords: ['overwhelm support', 'feeling overwhelmed', 'too much to do', 'managing stress', 'information overload'],
    },
    hero: { title: 'Feeling overwhelmed?', subtitle: 'When everything feels urgent and important, it can become difficult to focus, make decisions, or know where to start. Simplifying and prioritizing can help.' },
    summary: 'Overwhelm is the feeling that there\'s too much to handle—too many tasks, obligations, decisions, or information. It paralyzes you, creates anxiety, and affects sleep and relationships. The solution isn\'t always doing more; it\'s often about clarifying priorities, simplifying, and focusing on what matters most.',
    relatable: ['You don\'t know where to start so you do nothing', 'Everything feels urgent', 'You feel scattered and unfocused', 'You\'re behind on tasks that matter', 'Making decisions feels impossible', 'You feel paralyzed by the amount to do', 'Your mind is constantly racing', 'You\'re not finishing anything; just jumping between tasks'],
    situations: ['Multiple deadlines at once', 'Too many responsibilities (work, family, home)', 'Information overload (news, social media, emails)', 'Life transitions with many changes', 'Perfectionism plus high expectations', 'Lack of boundaries (saying yes to everything)', 'Disorganization or poor systems', 'Grief or major loss on top of daily stress'],
    tips: ['Write everything down—get it out of your head', 'Identify the 3 most important things this week', 'Focus on one priority at a time instead of trying to do everything at once', 'Stop saying yes to things that don\'t align with priorities', 'Group similar tasks together, such as answering emails or making phone calls, to reduce mental switching', 'Disconnect from news/social media for set periods', 'Delegate or drop non-essential tasks', 'Break large tasks into tiny steps; small progress reduces overwhelm'],
    reflectionQuestions: ['What\'s making you most overwhelmed right now?', 'Which of your current tasks actually matters most?', 'What could you stop doing or delegate?', 'What would it look like to simplify your life by 25%?', 'Where are you saying yes when you want to say no?'],
    whenToSeekSupport: 'Seek professional support if overwhelm is affecting your mental health, work, relationships, or daily functioning; if it is contributing to anxiety or depression; if you\'re relying on substances to cope; or if you\'re having thoughts of self-harm.',
    relatedCategories: ['stress', 'perfectionism', 'burnout', 'anxiety', 'time-management'],
    faq: [{ question: 'How do I distinguish overwhelm from anxiety?', answer: 'Overwhelm is usually triggered by too many tasks or information. Anxiety is the emotional response to threat. They often go together. Both improve with simplification and support.' }, { question: 'What if I really do have too much to do?', answer: 'If your responsibilities genuinely exceed your capacity, it may be necessary to reprioritize, ask for help, delegate tasks, or adjust expectations.' }, { question: 'How do I say no without guilt?', answer: 'It\'s okay to say no. You don\'t always need elaborate justification. Try: "That doesn\'t fit my priorities right now."' }, { question: 'How do I stop multi-tasking?', answer: 'Research shows multitasking reduces efficiency. Focus on one task at a time. Use timers if needed. You\'ll finish more by doing less.' }, { question: 'What if my job demands I do too much?', answer: 'Document what\'s asked. Talk to your manager: "Help me prioritize." If your job is truly unsustainable, consider alternatives.' }, { question: 'How do I not feel guilty about relaxing?', answer: 'Relaxation is maintenance, not laziness. Your productivity depends on rest. Guilt about resting is often perfectionism in disguise.' }, { question: 'Can I ever get ahead?', answer: 'Feeling "caught up" isn\'t always realistic. Sometimes progress comes from focusing on what matters most rather than trying to do everything.' }, { question: 'How do I know what to prioritize?', answer: 'Ask: "What has real consequences if not done? What aligns with my values?" Not everything urgent is important. Distinguish between the two.' }],
    trustSafety: { disclaimer: 'This content is educational and supportive. If overwhelm is persistent or linked to anxiety, depression, or burnout, consider speaking with a mental health professional.', lastReviewedDate: '2025-02-15' },
  },

  // 16-25: Quick-format remaining emotions (full quality, condensed syntax)
  { slug: 'low-self-esteem', displayName: 'Low Self-Esteem', seo: { title: 'Low Self-Esteem Support | Build Self-Worth & Confidence', description: 'Improve self-esteem and self-worth. You\'re worthy right now, not because of what you do.', openGraph: { title: 'Self-Esteem Support | You\'re Worthy', description: 'Build genuine confidence and self-acceptance.' }, keywords: ['low self-esteem', 'self-worth', 'building confidence', 'self-acceptance', 'feeling worthless'] }, hero: { title: 'Struggling with low self-esteem?', subtitle: 'Low self-esteem can affect how you see yourself and your abilities, but confidence and self-worth can be rebuilt over time.' }, summary: 'Low self-esteem often involves feeling as though you\'re not good enough—not worthy, capable, or deserving of good things. It stems from childhood experiences, trauma, criticism, or repeated failures. Low self-esteem affects relationships, work, and mental health. The path to higher self-esteem: self-compassion, challenging negative beliefs, and positive actions.', relatable: ['You feel unworthy of love or success', 'You blame yourself for everything that goes wrong', 'You accept treatment others wouldn\'t', 'You minimize your accomplishments', 'You believe others\' criticism over their praise', 'You feel shame about your body, appearance, or abilities', 'You stay small to avoid standing out', 'You feel like a burden to others'], situations: ['Childhood criticism or neglect', 'Bullying or peer rejection', 'Repeated failures or setbacks', 'Comparing yourself to others', 'Abuse or toxic relationships', 'Difficult life circumstances', 'Perfectionism and unmet standards', 'Social media and unrealistic comparisons'], tips: ['Notice negative self-talk; challenge it with evidence', 'Practice self-compassion: treat yourself like a good friend', 'List three things you\'ve accomplished or qualities you value in yourself, no matter how small.', 'Do one thing that makes you feel capable today', 'Set a boundary with someone who\'s critical or controlling', 'Spend time with people who value you', 'Do something kind for yourself (not punishment)', 'Consider therapy or counseling; low self-esteem often has deeper roots that can take time to understand.'], reflectionQuestions: ['Where does your low self-esteem come from?', 'What would it feel like to believe you\'re worthy?', 'What are you actually good at?', 'Who in your life believes in you? Why?', 'What\'s one way you could treat yourself with more kindness?'], stories: [{ title: 'Priya\'s Reparenting', content: 'Priya\'s parents were critical. She internalized that message: she wasn\'t good enough. Therapy helped her identify the critical voice as her parents\' voice, not truth. She practiced reparenting—talking to herself kindly.' }, { title: 'Marcus\'s Action', content: 'Marcus felt worthless and stuck. His therapist had him set one small goal and complete it. That one win shifted something. Small actions built confidence.' }, { title: 'Zara\'s Boundaries', content: 'Zara\'s low self-esteem made her accept poor treatment. Setting a boundary—telling her partner certain behavior wouldn\'t be tolerated—was terrifying but empowering.' }], whenToSeekSupport: 'Seek therapy if: low self-esteem is preventing you from living fully; it\'s linked to depression, anxiety, or eating disorders; or you\'re considering self-harm.', relatedCategories: ['depression', 'anxiety', 'perfectionism', 'self-doubt', 'shame'], faq: [{ question: 'Is self-esteem the same as being arrogant?', answer: 'No. High self-esteem is knowing your worth; it\'s humble and grounded. Arrogance is defensive and insecure. Healthy self-esteem is usually grounded and doesn\'t depend on proving your worth to others.' }, { question: 'Can I build self-esteem through achievements?', answer: 'Achievements can boost confidence, but lasting self-esteem usually comes from self-compassion, supportive relationships, and recognizing your value beyond success or failure.' }, { question: 'How long does it take to improve self-esteem?', answer: 'It varies. If lifelong, it takes time and consistent work. Months of therapy and practice usually show significant improvement.' }, { question: 'Should I avoid people who criticize me?', answer: 'Constructive criticism helps growth. Chronic criticism or contempt is harmful. Limit people who tear you down; spend time with people who see your worth.' }, { question: 'What if my self-esteem is tied to my appearance?', answer: 'Challenge the belief that appearance determines worth. Qualities such as kindness, resilience, humor, and the way you treat others also play an important role in self-worth. Therapy helps.' }, { question: 'Can low self-esteem cause depression?', answer: 'Often they go together. Low self-esteem contributes to depression. Improving one helps the other. Professional support addresses both.' }, { question: 'Is medication helpful for low self-esteem?', answer: 'Medication doesn\'t directly treat self-esteem, but if linked to depression or anxiety, medication can help those conditions, clearing space for esteem work.' }, { question: 'What if I\'m in a relationship with someone who lowers my self-esteem?', answer: 'Healthy relationships build each other up. If a partner consistently diminishes you, couples therapy or individual therapy can help you decide what\'s needed.' }], trustSafety: { disclaimer: 'This content is educational and supportive. If low self-esteem is affecting your mental health or is linked to self-harm, depression, anxiety, or eating disorders, consider speaking with a mental health professional.', lastReviewedDate: '2025-02-15' } },

  // 17. BURNOUT
  { slug: 'burnout', displayName: 'Burnout', seo: { title: 'Experiencing Burnout? Signs, Causes & Recovery Tips | SoulConnect', description: 'Learn the signs and causes of burnout, understand how chronic stress affects well-being, and explore practical strategies for rest, recovery, and balance.', openGraph: { title: 'Burnout Support | Recovery & Resources', description: 'Overcome burnout with rest, support, and meaningful change.' }, keywords: ['burnout support', 'job burnout', 'burnout recovery', 'workplace exhaustion', 'caregiver burnout'] }, hero: { title: 'Experiencing burnout?', subtitle: 'Burnout can happen when prolonged stress and pressure leave you physically and emotionally exhausted. Recovery often requires rest, support, and meaningful change.' }, summary: 'Burnout is a state of physical, emotional, and mental exhaustion caused by prolonged stress, often related to work, caregiving, or other ongoing responsibilities. Burnout often involves chronic fatigue, emotional exhaustion, cynicism, reduced effectiveness, and feeling trapped. Burnout can be a sign that something in your life, work, or responsibilities needs to change. Unlike ordinary tiredness, burnout often requires meaningful changes such as rest, stronger boundaries, lifestyle adjustments, or additional support.', relatable: ['You\'re exhausted despite sleeping', 'You feel cynical about work or life', 'Nothing excites you anymore', 'You make more mistakes than usual', 'You\'re irritable with everyone', 'You feel stuck, discouraged, or emotionally drained', 'Physical symptoms: headaches, body pain, frequent illness', 'You\'ve lost motivation for things you used to enjoy'], situations: ['Years of overwork without adequate rest', 'Caring for a sick or dying loved one', 'Helping professions (healthcare, teaching, social work, caregiving)', 'Perfectionism meeting endless demands', 'Lack of support or recognition', 'Values misalignment with work', 'Accumulation of stress without processing', 'No boundaries between work and personal life'], tips: ['Take time to rest whenever possible and create space away from work responsibilities', 'Set firm work hours and protect personal time', 'Find meaning and purpose outside work', 'Prioritize sleep, movement, and regular meals to support your physical and emotional well-being', 'Talk to someone you trust or a therapist', 'Reflect on whether your current responsibilities and expectations are sustainable', 'Consider a leave of absence if possible', 'Consider what changes—whether at work, at home, or in your routine—might help reduce stress'], reflectionQuestions: ['What has been consuming your energy for so long?', 'What would rest and recovery look like?', 'What\'s no longer sustainable in your current situation?', 'What changes are necessary?', 'What support do you need?'], stories: [{ title: 'Sarah\'s Breakdown', content: 'Sarah worked 70-hour weeks for 5 years. She had a breakdown at work. Her doctor ordered her to take 3 months off. During rest, she realized the job cost her health. She changed careers. Best decision ever.' }, { title: 'James\'s Boundaries', content: 'James was a therapist experiencing burnout. He set boundaries: fewer clients, protected personal time, exercise daily. Within months, his enthusiasm returned.' }, { title: 'Zara\'s Realization', content: 'Zara realized her burnout meant her values and job were misaligned. She couldn\'t fix it through rest alone; she needed a different role. Finding work aligned with her values was transformative.' }], whenToSeekSupport: 'Seek professional support if burnout is affecting your health, relationships, work, or daily functioning; if you\'re relying on alcohol or substances to cope; or if you\'re experiencing depression, anxiety, or thoughts of self-harm.', relatedCategories: ['work-stress', 'depression', 'stress', 'emotional-exhaustion', 'anxiety'], faq: [{ question: 'Is burnout the same as depression?', answer: 'Related but different. Burnout is often linked to chronic stress, especially at work or in caregiving roles. Depression is broader low mood. They often co-occur. Both can benefit from support and, in some cases, professional treatment.' }, { question: 'Can rest alone cure burnout?', answer: 'Rest helps, but if you return to the same situation, burnout returns. Real change (job, role, boundaries, lifestyle) is usually necessary.' }, { question: 'Should I quit my job?', answer: 'Not necessarily, but honestly assess: Is this sustainable? Can changes (boundaries, role adjustment, support) help? If no, leaving might be necessary.' }, { question: 'How long does burnout recovery take?', answer: 'Recovery looks different for everyone and can take weeks or months depending on the causes and the support available. If the situation doesn\'t change, recovery is difficult.' }, { question: 'Is burnout my fault?', answer: 'No. While personal choices matter, burnout usually results from unsustainable situations. Burnout is not a sign of weakness or failure.' }, { question: 'Can I prevent burnout?', answer: 'Yes. Regular rest, clear boundaries, work-life separation, purpose outside work, and realistic expectations prevent burnout.' }, { question: 'What if I can\'t afford to leave my job?', answer: 'Financial constraints are real. Set boundaries while exploring alternatives. Therapy can help you manage stress in difficult situations.' }, { question: 'How do I know if I\'m recovering?', answer: 'You sleep better, feel more energy, have more patience, find small things enjoyable again, and feel hope for the future.' }], trustSafety: { disclaimer: 'This content is educational and supportive. If burnout is affecting your health, daily functioning, or is linked to depression, anxiety, or thoughts of self-harm, consider speaking with a healthcare or mental health professional.', lastReviewedDate: '2025-02-15' } },

  // 18-25: Remaining emotions (condensed)
  { slug: 'jealousy', displayName: 'Jealousy', seo: { title: 'Jealousy Support | Managing Envy & Insecurity', description: 'Understand jealousy and transform it. Jealousy is a signal, not a flaw.', openGraph: { title: 'Jealousy Support | Understanding Envy', description: 'Navigate jealousy and insecurity with compassion.' }, keywords: ['jealousy support', 'managing jealousy', 'envy', 'insecurity', 'relationship jealousy'] }, hero: { title: 'Struggling with jealousy?', subtitle: 'Jealousy is normal and often a signal something matters. Understanding it helps.' }, summary: 'Jealousy is the fear of losing someone or something precious. It\'s different from envy (wanting what others have). Jealousy can be protective or toxic depending on how you handle it. Understanding what triggers jealousy—usually unmet needs or insecurity—helps address it constructively.', relatable: ['You feel anxious when your partner talks to someone attractive', 'You compare yourself to others', 'You track your partner\'s movements or communications', 'You feel threatened by others\' success', 'You want constant reassurance', 'Jealousy leads to conflict or controlling behavior', 'You feel like the bad guy for feeling jealous', 'You recognize jealousy isn\'t rational but can\'t stop it'], situations: ['A partner\'s close friendships or relationships that trigger insecurity', 'Others\' career success or achievements', 'Former partners or exes', 'Relationship insecurity or early dating', 'When you feel less-than in some way', 'Lack of trust in relationship', 'Childhood experiences with abandonment', 'Relationship dynamics where you feel devalued'], tips: ['Identify what jealousy is signaling: What\'s the real fear?', 'Communicate the feeling, not the accusation: "I feel insecure when..." not "You always..."', 'Work on self-esteem and your own worthiness', 'Trust takes time to build through honest communication, consistency, and healthy boundaries', 'Don\'t surveil or control; that creates more distance', 'Channel jealousy into improving yourself, not criticizing others', 'If jealousy is intense, therapy helps understand roots', 'Remember: you can\'t control others, only your responses'], reflectionQuestions: ['What\'s the real fear under your jealousy?', 'Does jealousy protect anything or just create conflict?', 'What would trusting your partner look like?', 'Where did your insecurity come from?', 'How can you build your own confidence independent of your partner?'], stories: [{ title: 'Marcus\'s Realization', content: 'Marcus was jealous of his girlfriend\'s close male friend. She said, "I chose you. Him being my friend doesn\'t diminish that." Marcus realized his jealousy was about his own insecurity, not her behavior.' }, { title: 'Priya\'s Breakthrough', content: 'Priya was jealous of her colleague\'s promotion. Instead of resenting her friend, she asked for advice. That shift transformed jealousy into learning and growth.' }, { title: 'James\'s Control', content: 'James tracked his wife\'s location and questioned her about friendships. His jealousy was controlling and toxic. Therapy helped him see this wasn\'t about protecting their relationship; it was about his fear and insecurity.' }], whenToSeekSupport: 'Seek help if: jealousy is leading to controlling behavior; it\'s causing frequent conflict; it\'s affecting your self-esteem; or you\'re having thoughts of harming yourself or others.', relatedCategories: ['insecurity', 'relationship-issues', 'low-self-esteem', 'anxiety', 'self-doubt'], faq: [{ question: 'Is jealousy normal?', answer: 'Yes, some jealousy is normal. Protecting what matters makes sense. Obsessive or controlling jealousy isn\'t healthy.' }, { question: 'Is my jealousy justified?', answer: 'Maybe. If your partner is crossing boundaries, that\'s information. Jealousy can sometimes stem from insecurity, unmet needs, or past experiences. Reflecting on both your feelings and the situation can help you understand what\'s driving it.' }, { question: 'How do I trust someone?', answer: 'Trust builds through consistency. Give them chances to be trustworthy. If they repeatedly violate trust, decide if the relationship is worth it.' }, { question: 'Should I tell my partner I\'m jealous?', answer: 'Yes, but frame it: "I feel insecure sometimes" not "You make me jealous." Vulnerability invites understanding, not defensiveness.' }, { question: 'Is checking my partner\'s phone justified?', answer: 'No. Checking violates privacy and erodes trust. If you need to check, trust is broken. Address that directly through conversation or therapy.' }, { question: 'Can my partner reduce my jealousy?', answer: 'Reassurance and transparency can help, but building confidence and addressing insecurity often requires personal reflection and communication.' }, { question: 'What if my jealousy is ruining my relationship?', answer: 'Get help now. Individual therapy helps you address insecurity. Couples therapy helps communication. Jealousy can be worked on, but it requires effort.' }, { question: 'Is there a difference between jealousy in new vs. long-term relationships?', answer: 'Yes. Early relationship jealousy is often normal (bonding happens). Long-term jealousy usually indicates deeper insecurity that deserves attention.' }], trustSafety: { disclaimer: 'This content is educational and supportive. If jealousy is causing significant distress or leading to controlling, abusive, or harmful behavior, consider seeking professional support.', lastReviewedDate: '2025-02-15' } },

  // 19-25: Final emotions (condensed for token efficiency, full quality)
  { slug: 'guilt', displayName: 'Guilt', seo: { title: 'Guilt: Signs, Causes & Self-Forgiveness Support | SoulConnect', description: 'Learn about guilt, self-blame, and self-forgiveness. Explore common triggers, coping strategies, and emotional support with SoulConnect.', openGraph: { title: 'Guilt Support | Healing from Regret', description: 'Process guilt and move toward self-forgiveness.' }, keywords: ['guilt support', 'feeling guilty', 'regret', 'processing guilt', 'self-forgiveness'] }, hero: { title: 'Struggling with guilt?', subtitle: 'Guilt can be painful and difficult to let go of, but it can also help you reflect, learn, and move forward.' }, summary: 'Guilt is the feeling that you\'ve done something wrong or failed to meet your own values or expectations. Unlike shame (feeling like you ARE wrong), guilt is about actions. Healthy guilt motivates you to make amends and change. Unhealthy guilt keeps you stuck in regret. The path forward: acknowledge what happened, make amends if possible, and practice self-forgiveness.', relatable: ['You replay past mistakes obsessively', 'You feel like you\'ve let people down', 'You apologize excessively', 'You feel responsible for others\' emotions or problems', 'You punish yourself for mistakes', 'You struggle to forgive yourself', 'You believe you don\'t deserve good things because of past actions', 'Guilt prevents you from moving forward'], situations: ['Hurting someone you care about', 'Betrayal or broken trust', 'Not being there when someone needed you', 'Making a poor decision with consequences', 'Survival guilt (surviving when others didn\'t)', 'Not meeting someone\'s expectations', 'Feeling that you prioritized your own needs when others needed support', 'Experiencing success or happiness when others are struggling'], tips: ['Acknowledge what happened without harsh judgment', 'Make amends if possible and safe', 'Learn from the experience; what will you do differently?', 'Practice self-compassion: everyone makes mistakes', 'Set appropriate limits on responsibility (you\'re not responsible for others\' emotions)', 'Forgive yourself in stages; it\'s not instant', 'Do something to honor what happened (donate, volunteer, help others)', 'Distinguish between healthy guilt (motivates change) and unhealthy guilt (keeps you stuck)'], reflectionQuestions: ['What happened and why do you feel guilty about it?', 'What would genuine amends look like?', 'Are you responsible for this, or are you taking on others\' responsibility?', 'What have you learned from this experience?', 'How can you practice self-forgiveness?'], stories: [{ title: 'Chen\'s Guilt', content: 'Chen was late to visit his grandfather, who died that night. Guilt consumed him. Therapy helped him realize he couldn\'t have known and couldn\'t have changed the outcome. He honored his grandfather\'s memory instead of drowning in guilt.' }, { title: 'Sophia\'s Amends', content: 'Sophia hurt a friend with careless words years ago. She finally reached out and apologized. Her friend forgave her. Making amends freed Sophia from guilt\'s weight.' }, { title: 'Marcus\'s Boundary', content: 'Marcus felt guilty for setting a boundary with his mother. Therapy helped him realize that protecting himself wasn\'t selfish or wrong. Guilt softened when he recognized his right to boundaries.' }], whenToSeekSupport: 'Seek professional support if guilt is persistent, overwhelming, or preventing you from enjoying relationships, work, or daily life; if it is linked to depression or self-harm; or if you\'re struggling to forgive yourself.', relatedCategories: ['shame', 'depression', 'regret', 'self-doubt', 'trauma'], faq: [{ question: 'Is guilt always bad?', answer: 'No. Healthy guilt signals that you care and motivates change. Unhealthy guilt keeps you stuck without leading to change.' }, { question: 'How do I know if my guilt is warranted?', answer: 'Ask yourself: Did I actually do something wrong? Am I taking responsibility for something outside my control? Is this feeling helping me grow or keeping me stuck?' }, { question: 'Should I apologize for everything I feel guilty about?', answer: 'Not necessarily. Some guilt is about things outside your control. Apologize for things you actually did wrong and that affected others.' }, { question: 'How do I forgive myself?', answer: 'Acknowledge what happened, make amends if possible, learn from it, and consciously practice self-compassion. Forgiveness is gradual, not instant.' }, { question: 'What if the other person won\'t forgive me?', answer: 'You can\'t control their forgiveness. You can apologize sincerely and make amends. Then you work on forgiving yourself, independent of their response.' }, { question: 'How do I stop feeling responsible for others?', answer: 'Recognize the boundary: you\'re responsible for your actions, not others\' reactions or problems. Therapy can help establish healthy boundaries.' }, { question: 'Is guilt linked to depression?', answer: 'Often. Excessive guilt contributes to depression. Addressing guilt can improve mood. Both deserve professional attention.' }, { question: 'Can I use guilt productively?', answer: 'Yes. Guilt can motivate you to make amends, change behavior, or help others. The key is using it for positive change, not self-punishment.' }], trustSafety: { disclaimer: 'This content is educational and supportive. If guilt is persistent, overwhelming, or linked to depression, anxiety, or self-harm, consider speaking with a mental health professional.', lastReviewedDate: '2025-02-15' } },

  // 20. SHAME
  { slug: 'shame', displayName: 'Shame', seo: { title: 'Shame: Signs, Causes & Self-Acceptance Support | SoulConnect', description: 'Learn about shame, self-worth, and emotional healing. Explore common causes, coping strategies, and ways to build self-compassion with SoulConnect.', openGraph: { title: 'Shame Support | Healing & Self-Acceptance', description: 'Heal from shame and reconnect with your inherent worth.' }, keywords: ['shame support', 'feeling ashamed', 'overcoming shame', 'shame resilience', 'self-rejection'] }, hero: { title: 'Struggling with shame?', subtitle: 'Shame can make you feel isolated, flawed, or unworthy, but those feelings do not define who you are. Healing and self-acceptance are possible.' }, summary: 'Shame is the feeling that you ARE bad or fundamentally flawed, unlike guilt which is about actions. Shame makes you want to hide or disappear. It\'s often rooted in childhood experiences, trauma, or internalized negative messages. Shame is treatable through vulnerability, self-compassion, and professional support.', relatable: ['You feel fundamentally broken or defective', 'You believe you don\'t deserve good things', 'You hide parts of yourself from others', 'You feel unworthy of love or respect', 'You over-apologize or minimize yourself', 'You judge yourself harshly for natural human experiences', 'You isolate to avoid being "found out"', 'You feel embarrassed about your body, sexuality, or identity'], situations: ['Childhood criticism, abuse, or neglect', 'Sexual trauma or abuse', 'Discrimination based on race, gender, sexuality, or identity', 'Financial hardship or poverty', 'Mental or physical health conditions', 'Grief or loss', 'Feeling different from social, cultural, or family expectations', 'Feeling different from peers'], tips: ['Name what you\'re feeling: "I\'m experiencing shame right now, and this feeling doesn\'t define my worth."', 'Share your experience with someone you trust (shame thrives in silence)', 'Practice self-compassion and gentle self-talk', 'Question shame\'s messages: Are they actually true?', 'Connect with others who share similar experiences (support groups, therapy)', 'Engage in activities that make you feel capable and worthy', 'Challenge internalized negative messages from your past', 'Seek professional help; shame often has deep roots requiring therapy'], reflectionQuestions: ['Where does your shame come from? Early experiences? Someone\'s words?', 'What messages did you internalize about your worth?', 'What would it feel like to believe you\'re fundamentally okay?', 'Who in your life sees your worth when you can\'t?', 'What small step could you take toward self-acceptance?'], stories: [{ title: 'Priya\'s Visibility', content: 'Priya felt shame about her heritage and tried to hide it. Therapy and connecting with her community helped her see that her heritage was beautiful, not shameful. Visibility became possible.' }, { title: 'James\'s Secret', content: 'James carried shame about his mental health diagnosis. When he finally told a friend, she said, "That doesn\'t define you." Vulnerability shattered shame\'s power.' }, { title: 'Zara\'s Reparenting', content: 'Zara\'s parents taught her to be ashamed of her body and sexuality. Years of therapy helped her reparent herself—teaching herself that her body and desires were normal and okay.' }], whenToSeekSupport: 'Seek help if: shame is preventing you from living authentically; it\'s linked to depression or self-harm; you\'re isolated; or you\'re unable to see your own worth. Therapy is powerful for shame work.', relatedCategories: ['guilt', 'depression', 'trauma', 'low-self-esteem', 'anxiety'], faq: [{ question: 'Is shame the same as guilt?', answer: 'No. Guilt is about actions ("I did something bad"). Shame is about identity ("I am bad"). Shame is more damaging and harder to address.' }, { question: 'Why does shame make me want to hide?', answer: 'Shame triggers the fight-flight-freeze response. Hiding feels protective. But isolation deepens shame. Connection and vulnerability heal it.' }, { question: 'Can I overcome shame?', answer: 'Yes. With therapy, vulnerability, and self-compassion, shame can be processed and healed. It takes time, but recovery is possible.' }, { question: 'Should I tell people about my shame?', answer: 'Selective vulnerability helps. Sharing with safe, trusted people breaks shame\'s silence. Not everyone needs to know, but some people should.' }, { question: 'How is shame different from low self-esteem?', answer: 'Low self-esteem is thinking you\'re not good enough. Shame is believing you\'re fundamentally defective. Shame is deeper and more pervasive.' }, { question: 'What if my shame is about trauma?', answer: 'Trauma-related shame is particularly deep. Trauma-informed therapy (EMDR, somatic experiencing) can help process both trauma and shame.' }, { question: 'Can shame ever be useful?', answer: 'Rarely. Shame usually damages more than it helps. Guilt is more useful (it motivates change). Shame often leads to withdrawal, self-criticism, and isolation.' }, { question: 'How do I practice self-compassion when I feel ashamed?', answer: 'Talk to yourself like you\'d talk to a friend in pain. Acknowledge the feeling without judgment. Remind yourself: "I\'m human. Everyone struggles."' }], trustSafety: { disclaimer: 'This content is educational and supportive. If shame is affecting your mental health, relationships, or daily life, or if it is linked to trauma, self-harm, or suicidal thoughts, consider speaking with a mental health professional.', lastReviewedDate: '2025-02-15' } },

  // 21. FEELING LOST
  { slug: 'feeling-lost', displayName: 'Feeling Lost', seo: { title: 'Feeling Lost in Life | Direction & Purpose Support', description: 'Navigate feeling lost and find direction. You can rebuild your sense of purpose and belonging.', openGraph: { title: 'Feeling Lost Support | Finding Your Way', description: 'Discover meaning and direction when you feel lost.' }, keywords: ['feeling lost', 'lack of direction', 'purpose', 'life direction', 'finding meaning'] }, hero: { title: 'Feeling lost or adrift?', subtitle: 'Not knowing where you\'re going is disorienting. But it\'s also an opportunity to reassess and redirect.' }, summary: 'Feeling lost is the disorientation that comes from lacking direction, purpose, or clarity about who you are or where you\'re headed. It often follows major life changes, loss, or periods of stagnation. Feeling lost is temporary and navigable—it\'s often the doorway to self-discovery and meaningful change.', relatable: ['You don\'t know what you want anymore', 'Everything feels meaningless or pointless', 'You\'re going through the motions without genuine engagement', 'You question major life decisions (career, relationships, etc.)', 'You feel disconnected from your values or goals', 'You\'re comparing yourself to others who seem to have it figured out', 'You don\'t recognize yourself anymore', 'You feel stuck between the past and an uncertain future'], situations: ['Major life transitions (career change, breakup, relocation)', 'Reaching a major goal and feeling empty afterward', 'Loss of identity (retirement, kids moving out, health changes)', 'Reevaluating deeply held beliefs or values', 'Prolonged stress or burnout that disconnected you from purpose', 'Grief or loss that shook your foundation', 'Realizing a path you chose isn\'t right for you anymore', 'Existential questions about meaning and purpose'], tips: ['Give yourself permission to not have all the answers', 'Reconnect with your values: What actually matters to you?', 'Explore without pressure: try new things, meet new people, take a class', 'Journal about your questions; clarity emerges through writing', 'Talk to people you admire about their journeys', 'Revisit what used to bring you joy; is it still there?', 'Consider therapy or coaching to explore direction', 'Remember: feeling lost is often the beginning of finding yourself'], reflectionQuestions: ['When did you last feel clear about your direction?', 'What changed since then?', 'What\'s important to you now (not what you think should be important)?', 'If you could design your ideal life, what would it look like?', 'What\'s one small exploration you could start this month?'], stories: [{ title: 'Sarah\'s Reckoning', content: 'Sarah had climbed the career ladder as planned. At the top, she felt empty. She took a sabbatical to figure out what she actually wanted. Feeling lost became the catalyst for redesigning her life around meaning, not achievement.' }, { title: 'James\'s Identity Shift', content: 'James\'s identity was wrapped up in his career. When he was laid off, he felt lost. Forced reflection helped him discover other parts of himself he\'d neglected. Loss became opportunity.' }, { title: 'Zara\'s Values Reckoning', content: 'Zara realized her path (chosen by family) wasn\'t her path. Feeling lost meant honoring her own values. It was scary but authentic.' }], whenToSeekSupport: 'Seek help if: feeling lost is causing depression or anxiety; you\'re considering self-harm; it\'s paralyzing your ability to function; or you want guidance in exploring direction.', relatedCategories: ['depression', 'anxiety', 'grief', 'burnout', 'purpose'], faq: [{ question: 'Is feeling lost permanent?', answer: 'No. Feeling lost is usually temporary, though it can last months or years depending on the cause. Exploration and support help you find direction again.' }, { question: 'How do I know what I want?', answer: 'Notice what energizes you. Pay attention to what you naturally gravitate toward. Your values, not others\' expectations, should guide you.' }, { question: 'Should I make big changes while feeling lost?', answer: 'Not necessarily immediately. Give yourself time to explore and reflect first. Major changes made in panic often don\'t address the real issue.' }, { question: 'What if everyone else seems to have it figured out?', answer: 'They probably don\'t. Most people feel lost at some point. Social media and polished presentations hide uncertainty. You\'re not alone.' }, { question: 'How do I find purpose?', answer: 'Purpose is often found by doing: volunteering, creating, connecting, learning. Sit less, do more. Purpose emerges through engagement.' }, { question: 'Is feeling lost a mental health problem?', answer: 'Not necessarily. It\'s a normal response to life transitions. But if it\'s causing depression, anxiety, or paralysis, professional support helps.' }, { question: 'Should I do therapy or coaching?', answer: 'Both can help. Therapy addresses underlying emotional blocks. Coaching helps you explore direction and make changes. Consider what you need.' }, { question: 'What if I\'m afraid of the answer I find?', answer: 'Fear is normal when facing big changes. A therapist can help you work through fear while you explore. You don\'t have to move fast.' }], trustSafety: { disclaimer: 'If feeling lost is linked to depression, anxiety, or self-harm thoughts, seek professional mental health support.', lastReviewedDate: '2025-02-15' } },

  // 22. EMOTIONAL EXHAUSTION
  { slug: 'emotional-exhaustion', displayName: 'Emotional Exhaustion', seo: { title: 'Emotional Exhaustion Support | Compassion Fatigue & Empathy Burnout', description: 'Recover from emotional exhaustion. Caring doesn\'t have to drain you. Boundaries help.', openGraph: { title: 'Emotional Exhaustion Support | Rest Matters', description: 'Manage emotional exhaustion and protect your wellbeing.' }, keywords: ['emotional exhaustion', 'compassion fatigue', 'empathy burnout', 'emotional fatigue', 'caring burnout'] }, hero: { title: 'Emotionally exhausted?', subtitle: 'Caring deeply depletes you when boundaries are missing. You can care AND protect yourself.' }, summary: 'Emotional exhaustion is the depletion that comes from absorbing others\' emotions, chronic stress, or intense caregiving without adequate support or boundaries. It\'s different from regular tiredness—it\'s the fatigue of your emotional reserves being constantly drawn upon. Emotional exhaustion is preventable and recoverable with boundaries, self-care, and support.', relatable: ['You absorb others\' emotions and problems', 'You can\'t stop thinking about others\' struggles', 'You feel emotionally numb or disconnected', 'You\'re irritable even though you love people', 'You feel like a tank running on empty', 'You cry easily or feel overwhelmed by emotion', 'You\'ve lost the ability to feel joy', 'Helping others leaves you drained, not fulfilled'], situations: ['Caregiving (children, elderly parents, sick loved ones)', 'Helping professions (therapy, nursing, social work, teaching)', 'Being the emotional support for multiple people', 'Chronic stress without adequate support', 'Absorbing family dynamics or others\' trauma', 'Setting no boundaries on emotional labor', 'Empathy without self-protection', 'Unprocessed personal trauma'], tips: ['Set boundaries on emotional labor: it\'s okay to say "I can\'t listen right now"', 'Process your own emotions regularly (therapy, journal, talk to someone)', 'Do something that replenishes you—non-negotiably, regularly', 'Notice the difference between empathy (understanding) and absorbing (taking on)', 'Build time alone into your schedule; it\'s restorative, not selfish', 'Limit exposure to heavy content (news, social media about others\' suffering)', 'Communicate needs to people you care for: "I care AND I need to protect my wellbeing"', 'Seek professional support; emotional exhaustion often needs help to recover from'], reflectionQuestions: ['Whose emotions are you carrying that aren\'t yours?', 'What boundaries do you need to set?', 'What replenishes you emotionally?', 'How do you define caring for others without losing yourself?', 'What would feel like "enough" in terms of helping others?'], stories: [{ title: 'Priya\'s Boundary', content: 'Priya was a therapist who absorbed clients\' pain. She was emotionally exhausted. Setting boundaries (limiting client load, not taking work home emotionally, processing her own stuff) helped her care sustainably.' }, { title: 'James\'s Family', content: 'James was the emotional support for his whole family. Everyone\'s problems landed on him. Learning to say "I can\'t fix this for you" was hard but necessary.' }, { title: 'Zara\'s Self-Care', content: 'Zara sacrificed everything for her kids and partner. She was running on empty. Reclaiming time for herself (exercise, friends, hobbies) wasn\'t selfish; it made her a better parent and partner.' }], whenToSeekSupport: 'Seek help if: emotional exhaustion is causing depression or numbness; you\'re unable to care for yourself; you\'re using substances to cope; or you\'re having thoughts of self-harm.', relatedCategories: ['burnout', 'stress', 'compassion-fatigue', 'depression', 'boundaries'], faq: [{ question: 'Is emotional exhaustion the same as burnout?', answer: 'Related but different. Burnout is work-related exhaustion. Emotional exhaustion can come from caregiving, relationships, or empathy work. Both require intervention.' }, { question: 'How do I stop absorbing others\' emotions?', answer: 'Recognize the boundary: their feelings are theirs; yours are yours. Practice empathy without absorbing. A therapist can help you build this skill.' }, { question: 'Is setting boundaries selfish?', answer: 'No. Setting boundaries is necessary for sustainable caring. You can\'t pour from an empty cup. Protecting yourself helps you show up better for others.' }, { question: 'How do I recover from emotional exhaustion?', answer: 'Time, boundaries, support, and self-care. It often requires reducing emotional demands while you recover. Professional support accelerates healing.' }, { question: 'Should I leave a caregiving role?', answer: 'Not necessarily. But the role needs to be sustainable. Changes (boundaries, support, reduced hours, professional help) usually make a difference.' }, { question: 'How do I know if I\'m emotionally exhausted or depressed?', answer: 'They often overlap. Emotional exhaustion from unmet needs. Depression is broader low mood. Both deserve professional attention.' }, { question: 'What replenishes emotional energy?', answer: 'Different for everyone: time alone, creative activities, time in nature, connection with select people, movement, spirituality. Notice what actually helps.' }, { question: 'Can I care AND protect myself?', answer: 'Absolutely. Healthy caring includes boundaries and self-protection. It\'s not either/or; it\'s both/and.' }], trustSafety: { disclaimer: 'If emotional exhaustion is linked to depression or self-harm, seek professional mental health support.', lastReviewedDate: '2025-02-15' } },

  // 23. OVERTHINKING
  { slug: 'overthinking', displayName: 'Overthinking', seo: { title: 'Overthinking Support | Manage Racing Thoughts', description: 'Calm your busy mind. Overthinking doesn\'t protect you; it exhausts you. Learn to quiet the mental noise.', openGraph: { title: 'Overthinking Support | Quiet Your Mind', description: 'Reduce overthinking and regain mental peace.' }, keywords: ['overthinking support', 'racing thoughts', 'rumination', 'anxious thoughts', 'mind racing'] }, hero: { title: 'Mind racing with thoughts?', subtitle: 'Overthinking feels productive but it\'s mental wheel-spinning. You can learn to think without drowning in thoughts.' }, summary: 'Overthinking (rumination) is repetitive, circular thinking about problems, situations, or possibilities. It feels like you\'re problem-solving but you\'re actually spinning your wheels. Overthinking fuels anxiety, keeps you stuck, and prevents action. The solution: mindfulness, acceptance, and shifting from thinking to doing.', relatable: ['You replay conversations for hours/days', 'You imagine worst-case scenarios obsessively', 'You can\'t stop analyzing past interactions', 'You struggle to make decisions because you see every angle', 'Your mind races, especially at night', 'You feel stuck in loops of the same thoughts', 'You\'re exhausted from thinking', 'You ruminate even though you know it doesn\'t help'], situations: ['Anxiety or worry patterns', 'Decision-making or perfectionism', 'After conflict or miscommunication', 'Uncertainty or lack of control', 'Grief or loss', 'Low self-esteem fueling self-doubt', 'ADHD or anxiety disorders', 'Lack of outlet for expression'], tips: ['Notice when you\'re overthinking; mindfulness helps', 'Set a time limit: "I\'ll think about this for 15 minutes, then I\'m done"', 'Write down the thoughts; often externalizing quiets the mind', 'Shift from thinking to action: Do ONE small thing', 'Use grounding: 5-4-3-2-1 technique to anchor in present', 'Redirect your mind: exercise, conversation, creative activity', 'Accept uncertainty; you can\'t control everything through thinking', 'Seek therapy; cognitive-behavioral therapy helps interrupt rumination patterns'], reflectionQuestions: ['What thought keeps you most stuck?', 'Does overthinking actually solve the problem or just make you anxious?', 'What action could you take instead of thinking about it?', 'What are you afraid will happen if you stop thinking about this?', 'How would you feel if you let this thought go?'], stories: [{ title: 'Rachel\'s Loop', content: 'Rachel replayed a work meeting for days, analyzing every word. A therapist helped her recognize the pattern: overthinking didn\'t fix anything. She practiced redirecting: when the loop started, she did something physical instead.' }, { title: 'Marcus\'s Worst-Case Spiral', content: 'Marcus imagined worst-case scenarios obsessively. A coach had him ask: "What\'s the most likely outcome?" Usually, reality was less catastrophic than his imagination.' }, { title: 'Sofia\'s Action', content: 'Sofia overthought a difficult conversation she needed to have. Once she actually had it, the overthinking stopped. Doing was more effective than thinking.' }], whenToSeekSupport: 'Seek help if: overthinking is causing anxiety or depression; it\'s preventing sleep or action; it\'s affecting relationships; or you\'re unable to break the patterns. Cognitive-behavioral therapy is very effective for overthinking.', relatedCategories: ['anxiety', 'perfectionism', 'insomnia', 'depression', 'rumination'], faq: [{ question: 'Is overthinking the same as being thoughtful?', answer: 'No. Thoughtfulness is considering carefully before acting. Overthinking is circular, repetitive thinking that prevents action and increases anxiety.' }, { question: 'Why can\'t I stop overthinking?', answer: 'Overthinking is often a habit and an anxiety response. Your brain thinks it\'s protecting you. Therapy helps break the pattern.' }, { question: 'Does overthinking help me solve problems?', answer: 'Rarely. It usually makes anxiety worse and prevents the action that actually solves problems. Thinking is helpful in small doses; excessive thinking creates paralysis.' }, { question: 'How do I quiet my mind?', answer: 'Grounding techniques (5-4-3-2-1), exercise, meditation, and action all help. Notice that action often quiets the mind more than more thinking.' }, { question: 'What if I can\'t redirect my thoughts?', answer: 'You\'re not trying hard enough; you\'re fighting them. Acceptance helps: "Okay, my mind is spiraling. That\'s what\'s happening." Then redirect gently.' }, { question: 'Is overthinking linked to anxiety?', answer: 'Often. Overthinking feeds anxiety and anxiety fuels overthinking. Breaking one pattern helps the other. Therapy addresses both.' }, { question: 'How do I know when to think and when to act?', answer: 'Quick rule: If thinking beyond 15 minutes isn\'t generating new insights or solutions, it\'s time to stop and act or let it go.' }, { question: 'Can I ever turn off my brain?', answer: 'Not completely, but you can quiet it. Meditation, exercise, and redirecting attention help. Your brain doesn\'t need to be silent; just quieter.' }], trustSafety: { disclaimer: 'If overthinking is linked to OCD, anxiety, or depression, seek professional help. Cognitive-behavioral therapy is effective.', lastReviewedDate: '2025-02-15' } },

  // 24. HEARTBREAK
  { slug: 'heartbreak', displayName: 'Heartbreak', seo: { title: 'Heartbreak & Breakup Support | Healing from Loss & Longing', description: 'Navigate heartbreak and rediscover yourself. Healing takes time. You will feel better than this.', openGraph: { title: 'Heartbreak Support | You\'ll Heal', description: 'Process heartbreak and rebuild your life after relationship loss.' }, keywords: ['heartbreak support', 'breakup recovery', 'relationship breakup', 'lost love', 'healing after breakup'] }, hero: { title: 'Your heart is broken?', subtitle: 'Heartbreak is one of life\'s most painful experiences. Healing is possible, even when it doesn\'t feel like it.' }, summary: 'Heartbreak is the deep pain of losing someone you love and imagined a future with. It\'s grief, rejection, and lost identity all tangled together. Heartbreak is temporary even when it feels permanent. With time, connection, and self-care, you heal and rediscover yourself.', relatable: ['Everything reminds you of them', 'You can\'t imagine feeling happy again', 'You swing between anger and deep sadness', 'You check their social media obsessively', 'You replay memories and "what ifs"', 'You feel unlovable or broken', 'Simple things (their favorite song, places you went) trigger pain', 'You don\'t recognize yourself without them'], situations: ['Unexpected breakup or rejection', 'Betrayal, infidelity, or broken trust', 'Long-term relationship ending', 'Unrequited love', 'Breakup you initiated but still grieve', 'Breakup during vulnerable time (loss, stress)', 'Relationship ending despite wanting it to work', 'Questioning if you\'ll ever trust or love again'], tips: ['Let yourself feel; don\'t rush through grief', 'Connect with people who support you', 'Do one thing daily that nourishes you (walk, meal you love, time with friend)', 'Limit exposure to reminders (mute their social, avoid places)', 'Journal your feelings without judgment', 'Do not contact them; if possible, take a break from them', 'Reclaim your identity outside the relationship', 'Know: Time, connection, and self-compassion heal heartbreak'], reflectionQuestions: ['What did this relationship mean to you?', 'What did you lose beyond the person?', 'Who are you without this relationship?', 'What about yourself do you want to rediscover?', 'What future do you want to build from here?'], stories: [{ title: 'Ana\'s Reinvention', content: 'Ana\'s 5-year relationship ended. She felt lost. She reclaimed old friendships, took classes she\'d shelved, and slowly rediscovered herself. A year later, she was grateful for the pain because it led her back to herself.' }, { title: 'Marcus\'s Anger', content: 'Marcus was angry after his breakup. A therapist helped him see anger was grief in disguise. He processed both. Anger faded; healing started.' }, { title: 'Zara\'s Growth', content: 'Zara\'s heartbreak shattered her. But it also cracked her open. Therapy and pain revealed patterns she needed to address. She grew through heartbreak.' }], whenToSeekSupport: 'Seek help if: heartbreak is causing depression; you\'re having thoughts of self-harm; you can\'t function in daily life; you\'re unable to let go after months; or you\'re using substances to cope.', relatedCategories: ['grief', 'depression', 'loneliness', 'loss-of-identity', 'anxiety'], faq: [{ question: 'How long does heartbreak last?', answer: 'Varies. Acute pain often softens within weeks to months. Deeper healing takes longer (6mo-2yrs). There\'s no fixed timeline; respect your pace.' }, { question: 'Should I stay friends with them?', answer: 'Usually not immediately. Distance helps healing. Friendship might be possible later, but not while your heart is breaking.' }, { question: 'Will I ever love again?', answer: 'Yes. Heartbreak doesn\'t mean you\'re unlovable. It means you loved and lost. That\'s painful and brave. You\'ll love again.' }, { question: 'What if they come back?', answer: 'Before reconnecting, heal first. Reconnecting before you\'ve processed often repeats painful patterns. Give yourself space to decide clearly.' }, { question: 'Should I block them on social media?', answer: 'Usually yes, at least temporarily. Seeing their life move on is painful and slows healing. Blocking protects you.' }, { question: 'How do I stop thinking about them?', answer: 'Redirect when thoughts arise: call a friend, exercise, create, journal. Over time and with connection, thoughts naturally become less frequent.' }, { question: 'Is it wrong to miss them?', answer: 'No. Missing them doesn\'t mean you should get back together. You can miss them and still know the breakup was right.' }, { question: 'What if this was my person and I let them go?', answer: 'Heartbreak makes you doubt your decisions. Time clarifies whether it was right. Trust that if it was meant to be, the universe has a way. For now, heal.' }], trustSafety: { disclaimer: 'If heartbreak is linked to depression, self-harm, or suicidal thoughts, seek professional mental health support immediately.', lastReviewedDate: '2025-02-15' } },

  // 25. MOTIVATION (or Self-Discovery - final emotion)
  { slug: 'motivation', displayName: 'Motivation', seo: { title: 'Motivation & Drive Support | Reignite Your Passion', description: 'Rediscover your drive and purpose. Motivation isn\'t laziness; it\'s energy direction that can be restored.', openGraph: { title: 'Motivation Support | Find Your Drive', description: 'Overcome low motivation and reconnect with purpose.' }, keywords: ['motivation support', 'lack of motivation', 'low drive', 'finding motivation', 'procrastination motivation'] }, hero: { title: 'Lost your motivation?', subtitle: 'Motivation isn\'t missing; it\'s often redirected or blocked. You can reignite it by understanding what\'s underneath.' }, summary: 'Low motivation is the lack of energy, drive, or desire to pursue goals or activities. It\'s different from laziness (choosing not to do something). Low motivation often signals that something needs to change: misalignment with your values, burnout, depression, or lack of meaning. Restoring motivation requires understanding its root cause and realigning with what actually matters to you.', relatable: ['Nothing excites you anymore', 'You feel stuck in "going through the motions"', 'You procrastinate on everything', 'You question if your goals actually matter', 'You feel drained even thinking about tasks', 'You compare yourself to motivated people and feel worse', 'You know what you "should" do but can\'t summon the energy', 'You\'ve lost touch with why something mattered'], situations: ['Burnout from overwork or perfectionism', 'Depression or low mood', 'Misalignment: pursuing goals others chose, not you', 'Loss or grief that shook your foundation', 'Lack of progress or slow progress toward goals', 'Perfectionism blocking action (fear of imperfection)', 'ADHD or depression affecting executive function', 'Accomplishing a major goal and feeling empty after'], tips: ['Identify the root: burnout? depression? misalignment? The fix depends on the cause', 'Reconnect with your values: Are you pursuing what matters to YOU?', 'Start small: tiny actions build momentum more than willpower', 'Remove friction: make the thing you want to do easier', 'Connect with others pursuing similar things', 'Notice your natural energy patterns: when are you most motivated?', 'Celebrate small wins; progress is motivating', 'If depression or ADHD is involved, professional support helps'], reflectionQuestions: ['When did you last feel motivated? What was different then?', 'Are you pursuing goals that actually matter to you?', 'What would feel motivating if you gave yourself permission?', 'What\'s the smallest possible step you could take toward what matters?', 'What would reigniting motivation require: change? rest? direction shift?'], stories: [{ title: 'Sarah\'s Realignment', content: 'Sarah was losing motivation for her career (chosen by her family). She realized the goals weren\'t hers. Choosing her own direction reignited her drive.' }, { title: 'James\'s Rest', content: 'James\'s motivation crashed after years of pushing. A burnout made rest non-negotiable. After recovery, motivation returned naturally.' }, { title: 'Zara\'s Momentum', content: 'Zara was paralyzed by perfectionism. Taking tiny action (imperfectly) built momentum. Seeing progress motivated her more than any willpower.' }], whenToSeekSupport: 'Seek help if: low motivation is linked to depression; you can\'t function; you\'ve lost touch with your values; or you need support identifying the root cause.', relatedCategories: ['depression', 'burnout', 'procrastination', 'purpose', 'self-doubt'], faq: [{ question: 'Is low motivation laziness?', answer: 'No. Laziness is choosing not to do something. Low motivation is lacking energy or drive. They\'re different and need different solutions.' }, { question: 'How do I rebuild motivation?', answer: 'Find the root cause (burnout? depression? misalignment?), address it, then take tiny actions. Momentum builds motivation more than motivation builds action.' }, { question: 'What if I\'m not motivated by the typical things?', answer: 'Different people are motivated by different things: achievement, connection, creativity, helping, autonomy, mastery. Find YOUR motivators, not society\'s.' }, { question: 'Is it okay to not want to do something?', answer: 'Yes. Not everything is for you. Motivation often returns when you align with what actually matters to you rather than what you think should matter.' }, { question: 'How do I know if this is depression or just low motivation?', answer: 'Depression involves low mood, hopelessness, and lack of energy across all domains. Low motivation is often specific to certain goals or areas. Depression needs professional help.' }, { question: 'What if my goals are the problem?', answer: 'Then change them. You can pivot at any time. Motivation often returns when you pursue what\'s true for you, not what looks good on paper.' }, { question: 'How do I build momentum?', answer: 'Start ridiculously small. One tiny action. Then another. Momentum builds slowly but steadily. Two small actions beat zero actions every time.' }, { question: 'Can I motivate myself or do I need external motivation?', answer: 'Intrinsic motivation (driven by purpose) is more sustainable than external (rewards, pressure). Both can work, but intrinsic lasts longer.' }], trustSafety: { disclaimer: 'If low motivation is linked to depression, self-harm, or suicidal thoughts, seek professional mental health support immediately.', lastReviewedDate: '2025-02-15' } },
];

export default emotionContentLibrary;

