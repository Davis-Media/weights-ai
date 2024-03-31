"use client";

import { UploadButton } from "@/lib/uploadthing";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export function UploadProgressPic() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Pic</CardTitle>
        <CardDescription>
          Upload a progress pic for this workout...
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            // Do something with the response
            console.log("Files: ", res);
            alert("Upload Completed");
          }}
          onUploadError={(error: Error) => {
            // Do something with the error.
            alert(`ERROR! ${error.message}`);
          }}
        />
      </CardContent>
    </Card>
  );
}
