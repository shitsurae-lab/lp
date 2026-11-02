import sharp from "sharp";
import { glob } from "glob";
import path from "path";
import fs from "fs/promises";

// ★sharpの内部キャッシュを無効化（同名ファイル上書きの反映漏れを防ぐ）
sharp.cache(false);

const srcDir = "./design-assets";
const distDir = "./public/images";

await fs.mkdir(distDir, { recursive: true });

// 1. 既存の public/images/*.webp を一度削除
const oldFiles = await glob(`${distDir}/*.webp`);
for (const oldFile of oldFiles) {
  await fs.unlink(oldFile);
}

// 2. 元画像を再検索して変換
const files = await glob(`${srcDir}/**/*-assets/*.{png,jpg,jpeg}`);

if (files.length === 0) {
  console.log("⚠️ 対象の画像が見つかりませんでした。");
} else {
  for (const file of files) {
    const baseName = path.basename(file, path.extname(file));
    const outputFile = path.join(distDir, `${baseName}.webp`);

    await sharp(file).webp({ quality: 80 }).toFile(outputFile);
    console.log(
      ` ➡️ 変換: ${path.basename(file)} -> public/images/${baseName}.webp`,
    );
  }
  console.log("🎉 画像の同期が完了しました！");
}
