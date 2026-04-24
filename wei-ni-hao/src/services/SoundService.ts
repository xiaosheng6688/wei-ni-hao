// Web Audio API 生成治愈声音 - 无需任何外部文件！
export type SoundType = 'rain' | 'ocean' | 'cafe' | 'forest';

let audioCtx: AudioContext | null = null;
let activeNodes: { gain: GainNode; sources: AudioNode[]; interval?: number } | null = null;

function getAudioCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

// 创建白噪声缓冲
function createNoiseBuffer(ctx: AudioContext, duration: number, type: 'white' | 'brown' | 'pink'): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * duration;
  const buffer = ctx.createBuffer(2, length, sampleRate);
  const dataL = buffer.getChannelData(0);
  const dataR = buffer.getChannelData(1);

  if (type === 'white') {
    for (let i = 0; i < length; i++) {
      const v = Math.random() * 2 - 1;
      dataL[i] = v;
      dataR[i] = Math.random() * 2 - 1;
    }
  } else if (type === 'brown') {
    let lastOut = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + (0.02 * white)) / 1.02;
      dataL[i] = lastOut * 3.5;
      dataR[i] = lastOut * 3.5;
    }
  } else {
    // pink noise approximation
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      b6 = white * 0.115926;
      const v = pink * 0.11;
      dataL[i] = v;
      dataR[i] = pink * 0.11;
    }
  }
  return buffer;
}

export async function playSound(type: SoundType): Promise<void> {
  await stopSound();
  const ctx = getAudioCtx();

  const masterGain = ctx.createGain();
  masterGain.gain.value = 0.5;
  masterGain.connect(ctx.destination);

  const sources: AudioNode[] = [];

  if (type === 'rain') {
    // 雨声 = 滤波白噪声 + 偶尔滴答
    const buf = createNoiseBuffer(ctx, 4, 'brown');
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 800;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 4000;
    src.connect(hp).connect(lp).connect(masterGain);
    src.start();
    sources.push(src);

    // 滴答层
    const buf2 = createNoiseBuffer(ctx, 2, 'white');
    const src2 = ctx.createBufferSource();
    src2.buffer = buf2;
    src2.loop = true;
    const hp2 = ctx.createBiquadFilter();
    hp2.type = 'highpass';
    hp2.frequency.value = 3000;
    const g2 = ctx.createGain();
    g2.gain.value = 0.15;
    src2.connect(hp2).connect(g2).connect(masterGain);
    src2.start();
    sources.push(src2);
  }

  if (type === 'ocean') {
    // 海浪 = 调制噪声
    const buf = createNoiseBuffer(ctx, 8, 'brown');
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 600;
    const waveGain = ctx.createGain();
    waveGain.gain.value = 0.3;
    src.connect(lp).connect(waveGain).connect(masterGain);
    src.start();
    sources.push(src);

    // LFO调制 - 模拟潮水
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.12;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.25;
    lfo.connect(lfoGain).connect(waveGain.gain);
    lfo.start();
    sources.push(lfo);
  }

  if (type === 'forest') {
    // 森林 = 柔和粉色噪声 + 高频鸟鸣模拟
    const buf = createNoiseBuffer(ctx, 6, 'pink');
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 2000;
    const g = ctx.createGain();
    g.gain.value = 0.25;
    src.connect(lp).connect(g).connect(masterGain);
    src.start();
    sources.push(src);

    // 鸟鸣层 - 用振荡器模拟
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = 2200;
    const g1 = ctx.createGain();
    g1.gain.value = 0.04;
    osc1.connect(g1).connect(masterGain);
    osc1.start();
    sources.push(osc1);

    // 随机调制鸟鸣
    const modOsc = ctx.createOscillator();
    modOsc.frequency.value = 3;
    const modGain = ctx.createGain();
    modGain.gain.value = 600;
    modOsc.connect(modGain).connect(osc1.frequency);
    modOsc.start();
    sources.push(modOsc);
  }

  if (type === 'cafe') {
    // 咖啡馆 = 低沉棕色噪声（嘈杂低频） + 高频层
    const buf = createNoiseBuffer(ctx, 6, 'brown');
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 400;
    bp.Q.value = 0.5;
    const g = ctx.createGain();
    g.gain.value = 0.6;
    src.connect(bp).connect(g).connect(masterGain);
    src.start();
    sources.push(src);

    // 人声频率范围噪声
    const buf2 = createNoiseBuffer(ctx, 4, 'white');
    const src2 = ctx.createBufferSource();
    src2.buffer = buf2;
    src2.loop = true;
    const bp2 = ctx.createBiquadFilter();
    bp2.type = 'bandpass';
    bp2.frequency.value = 1200;
    bp2.Q.value = 0.3;
    const g2 = ctx.createGain();
    g2.gain.value = 0.08;
    src2.connect(bp2).connect(g2).connect(masterGain);
    src2.start();
    sources.push(src2);
  }

  activeNodes = { gain: masterGain, sources };
}

export async function stopSound(): Promise<void> {
  if (activeNodes) {
    try {
      activeNodes.sources.forEach(s => {
        try { (s as any).stop?.(); } catch {}
      });
      activeNodes.gain.disconnect();
    } catch {}
    activeNodes = null;
  }
}

export async function setVolume(volume: number): Promise<void> {
  if (activeNodes) {
    activeNodes.gain.gain.value = Math.max(0, Math.min(1, volume));
  }
}
