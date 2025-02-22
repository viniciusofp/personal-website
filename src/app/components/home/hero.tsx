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
  return (
    <div className=" h-svh flex items-center bg-stone-100  grainy">
      <div className="container grid gap-12 mx-auto relative p-8 justify-center">
        <Chat />
      </div>
    </div>
  );
}
