import {
  computeDaily,
  makeScoreboardContent,
} from "#/service/daily-scoreboard";

async function main() {
  const day = 24 * 60 * 60 * 1000;
  const list: [string, string][] = [
    ["marco", "ma"],
    ["marc123o", "1ma"],
    ["2marc123o", "4ma"],
    ["12", "12"],
    ["22123", "123123"],
  ];

  await Promise.all(list.map((args) => computeDaily(...args)));

  console.log(await makeScoreboardContent());
}

main();
