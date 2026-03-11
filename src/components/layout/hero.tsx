import { AnimatedShinyText } from "../ui/animated-shiny-text";

export function Hero() {
  return (
    <div className="mx-auto my-4 grid w-full max-w-6xl grid-cols-1 items-start gap-10 sm:my-5 lg:my-7 lg:grid-cols-[auto_1fr] lg:gap-14">
      <div className="flex flex-col items-center justify-start gap-2">
        <div className="relative">
          <h1
            className="font-jersey-25 absolute inset-0 translate-y-[3px] text-center text-7xl leading-none text-balance text-white uppercase select-none md:translate-y-[10px] md:text-8xl"
            aria-hidden="true"
            style={{
              color: "rgba(0,0,0,0.6)",
              WebkitTextStroke: "1px rgba(255,255,255,0.7)",
            }}
          >
            StackSkills
          </h1>

          <h1 className="font-jersey-25 relative text-center text-7xl leading-none text-balance text-white uppercase md:text-8xl">
            StackSkills
          </h1>
        </div>

        <p className="text-center font-mono text-[15px] font-medium tracking-tight uppercase lg:text-left lg:text-[19px]">
          <AnimatedShinyText>
            Helps you explore the stack of a repository
          </AnimatedShinyText>
        </p>
      </div>

      <div>
        <p className="text-muted-foreground font-geist-sans mt-2 text-center text-xl leading-tight tracking-tight text-balance sm:text-2xl lg:text-left lg:text-3xl">
          StackSkills is a tool that helps you explore the stack of a repository
          and find the skills.
        </p>
      </div>
    </div>
  );
}
