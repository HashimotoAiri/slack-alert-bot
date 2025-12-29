import { App } from "@slack/bolt";

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// ★設定ここだけ変える
const WATCH_CHANNEL = "C0A5P2ML71T";   // 監視チャンネルID
const ALERT_CHANNEL = "C0A62DM3492";   // 通知チャンネルID
const MENTION_USER = "U0A5B3TBL5V";    // あなたのユーザーID

app.event("message", async ({ event, client }) => {
  // Bot自身やjoin通知を除外
  if (event.subtype) return;

  // チャンネル限定
  if (event.channel !== WATCH_CHANNEL) return;

  const text = event.text ?? "";

  // 条件（例：UPSIDER系）
  const hit = /UPSIDER|決済|利用|支払い|¥|円/.test(text);
  if (!hit) return;

  await client.chat.postMessage({
    channel: ALERT_CHANNEL,
    text: `🚨 <@${MENTION_USER}> 新規投稿を検知\n\n> ${text}`,
  });
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log("⚡ Slack bot running");
})();
