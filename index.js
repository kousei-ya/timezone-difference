#!/usr/bin/env node

const { Select, Input } = require("enquirer");
const { cities } = require("./cities_list");
const { DateTime } = require("luxon");

async function main() {
  const cityChoices = Object.keys(cities);

  const baseCityPrompt = new Select({
    name: "baseCity",
    message: "基準となる都市を選んでください:",
    choices: cityChoices,
  });
  const baseCity = await baseCityPrompt.run();

  const yearPrompt = new Input({
    name: "year",
    message: "希望の年を入力してください (例: 2025):",
    validate: (value) =>
      /^\d{4}$/.test(value) ? true : "正しい年を入力してください",
  });
  const year = await yearPrompt.run();

  const monthPrompt = new Input({
    name: "month",
    message: "希望の月を入力してください (1〜12):",
    validate: (value) =>
      /^[1-9]$|^1[0-2]$/.test(value)
        ? true
        : "1〜12の範囲で正しい月を入力してください",
  });
  const month = await monthPrompt.run();

  const dayPrompt = new Input({
    name: "day",
    message: "希望の日付を入力してください (1〜31):",
    validate: (value) =>
      /^[1-9]$|^[1-2][0-9]$|^3[0-1]$/.test(value)
        ? true
        : "1〜31の範囲で正しい日付を入力してください",
  });
  const day = await dayPrompt.run();

  const hourPrompt = new Input({
    name: "hour",
    message: "希望の時刻を入力してください (0〜23):",
    validate: (value) =>
      /^([0-9]|1[0-9]|2[0-3])$/.test(value)
        ? true
        : "0〜23の範囲で正しい時刻を入力してください",
  });
  const hour = await hourPrompt.run();

  const inputDate =
    `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}` +
    `T${hour.padStart(2, "0")}:00:00`;

  const baseCityTime = DateTime.fromISO(inputDate, {
    zone: cities[baseCity],
  });

  const comparedCityChoices = cityChoices.filter(
    (city) => city.name !== baseCity
  );

  const comparedCityPrompt = new Select({
    name: "comparedCity",
    message: "比較する都市を選んでください:",
    choices: comparedCityChoices,
  });

  const comparedCity = await comparedCityPrompt.run();

  const comparedCityTime = baseCityTime.setZone(cities[comparedCity]);

  const offsetDifference = (comparedCityTime.offset - baseCityTime.offset) / 60;

  const offsetDifferenceAbs = Math.abs(offsetDifference);
  console.log(
    `\n${baseCity}と${comparedCity}の時差は${offsetDifferenceAbs} 時間です。`
  );

  console.log(`${baseCity}の日時: ${baseCityTime.toFormat("yyyy/M/d HH:mm")}`);
  console.log(
    `${comparedCity}の日時: ${comparedCityTime.toFormat("yyyy/M/d HH:mm")}\n`
  );
}

main();
