"use client";

import dynamic from "next/dynamic";

const Stats = dynamic(() => import("./Stats"));
const TryIt = dynamic(() => import("./TryIt"));
const Features = dynamic(() => import("./Features"));
const OrnamentDivider = dynamic(() => import("./OrnamentDivider"));
const Monetization = dynamic(() => import("./Monetization"));
const Market = dynamic(() => import("./Market"));
const Roadmap = dynamic(() => import("./Roadmap"));
const CTA = dynamic(() => import("./CTA"));
const Footer = dynamic(() => import("./Footer"));

export default function BelowFold() {
  return (
    <>
      <Stats />
      <TryIt />
      <Features />
      <OrnamentDivider />
      <Monetization />
      <Market />
      <OrnamentDivider />
      <Roadmap />
      <CTA />
      <Footer />
    </>
  );
}
