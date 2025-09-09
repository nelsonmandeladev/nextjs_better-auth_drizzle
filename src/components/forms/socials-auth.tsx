"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { authClient } from '@/lib';
import { IconBrandFacebook, IconBrandGoogle } from "@tabler/icons-react"
import { toast } from 'sonner';

function SocialsAuth() {

    async function facebookLogin() {
        console.log("Hello")
        const { error } = await authClient.signIn.social({
            provider: "facebook",
        });

        if (error) {
            toast.error(error.message)
        }
    }

    async function googleLogin() {
        console.log("Hello")
        const { error } = await authClient.signIn.social({
            provider: "google"
        });
        if (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <Button
                variant="outline" className="w-full h-10"
                onClick={() => facebookLogin()}
                type='button'
            >
                <IconBrandFacebook className='!size-5 stroke-1' />
                Login with facebook
            </Button>
            <Button variant="outline" className="w-full h-10"
                onClick={() => googleLogin()}
                type='button'
            >
                <IconBrandGoogle className='!size-5 stroke-1' />
                Login with Google
            </Button>
        </div>
    );
}

export default SocialsAuth;