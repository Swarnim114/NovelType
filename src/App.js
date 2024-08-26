import Header from "./Components/Header";
import Home from "./Pages/Home";

function App() {
    return (
        <div>
            <Header></Header> {/* Keep the Header at the top */}
            <Home /> {/* Other pages or routes can be placed here */}
        </div>
    );
}

export default App;
