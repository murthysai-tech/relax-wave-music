import { NextResponse } from "next/server";
import ytdl from "@distube/ytdl-core";
import { Readable } from "stream";

// Helper to convert Node.js stream to Web Stream for Next.js App Router
function nodeStreamToWebStream(nodeStream: Readable): ReadableStream {
  return new ReadableStream({
    start(controller) {
      nodeStream.on('data', (chunk) => {
        controller.enqueue(chunk);
      });
      nodeStream.on('end', () => {
        controller.close();
      });
      nodeStream.on('error', (err) => {
        controller.error(err);
      });
    },
    cancel() {
      nodeStream.destroy();
    }
  });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new NextResponse("Missing video id", { status: 400 });
    }

    const url = `https://www.youtube.com/watch?v=${id}`;
    
    const nodeStream = ytdl(url, {
      filter: "audioonly",
      quality: "highestaudio",
      highWaterMark: 1 << 25, // Buffer aggressively
    });

    const webStream = nodeStreamToWebStream(nodeStream);

    return new NextResponse(webStream, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-cache",
        "Access-Control-Allow-Origin": "*",
        "Accept-Ranges": "bytes"
      },
    });

  } catch (error: any) {
    console.error("YTDL ERROR:", error);
    return new NextResponse("Error extracting stream", { status: 500 });
  }
}
