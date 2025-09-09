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
import { Label } from "@/components/ui/label"
import SocialsAuth from "@/components/forms/socials-auth";
import z from "zod";
import { Form } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { InputField } from "./form-fiiels/input-field";
import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib";
import { toast } from "sonner";


export const LoginFormSchema = z.object({
  email: z.email({ error: "Email is required" }),
  password: z.string({ error: "Password required" }),
});

type LoginFormType = z.infer<typeof LoginFormSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<LoginFormType>({
    resolver: zodResolver(LoginFormSchema),
  });

  function handleLogin(data: LoginFormType) {
    startTransition(async () => {
      const { error, data: user } = await authClient.signIn.email(data);
      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success(`Welcome ${user.user.name} 🥳. You have been successfully welcomed.`);
      router.push("/");
    })
  }


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Facebook or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLogin)}>
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
                      fieldName="email"
                      label={"Email"}
                      id="email"
                      placeholder="example@email.com"
                      type="email"
                    />
                  </div>
                  <div className="grid gap-3">
                    <InputField
                      control={form.control}
                      fieldName="password"
                      label={
                        <div className="flex items-center w-full justify-between">
                          <Label htmlFor="password">Password</Label>
                          <Link
                            href="#"
                            className="ml-auto text-sm underline-offset-4 hover:underline"
                          >
                            Forgot your password?
                          </Link>
                        </div>
                      }
                      id="password"
                      placeholder="example@email.com"
                      type="password"
                    />
                  </div>
                  <Button disabled={isPending} type="submit" className="w-full">
                    Login
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link href="/register" className="underline underline-offset-4">
                    Sign up
                  </Link>
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
