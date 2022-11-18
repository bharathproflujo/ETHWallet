import { StatusBar } from 'expo-status-bar';
import { ImageBackground, StyleSheet } from 'react-native';
import Wallet from './src/components/Wallet'

export default function App() {
  return (
    <ImageBackground source={require('./assets/ethereum1.jpg')} style={styles.container}>
      <Wallet></Wallet>
      <StatusBar style="auto" />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
