import { Chat } from "./components/chat";
import { DataStreamProvider } from "./components/data-stream-provider";
import { getServerSession } from "next-auth"; // Import getServerSession
import { authConfig } from "@/app/chatbot/(auth)/auth.config"; // Import authConfig

export default async function ChatbotAgentPage() {
  const session = await getServerSession(authConfig); // Get the session using getServerSession

  return (
    <DataStreamProvider>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow p-6">
          <Chat
            id="chatbot-agent"
            initialMessages={[]}
            initialChatModel="chat-model"
            initialVisibilityType="private"
            isReadonly={false}
            autoResume={false}
            session={session}
          />
        </div>
      </div>
    </DataStreamProvider>
  );
}
