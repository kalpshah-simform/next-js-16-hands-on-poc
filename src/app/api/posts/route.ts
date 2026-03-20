import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";

export async function GET() {
  const requestId = crypto.randomUUID();

  try {
    logger.info("API request", {
      requestId,
      route: "/api/posts",
      method: "GET",
    });

    const session = await auth();
    const userId =
      session?.user && "id" in session.user
        ? (session.user as typeof session.user & { id?: string }).id
        : undefined;

    if (!userId) {
      logger.warn("Unauthorized API request", {
        requestId,
        route: "/api/posts",
      });
      return NextResponse.json(
        { error: "Unauthorized", requestId },
        { status: 401 },
      );
    }

    const posts = await db.post.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: "desc" },
    });

    logger.info("API request completed", {
      requestId,
      route: "/api/posts",
      postCount: posts.length,
    });

    return NextResponse.json({ posts, requestId });
  } catch (error) {
    logger.error("API request failed", {
      requestId,
      route: "/api/posts",
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: "Internal Server Error", requestId },
      { status: 500 },
    );
  }
}
