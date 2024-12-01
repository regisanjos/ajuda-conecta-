// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import PontosColeta from './components/PontosColeta';
import Dashboard from './components/Dashboard';
import ComoDoar from './components/ComoDoar';
import ComoColetar from './components/ComoColetar';
import Contate from './components/Contate';
import Doacoes from './components/Doacoes';
import DoarUser from './components/DoarUser';
import Entregas from './components/Entregas';
import AcompanharUser from './components/AcompanharUser';
import DetalhesEntrega from './components/DetalhesEntrega';
import Catastrofes from './components/Catastrofes';
import { DoacoesProvider } from './context/DoacoesContext';
import { EntregasProvider } from './context/EntregasContext';
import { CatastrofesProvider } from './context/CatastrofesContext';
import { UserProvider } from './context/UserContext';

function App() {
    return (
        <DoacoesProvider>
            <EntregasProvider>
                <CatastrofesProvider>
                    <UserProvider>
                        <Router>
                            <Header />
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/signup" element={<Signup />} />
                                <Route path="/pontos-coleta" element={<PontosColeta />} />
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/como-doar" element={<ComoDoar />} />
                                <Route path="/como-coletar" element={<ComoColetar />} />
                                <Route path="/contate" element={<Contate />} />
                                <Route path="/doacoes" element={<Doacoes />} />
                                <Route path="/doar-user" element={<DoarUser />} />
                                <Route path="/entregas" element={<Entregas />} />
                                <Route path="/acompanhar-user" element={<AcompanharUser />} />
                                <Route path="/acompanhar/:id" element={<DetalhesEntrega />} />
                                <Route path="/catastrofes" element={<Catastrofes />} />
                            </Routes>
                        </Router>
                    </UserProvider>
                </CatastrofesProvider>
            </EntregasProvider>
        </DoacoesProvider>
    );
}

export default App;
