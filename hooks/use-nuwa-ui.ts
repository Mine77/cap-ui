import type { RemoteProxy, Reply } from "penpal";
import { connect, WindowMessenger } from "penpal";
import { useEffect, useState } from "react";

export interface UseNuwaParentProps {
  onReceiveMessage?(incomingMessage: string): string;
}

type NuwaParentMethods = {
  sendMessage(msg: string): Reply<string>;
  sendToolCall(toolCall: string): Reply<string>;
  sendPrompt(prompt: string): Reply<string>;
};

export const useNuwaUI = ({ onReceiveMessage }: UseNuwaParentProps) => {
  const [parentMethods, setParentMethods] =
    useState<RemoteProxy<NuwaParentMethods> | null>(null);

  const sendMessage = (msg: string) => {
    return onReceiveMessage?.(msg);
  };

  useEffect(() => {
    const initConnection = async () => {
      try {
        const messenger = new WindowMessenger({
          remoteWindow: window.parent,
          allowedOrigins: ["*"], // Allow all origins for testing
        });

        const conn = connect<NuwaParentMethods>({
          messenger,
          methods: {
            sendMessage,
          },
          timeout: 15000, // Increased timeout
        });

        const parentMethods = await conn.promise;

        setParentMethods(parentMethods);
      } catch (error) {
        console.error("IFrame UI Failed to connect to parent:", error);
      }
    };

    // Start connection attempt immediately
    initConnection();
  }, []);

  return {
    parentMethods,
  };
};
