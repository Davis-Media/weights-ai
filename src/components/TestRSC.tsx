export const TestRSC: React.FC = async () => {
  await delay(4000);
  return <div>RSC FROM SERVER</div>;
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
