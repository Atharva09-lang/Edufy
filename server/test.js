const dns = require("dns").promises;

async function test() {
  try {
    const result = await dns.resolveSrv(
      "_mongodb._tcp.cluster0.c0nm1uo.mongodb.net"
    );
    console.log(result);
  } catch (err) {
    console.error(err);
  }
}

test();