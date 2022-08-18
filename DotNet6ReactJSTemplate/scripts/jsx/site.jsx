function App() {
    return (
        <p>
            If you see this message, the template is loaded correctly. Happy coding!
        </p>
    );
}

// ReactDom.render should be located at the end of the file
ReactDOM.render(
    <App />,
    document.getElementById('react-wrapper')
);