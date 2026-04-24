# 为你好 - AI情绪治愈应用 🌸

一款温暖的情绪治愈AI应用，基于React Native + Ollama本地大模型开发。

## 功能特性

- 🤖 **温柔倾听AI** - 基于Qwen2.5-7B，温暖、有思考的回应
- 🎵 **四大治愈声音** - 雨声、海浪、咖啡馆、森林
- 🔒 **合规设计** - 年龄验证、防沉迷提示、本地数据存储
- 💎 **订阅系统** - 9.9元/月高级会员，无限对话

## 快速启动（30分钟内上线）

### 1. 安装依赖
```bash
cd wei-ni-hao
npm install
```

### 2. 下载治愈音频（免费）
```powershell
# Windows PowerShell
.\scripts\download-audio.ps1
```
或手动从 https://pixabay.com/music 下载免费音频到 `assets/sounds/` 目录。

### 3. 安装并启动Ollama + Qwen模型
```bash
# 安装Ollama（Windows直接下载安装包）
# 下载地址: https://ollama.ai/download

# 启动服务
ollama serve

# 拉取Qwen模型（约5GB）
ollama pull qwen2.5:7b
```

### 4. 启动应用
```bash
# Web版（最快测试）
npm run web

# Android模拟器
npm run android

# iOS模拟器（需macOS）
npm run ios
```

### 5. 打包发布
```bash
# 构建APK（需要Android Studio）
npx expo run:android --variant release

# 或使用EAS云构建（推荐）
npx eas build --platform android
```

## 商业配置

### 支付接入（微信/支付宝）
1. 注册微信支付商户：https://pay.weixin.qq.com
2. 注册支付宝商户：https://open.alipay.com
3. 在 `src/services/PaymentService.ts` 中填入商户ID
4. 后端需搭建订单验证服务（可用Serverless）

### 收款账户配置
修改 `PaymentService.ts` 中的收款账户为你个人的支付宝/微信商户账号。

## 目录结构
```
wei-ni-hao/
├── App.tsx                 # 应用入口
├── src/
│   ├── screens/            # 所有页面
│   │   ├── AgeVerificationScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── ChatScreen.tsx
│   │   ├── SoundScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── PremiumScreen.tsx
│   ├── services/           # 核心服务
│   │   ├── AIService.ts    # Ollama AI调用
│   │   ├── SoundService.ts # 音频播放
│   │   └── PaymentService.ts # 支付
│   ├── store/              # 状态管理
│   ├── theme/              # 主题系统
│   └── navigation/         # 路由
├── assets/sounds/          # 音频文件
└── scripts/                # 工具脚本
```

## 合规说明

- ✅ 年龄验证（入口强制）
- ✅ 防沉迷提示（每次对话提醒）
- ✅ 数据本地存储（隐私保护）
- ✅ AI声明（用户知晓AI属性）

## 推广建议

1. **小红书** - 发布"治愈系AI"相关笔记，附下载链接
2. **B站** - 制作使用视频，展示AI对话和声音功能
3. **抖音** - 15秒短视频展示核心功能
4. **应用商店** - 提交华为应用市场、小米商店等

## 许可证

本代码归用户所有，拥有永久开发权和商用权。

---

Made with 💕 for emotional wellness
