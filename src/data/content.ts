// All copy from the Figma frame, centralized so components stay presentational.

export const nav = {
  links: [
    { label: "ABOUT", href: "#about" },
    { label: "TRACKS", href: "#tracks" },
    { label: "SCHEDULE", href: "#schedule" },
    { label: "SPONSORS", href: "#sponsors" },
    { label: "FAQ", href: "#faq" },
  ],
  register: {
    label: "Register",
    href: "https://docs.google.com/forms/d/e/1FAIpQLScSycfA_9ekC7u_qANe-tpZkVcSWiwmgBCmQ6K-ZpjXcxH9rw/viewform",
  },
  mentor: {
    label: "Mentor / Judge",
    href: "#", // placeholder — swap when the form URL is ready
  },
} as const;

export const hero = {
  title: "NASA SPACE APPS",
  subtitle: "NOVEMBER 14-15 — TEMECULA, CA",
} as const;

export const about = {
  heading: "ABOUT",
  introHeading: "What is NASA Space Apps?",
  introBody: [
    "The NASA International Space Apps Challenge is the largest annual global hackathon. Participants around the world use NASA and partner-agency open data to solve challenges in Earth and space science.",
    "Teams choose a challenge, research the problem, build a project, and present their solution over two days. You do not need a team, coding experience, or a space background to participate.",
  ],
  localHeading: "",
  localBody: [
    "For the first time, NASA Space Apps is coming to Temecula.",
    "A free, in-person weekend to build, learn, and solve real challenges alongside students, professionals, mentors, and creators from across Southern California.",
  ],
  impactHeading: "2025 Global Impact",
  impactStats: [
    "114k+ Participants",
    "551 Local Events",
    "167 Countries & Territories",
  ],
} as const;

export const tracks = {
  heading: "Tracks",
  cards: Array.from({ length: 6 }, () => ({
    title: "COMING SOON",
    description: "",
  })),
} as const;

export const schedule = {
  heading: "Schedule",
  body: "To Be Announced!",
} as const;

export const sponsors = {
  heading: "Sponsors",
  body: "To be Announced!",
} as const;

export const faq = {
  heading: "Frequently Asked Questions",
  leftColumn: [
    {
      q: "Who can participate?",
      a: "Anyone. Students, professionals, designers, scientists, builders, and curious first-timers are all welcome. You don't need a space background or any coding experience to join.",
    },
    {
      q: "Is the hackathon free?",
      a: "Yes. NASA Space Apps is free to participate. There's no entry fee. Just bring yourself, your laptop, and your curiosity.",
    },
    {
      q: "How many people can be on a team?",
      a: "Teams can be anywhere from 1 to 6 people. You can register with a team or join one at the event.",
    },
    {
      q: "What should I bring?",
      a: "A laptop and charger, a reusable water bottle, and anything you need to be comfortable for the weekend. We'll handle the rest.",
    },
    {
      q: "What resources are provided?",
      a: "Wi-Fi, power, meals and snacks, workspaces, mentor support, and NASA open datasets. Mentors are on hand throughout the weekend to help teams get unstuck.",
    },
  ],
  rightColumn: [
    {
      q: "Do I need coding experience?",
      a: "No. Many teams build projects with no code at all — using storytelling, design, data analysis, hardware, or research. Coding is one tool, not a requirement.",
    },
    {
      q: "Do I need a team before I come?",
      a: "No. Show up solo and we'll help you find a team on Saturday morning, or work alone if you prefer.",
    },
    {
      q: "Where is the event?",
      a: "Temecula, California. The venue address and parking details are shared with registered participants before the event.",
    },
    {
      q: "Will there be workshops or mentors?",
      a: "Yes. Mentors from industry and academia circulate throughout the weekend, and we run short workshops on tools, datasets, and pitching.",
    },
    {
      q: "I still have a question. Who should I contact?",
      a: "Email the organizing team at spaceapps.temecula@gmail.com or message us on the Temecula Space Apps social channels. We'll get back to you as soon as possible.",
    },
  ],
} as const;

export const footer = {
  credit: "MADE WITH <3 BY THE ORGANIZER TEAM!💫",
} as const;
