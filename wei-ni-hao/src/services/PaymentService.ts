import { Alert } from 'react-native';

export const PaymentService = {
  async purchasePremium(): Promise<boolean> {
    return new Promise((resolve) => {
      Alert.alert(
        '💎 升级高级会员',
        '解锁无限对话、专属治愈声音\n\n仅需 ¥9.9/月\n\n添加客服微信 z6ys8866 开通',
        [
          { text: '取消', style: 'cancel', onPress: () => resolve(false) },
          { text: '微信支付', onPress: () => {
            Alert.alert(
              '📱 请扫码支付',
              '转账 ¥9.9 到客服\n支付后截图发给 z6ys8866 开通',
              [
                { text: '已支付', onPress: () => resolve(true) },
                { text: '取消', onPress: () => resolve(false) },
              ]
            );
          }},
        ]
      );
    });
  },

  async checkPremiumStatus(): Promise<boolean> {
    return false;
  },
};
