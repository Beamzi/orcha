"use client";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { chatContext, ChatType } from "@/context/chat";
import PromptBar from "./PromptBar";
import {
  chatInstanceContext,
  ChatInstancesType,
} from "@/context/chatInstances";
import { sessionOrchaContext } from "@/context/session";
import { globalHooksContext } from "@/context/globalHooks";
import ollama from "ollama/browser";

interface resultProps {
  title: string;
  url: string;
}
interface Props {
  instanceId: number | undefined;
}

export default function CoreRequestChain({ instanceId }: Props) {
  const [promptQuery, setPromptQuery] = useState("");
  const [searchResult, setSearchResult] = useState<resultProps[]>([]);
  const [promptInject, setPromptInject] = useState("");
  const [modelSearchSum, setModelSearchSum] = useState("");
  const [isPromptReady, setIsPromptReady] = useState(false);
  const [modelDirect, setModelDirect] = useState("");

  const sessionContext = useContext(sessionOrchaContext);
  if (!sessionContext) throw new Error("invalid session");

  const userSession = sessionContext;
  const authorId = userSession.id;

  const chatHistoryContext = useContext(chatContext);
  if (!chatHistoryContext) throw new Error("context not loaded");

  const { chatHistoryClient, setChatHistoryClient } = chatHistoryContext;

  const globalHooks = useContext(globalHooksContext);
  if (!globalHooks) throw new Error("globals not loaded");

  const {
    forceInstance,
    setForceInstance,
    tempId,
    tempInstanceId,
    setTempId,
    setTempInstanceId,
    webSearchResult,
    setwebSearchResult,
    webModeSwitch,
    setWebModeSwitch,

    setInstanceId: setSelectedInstanceId,
  } = globalHooks;

  const instanceContext = useContext(chatInstanceContext);

  if (!instanceContext) throw new Error("instance content not loaded");

  const { chatInstancesClient, setChatInstancesClient } = instanceContext;

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

      const rawSearchResult = response.searchResponse.web.results;

      console.log(response);

      setPromptInject(jsonResponseString);
      setSearchResult(response.searchResponse.web.results);

      // setSearchResult((prev) => []);
      setwebSearchResult(response.searchResponse.web.results);

      // console.log(searchResult);

      getWebSearchWithContext(jsonResponseString);

      // setIsPromptReady(true);
      // setTimeout(() => {
      //   setIsPromptReady(false);
      // }, 10);
    } catch (e) {
      // console.error(e);
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
          // { role: "user", content: promptQuery },
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

  async function getModelSearchSum() {
    try {
      let request = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          model: "gemma3:1b",
          prompt: `please summarise the following search results'${promptInject}'`,
          stream: false,
        }),
      });

      const response = await request.json();

      setModelSearchSum(response.response);
    } catch (e) {
      console.error(e);
    }
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

  async function getModelDirect() {
    try {
      const request = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          model: "gemma3:1b",
          prompt: promptQuery,
          stream: false,
        }),
      });

      const response = await request.json();
      setModelDirect(response.response);

      if (instanceId) {
        createChat(instanceId, response.response);
      } else {
        createInstance(response.response);
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
      // console.log({ response });
      setChatHistoryClient((prev) =>
        prev.map((item) =>
          item.id === tempId
            ? {
                ...item,
                id: response.prismaResponse.id,
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

  useEffect(() => {
    if (isPromptReady) {
      getModelSearchSum();
    }
  }, [isPromptReady]);

  // useEffect(() => {
  //   if (instanceId !== undefined) {
  //     setInstanceMatch(instanceId);
  //   }
  // }, [instanceId]);

  return (
    <div className="w-full">
      <PromptBar
        getWebSearch={getWebSearch}
        // getWebSearchWithContext={getWebSearchWithContext}
        getModelDirect={getModelDirect}
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
