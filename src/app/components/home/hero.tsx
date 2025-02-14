'use client';

import { useRef, useState } from 'react';
import Chat from './chat';

function calculateAge(birthDate: string) {
  const today = new Date();
  const birth = new Date(birthDate);

  let age = today.getFullYear() - birth.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  const birthMonth = birth.getMonth();
  const birthDay = birth.getDate();

  // Subtract 1 if the birthday hasn't occurred yet this year
  if (
    currentMonth < birthMonth ||
    (currentMonth === birthMonth && currentDay < birthDay)
  ) {
    age--;
  }

  return age;
}

const myAge = calculateAge('1992-04-10');

export type HeroProps = {};

export default function Hero(props: HeroProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };
  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className=" h-svh flex items-center bg-stone-100  grainy"
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 mix-blend-overlay h-full w-full"
        style={{
          opacity,
          background: `radial-gradient(1200px circle at ${position.x}px ${position.y}px, rgba(255,255,255,.2), transparent 50%)`
        }}
      />

      <div className="container grid gap-12 mx-auto relative p-8 justify-center">
        <div className=" blur-[0.5px] w-full">
          <h1 className="~text-3xl/5xl font-bold font-mono text-stone-800 text-center">
            Olá, eu sou Vinícius Pereira.
          </h1>
        </div>
        <Chat />
      </div>
    </div>
  );
}
