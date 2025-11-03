import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/ui/InterviewCard";
import { dummyInterviews } from "@/constants";
import Image from "next/image";
import Link from "next/link";

const HomePage = () => {
    return (
        <>
            <section className="card-cta">
                <div className="flex flex-col gap-6 max-w-lg">
                    <h2 className="">
                        Prepare your Interview with AI-Powered Agent with
                        Feedback
                    </h2>
                    <p className="text-lg">
                        Improve your skills by practicing real interview getting
                        complete feedback
                    </p>
                    <Button asChild className="btn-primary max-sm:w-full">
                        <Link href="/interview">Start Your Interview</Link>
                    </Button>
                </div>
                <Image src="/robot.png" alt="Robot" width={400} height={400} />
            </section>

            <section className="flex flex-col gap-6 mt-8">
                <h2 className="">Your Interviews</h2>

                <div className="interviews-section">
                    {dummyInterviews.map((interview) => (
                        <InterviewCard key={interview.id} {...interview} />
                    ))}

                    {/* <p>You haven't taken any interviews yet.</p> */}
                </div>
            </section>

            <section className="flex flex-col gap-6 mt-8">
                <h2>Take an Interview</h2>

                <div className="interviews-section">
                    {dummyInterviews.map((interview) => (
                        <InterviewCard key={interview.id} {...interview} />
                    ))}
                </div>
            </section>
        </>
    );
};

export default HomePage;
