'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import FileDropZone from '@/components/file-drop-zone'

export default function Home() {

  const onFilesAdded = (files: FileList) => {
    console.log("Added files: ", files);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Input type="text" className="border-2 border-gray-300 p-2 rounded-md" placeholder="What do you want to do?" />
      <FileDropZone onFilesAdded={onFilesAdded} />
      <Button>Do it</Button>
    </main>
  )
}
