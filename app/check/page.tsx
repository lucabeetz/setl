'use client'

import { Button } from "@/components/ui/button"

export default function Home() {
    const response = "response"

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <p>Does this look good to you?</p>
            <div>
                {response}
            </div>
            <div className="flex flex-row gap-8">
                <Button>No</Button>
                <Button>Yes</Button>
            </div>
        </main>
    )
}
