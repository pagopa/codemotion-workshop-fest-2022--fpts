const delay = (ms: number): Promise<void> =>
  new Promise(done => setTimeout(done, ms));

export type Speaker = {
  readonly id: string;
  readonly name: string;
  readonly surname: string;
  readonly githubUsername: string;
  readonly confirmed: boolean;
};

// Mock Speakers dataset
const sperakerDB = new Map<Speaker["id"], Speaker>();
sperakerDB.set("aaa123", {
  confirmed: false,
  githubUsername: "geniusplayboybillionaire",
  id: "aaa123",
  name: "Tony",
  surname: "Stark"
});
sperakerDB.set("zzz789", {
  confirmed: true,
  githubUsername: "haihydra",
  id: "zzz789",
  name: "Steve",
  surname: "Rogers"
});

export const readSpeakerById = async (
  id: Speaker["id"]
): Promise<Speaker | undefined> => {
  await delay(200); // simulate network lag
  return sperakerDB.get(id);
};
