"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useFormState } from "react-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { FaGithub } from "react-icons/fa";

import { SocialLogin } from "@/modules/auth/ui/components/social-login";
import { z } from "zod";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { signUpAction } from "../actions/signup-action";
import { signUpSchema } from "../schemas";

const getDefaultValues = () => ({
  email: "demo@meet.ai",
  password: "password123",
  name: "Demo User",
  code: "123456",
});

export const SignUpView = () => {
  const [state, formAction] = useFormState(signUpAction, {
    success: false,
    error: null,
    invalidFields: [],
  });

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: getDefaultValues(),
  });

  useEffect(() => {
    if (state.error) {
      const emailOrPasswordError = state.invalidFields.includes("email") || state.invalidFields.includes("password");
      const codeError = state.invalidFields.includes("code");

      if (emailOrPasswordError && !codeError) {
        form.setValue("password", "");
      }
    }
  }, [form, state.error, state.invalidFields]);

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    formAction(values);
  };

  const pending = form.formState.isSubmitting || state.invalidFields.includes("pending");

  const onSocial = async (provider: "google" | "github") => {
    const response = await SocialLogin(provider);

    if (response?.url) {
      window.location.href = response.url;
    }
  };

  return (
    <div className="grid min-h-svh grid-cols-1 gap-y-8 px-4 py-10 md:grid-cols-[1.2fr_1fr] md:px-0">
      <Card className="mx-auto w-full max-w-xl border-none shadow-none md:mx-0">
        <CardContent className="p-0 md:p-8">
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-2 text-center md:text-left">
                <h1 className="text-2xl font-semibold">Create an account</h1>
                <p className="text-sm text-muted-foreground">Enter your details to get started</p>
              </div>

              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="email@example.com" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input placeholder="••••••••" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>2FA Code</FormLabel>
                      <FormControl>
                        <Input placeholder="123456" maxLength={6} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator className="my-2" />

                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full" disabled={pending}>
                    {pending ? (
                      <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
                    ) : null}
                    Create account
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      disabled={pending}
                      onClick={() => onSocial("google")}
                      variant="outline"
                      type="button"
                      className="w-full"
                    >
                      <Image src="/google.svg" width={16} height={16} alt="Google logo" aria-hidden />
                    </Button>
                    <Button
                      disabled={pending}
                      onClick={() => onSocial("github")}
                      variant="outline"
                      type="button"
                      className="w-full"
                    >
                      <FaGithub />
                    </Button>
                  </div>

                  <div className="text-center text-sm">
                    Already have an account?{" "}
                    <Link href="/sign-in" className="underline underline-offset-4">
                      Sign in
                    </Link>
                  </div>
                </div>
              </div>
            </form>
          </Form>

          <div className="bg-radial from-sidebar-accent to-sidebar relative hidden items-center justify-center gap-y-4 md:flex md:flex-col">
            <Image src="/logo.svg" alt="Meet.AI logo" height={92} width={92} />
            <p className="text-2xl font-semibold text-white">Meet.AI</p>
          </div>
        </CardContent>
      </Card>

      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of service</a> and <a href="#">Privacy Policy</a>
      </div>
    </div>
  );
};
