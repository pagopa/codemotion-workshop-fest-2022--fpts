import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import { readSpeakerById } from "./db_speakers";
import { saveTalk } from "./db_talks";

type Submission = {
  readonly title: string;
  readonly abstract: string;
  readonly speakerId: string;
};

type Success = {
  readonly code: 200;
  readonly body: Submission;
};
type SpeakerNotFound = { readonly code: 404 };
type GenericServerError = { readonly code: 500; readonly body: string };
type SpeakerCannotSubmit = { readonly code: 403 };
type InvalidParameters = { readonly code: 400; readonly body: string };

type EndpointResponse =
  | Success
  | SpeakerNotFound
  | GenericServerError
  | SpeakerCannotSubmit
  | InvalidParameters;

const success = (body: Submission): Success => ({ body, code: 200 });
const speakerNotFound = (): SpeakerNotFound => ({ code: 404 });
const serverError = (reason: string): GenericServerError => ({
  body: reason,
  code: 500
});
const invalidParameters = (reason: string): InvalidParameters => ({
  body: reason,
  code: 400
});
const speakerCannotSubmit = (): SpeakerCannotSubmit => ({ code: 403 });

type SubmissionValidationFailure =
  | "bad-payload-format"
  | "title-missing"
  | "title-too-short"
  | "title-too-long"
  | "abstract-missing"
  | "abstract-too-long"
  | "speaker-missing";

const validateSubmission = (
  input: any // eslint-disable-line @typescript-eslint/no-explicit-any
): E.Either<SubmissionValidationFailure, Submission> => {
  if (typeof input !== "object" || input === null) {
    return E.left("bad-payload-format");
  }

  const { title } = input;
  if (typeof title !== "string") {
    return E.left("title-missing");
  }
  if (title.length < 10) {
    return E.left("title-too-short");
  }
  if (title.length > 70) {
    return E.left("title-too-long");
  }

  const { abstract } = input;
  if (typeof abstract !== "string") {
    return E.left("abstract-missing");
  }
  if (abstract.length > 3000) {
    return E.left("abstract-too-long");
  }

  const { speakerId } = input;
  if (typeof speakerId !== "string") {
    return E.left("speaker-missing");
  }

  return E.right({ abstract, speakerId, title });
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default (input: unknown): Promise<EndpointResponse> =>
  pipe(
    input,
    // validate submission
    validateSubmission,
    TE.fromEither,
    TE.mapLeft(reason => invalidParameters(reason)),

    // check if the speaker exists and is confirmed
    TE.chainW(sub =>
      pipe(
        TE.tryCatch(
          () => readSpeakerById(sub.speakerId),
          _ => serverError("failed to retrieve speaker informations")
        ),

        TE.chainW(maybeSpeaker =>
          pipe(maybeSpeaker, O.fromNullable, TE.fromOption(speakerNotFound))
        ),

        TE.chainW(speaker =>
          speaker.confirmed ? TE.right(speaker) : TE.left(speakerCannotSubmit())
        ),

        TE.map(_ => sub)
      )
    ),

    TE.chainW(sub =>
      TE.tryCatch(
        () =>
          saveTalk({
            abstract: sub.abstract,
            speakerId: sub.speakerId,
            title: sub.title
          }),
        _ => serverError("failed to save talk")
      )
    ),

    TE.map(sub => success(sub)),
    TE.toUnion
  )();
