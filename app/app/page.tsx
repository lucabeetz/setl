"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FileDropZone from "@/components/file-drop-zone";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Confetti from "react-confetti";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [files, setFiles] = useState<FileList[]>([]);
  const [task, setTask] = useState("");
  const [feedback, setFeedback] = useState("");
  const [response, setResponse] = useState(undefined);

  const onFilesAdded = (files: FileList) => {
    console.log("Added files: ", files);
    setFiles([...files]);
  };

  const run = async (again: boolean) => {
    setLoading(true);
    console.log("File list", files);
    const body: any = {
      task: task,
      file_path: files[0].name,
    };

    if (again) {
      body["feedback"] = feedback;
      body["previous"] = response.final_command;
    }

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
      <p className="text-5xl font-bold mb-10">Video wizard 🧙‍♂️</p>
      <Input
        type="text"
        className="border-2 border-gray-300 p-2 rounded-md mb-8 max-w-lg"
        placeholder="What do you want to do?"
        onChange={(e) => setTask(e.target.value)}
      />
      <FileDropZone onFilesAdded={onFilesAdded} />

      {loading ? (
        <Button disabled variant="outline" className="mt-8 mb-4">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Magic in progress 🪄
        </Button>
      ) : (
        <Button onClick={() => run(false)} className="mt-8 mb-4">
          Do it
        </Button>
      )}
      <div>
        {response && (
          <div>
            <div className="mt-5 flex max-w-screen-2xl flex-wrap justify-center">
              {response.output_files.map((p) => (
                <div className="w-fit max-w-sm p-4 flex flex-col">
                  <video key={p} src={p} controls={true} />
                </div>
              ))}
            </div>
            <div>
              <p>Does this look good to you?</p>
              <div className="flex flex-row gap-8">
                <Button
                  onClick={() => {
                    setShowConfetti(true);
                    setTimeout(() => setShowConfetti(false), 4000);
                  }}
                >
                  Yes
                </Button>
                {showConfetti && (
                  <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                  />
                )}
              </div>
              <p className="my-4">If not what's wrong?</p>
              <Input
                type="text"
                className="border-2 border-gray-300 p-2 rounded-md mb-8 max-w-lg"
                placeholder="Feedback please 🙏"
                onChange={(e) => setFeedback(e.target.value)}
              />
              {loading ? (
                <Button disabled variant="outline" className="mt-2 mb-4">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Applying your feedback 🦄
                </Button>
              ) : (
                <Button onClick={() => run(true)} className="mt-2 mb-4">
                  Try again
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
