import Fastify from "fastify";
import saveTalkController from ".";
const fastify = Fastify({
  logger: true
});

fastify.get("/", async (request, reply) => reply.send({ hello: "world" }));
fastify.post("/talks", async (request, reply) => {
  const response = await saveTalkController(request.body);

  const code = response.code;
  const body = "body" in response ? response.body : undefined;
  return reply.code(code).send(body);
});

fastify.listen(3000, (err /* , address */) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
