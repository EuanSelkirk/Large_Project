import { Tailwind, compile } from "@fileforge/react-print";

export const getResumeHTML = async () => {
  return compile(
    <Tailwind>
      <div className="p-6 font-sans">
        <h1 className="text-4xl font-bold">Jane Doe</h1>
        <p className="text-lg">Full-Stack Developer</p>
        <section className="mt-4">
          <h2 className="text-2xl font-semibold">Experience</h2>
          <ul className="list-disc pl-5">
            <li>Company A (2020–2022)</li>
            <li>Company B (2022–Now)</li>
          </ul>
        </section>
      </div>
    </Tailwind>
  );
};
