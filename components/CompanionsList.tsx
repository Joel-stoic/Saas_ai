import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, getSubjectColor } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
interface CompanionsListProps {
  title: string;
  companions: Companion[];
  className?: string;
}

const CompanionsList = ({
  title,
  companions,
  className,
}: CompanionsListProps) => {
  return (
    <article className={cn("companion-list", className)}>
      <h2 className="font-bold text-3xl">{title}</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-lg w-2/3">Lessons</TableHead>
            <TableHead className="text-lg">Subject</TableHead>
            <TableHead className="text-lg">Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companions?.map(({ id, subject, name, topic, duration }, index) => (
            <TableRow key={`${id}-${index}`}>
              <TableCell>
                <Link href={`/companions/${id}`}>
                  <div className="flex items-center gap-2">
                    <div
                      className="size-[72px] flex items-center justify-center rounded-lg max-md:hidden"
                      style={{ backgroundColor: getSubjectColor(subject) }}
                    >
                      <Image
                        src={`/icons/${subject}.svg`}
                        alt={subject}
                        width={35}
                        height={35}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="font-bold">{name}</p>
                      <p className="text-lg">Topic: {topic}</p>
                    </div>
                  </div>
                  
                </Link>
              </TableCell>
              <TableCell>
                <div className="max-md:hidden">
                  <Button className="w-32 py-2 rounded-lg bg-gradient-to-r from-black to-gray-800 text-white font-semibold shadow-md transition-all duration-500 hover:from-gray-800 hover:to-black hover:scale-105 hover:shadow-lg hover:shadow-black">
                    {subject}
                  </Button>
                </div>
                <div
                  className="flex items-center justify-center rounded-lg w-fit p-2 md:hidden"
                  style={{ backgroundColor: getSubjectColor(subject) }}
                >
                  <Image
                    src={`/icons/${subject}.svg`}
                    alt={subject}
                    width={18}
                    height={18}
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 w-full justify-end">
                  <p className="text-2xl">
                    {duration} <span className="max-md:hidden">mins</span>
                  </p>
                  <Image
                    src={`/icons/clock.svg`}
                    alt="minutes"
                    width={14}
                    height={14}
                    className="md:hidden"
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </article>
  );
};

export default CompanionsList;
