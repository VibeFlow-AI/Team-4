import { Bookmark } from "lucide-react";

interface SessionCardData {
  initials: string;
  name: string;
  location: string;
  subjects: string[];
  description: string;
  duration: string;
  language: string;
}

const SESSIONS: SessionCardData[] = [
  {
    initials: "RL",
    name: "Rahul Lavan",
    location: "Colombo",
    subjects: ["Science", "Physics", "Biology"],
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled",
    duration: "30 mins – 1 hour",
    language: "English, Tamil",
  },
  {
    initials: "CR",
    name: "Chathum Rahal",
    location: "Galle",
    subjects: ["Mathematics", "History", "English"],
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled",
    duration: "1 hour",
    language: "English",
  },
  {
    initials: "MI",
    name: "Malsha Fernando",
    location: "Colombo",
    subjects: ["Chemistry", "Art", "Commerce"],
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled",
    duration: "1 hour",
    language: "Sinhala",
  },
];

function SessionHighlights() {
  return (
    <section className="w-full bg-gradient-to-br from-blue-100 via-purple-100 to-yellow-100 py-16 px-2 sm:px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 text-black">
          Session Highlights – Trending Now
        </h2>
        <p className="text-lg sm:text-xl text-center text-black/80 max-w-3xl mx-auto mb-12">
          Join the sessions students are raving about. These expert-led, high-impact sessions are designed to help you unlock your full potential whether you're polishing your resume, mapping out your career path, or getting ready to ace technical interviews.
        </p>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {SESSIONS.map((session, idx) => (
            <div
              key={session.name}
              className="bg-white rounded-2xl shadow-md p-6 flex flex-col h-full transition-transform duration-200 hover:scale-[1.02]"
            >
              {/* Avatar and Name */}
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-semibold bg-gray-100 text-gray-700">
                  {session.initials}
                </div>
                <div>
                  <div className="font-semibold text-lg text-black leading-tight">{session.name}</div>
                  <div className="text-gray-500 text-sm">{session.location}</div>
                </div>
              </div>
              {/* Subjects */}
              <div className="flex flex-wrap gap-2 mb-3">
                {session.subjects.map((subj) => (
                  <span
                    key={subj}
                    className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-md"
                  >
                    {subj}
                  </span>
                ))}
              </div>
              {/* Description */}
              <div className="text-gray-800 text-sm mb-4">
                {session.description}
              </div>
              {/* Duration and Language */}
              <div className="mb-4">
                <span className="font-semibold">Duration:</span>{" "}
                <span className="text-gray-700">{session.duration}</span>
                <br />
                <span className="font-semibold">Preferred Language:</span>{" "}
                <span className="text-gray-700">{session.language}</span>
              </div>
              {/* Bottom Bar */}
              <div className="mt-auto flex items-center gap-2 pt-2 border-t border-gray-100">
                <button
                  className="flex-1 bg-black text-white rounded-lg py-2 mt-4 font-medium text-base hover:bg-gray-900 transition-colors"
                >
                  Book a session
                </button>
                <button
                  className="ml-2 mt-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Bookmark session"
                >
                  <Bookmark className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SessionHighlights; 