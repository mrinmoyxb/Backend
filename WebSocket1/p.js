async function typewriter(text, delay = 500) {
  for (const char of text) {
    process.stdout.write(char)  // write without newline
    await new Promise(r => setTimeout(r, delay))
  }
}

await typewriter("Hello");