'use client';

import { useEffect, useState } from 'react';
import Layout from "@/components/Layout";
import CharacterCard, { ICharacter } from "@/components/characters/CharacterCard";
import PlannerCard from "./components/PlannerCard";
import { CharacterProvider } from "./contexts/CharacterContext";
import PlannerContainer from './components/container';

export default function Planner() {
  return (
    <Layout>
      <CharacterProvider>
        <PlannerContainer />
      </CharacterProvider>
    </Layout>
  );
}