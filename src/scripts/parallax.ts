import Rellax from "rellax";

// Rellax のインスタンス型を typeof から取得
type RellaxInstance = InstanceType<typeof Rellax>;

let instance: RellaxInstance | null = null;

/**
 * 画面幅に応じて Rellax の有効化 / 破棄（destroy）を切り替える
 */
export function initParallax() {
  const elements = document.querySelectorAll(".rellax");
  if (elements.length === 0) return;

  // 768px 以上の PC 画面かどうかを判定
  const isDesktop = window.matchMedia("(min-width: 768px)").matches;

  if (isDesktop) {
    // PC表示かつインスタンスが未生成の場合のみ初期化
    if (!instance) {
      instance = new Rellax(".rellax", {
        center: true,
        round: true,
        vertical: true,
        horizontal: false,
      });
    }
  } else {
    // スマホ表示の場合は destroy() してパララックスを完全解除＆スタイルリセット
    if (instance) {
      instance.destroy();
      instance = null;
    }
  }
}

// DOM読み込み時 ＆ 画面リサイズ時に判定を実行
if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    initParallax();

    // 画面幅が変更された時（レスポンシブ切り替え時）にも即座に対応
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    mediaQuery.addEventListener("change", () => {
      initParallax();
    });
  });
}
