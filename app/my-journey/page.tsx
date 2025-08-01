import CompanionsList from "@/components/CompanionsList";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getUserCompanions, getUserSessions } from "@/lib/actions/companion.action";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";

const Profile = async () => {
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  const companions = await getUserCompanions(user.id);
  const sessionHistory = await getUserSessions(user.id);

  return (
    <main className="min-lg:w-3/4">
      <section className="flex justify-between gap-4 max-sm:flex-col items-center">
        {/* Profile Info */}
        <div className="flex gap-4 items-center">
          <Image
            src={user.imageUrl}
            alt={user.firstName!}
            width={110}
            height={110}
            className="rounded-full"
          />
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-2xl">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-sm text-muted-foreground">
              {user.emailAddresses[0].emailAddress}
            </p>
          </div>
        </div>

        {/* Session Stats */}
        <div className="flex gap-4">
          <div className="border border-black rounded-lg p-3 gap-2 flex flex-col h-fit items-center">
            <div className="flex gap-2 items-center">
              <Image src="/icons/check.svg" alt="checkmark" width={22} height={22} />
              <p className="text-2xl font-bold">{sessionHistory.length}</p>
            </div>
            <div className="text-sm">Lessons completed</div>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="border border-black rounded-lg p-3 gap-2 flex flex-col h-fit items-center">
            <div className="flex gap-2 items-center">
              <Image src="/icons/check.svg" alt="checkmark" width={22} height={22} />
              <p className="text-2xl font-bold">{companions.length}</p>
            </div>
            <div className="text-sm">Companions Created</div>
          </div>
        </div>
      </section>

      {/* Accordion Example */}
      <Accordion type="multiple">
      {/* Recent Sessions */}
      <AccordionItem value="recent">
        <AccordionTrigger className="text-2xl font-bold">Recent Sessions</AccordionTrigger>
        <AccordionContent>
          <CompanionsList title="Recent Session" companions={sessionHistory} />
        </AccordionContent>
      </AccordionItem>

      {/* My Companions */}
      <AccordionItem value="companions">
        <AccordionTrigger className="text-2xl font-bold">
          My Companions ({companions.length})
        </AccordionTrigger>
        <AccordionContent>
          <CompanionsList title="My Companions" companions={companions} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>

    </main>
  );
};

export default Profile;
