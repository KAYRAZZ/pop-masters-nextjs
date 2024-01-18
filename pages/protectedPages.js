"use client"

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function ProtectedPages() {
    const { data: session, status } = useSession();
    const router = useRouter()
    useEffect(() => {
        if (status && status === "unauthenticated") {
            router.push("/login")
        }
    }, [status])

}

export default ProtectedPages;