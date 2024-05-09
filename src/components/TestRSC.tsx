import { api } from "@/trpc/server";

export const TestRSC = async () => {
  const profile = await api.user.getUserProfile();

  await delay(3000);
  return <div>RSC FROM SERVER</div>;
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
