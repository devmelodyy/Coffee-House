import { BeanDivider } from "@/components/sections/BeanDivider";
import { Categories, CoffeeOfWeek, Events, Hero, HowItWorks, Specials, StoryAndVisit } from "@/components/sections/Home";

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <BeanDivider />
      <Specials />
      <CoffeeOfWeek />
      <HowItWorks />
      <Events />
      <StoryAndVisit />
    </>
  );
}
