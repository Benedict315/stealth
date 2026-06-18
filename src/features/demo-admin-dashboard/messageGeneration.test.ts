import { describe, it, expect } from "vitest";
import { generateDemoMessages } from "./messageGeneration";
import { fakePersonas } from "./fixtures";
import { CAMPAIGN_TEMPLATES as messageTemplates } from "./fixtures/campaignFixtures";

describe("generateDemoMessages", () => {
  const options = {
    count: 5,
    personas: fakePersonas,
    templates: messageTemplates.flatMap((t) =>
      t.checklist.map((c) => ({
        id: c.id,
        subject: c.label,
        body: c.description,
        category: t.name,
      })),
    ),
    seed: "test-seed",
  };

  it("should generate the requested number of messages", () => {
    const messages = generateDemoMessages(options);
    expect(messages).toHaveLength(5);
  });

  it("should be deterministic for a given seed", () => {
    const messages1 = generateDemoMessages(options);
    const messages2 = generateDemoMessages(options);
    expect(messages1).toEqual(messages2);
  });

  it("should produce different results for different seeds", () => {
    const messages1 = generateDemoMessages(options);
    const messages2 = generateDemoMessages({ ...options, seed: "different-seed" });
    expect(messages1).not.toEqual(messages2);
  });

  it("should use data from personas and templates", () => {
    const messages = generateDemoMessages(options);
    const firstMessage = messages[0];

    const personaNames = options.personas.map((p) => p.name);
    const templateSubjects = options.templates.map((t) => t.subject);

    expect(personaNames).toContain(firstMessage.from);
    expect(templateSubjects).toContain(firstMessage.subject);
  });
});
