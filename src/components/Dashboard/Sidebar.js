import React from "react";
import { Home, BarChart2, Settings } from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="bg-black text-white w-64 min-h-screen fixed top-0 left-0 flex flex-col p-6 border-r border-gray-800">
      <h2 className="text-2xl font-bold uppercase text-red-600 tracking-wider">Dashboard</h2>
      <nav className="mt-8">
        <ul className="space-y-6">
          <li className="flex items-center text-gray-400 hover:text-white cursor-pointer transition-all">
            <Home className="w-5 h-5 mr-3" /> Início
          </li>
          <li className="flex items-center text-gray-400 hover:text-white cursor-pointer transition-all">
            <BarChart2 className="w-5 h-5 mr-3" /> Estatísticas
          </li>
          <li className="flex items-center text-gray-400 hover:text-white cursor-pointer transition-all">
            <Settings className="w-5 h-5 mr-3" /> Configurações
          </li>
        </ul>
      </nav>
    </aside>
  );
};

const HeroSection = () => {
  return (
    <div className="ml-64 w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900 text-white text-center px-6">
      <section className="max-w-4xl">
        <h1 className="text-6xl font-extrabold uppercase leading-tight tracking-widest">
          TRANSFORMA-TE! CIÊNCIA, DISCIPLINA E PERFORMANCE
          <br />
          <span className="text-red-600 text-5xl">@ 180 BY BINHO</span>
        </h1>
        <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          A verdadeira evolução não acontece por acaso. O <span className="font-bold text-white">180 by Binho</span> combina ciência, mentalidade e prática disciplinada para otimizar o teu desempenho físico e mental. Esquece atalhos e modas passageiras: aqui, a transformação é real, sustentada pela neurociência, fisiologia e psicologia do desempenho.
        </p>
      </section>
    </div>
  );
};

export { Sidebar, HeroSection };