import CompanionCard from "@/components/CompanionCard";
import CompanionsList from "@/components/CompanionsList";
import CTA from "@/components/CTA";
import { getAllCompanions, getRecentSessions } from "@/lib/actions/companion.action";
import { getSubjectColor } from "@/lib/utils";
import * as Sentry from '@sentry/nextjs';

// ✅ Define Companion type
type Companion = {
  id: string;
  name: string;
  subject: string;
  topic?: string;
  duration?: number;
};

const Page = async () => {
  let companions: Companion[] = [];
  let recentSessionsCompanions: Companion[] = [];

  // ✅ Safely fetch companions
  try {
    companions = await getAllCompanions({ limit: 3 }) as Companion[];
  } catch (error) {
    Sentry.captureException(error);
    console.error("Companion fetch failed:", error);
  }

  // ✅ Safely fetch recent sessions and flatten if needed
  try {
    const result = await getRecentSessions(10);
    recentSessionsCompanions = result.flat() as Companion[];
  } catch (error) {
    Sentry.captureException(error);
    console.error("Recent sessions fetch failed:", error);
  }

  return (
    <main>
      <h1 className="text-3xl font-bold mb-6">Popular Companions</h1>

      <section className="home-section">
        {companions.length > 0 ? (
          companions.map((companion) => (
            <CompanionCard
              key={companion.id}
              id={companion.id}
              name={companion.name}
              subject={companion.subject}
              topic={companion.topic || ""}
              duration={companion.duration || 0}
              color={getSubjectColor(companion.subject)}
            />
          ))
        ) : (
          <p className="text-muted-foreground">No companions available right now.</p>
        )}
      </section>

      <section className="home-section">
        {recentSessionsCompanions.length > 0 ? (
          <CompanionsList
            title="Recently completed sessions"
            companions={recentSessionsCompanions}
            className="w-2/3 max-lg:w-full"
          />
        ) : (
          <p className="text-muted-foreground">No recent sessions to show.</p>
        )}

        <CTA />
      </section>
    </main>
  );
};

export default Page;
