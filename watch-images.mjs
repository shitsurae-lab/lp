import chokidar from "chokidar";
import { exec } from "child_process";

const watchPattern = "./design-assets/**/*-assets/*.{png,jpg,jpeg}";

console.log("👀 画像フォルダの自動監視を開始しました...");

// 初回起動時に1度同期を実行
runSync();

const watcher = chokidar.watch(watchPattern, {
  persistent: true,
  ignoreInitial: true,
  // ★同名上書き保存（Photoshop等）を確実に拾うための設定
  awaitWriteFinish: {
    stabilityThreshold: 300, // 300ms間ファイルサイズが変わらなければ書き込み完了とみなす
    pollInterval: 100,
  },
});

watcher.on("all", (event, filePath) => {
  console.log(`[検知: ${event}] ${filePath}`);
  runSync();
});

function runSync() {
  exec("node sync-images.mjs", (error, stdout, stderr) => {
    if (error) {
      console.error(`実行エラー: ${error.message}`);
      return;
    }
    if (stdout) console.log(stdout.trim());
  });
}
