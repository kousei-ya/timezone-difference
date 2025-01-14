#!/usr/bin/env node

const { Select, Input } = require("enquirer");
const { cities } = require("./cities_list");
const { DateTime } = require("luxon");

async function main() {
  try {
    const cityChoices = Object.keys(cities);

    // 1つ目の都市を選択
    const city1Prompt = new Select({
      name: "city1",
      message: "1つ目の都市を選んでください:",
      choices: cityChoices,
    });
    const city1 = await city1Prompt.run();

    // 日時を入力
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

    // ユーザーが指定した日付と時刻を作成
    const inputDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
      2,
      "0"
    )}T${hour.padStart(2, "0")}:00:00`;

    // 1つ目の都市のタイムゾーンに変換
    const city1Time = DateTime.fromISO(inputDate, { zone: cities[city1] });

    const city2Choices = cityChoices.filter((city) => city.name !== city1);

    const city2Prompt = new Select({
      name: "city2",
      message: "2つ目の都市を選んでください:",
      choices: city2Choices,
    });

    const city2 = await city2Prompt.run();

    // 2つ目の都市の日時を取得（1つ目の都市の時間を基に変換）
    const city2Time = city1Time.setZone(cities[city2]);

    // 両都市のタイムゾーンオフセット差を計算
    const offsetDifference = (city2Time.offset - city1Time.offset) / 60; // オフセット差を時間単位で計算

    // 結果を表示
    const offsetDifferenceAbs = Math.abs(offsetDifference); // 絶対値を取得
    console.log(
      `\n${city1}と${city2}の時差は${offsetDifferenceAbs} 時間です。`
    );

    console.log(`${city1}の日時: ${city1Time.toFormat("yyyy/M/d HH:mm")}`);
    console.log(`${city2}の日時: ${city2Time.toFormat("yyyy/M/d HH:mm")}\n`);
  } catch (err) {
    console.error("エラーが発生しました:", err.message);
  }
}

main();
