import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

// styles
import "./App.css";

// pages and components
import ProjectList from "./pages/projectList/ProjectList";
import Create from "./pages/create/Create";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Project from "./pages/project/Project";
import Navbar from "./components/navbar/Navbar";
import Home from "./pages/home/home";
import Team from "./pages/team/team";
import Projects from "./pages/Projects/Projects";
import Footer from "./components/Footer";
import ContactUs from "./components/contact/contact";
import Library from "./pages/Library/library";

function App() {
  const { user, authIsReady } = useAuthContext();

  return (
    <div className="App">
      {authIsReady && (
        <BrowserRouter>
          <div className="container">
            <Navbar />

            <Switch>
              <Route exact path="/">
                {!user && <Redirect to="/home" />}
                {user && <ProjectList />}
              </Route>
              <Route path="/create">
                {!user && <Redirect to="/login" />}
                {user && <Create />}
              </Route>
              <Route path="/project/:id">
                {!user && <Redirect to="/login" />}
                {user && <Project />}
              </Route>
              <Route path="/login">
                {user && <Redirect to="/" />}
                {!user && <Login />}
              </Route>
              <Route path="/signup">
                <Signup />
              </Route>
              <Route path="/home">
                <Home />
              </Route>
              <Route path="/team">
                <Team />
              </Route>
              <Route path="/projects">
                <Projects />
              </Route>
              <Route path="/contact">
                <ContactUs />
              </Route>
              <Route path="/library">
                <Library />
              </Route>
            </Switch>
          </div>
          <Footer />
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
