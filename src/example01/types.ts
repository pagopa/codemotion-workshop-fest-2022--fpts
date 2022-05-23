export type Submission = {
  readonly title: string;
  readonly abstract: string;
  readonly speakerId: string;
};

export type Success = {
  readonly code: 200;
  readonly body: Submission;
};
export type SpeakerNotFound = { readonly code: 404 };
type GenericServerError = { readonly code: 500; readonly body: string };
type SpeakerCannotSubmit = { readonly code: 403 };
type InvalidParameters = { readonly code: 400; readonly body: string };

export type EndpointFailureResponse =
  | SpeakerNotFound
  | GenericServerError
  | SpeakerCannotSubmit
  | InvalidParameters;

export type EndpointResponse = Success | EndpointFailureResponse;

export const success = (body: Submission): EndpointResponse => ({
  body,
  code: 200
});
export const speakerNotFound = (): EndpointResponse => ({ code: 404 });
export const serverError = (reason: string): EndpointResponse => ({
  body: reason,
  code: 500
});
export const invalidParameters = (reason: string): EndpointResponse => ({
  body: reason,
  code: 400
});
export const speakerCannotSubmit = (): EndpointResponse => ({ code: 403 });
