import {ApolloProvider} from "@apollo/client";
import {client} from "../shared/api/github.ts";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import styles from './styles.module.css';
import {HomePage} from "../pages/Home";
import {RepositoryPage} from "../pages/Repository";

export const App = () => {
    return (
        <ApolloProvider client={client}>
            <BrowserRouter>
                <div className={styles.app}>
                    <Routes>
                        <Route path="/" element={<HomePage/>}/>
                        <Route path="/repository/:owner/:name" element={<RepositoryPage/>}/>
                    </Routes>
                </div>
            </BrowserRouter>
        </ApolloProvider>
    )
}