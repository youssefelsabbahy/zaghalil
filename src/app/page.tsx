import { Hero } from "@/components/sections/Hero";
import { Story } from "@/components/sections/Story";
import { Characters } from "@/components/sections/Characters";
import { Partners } from "@/components/sections/Partners";
import { Services } from "@/components/sections/Services";
import { Shop } from "@/components/sections/Shop";
import { Videos } from "@/components/sections/Videos";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <Characters />
      <Story />
      <Partners />
      <Services />
      <Shop />
      <Videos />
      <Testimonials />
      <Contact />
    </main>
  );
}
