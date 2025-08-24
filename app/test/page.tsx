"use client";;

import { useState } from "react";
import { useNuwaUI } from "@/hooks/use-nuwa-ui";

export default function TestPage() {
    const [inputValue, setInputValue] = useState("");
    const [messageReceived, setMessageReceived] = useState("");


    const { parentMethods } = useNuwaUI({
        onReceiveMessage: (incomingMessage: string) => {
            console.log("Child: Received message from parent:", incomingMessage);
            setMessageReceived(incomingMessage)
            return `Message Received`;
        },
    });

    const handleClick = async () => {
        if (parentMethods) {
            try {
                const response = await parentMethods.sendMessage(
                    inputValue || "Hello from child iframe page",
                );
                console.log("Child: Parent responded:", response);
            } catch (error) {
                console.error("Child: Failed to send message to parent:", error);
            }
        }
    }

    return (
        <div className="h-full flex flex-col">
            <h1 className="text-2xl font-bold m-4">UI IFrame</h1>
            <span className="ml-4 text-sm">
                Status: {parentMethods ? '🟢 Connected' : '🔴 Disconnected'}
            </span>
            <div className="p-4">
                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Enter message to send"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4 text-md">Message Received: {messageReceived}</div>
                <button
                    type="button"
                    onClick={handleClick}
                    disabled={!parentMethods}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    {parentMethods ? 'Send Message to Nuwa' : 'Connecting...'}
                </button>
            </div>
        </div>
    );
}
