import { backup } from "./backup";

async function main() {
  console.log("Beginning backup...");
  try {
    await backup();
  } catch (error) {
    console.error("Error while running backup: ", error);
  }
}

main();
