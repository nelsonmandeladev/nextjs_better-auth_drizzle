"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import SocialsAuth from "@/components/forms/socials-auth";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import { InputField } from "./form-fiiels/input-field";
import { toast } from "sonner";
import { useTransition } from "react";
import { authClient } from "@/lib";
import { useRouter } from "next/navigation";

const strongPasswordSchema = z
    .string({ error: "Password required" })
    .min(8, "Must have min 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase")
    .regex(/[a-z]/, "Must contain lowercase")
    .regex(/[0-9]/, "Must contain number")
    .regex(/[^A-Za-z0-9]/, "Must contain special characters");

export const RegisterFormSchema = z.object({
    fullName: z.string({ error: "Your full name is required" }),
    email: z
        .email({ error: "Email required" }),
    password: strongPasswordSchema,
});

type RegisterFormType = z.infer<typeof RegisterFormSchema>;

export function RegisterForm({
    className,
    ...props
}: React.ComponentProps<"div">) {

    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<RegisterFormType>({
        resolver: zodResolver(RegisterFormSchema),
    });

    function handleRegister(data: RegisterFormType) {
        startTransition(async () => {
            const { error, data: user } = await authClient.signUp.email({
                name: data.fullName,
                email: data.email,
                password: data.password,
            })
            if (error) {
                if (error?.status === 422) {
                    toast.error('A user exist with the provided email, please try login to you account.');
                    return
                }
                toast.error(error.message);
                return;
            }
            toast.success(`Hello ${user.user.name}, you account has been created 🎊. You can click on Signin if not auto redirected.`);
            router.push("/login")

        })

    }
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Glad to have you with us</CardTitle>
                    <CardDescription>
                        Register with your Facebook or Google account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleRegister)}>
                            <div className="grid gap-6">
                                <SocialsAuth />
                                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                    <span className="bg-card text-muted-foreground relative z-10 px-2">
                                        Or continue with
                                    </span>
                                </div>
                                <div className="grid gap-6">
                                    <div className="grid gap-3">
                                        <InputField
                                            control={form.control}
                                            fieldName="fullName"
                                            id="fullName"
                                            type="text"
                                            placeholder="SN Mandela"
                                            label={"Full Name"}
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <InputField
                                            control={form.control}
                                            fieldName="email"
                                            id="email"
                                            type="email"
                                            placeholder="sm.mandela@gmail.com"
                                            label={"Email"}
                                        />
                                    </div>
                                    <div className="grid gap-3">

                                        <InputField
                                            control={form.control}
                                            fieldName="password"
                                            id="password"
                                            type="password"
                                            placeholder="*****"
                                            label={"Password"}
                                        />
                                    </div>
                                    <Button disabled={isPending} type="submit" className="w-full">
                                        Register
                                    </Button>
                                </div>
                                <div className="text-center text-sm">
                                    Don&apos;t have an account?{" "}
                                    <a href="/login" className="underline underline-offset-4">
                                        Signin
                                    </a>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </div>
        </div>
    )
}
