const delay = (ms: number): Promise<void> =>
  new Promise(done => setTimeout(done, ms));

export type Talk = {
  readonly title: string;
  readonly abstract: string;
  readonly speakerId: string;
};

// Mock Talks dataset
const talkDB = new Map<Talk["title"], Talk>();
talkDB.set("Lorem ipsum", {
  abstract:
    "In vulputate vehicula orci sed condimentum. Vestibulum sit amet varius nisl, eget cursus est. Morbi vitae nulla at justo aliquam efficitur.",
  speakerId: "xxx456",
  title: "Lorem ipsum"
});

export const saveTalk = async (talk: Talk): Promise<Talk> => {
  await delay(200); // simulate network lag
  talkDB.set(talk.title, talk);
  return talk;
};

export const readTalkByTitle = async (
  title: Talk["title"]
): Promise<Talk | undefined> => {
  await delay(200); // simulate network lag
  return talkDB.get(title);
};
