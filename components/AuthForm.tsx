"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { auth } from "@/firebase/client";
import { signIn, signUp } from "@/lib/actions/auth.action";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import FormField from "./FormField";

const authFormSchema = (type: FormType) => {
    return z.object({
        name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
        email: z.string().email(),
        password: z.string().min(6),
    });
};

const AuthForm = ({ type }: { type: FormType }) => {
    const router = useRouter();
    const formSchema = authFormSchema(type);
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (type === "sign-up") {
                const { name, email, password } = values;

                const userCreds = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

                const result = await signUp({
                    uid: userCreds.user.uid,
                    name: name!,
                    email,
                    password,
                });

                if (!result?.success) {
                    toast.error(result?.message || "Error creating account");
                    return;
                }

                toast.success("Account created successfully!. Please sign in.");
                router.push("/sign-in");
            } else {
                const { email, password } = values;

                const userCreds = await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

                const token = await userCreds.user.getIdToken();

                if (!token) {
                    toast.error("Error signing in");
                    return;
                }

                await signIn({ email, idToken: token });

                toast.success("Signed in successfully!");
                router.push("/");
            }
        } catch (error) {
            console.log(error);
            toast.error(`Error submitting form: ${error}`);
        }
        console.log("Form Values:", values);
    }

    const isSignIn = type === "sign-in";

    return (
        <div className="card-border lg:min-w-[566px]">
            <div className="flex flex-col gap-6 card py-14 px-10">
                <div className="flex flex-row gap-2 justify-center">
                    <Image src="/logo.svg" alt="logo" width={38} height={32} />
                    <h2 className="text-primary-100">Interview AI Agent</h2>
                </div>
                <h3>Practice Interview with AI</h3>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full space-y-6 mt-4 form"
                    >
                        {!isSignIn && (
                            <FormField
                                type="text"
                                name="name"
                                control={form.control}
                                label="Name"
                                placeholder="Your name"
                            />
                        )}
                        <FormField
                            type="email"
                            name="email"
                            control={form.control}
                            label="Email"
                            placeholder="Your email"
                        />
                        <FormField
                            type="password"
                            name="password"
                            control={form.control}
                            label="Password"
                            placeholder="Your password"
                        />
                        <Button type="submit" className="btn">
                            {isSignIn ? "Sign In" : "Create Account"}
                        </Button>
                    </form>
                </Form>

                <p className="text-center">
                    {isSignIn ? "New user? " : "Already have an account? "}
                    <Link
                        href={!isSignIn ? "/sign-in" : "/sign-up"}
                        className="font-bold text-user-primary ml-1"
                    >
                        {!isSignIn ? "Sign In" : "Sign Up"}
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default AuthForm;
