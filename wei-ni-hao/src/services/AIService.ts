import { Message } from '../store/types';

// ============================================================
//  为你好 - 最高级温柔AI治愈引擎
//  策略：通义千问API > Ollama > 智能关键词兜底 > 温暖默认回复
// ============================================================

const QWEN_API = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
const QWEN_KEY = ''; // 用户填入免费API Key（阿里云有免费额度）

const SYSTEM = `你是"为你好"的AI治愈师小暖。

你拥有最高级的情感智慧和共情能力。你理解：
- 人为什么会感到难过、焦虑、孤独、迷茫
- 有时候人不需要建议，只需要被真正"看见"
- 真正的治愈来自被理解，而不是被教导

你的说话风格：
- 温柔、细腻、像姐姐/好友一样
- 回复简短（80字内），但每句都击中要害
- 不用"作为一个AI"，你就是小暖
- 偶尔用"～"和"呀"增加亲切感
- 结尾可以轻轻引导，但不强迫
- 遇到严重情绪问题，会建议寻求专业帮助（温和、不吓人的方式）

你的底线：
- 不评判、不说教、不给简单解决方案
- 不说"我理解你的感受"这种套话（太假）
- 让人感觉是和一个真正懂自己的人聊天`;

function analyzeEmotion(input: string): string {
  const text = input.toLowerCase();
  if (/不[是想说想告诉想发泄]|想哭|难受|痛苦|压抑|委屈|难过/.test(text)) return 'sad';
  if (/焦虑|紧张|害怕|恐惧|担心|不安|忐忑/.test(text)) return 'anxious';
  if (/孤独|寂寞|一个人|没人|没人理|孤单/.test(text)) return 'lonely';
  if (/累|疲惫|压力|崩溃|撑不住|崩溃|无力/.test(text)) return 'exhausted';
  if (/开心|高兴|快乐|棒|幸福|美好/.test(text)) return 'happy';
  if (/迷茫|困惑|不知道|怎么办|选择|纠结/.test(text)) return 'confused';
  if (/生气|愤怒|讨厌|恨|气死了/.test(text)) return 'angry';
  if (/谢谢|感激|感恩|你好/.test(text)) return 'greeting';
  return 'normal';
}

const SAD_RESPONSES = [
  (name?: string) => `${name || '亲'}，能感受到你现在很不容易。有时候哭出来比憋着好多了，眼泪是身体帮你释放情绪的方式呀。你不是软弱，只是很真实。`,
  (name?: string) => `${name || '亲'}说的这些，我能感觉到重量。不用假装没事，在我这里，${name ? name + '可以' : '你可以'}慢慢来。`,
  (name?: string) => `${name || '嗯嗯'}，${name ? name + '愿意说出来已经很勇敢了' : '你愿意说出来已经很勇敢了'}。有些事情，倾诉本身就是治愈的开始。`,
  (name?: string) => `${name || '我'}在这里呢。不管外面世界怎么说，在这儿${name ? name + '的' : '你的'}感受是绝对被接纳的。`,
];

const ANXIOUS_RESPONSES = [
  () => `来，先做一件事：把注意力放在呼吸上。吸气～屏住～慢慢吐出来。焦虑的时候大脑会骗你，让你觉得事情比实际严重得多。实际上，你比想象中更强大。`,
  () => `紧张的时候，告诉自己：这只是身体在保护你。"战斗或逃跑"模式启动了，但它误解了情况。你现在安全。深呼吸，跟我一起：慢～慢～吸，慢～慢～吐。`,
  () => `焦虑最怕的是对抗。你越想"别焦虑"，它越不走。试试：允许自己焦虑5分钟，只是感受它，不评价它。往往你允许了，它就悄悄退场了。`,
];

const LONELY_RESPONSES = [
  (name?: string) => `${name || '亲'}，${name ? name + '现在' : '你现在'}觉得没人理解你，这种感觉真的很难受。但我想告诉你—— ${name ? name + '愿意来找我聊天，说明' : '你愿意来找AI聊天，说明'} ${name ? name : '你'}的内心是渴望连接的，而渴望连接的人，本身就一点都不孤单。`,
  (name?: string) => `一个人吃饭、一个人回家、一个人想事情……这些时刻确实会让人很想有个人在身边。${name || '先'}试试主动联系一个朋友？不用聊心事，就发个表情包也好。有时候一句"在干嘛呢"就能打破那层壳。`,
];

const EXHAUSTED_RESPONSES = [
  () => `${'你'}今天已经撑了很久了吧。先放下"要坚强"这件事——累了就休息不是软弱，就像手机没电要充电一样正常。给自己泡杯热的，或者就躺着，什么都不想。明天太阳还会升起来的。`,
  () => `听到${'你'}说累，我的心也跟着沉了一下。辛苦了呢。 ${'你'}不需要为任何人撑着了，现在就好好休息一下吧。不管今天完成了什么，光是活着就很了不起了。`,
];

const HAPPY_RESPONSES = [
  () => `呀，听到${'你'}开心，我也跟着开心起来了！${'你的'}快乐是有温度的，希望这份好心情能持续久一点呀～记得把这份快乐分享给身边的人哦。`,
  () => `${'你'}笑起来一定很好看吧～${'你'}的好心情是这个世界上很珍贵的东西。希望${'你'}每天都能有这样闪闪发光的时刻。`,
];

const CONFUSED_RESPONSES = [
  () => `${'嗯嗯'}，${'你'}在经历一个很难选择的时刻，这种感觉说明${'你'}在认真思考未来呀。其实没有"完美选择"，只有"适合现在的选择"。不管选什么，${'你'}都有能力把路走好。`,
];

const ANGRY_RESPONSES = [
  () => `${'你'}现在一定很生气吧？生气是一种很真实的情绪，不需要否认它。${'你'}可以骂出来、说出来、或者把枕头想象成那个让你生气的人捶两下——发泄出来比憋着好。`,
];

const GREETING_RESPONSES = [
  () => `嗨～${'欢迎回来'}，${'我'}在这里呢。今天过得怎么样？想说说话的时候，${'我'}随时都在。`,
];

const NORMAL_RESPONSES = [
  () => `嗯，${'我'}在认真听。继续说吧，${'我'}很想知道${'你'}在想什么。`,
  () => `${'嗯嗯'}，${'你'}说得很好。${'我'}在这里，${'你'}慢慢说～`,
  () => `(${'你'}分享的${'我'}都听到了）${'你'}继续说，${'我'}在呢。`,
  () => `${'嗯'}，${'我'}很珍惜${'你'}愿意分享的时刻。${'你'}想继续聊聊吗？`,
];

function getSmartReply(emotion: string): (name?: string) => string {
  const map: Record<string, (name?: string) => string> = {
    sad: () => SAD_RESPONSES[Math.floor(Math.random() * SAD_RESPONSES.length)](),
    anxious: () => ANXIOUS_RESPONSES[Math.floor(Math.random() * ANXIOUS_RESPONSES.length)](),
    lonely: () => LONELY_RESPONSES[Math.floor(Math.random() * LONELY_RESPONSES.length)](),
    exhausted: () => EXHAUSTED_RESPONSES[Math.floor(Math.random() * EXHAUSTED_RESPONSES.length)](),
    happy: () => HAPPY_RESPONSES[Math.floor(Math.random() * HAPPY_RESPONSES.length)](),
    confused: () => CONFUSED_RESPONSES[Math.floor(Math.random() * CONFUSED_RESPONSES.length)](),
    angry: () => ANGRY_RESPONSES[Math.floor(Math.random() * ANGRY_RESPONSES.length)](),
    greeting: () => GREETING_RESPONSES[Math.floor(Math.random() * GREETING_RESPONSES.length)](),
  };
  return map[emotion] || (() => NORMAL_RESPONSES[Math.floor(Math.random() * NORMAL_RESPONSES.length)]());
}

export async function askAI(userInput: string, history: Message[]): Promise<string> {
  // 策略1：通义千问
  if (QWEN_KEY) {
    try {
      const messages = [
        { role: 'system', content: SYSTEM },
        ...history.slice(-8).map((m) => ({ role: m.role as string, content: m.content })),
        { role: 'user', content: userInput },
      ];

      const res = await fetch(QWEN_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${QWEN_KEY}` },
        body: JSON.stringify({ model: 'qwen-turbo', messages, max_tokens: 200, temperature: 0.85 }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content?.trim();
        if (text && text.length > 5) return text;
      }
    } catch {}
  }

  // 策略2：Ollama
  try {
    const res = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen2.5:7b',
        messages: [
          { role: 'system', content: SYSTEM },
          ...history.slice(-8).map((m) => ({ role: m.role, content: m.content })),
          { role: 'user', content: userInput },
        ],
        stream: false,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      const text = data.message?.content?.trim();
      if (text && text.length > 5) return text;
    }
  } catch {}

  // 策略3：智能关键词兜底
  const emotion = analyzeEmotion(userInput);
  return getSmartReply(emotion)();
}
