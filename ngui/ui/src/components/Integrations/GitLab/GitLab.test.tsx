import { createRoot } from "react-dom/client";
import TestProvider from "tests/TestProvider";
import GitLab from "./GitLab";

it("renders without crashing", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <GitLab />
    </TestProvider>
  );
  root.unmount();
});
