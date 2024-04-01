export const TestRSC = async (props: { done: () => void }) => {
  await delay(3000);
  props.done();
  return <div>RSC FROM SERVER</div>;
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
