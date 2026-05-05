"use client";
import { useContext, useState } from "react";
import { chatContext, ChatType } from "@/context/chat";
import PromptBar from "./PromptBar";
import { ChatInstancesType } from "@/context/chatInstances";
import ollama from "ollama/browser";
import {
  useChatHistory,
  useGlobalHooks,
  useInstances,
  useSessionContext,
} from "@/hooks/context/contextHooks";
import { convertServerPatchToFullTree } from "next/dist/client/components/segment-cache/navigation";

interface Props {
  instanceId: number | undefined;
}

const transformChatlogs = (
  selectedInstance: ChatInstancesType | undefined,
  filteredChatsByInstance: ChatType[] | undefined,
) => {
  const server = selectedInstance?.chatlogs
    ?.map((chat) => [
      {
        role: "user",
        content: chat.prompt ?? "",
      },
      {
        role: "assistant",
        content: chat.response ?? "",
      },
    ])
    .flat();
  const client = filteredChatsByInstance
    ?.map((chat) => [
      {
        role: "user",
        content: chat.prompt ?? "",
      },
      {
        role: "assistant",
        content: chat.response ?? "",
      },
    ])
    .flat();

  let merge = [...(server ?? []), ...(client ?? [])];

  if (merge.length > 20) {
    merge = merge.slice(-20);
  }

  return merge;
};

export default function CoreRequestChain({ instanceId }: Props) {
  const [promptQuery, setPromptQuery] = useState("");
  const { chatHistoryClient, setChatHistoryClient } = useChatHistory();
  const { chatInstancesClient, setChatInstancesClient } = useInstances();
  const userSession = useSessionContext();
  const {
    tempId,
    tempInstanceId,
    setwebSearchResult,
    isSearchModeMemory,
    setWebModeSwitch,
    setInstanceId: setSelectedInstanceId,
    isStreaming,
    setIsStreaming,
  } = useGlobalHooks();

  async function getWebSearch() {
    try {
      let request = await fetch("/api/get-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchQuery: promptQuery }),
      });
      const response = await request.json();
      const jsonResponseString = JSON.stringify(
        response.searchResponse.web.results,
      );

      setwebSearchResult(response.searchResponse.web.results);
      getWebSearchWithContext(jsonResponseString);
    } catch (e) {
      console.error(e);
    }
  }

  async function getWebSearchWithContext(promptInject?: string) {
    const filteredChatsByInstance = chatHistoryClient.filter(
      (chat) => chat.instanceId === instanceId,
    );
    const selectedInstance = chatInstancesClient.find(
      (instance) => instance.id === instanceId,
    );
    try {
      const stream = await ollama.chat({
        model: "gemma3:1b",
        messages: [
          ...(transformChatlogs(selectedInstance, filteredChatsByInstance) ??
            []),
          {
            role: "user",
            content: `You are a helpful Assistant, Summarise the following search results, ${promptInject}`,
          },
        ],
        stream: true,
      });
      let fullResponse = "";

      for await (const part of stream) {
        setIsStreaming(false);

        fullResponse += part.message.content;
        setChatHistoryClient((prev) =>
          prev.map((item) =>
            item.instanceId === tempInstanceId
              ? { ...item, response: fullResponse }
              : item,
          ),
        );
      }

      setIsStreaming(true);
      //this is where an instance is created OR an addition to the chatlog of an instance by ID
      if (instanceId) {
        createChat(instanceId, fullResponse);
      } else {
        createInstance(fullResponse);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function getChatWithContext() {
    const filteredChatsByInstance = chatHistoryClient.filter(
      (chat) => chat.instanceId === instanceId,
    );
    const selectedInstance = chatInstancesClient.find(
      (instance) => instance.id === instanceId,
    );
    try {
      const stream = await ollama.chat({
        model: "gemma3:1b",
        messages: [
          ...(transformChatlogs(selectedInstance, filteredChatsByInstance) ??
            []),
          { role: "user", content: promptQuery },
        ],
        stream: true,
      });
      let fullResponse = "";
      for await (const part of stream) {
        fullResponse += part.message.content;
        setChatHistoryClient((prev) =>
          prev.map((item) =>
            item.instanceId === tempInstanceId
              ? { ...item, response: fullResponse }
              : item,
          ),
        );
      }
      //this is where an instance is created OR an addition to the chatlog of an instance by ID
      if (instanceId) {
        createChat(instanceId, fullResponse);
      } else {
        createInstance(fullResponse);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function createInstance(modelResponse: string) {
    try {
      const request = await fetch("/api/create-instance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: promptQuery,
          chatlogs: {
            response: modelResponse,
            prompt: promptQuery,
          },
        }),
      });
      const response = await request.json();

      setChatInstancesClient((prev) =>
        prev.map((item) =>
          item.id === tempInstanceId
            ? {
                ...item,
                id: response.prismaResponse.id,
                chatlogs: chatHistoryClient.filter(
                  (chat) => chat.instanceId === response.prismaResponse.id,
                ),
              }
            : item,
        ),
      );

      setWebModeSwitch((prev) => [
        ...prev,
        {
          instanceIdForWeb: response.prismaResponse.id,
          isWebInUse: isSearchModeMemory,
        },
      ]);

      setChatHistoryClient((prev) =>
        prev.map((item) =>
          item.id === tempId
            ? {
                ...item,
                id: response.prismaResponse.chatlogs[0].id,
                instanceId: response.prismaResponse.id,
                response: modelResponse,
              }
            : item,
        ),
      );

      setSelectedInstanceId(response.prismaResponse.id);

      return response;
    } catch (e) {
      console.error(e);
    }
  }

  async function createChat(instanceId: number, modelResponse: string) {
    try {
      const request = await fetch("/api/create-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          response: modelResponse,
          prompt: promptQuery,
          instanceId: instanceId,
        }),
      });
      const response = await request.json();
      console.log({ response });
      setChatHistoryClient((prev) =>
        prev.map((item) =>
          item.id === tempId
            ? {
                ...item,
                id: response.prismaResponse.id,
                instanceId: response.prismaResponse.instanceId,
                response: modelResponse,
              }
            : item,
        ),
      );

      // console.log({ response });
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="w-full">
      <PromptBar
        getWebSearch={getWebSearch}
        getChatWithContext={getChatWithContext}
        promptQuery={promptQuery}
        setPromptQuery={setPromptQuery}
        instanceId={instanceId}
        tempId={tempId}
        tempInstanceId={tempInstanceId}
        setChatInstancesClient={setChatInstancesClient}
      />
    </div>
  );
}
