"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FileDropZone from "@/components/file-drop-zone";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<FileList[]>([]);
  const [task, setTask] = useState("");
  const [response, setResponse] = useState(undefined);

  const onFilesAdded = (files: FileList) => {
    console.log("Added files: ", files);
    setFiles([...files]);
  };

  const run = async () => {
    setLoading(true);
    console.log("File list", files);
    const body = {
      task: task,
      file_path: files[0].name,
    };

    console.log("Body", body);

    const r = await fetch("http://127.0.0.1:8000/ffmpeg", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await r.json();
    console.log("RESPONSE", json);

    if (r.status === 200) {
      setResponse(json);
    } else {
      console.error(`Got an error: ${json}`);
    }

    setLoading(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Input
        type="text"
        className="border-2 border-gray-300 p-2 rounded-md mb-4"
        placeholder="What do you want to do?"
        onChange={(e) => setTask(e.target.value)}
      />
      <FileDropZone onFilesAdded={onFilesAdded} />

      {loading ? (
        <Button disabled variant="outline">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Magic in progress 🪄
        </Button>
      ) : (
        <Button onClick={run}>Do it</Button>
      )}
      <div className="mt-5 flex max-w-screen-2xl flex-wrap justify-center">
        {response &&
          response.output_files.map((p) => (
            <video key={p} src={p} controls={true} />
          ))}
      </div>
    </main>
  );
}
