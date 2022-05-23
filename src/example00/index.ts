/* eslint-disable @typescript-eslint/no-unused-vars */
import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { readSpeakerById } from "./db_speakers";
import { saveTalk } from "./db_talks";
import {
  Submission,
  invalidParameters,
  serverError,
  speakerNotFound,
  speakerCannotSubmit,
  EndpointResponse,
  success
} from "./types";

type SubmissionValidationFailure =
  | "bad-payload-format"
  | "title-missing"
  | "title-too-short"
  | "title-too-long"
  | "abstract-missing"
  | "abstract-too-long"
  | "speaker-missing";

declare function validateSubmission(
  input: any // eslint-disable-line @typescript-eslint/no-explicit-any
): E.Either<SubmissionValidationFailure, Submission>;

declare function endpoint(input: unknown): Promise<EndpointResponse>;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default endpoint;
