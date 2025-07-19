import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const Empty = ({ desc, style = {} }) => {
  return (
    <View style={[styles.empty, style]}>
      <Image
        source={{ uri: 'https://s.yezgea02.com/1619144597039/empty.png' }}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.text}>{desc || '暂无数据'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  text: {
    fontSize: 14,
    color: '#999',
  },
});

export default Empty;