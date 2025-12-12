"use client";
import { useContext, useEffect, useState } from "react";
import { chatContext } from "@/context/chat";
import PromptBar from "./PromptBar";

interface resultProps {
  title: string;
  url: string;
}

export default function TestRenderSearch() {
  const [promptQuery, setPromptQuery] = useState("");
  const [searchResult, setSearchResult] = useState<resultProps[]>([]);
  const [promptInject, setPromptInject] = useState("");
  const [modelSearchSum, setModelSearchSum] = useState("");
  const [isPromptReady, setIsPromptReady] = useState(false);
  const [modelDirect, setModelDirect] = useState("");

  let tempId = 36437;

  const chatHistoryContext = useContext(chatContext);
  if (!chatHistoryContext) throw new Error("context not loaded");

  const { chatHistoryClient, setChatHistoryClient } = chatHistoryContext;

  async function getResult() {
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
        response.searchResponse.web.results
      );
      setPromptInject(jsonResponseString);
      setSearchResult(response.searchResponse.web.results);
      setIsPromptReady(true);
      setTimeout(() => {
        setIsPromptReady(false);
      }, 10);
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
      // console.log(searchResult);
      // console.log(promptInject, "this is console log");
      // console.log("🟢 Summary FETCH SENT, waiting for response...");

      const response = await request.json();

      setModelSearchSum(response.response);
      setChatHistoryClient((prev) =>
        prev.map((item) =>
          item.id === tempId
            ? { ...item, id: 3, response: response.response }
            : item
        )
      );

      const instanceResponse = await createInstance();
      createChat(instanceResponse.prismaResponse);
    } catch (e) {
      console.error(e);
    }
  }

  async function createInstance() {
    try {
      const request = await fetch("/api/create-instance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: promptQuery,
        }),
      });
      const response = await request.json();

      // const instanceId = response.prismaResponse.id;
      // const instanceId2 = response.response.response.prismaResponse.id;
      console.log({ response });
      console.log(response.prismaResponse.id, "response.prismaResponse.id");

      // console.log(instanceId, "response.prismaResponse.id");
      // console.log(instanceId2, "response.response.prismaResponse.id");

      return response;
    } catch (e) {
      console.error(e);
    }
  }

  async function createChat(instanceId: number) {
    try {
      const request = await fetch("/api/create-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          response: modelDirect,
          prompt: promptQuery,
          instanceId: instanceId,
        }),
      });

      const response = await request.json();
      console.log({ response });
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

      setChatHistoryClient((prev) =>
        prev.map((item) =>
          item.id === tempId
            ? { ...item, id: 3, response: response.response }
            : item
        )
      );
      createInstance();
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    if (isPromptReady) {
      getModelSearchSum();
    }
  }, [isPromptReady]);

  return (
    <div className="flex flex-col h-screen border  ">
      <div className="flex flex-1 min-h-0 overflow-y-scroll border p-2.5 ">
        {/* <div>{modelSearchSum}</div> */}
        <hr></hr>
        <div>
          {chatHistoryClient.map((item, index) => (
            <div className="flex flex-col" key={index + 1246}>
              <p>{item.prompt}</p>
              <p>{item.response}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="">
        <PromptBar
          getResult={getResult}
          getModelDirect={getModelDirect}
          promptQuery={promptQuery}
          setPromptQuery={setPromptQuery}
        />
      </div>
    </div>
  );
}
