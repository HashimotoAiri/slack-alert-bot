import { App } from "@slack/bolt";

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// ===== 設定 =====
const WATCH_CHANNEL = "C0A5P2ML71T";   // 監視チャンネルID
const ALERT_CHANNEL = "C0A62DM3492";   // 通知チャンネルID
const MENTION_USER  = "U0A5B3TBL5V";   // あなたのユーザーID
// =================

// メッセージイベント
app.event("message", async ({ event, client }) => {
  if (event.subtype) return;
  if (event.channel !== WATCH_CHANNEL) return;

  const text = event.text ?? "";
  if (!/UPSIDER|決済|利用|支払い|¥|円/.test(text)) return;

  await client.chat.postMessage({
    channel: ALERT_CHANNEL,
    text: `🚨 <@${MENTION_USER}> 新規投稿を検知\n\n> ${text}`,
  });
});

// 起動（Railwayが割り当てたPORTで待ち受け）
(async () => {
  await app.start(process.env.PORT);
  console.log("⚡ Slack bot is running");
})();
