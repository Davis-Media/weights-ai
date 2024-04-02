export const TestRSC = async () => {
  await delay(3000);
  return <div>RSC FROM SERVER</div>;
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
