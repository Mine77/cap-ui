// app/api/[transport]/route.ts
import { createMcpHandler } from "mcp-handler";
import { type NextRequest, NextResponse } from "next/server";

const handler = createMcpHandler(
  async (server) => {
    // server comes from the official MCP SDK
    server.tool(
      "get_ui", // The name of the tool
      "Gets the ui", // A description what the tool does
      {},
      async () => {
        // Implemenation of the tool
        const ui = "http://localhost:3000/weather";
        return {
          content: [{ type: "text", text: `UI: ${ui}` }],
        };
      },
    );
  },
  {},
  {
    streamableHttpEndpoint: "/api/mcp", // The URL where you host the MCP Server
    verboseLogs: true,
    maxDuration: 60,
  },
);

async function handleRequest(req: NextRequest) {
  // Add CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 200, headers: corsHeaders });
  }

  try {
    const response = await handler(req);

    // If response is already a Response, add CORS headers
    if (response instanceof Response) {
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }

    return new NextResponse(response, { headers: corsHeaders });
  } catch (error) {
    console.error("MCP Handler Error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: corsHeaders },
    );
  }
}

export {
  handleRequest as GET,
  handleRequest as POST,
  handleRequest as DELETE,
  handleRequest as OPTIONS,
};
