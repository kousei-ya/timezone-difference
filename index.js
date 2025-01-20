#!/usr/bin/env node

const { Select, Input } = require("enquirer");
const { cities } = require("./cities_list");
const { DateTime } = require("luxon");

main();

async function main() {
  const cityChoices = Object.keys(cities);

  const baseCity = await selectCity(
    "基準となる都市を選んでください:",
    cityChoices,
  );

  const inputDate = await getDateTimeFromUser();

  const baseCityTime = DateTime.fromISO(inputDate, {
    zone: cities[baseCity],
  });

  const comparedCityChoices = cityChoices.filter(
    (city) => city.name !== baseCity,
  );

  const comparedCity = await selectCity(
    "比較する都市を選んでください:",
    comparedCityChoices,
  );

  const comparedCityTime = baseCityTime.setZone(cities[comparedCity]);

  const offsetDifference = (comparedCityTime.offset - baseCityTime.offset) / 60;

  const offsetDifferenceAbs = Math.abs(offsetDifference);
  console.log(
    `\n${baseCity}と${comparedCity}の時差は${offsetDifferenceAbs} 時間です。`,
  );

  console.log(`${baseCity}の日時: ${baseCityTime.toFormat("yyyy/M/d HH:mm")}`);
  console.log(
    `${comparedCity}の日時: ${comparedCityTime.toFormat("yyyy/M/d HH:mm")}\n`,
  );
}

async function selectCity(message, choices) {
  const cityPrompt = new Select({
    name: "city",
    message,
    choices,
  });
  return cityPrompt.run();
}

async function getInput(message, validate) {
  const inputPrompt = new Input({
    name: "input",
    message,
    validate,
  });
  return inputPrompt.run();
}

async function getDateTimeFromUser() {
  const year = await getInput(
    "希望の年を入力してください (例: 2025):",
    (value) => (/^\d{4}$/.test(value) ? true : "正しい年を入力してください"),
  );
  const month = await getInput(
    "希望の月を入力してください (1〜12):",
    (value) =>
      /^[1-9]$|^1[0-2]$/.test(value)
        ? true
        : "1〜12の範囲で正しい月を入力してください",
  );
  const day = await getInput(
    "希望の日付を入力してください (1〜31):",
    (value) =>
      /^[1-9]$|^[1-2][0-9]$|^3[0-1]$/.test(value)
        ? true
        : "1〜31の範囲で正しい日付を入力してください",
  );
  const hour = await getInput(
    "希望の時刻を入力してください (0〜23):",
    (value) =>
      /^([0-9]|1[0-9]|2[0-3])$/.test(value)
        ? true
        : "0〜23の範囲で正しい時刻を入力してください",
  );

  return (
    `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}` +
    `T${hour.padStart(2, "0")}:00:00`
  );
}
