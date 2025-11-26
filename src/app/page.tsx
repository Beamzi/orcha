import TestRenderPrompt from "@/components/TestRenderPrompt";
import TestRenderSearch from "@/components/TestRenderSearch";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <TestRenderPrompt />
      <TestRenderSearch />
    </div>
  );
}
