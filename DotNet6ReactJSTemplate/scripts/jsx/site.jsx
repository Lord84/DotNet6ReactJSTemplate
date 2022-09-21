import { createRoot } from "react-dom/client";

const rootElement = document.getElementById("react-wrapper");
const root = createRoot(rootElement);

function App() {
    return (
        <p>
            If you see this message, the template is loaded correctly. Happy coding!<br/>
            To learn more about Hooks, visit https://reactjs.org/docs/hooks-reference.html
        </p>
    );
}

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);